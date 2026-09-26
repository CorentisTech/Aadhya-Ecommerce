import { NextResponse } from 'next/server';
import { queryDb, getDbPool } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department'); // 'fashion' | 'numismatics'
    const category = searchParams.get('category');
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'all'; // 'all', 'active', 'archived', 'low_stock'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIdx = 1;

    if (department) {
      whereConditions.push(`p.department = $${paramIdx}`);
      params.push(department);
      paramIdx++;
    }

    if (category) {
      whereConditions.push(`c.slug = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }

    if (status === 'active') {
      whereConditions.push(`p.is_active = true`);
    } else if (status === 'archived') {
      whereConditions.push(`p.is_active = false`);
    }

    if (search.trim()) {
      whereConditions.push(`(
        p.name ILIKE $${paramIdx} 
        OR p.product_no ILIKE $${paramIdx} 
        OR c.name ILIKE $${paramIdx}
      )`);
      params.push(`%${search.trim()}%`);
      paramIdx++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await queryDb(
      `SELECT COUNT(*)::int AS total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const query = `
      SELECT 
        p.id,
        p.product_no,
        p.name,
        p.slug,
        p.department,
        p.base_price,
        p.base_mrp,
        p.base_discount,
        p.is_bestseller,
        p.avg_rating,
        p.reviews_count,
        p.is_active,
        p.created_at,
        c.name AS category_name,
        c.slug AS category_slug,
        (
          SELECT pm.media_url 
          FROM product_media pm 
          WHERE pm.product_id = p.id 
          ORDER BY pm.is_primary DESC, pm.sort_order ASC 
          LIMIT 1
        ) AS image_url,
        (
          SELECT COALESCE(SUM(pv.stock_quantity), 0)::int 
          FROM product_variants pv 
          WHERE pv.product_id = p.id
        ) AS total_stock,
        (
          SELECT json_agg(json_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'price', pv.price,
            'mrp', pv.mrp,
            'stock_quantity', pv.stock_quantity,
            'color', fvd.color,
            'color_hex', fvd.color_hex,
            'size', fvd.size
          ))
          FROM product_variants pv
          LEFT JOIN fashion_variant_details fvd ON pv.id = fvd.variant_id
          WHERE pv.product_id = p.id
        ) AS variants,
        CASE 
          WHEN p.department = 'fashion' THEN (
            SELECT json_build_object(
              'fabric', f.fabric,
              'pattern', f.pattern,
              'neck_type', f.neck_type,
              'sleeves', f.sleeves,
              'occasion', f.occasion,
              'length', f.length,
              'pack_of', f.pack_of,
              'fit', f.fit
            ) FROM fashion_product_details f WHERE f.product_id = p.id
          )
          WHEN p.department = 'numismatics' THEN (
            SELECT json_build_object(
              'rarity', n.rarity,
              'era', n.era,
              'year', n.year,
              'denomination', n.denomination,
              'material', n.material,
              'weight', n.weight,
              'condition', n.condition,
              'mint', n.mint,
              'shipping_charges', n.shipping_charges
            ) FROM numismatic_product_details n WHERE n.product_id = p.id
          )
        END AS domain_details
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    params.push(limit, offset);
    const products = await queryDb(query, params);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err: any) {
    console.error('Error fetching admin products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      product_no,
      name,
      department, // 'fashion' | 'numismatics'
      category_id,
      description,
      base_price,
      base_mrp,
      base_discount,
      is_bestseller = false,
      return_policy,
      visual_type,
      visual_color,
      visual_pattern,
      media = [], // array of { media_url, is_primary, color_name, color_hex }
      variants = [], // array of variant objects with colors/sizes/SKU/stock/images
      fashion_details, // { fabric, pattern, neck_type, sleeves, occasion, length, pack_of, fit, model_info, return_time }
      numismatic_details // { rarity, era, year, denomination, material, weight, condition, mint, shipping_charges, collection_label }
    } = body;

    if (!product_no || !name || !department || !category_id || base_price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: product_no, name, department, category_id, base_price' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    const productId = uuidv4();
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product_no.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // 1. Insert base product
    const insertProductSql = `
      INSERT INTO products (
        id, product_no, name, slug, category_id, department, description,
        base_price, base_mrp, base_discount, is_bestseller, return_policy,
        visual_type, visual_color, visual_pattern, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true)
      RETURNING *
    `;
    const productResult = await client.query(insertProductSql, [
      productId,
      product_no,
      name,
      slug,
      category_id,
      department,
      description || '',
      base_price,
      base_mrp || base_price,
      base_discount || 0,
      Boolean(is_bestseller),
      return_policy || '',
      visual_type || (department === 'fashion' ? 'dress' : 'coin'),
      visual_color || '',
      visual_pattern || ''
    ]);

    // 2. Insert Domain-specific Details
    if (department === 'fashion' && fashion_details) {
      const insertFashionSql = `
        INSERT INTO fashion_product_details (
          product_id, fabric, pattern, neck_type, sleeves, occasion,
          length, pack_of, fit, model_info, return_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;
      await client.query(insertFashionSql, [
        productId,
        fashion_details.fabric || null,
        fashion_details.pattern || null,
        fashion_details.neck_type || null,
        fashion_details.sleeves || null,
        fashion_details.occasion || null,
        fashion_details.length || null,
        fashion_details.pack_of || null,
        fashion_details.fit || null,
        fashion_details.model_info || null,
        fashion_details.return_time || null
      ]);
    } else if (department === 'numismatics' && numismatic_details) {
      const insertNumisSql = `
        INSERT INTO numismatic_product_details (
          product_id, rarity, era, year, denomination, material,
          weight, condition, mint, shipping_charges, collection_label
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;
      await client.query(insertNumisSql, [
        productId,
        numismatic_details.rarity || null,
        numismatic_details.era || null,
        numismatic_details.year || null,
        numismatic_details.denomination || null,
        numismatic_details.material || null,
        numismatic_details.weight || null,
        numismatic_details.condition || null,
        numismatic_details.mint || null,
        numismatic_details.shipping_charges || null,
        numismatic_details.collection_label || null
      ]);
    }

    // 3. Insert Variants & Fashion variant colors/sizes
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        const variantId = uuidv4();
        const sku = v.sku || `${product_no}-${(v.color || 'STD').toUpperCase()}-${(v.size || 'STD').toUpperCase()}`;
        
        await client.query(`
          INSERT INTO product_variants (
            id, product_id, sku, price, mrp, discount, stock_quantity, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        `, [
          variantId,
          productId,
          sku,
          v.price || base_price,
          v.mrp || base_mrp || base_price,
          v.discount || base_discount || 0,
          v.stock_quantity || 0
        ]);

        if (department === 'fashion' && (v.color || v.size)) {
          await client.query(`
            INSERT INTO fashion_variant_details (variant_id, color, color_hex, size)
            VALUES ($1, $2, $3, $4)
          `, [variantId, v.color || null, v.color_hex || null, v.size || null]);
        }

        // Color-specific images attached to this variant
        if (Array.isArray(v.images)) {
          for (let i = 0; i < v.images.length; i++) {
            await client.query(`
              INSERT INTO product_media (product_id, variant_id, media_url, sort_order, is_primary, color_name, color_hex)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
              productId,
              variantId,
              v.images[i],
              i,
              i === 0,
              v.color || null,
              v.color_hex || null
            ]);
          }
        }
      }
    } else {
      // Default standard variant if none specified
      const defaultVariantId = uuidv4();
      await client.query(`
        INSERT INTO product_variants (id, product_id, sku, price, mrp, discount, stock_quantity, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      `, [defaultVariantId, productId, `${product_no}-DEFAULT`, base_price, base_mrp || base_price, base_discount || 0, 10]);
    }

    // 4. Insert Global Media
    if (Array.isArray(media) && media.length > 0) {
      for (let i = 0; i < media.length; i++) {
        const m = media[i];
        const mediaUrl = typeof m === 'string' ? m : m.media_url;
        if (mediaUrl) {
          await client.query(`
            INSERT INTO product_media (product_id, media_url, sort_order, is_primary, color_name, color_hex)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            productId,
            mediaUrl,
            i,
            typeof m === 'object' ? Boolean(m.is_primary) : i === 0,
            typeof m === 'object' ? m.color_name || null : null,
            typeof m === 'object' ? m.color_hex || null : null
          ]);
        }
      }
    }

    // 5. Audit Log
    await client.query(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ($1, $2, $3, $4)
    `, [
      'CREATE_PRODUCT',
      'products',
      productId,
      JSON.stringify({ product_no, name, department, base_price })
    ]);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      productId,
      product: productResult.rows[0]
    });

  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
