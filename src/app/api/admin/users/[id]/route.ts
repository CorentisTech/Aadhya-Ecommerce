import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userRows = await queryDb(`
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        COALESCE(CONCAT(p.first_name, ' ', p.last_name), 'Aadhya Member') AS full_name,
        p.phone,
        p.avatar,
        p.role,
        p.created_at,
        p.updated_at,
        au.email
      FROM profiles p
      LEFT JOIN auth.users au ON p.id = au.id
      WHERE p.id = $1
    `, [id]);

    if (!userRows || userRows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = userRows[0];

    // Addresses
    const addresses = await queryDb(`
      SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC
    `, [id]);

    // Active vs Past Orders
    const orders = await queryDb(`
      SELECT 
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
        o.created_at,
        (
          SELECT json_agg(json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'selected_size', oi.selected_size,
            'selected_color', oi.selected_color,
            'product_name', pr.name,
            'product_no', pr.product_no,
            'department', pr.department
          ))
          FROM order_items oi
          JOIN products pr ON oi.product_id = pr.id
          WHERE oi.order_id = o.id
        ) AS items
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [id]);

    const activeOrders = orders.filter(
      (o: any) => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status)
    );
    const pastOrders = orders.filter(
      (o: any) => ['DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(o.status)
    );

    return NextResponse.json({
      success: true,
      user,
      addresses,
      activeOrders,
      pastOrders,
      totalOrders: orders.length,
      totalSpent: orders
        .filter((o: any) => !['CANCELLED', 'REFUNDED'].includes(o.status))
        .reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)
    });

  } catch (err: any) {
    console.error('Error fetching user detail:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
