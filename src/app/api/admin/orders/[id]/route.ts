import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const orderRows = await queryDb(`
      SELECT 
        o.*,
        p.first_name,
        p.last_name,
        p.phone AS customer_phone,
        au.email AS customer_email,
        json_build_object(
          'id', a.id,
          'full_name', a.full_name,
          'address_line1', a.address_line1,
          'street_name', a.street_name,
          'landmark', a.landmark,
          'city', a.city,
          'state', a.state,
          'zip_code', a.zip_code,
          'country', a.country,
          'alt_phone', a.alt_phone
        ) AS shipping_address,
        (
          SELECT json_agg(json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'variant_id', oi.variant_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'selected_size', oi.selected_size,
            'selected_color', oi.selected_color,
            'product_name', pr.name,
            'product_no', pr.product_no,
            'department', pr.department,
            'image_url', (SELECT media_url FROM product_media WHERE product_id = pr.id ORDER BY is_primary DESC LIMIT 1)
          ))
          FROM order_items oi
          JOIN products pr ON oi.product_id = pr.id
          WHERE oi.order_id = o.id
        ) AS items
      FROM orders o
      LEFT JOIN profiles p ON o.user_id = p.id
      LEFT JOIN auth.users au ON p.id = au.id
      LEFT JOIN addresses a ON o.shipping_address_id = a.id
      WHERE o.id::text = $1 OR o.order_number = $1
    `, [id]);

    if (!orderRows || orderRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: orderRows[0]
    });

  } catch (err: any) {
    console.error('Error fetching order detail:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
