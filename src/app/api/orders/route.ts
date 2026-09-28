import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const orders = await queryDb(
      `SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.shipping_cost,
        o.discount_amount,
        o.total_amount,
        o.payment_method,
        o.payment_status,
        o.courier,
        o.tracking_number,
        o.tracking_url,
        o.created_at,
        o.updated_at,
        (
          SELECT json_agg(json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'selected_size', oi.selected_size,
            'selected_color', oi.selected_color,
            'product_name', p.name,
            'product_no', p.product_no,
            'product_slug', p.slug,
            'product_image', (
              SELECT pm.media_url 
              FROM product_media pm 
              WHERE pm.product_id = p.id 
              ORDER BY pm.is_primary DESC, pm.sort_order ASC 
              LIMIT 1
            )
          ))
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) AS items
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user.id]
    );

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
