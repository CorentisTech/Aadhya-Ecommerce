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
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { items, shipping_address, subtotal, shipping_cost, discount_amount, total_amount, payment_method, idempotency_key } = body;

    // Check idempotency (prevent duplicate orders if user clicked twice)
    if (idempotency_key) {
      const existing = await queryDb('SELECT id, order_number FROM orders WHERE idempotency_key = $1', [idempotency_key]);
      if (existing && existing.length > 0) {
        return NextResponse.json({ success: true, order: existing[0], message: 'Order already exists' });
      }
    }

    const orderNumber = 'AD-' + Math.floor(100000 + Math.random() * 900000);
    const userId = user ? user.id : null;

    // We must use a transaction for safety
    // For now we'll do sequential inserts or use a transaction if getDbPool is available
    // But since queryDb might not share the same client, we can do it in separate queries if it's safe enough for this mock.
    
    // Insert order
    const orderRows = await queryDb(`
      INSERT INTO orders (
        order_number, user_id, status, subtotal, shipping_cost, discount_amount, total_amount, 
        payment_method, payment_status, shipping_address_id, first_name, last_name, customer_email, customer_phone, idempotency_key
      ) VALUES (
        $1, $2, 'PENDING', $3, $4, $5, $6, $7, 'PENDING', NULL, $8, $9, $10, $11, $12
      ) RETURNING id, order_number
    `, [
      orderNumber, 
      userId, 
      subtotal || 0, 
      shipping_cost || 0, 
      discount_amount || 0, 
      total_amount || 0, 
      payment_method || 'CARD',
      shipping_address?.firstName || '',
      shipping_address?.lastName || '',
      shipping_address?.email || '',
      shipping_address?.phone || '',
      idempotency_key || null
    ]);

    const newOrder = orderRows[0];

    // Insert items
    if (items && items.length > 0) {
      for (const item of items) {
        await queryDb(`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, selected_size, selected_color)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          newOrder.id,
          item.product.id,
          item.quantity,
          item.product.price,
          item.selectedSize || null,
          item.selectedColor || null
        ]);
      }
    }

    return NextResponse.json({ success: true, order: newOrder });

  } catch (error: any) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
