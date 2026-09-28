import { NextResponse } from 'next/server';
import { queryDb, getDbPool } from '@/utils/db';

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
      WHERE p.id = $1 OR p.product_no = $1
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
    await client.query(`
      UPDATE products 
      SET 
        name = COALESCE($1, name),
        category_id = COALESCE($2, category_id),
        base_price = COALESCE($3, base_price),
        base_mrp = COALESCE($4, base_mrp),
        base_discount = COALESCE($5, base_discount),
        is_bestseller = COALESCE($6, is_bestseller),
        is_hero = COALESCE($7, is_hero),
        hero_order = COALESCE($8, hero_order),
        description = COALESCE($9, description),
        return_policy = COALESCE($10, return_policy),
        is_active = COALESCE($11, is_active),
        updated_at = NOW()
      WHERE id = $12 OR product_no = $12
    `, [
      name,
      category_id,
      base_price,
      base_mrp,
      base_discount,
      is_bestseller,
      is_hero !== undefined ? is_hero : null,
      hero_order !== undefined ? hero_order : null,
      description,
      return_policy,
      is_active,
      id
    ]);

    // 2. Update domain details
    if (fashion_details) {
      await client.query(`
        UPDATE fashion_product_details
        SET 
          fabric = COALESCE($1, fabric),
          pattern = COALESCE($2, pattern),
          neck_type = COALESCE($3, neck_type),
          sleeves = COALESCE($4, sleeves),
          occasion = COALESCE($5, occasion),
          length = COALESCE($6, length),
          pack_of = COALESCE($7, pack_of),
          fit = COALESCE($8, fit),
          model_info = COALESCE($9, model_info),
          return_time = COALESCE($10, return_time)
        WHERE product_id = (SELECT id FROM products WHERE id = $11 OR product_no = $11 LIMIT 1)
      `, [
        fashion_details.fabric,
        fashion_details.pattern,
        fashion_details.neck_type,
        fashion_details.sleeves,
        fashion_details.occasion,
        fashion_details.length,
        fashion_details.pack_of,
        fashion_details.fit,
        fashion_details.model_info,
        fashion_details.return_time,
        id
      ]);
    } else if (numismatic_details) {
      await client.query(`
        UPDATE numismatic_product_details
        SET 
          rarity = COALESCE($1, rarity),
          era = COALESCE($2, era),
          year = COALESCE($3, year),
          denomination = COALESCE($4, denomination),
          material = COALESCE($5, material),
          weight = COALESCE($6, weight),
          condition = COALESCE($7, condition),
          mint = COALESCE($8, mint),
          shipping_charges = COALESCE($9, shipping_charges),
          collection_label = COALESCE($10, collection_label)
        WHERE product_id = (SELECT id FROM products WHERE id = $11 OR product_no = $11 LIMIT 1)
      `, [
        numismatic_details.rarity,
        numismatic_details.era,
        numismatic_details.year,
        numismatic_details.denomination,
        numismatic_details.material,
        numismatic_details.weight,
        numismatic_details.condition,
        numismatic_details.mint,
        numismatic_details.shipping_charges,
        numismatic_details.collection_label,
        id
      ]);
    }

    // 3. Audit log
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

    return NextResponse.json({ success: true, message: 'Product archived successfully' });
  } catch (err: any) {
    console.error('Error archiving product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
