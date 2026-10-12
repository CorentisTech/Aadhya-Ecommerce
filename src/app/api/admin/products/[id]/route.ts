import { NextResponse } from 'next/server';
import { queryDb, getDbPool } from '@/utils/db';
import { invalidateCache, invalidateCachePattern, CacheKeys } from '@/lib/cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const productRows = await queryDb(`
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id::text = $1::text OR p.product_no = $1
    `, [id]);

    if (!productRows || productRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const product = productRows[0];

    // Media
    const media = await queryDb(`
      SELECT * FROM product_media WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC
    `, [product.id]);

    // Variants
    const variants = await queryDb(`
      SELECT 
        pv.*,
        fvd.color,
        fvd.color_hex,
        fvd.size
      FROM product_variants pv
      LEFT JOIN fashion_variant_details fvd ON pv.id = fvd.variant_id
      WHERE pv.product_id = $1
      ORDER BY pv.created_at ASC
    `, [product.id]);

    // Domain Details
    let domainDetails: any = null;
    if (product.department === 'fashion') {
      const fRows = await queryDb(`SELECT * FROM fashion_product_details WHERE product_id = $1`, [product.id]);
      domainDetails = fRows[0] || null;
    } else {
      const nRows = await queryDb(`SELECT * FROM numismatic_product_details WHERE product_id = $1`, [product.id]);
      domainDetails = nRows[0] || null;
    }

    return NextResponse.json({
      success: true,
      product,
      media,
      variants,
      domainDetails
    });

  } catch (err: any) {
    console.error('Error fetching product details:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      category_id,
      base_price,
      base_mrp,
      base_discount,
      is_bestseller,
      is_hero,
      hero_order,
      description,
      return_policy,
      is_active,
      fashion_details,
      numismatic_details
    } = body;

    await client.query('BEGIN');

    // 1. Update product base
    const updateRes = await client.query(`
      UPDATE products 
      SET 
        name = COALESCE($1, name),
        category_id = COALESCE($2, category_id),
        base_price = COALESCE($3, base_price),
        base_mrp = COALESCE($4, base_mrp),
        base_discount = COALESCE($5, base_discount),
        is_bestseller = CASE WHEN $6 IS NOT NULL THEN $6 ELSE is_bestseller END,
        is_hero = CASE WHEN $7 IS NOT NULL THEN $7 ELSE is_hero END,
        hero_order = CASE WHEN $8 IS NOT NULL THEN $8 ELSE hero_order END,
        description = COALESCE($9, description),
        return_policy = COALESCE($10, return_policy),
        is_active = CASE WHEN $11 IS NOT NULL THEN $11 ELSE is_active END,
        updated_at = NOW()
      WHERE id::text = $12::text OR product_no = $12
      RETURNING id, department
    `, [
      name ?? null,
      category_id ?? null,
      base_price !== undefined && !isNaN(Number(base_price)) ? Number(base_price) : null,
      base_mrp !== undefined && !isNaN(Number(base_mrp)) ? Number(base_mrp) : null,
      base_discount !== undefined && !isNaN(Number(base_discount)) ? Number(base_discount) : null,
      is_bestseller !== undefined ? Boolean(is_bestseller) : null,
      is_hero !== undefined ? Boolean(is_hero) : null,
      hero_order !== undefined && !isNaN(Number(hero_order)) ? Number(hero_order) : 0,
      description ?? null,
      return_policy ?? null,
      is_active !== undefined ? Boolean(is_active) : null,
      id
    ]);

    if (!updateRes.rows || updateRes.rows.length === 0) {
      throw new Error(`Product not found: ${id}`);
    }

    const actualProductId = updateRes.rows[0].id;

    // 2. Update domain details with UPSERT to handle missing rows gracefully
    if (fashion_details) {
      await client.query(`
        INSERT INTO fashion_product_details (
          product_id, fabric, pattern, neck_type, sleeves, occasion, length, fit, fabric_care, model_info, return_time
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
        ON CONFLICT (product_id) DO UPDATE SET 
          fabric = COALESCE(EXCLUDED.fabric, fashion_product_details.fabric),
          pattern = COALESCE(EXCLUDED.pattern, fashion_product_details.pattern),
          neck_type = COALESCE(EXCLUDED.neck_type, fashion_product_details.neck_type),
          sleeves = COALESCE(EXCLUDED.sleeves, fashion_product_details.sleeves),
          occasion = COALESCE(EXCLUDED.occasion, fashion_product_details.occasion),
          length = COALESCE(EXCLUDED.length, fashion_product_details.length),
          fit = COALESCE(EXCLUDED.fit, fashion_product_details.fit),
          fabric_care = COALESCE(EXCLUDED.fabric_care, fashion_product_details.fabric_care),
          model_info = COALESCE(EXCLUDED.model_info, fashion_product_details.model_info),
          return_time = COALESCE(EXCLUDED.return_time, fashion_product_details.return_time)
      `, [
        actualProductId,
        fashion_details.fabric || null,
        fashion_details.pattern || null,
        fashion_details.neck_type || null,
        fashion_details.sleeves || null,
        fashion_details.occasion || null,
        fashion_details.length || null,
        fashion_details.fit || null,
        fashion_details.fabric_care || null,
        fashion_details.model_info || null,
        fashion_details.return_time || null
      ]);
    } else if (numismatic_details) {
      await client.query(`
        INSERT INTO numismatic_product_details (
          product_id, rarity, era, year, denomination, material, weight, condition, mint, shipping_charges, collection_label
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
        ON CONFLICT (product_id) DO UPDATE SET 
          rarity = COALESCE(EXCLUDED.rarity, numismatic_product_details.rarity),
          era = COALESCE(EXCLUDED.era, numismatic_product_details.era),
          year = COALESCE(EXCLUDED.year, numismatic_product_details.year),
          denomination = COALESCE(EXCLUDED.denomination, numismatic_product_details.denomination),
          material = COALESCE(EXCLUDED.material, numismatic_product_details.material),
          weight = COALESCE(EXCLUDED.weight, numismatic_product_details.weight),
          condition = COALESCE(EXCLUDED.condition, numismatic_product_details.condition),
          mint = COALESCE(EXCLUDED.mint, numismatic_product_details.mint),
          shipping_charges = COALESCE(EXCLUDED.shipping_charges, numismatic_product_details.shipping_charges),
          collection_label = COALESCE(EXCLUDED.collection_label, numismatic_product_details.collection_label)
      `, [
        actualProductId,
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

    // 3. Update Media
    if (body.media !== undefined) {
      // Remove old media
      await client.query('DELETE FROM product_media WHERE product_id = $1', [actualProductId]);
      
      // Insert new media
      if (Array.isArray(body.media) && body.media.length > 0) {
        for (let i = 0; i < body.media.length; i++) {
          const m = body.media[i];
          if (m && m.media_url) {
            await client.query(`
              INSERT INTO product_media (product_id, variant_id, media_url, sort_order, is_primary, color_name, color_hex)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
              actualProductId,
              m.variant_id || null,
              m.media_url,
              m.sort_order !== undefined ? m.sort_order : i,
              Boolean(m.is_primary),
              m.color_name || null,
              m.color_hex || null
            ]);
          }
        }
      }
    }

    // 4. Audit Log
    await client.query(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ($1, $2, $3, $4)
    `, [
      'UPDATE_PRODUCT',
      'products',
      id,
      JSON.stringify({ name, base_price, is_active })
    ]);

    await client.query('COMMIT');

    // Invalidate Redis product caches immediately
    await invalidateCache(CacheKeys.productDetail('all', id));
    await invalidateCache(CacheKeys.productDetail('fashion', id));
    await invalidateCache(CacheKeys.productDetail('numismatics', id));
    await invalidateCachePattern('aadhya:cache:*:products:*');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

    return NextResponse.json({ success: true, message: 'Product updated successfully' });

  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete/archive
    await queryDb(`UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1`, [id]);
    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ('ARCHIVE_PRODUCT', 'products', $1, '{"status": "archived"}')
    `, [id]);

    // Invalidate Redis product caches immediately
    await invalidateCache(CacheKeys.productDetail('all', id));
    await invalidateCache(CacheKeys.productDetail('fashion', id));
    await invalidateCache(CacheKeys.productDetail('numismatics', id));
    await invalidateCachePattern('aadhya:cache:*:products:*');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

    return NextResponse.json({ success: true, message: 'Product archived successfully' });
  } catch (err: any) {
    console.error('Error archiving product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
