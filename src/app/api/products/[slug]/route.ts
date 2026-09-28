import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const decodedSlug = decodeURIComponent(slug).trim();
    const normalizedSlug = decodedSlug.toLowerCase().replace(/ /g, '-');

    // Flexible query by UUID, product_no, slug, or normalized name
    const products = await queryDb(
      `SELECT 
        p.id,
        p.product_no,
        p.name,
        p.slug,
        p.department,
        p.description,
        p.visual_type,
        p.visual_color,
        p.visual_pattern,
        p.base_price,
        p.base_mrp,
        p.base_discount,
        p.is_bestseller,
        p.is_hero,
        p.hero_order,
        p.avg_rating,
        p.reviews_count,
        p.return_policy,
        p.is_active,
        c.name AS category_name,
        c.slug AS category_slug,
        (
          SELECT json_agg(json_build_object(
            'id', pm.id,
            'media_url', pm.media_url,
            'is_primary', pm.is_primary,
            'color_name', pm.color_name,
            'color_hex', pm.color_hex
          ) ORDER BY pm.is_primary DESC, pm.sort_order ASC)
          FROM product_media pm 
          WHERE pm.product_id = p.id
        ) AS media,
        (
          SELECT json_agg(json_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'price', pv.price,
            'mrp', pv.mrp,
            'discount', pv.discount,
            'stock_quantity', pv.stock_quantity,
            'color', fvd.color,
            'color_hex', fvd.color_hex,
            'size', fvd.size
          ))
          FROM product_variants pv
          LEFT JOIN fashion_variant_details fvd ON pv.id = fvd.variant_id
          WHERE pv.product_id = p.id AND pv.is_active = true
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
              'fit', f.fit,
              'model_info', f.model_info,
              'return_time', f.return_time,
              'fabric_care', f.fabric_care,
              'details', f.details
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
              'shipping_charges', n.shipping_charges,
              'collection_label', n.collection_label
            ) FROM numismatic_product_details n WHERE n.product_id = p.id
          )
          ELSE NULL
        END AS details
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true
         AND (
           p.id::text = $1
           OR LOWER(p.product_no) = LOWER($1)
           OR LOWER(p.slug) = LOWER($1)
           OR LOWER(p.slug) = LOWER($2)
           OR LOWER(p.name) = LOWER($1)
           OR LOWER(REPLACE(p.name, ' ', '-')) = LOWER($2)
         )
       LIMIT 1`,
      [decodedSlug, normalizedSlug]
    );

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(products[0]);
  } catch (error: any) {
    console.error('Single product fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
