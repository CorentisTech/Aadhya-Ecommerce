import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('q') || '';
    const department = searchParams.get('department');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIdx = 1;

    if (status && status !== 'all') {
      if (status === 'received') {
        whereConditions.push(`o.status = 'PENDING'`);
      } else if (status === 'approved') {
        whereConditions.push(`o.status IN ('CONFIRMED', 'PROCESSING')`);
      } else if (status === 'dispatched') {
        whereConditions.push(`o.status = 'SHIPPED'`);
      } else if (status === 'delivered') {
        whereConditions.push(`o.status = 'DELIVERED'`);
      } else if (status === 'cancelled') {
        whereConditions.push(`o.status IN ('CANCELLED', 'REFUNDED')`);
      } else {
        whereConditions.push(`o.status = $${paramIdx}`);
        params.push(status);
        paramIdx++;
      }
    }

    if (search.trim()) {
      whereConditions.push(`(
        o.order_number ILIKE $${paramIdx} 
        OR p.first_name ILIKE $${paramIdx} 
        OR p.last_name ILIKE $${paramIdx}
        OR a.full_name ILIKE $${paramIdx}
        OR o.tracking_number ILIKE $${paramIdx}
      )`);
      params.push(`%${search.trim()}%`);
      paramIdx++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await queryDb(
      `SELECT COUNT(*)::int AS total 
       FROM orders o 
       LEFT JOIN profiles p ON o.user_id = p.id 
       LEFT JOIN addresses a ON o.shipping_address_id = a.id 
       ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const query = `
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
        o.tracking_url,
        o.dispatched_at,
        o.delivered_at,
        o.rejection_reason,
        o.created_at,
        COALESCE(CONCAT(p.first_name, ' ', p.last_name), a.full_name, 'Valued Customer') AS customer_name,
        COALESCE(p.phone, a.alt_phone, 'N/A') AS customer_phone,
        COALESCE(
          (SELECT pr.department FROM order_items oi JOIN products pr ON oi.product_id = pr.id WHERE oi.order_id = o.id LIMIT 1),
          'fashion'
        ) AS domain,
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
      LEFT JOIN profiles p ON o.user_id = p.id
      LEFT JOIN addresses a ON o.shipping_address_id = a.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    params.push(limit, offset);
    const orders = await queryDb(query, params);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      action, // 'APPROVE' | 'REJECT' | 'DISPATCH' | 'DELIVER'
      rejection_reason,
      courier,
      tracking_number,
      tracking_url,
      admin_note
    } = body;

    if (!order_id || !action) {
      return NextResponse.json(
        { success: false, error: 'Order ID and action are required' },
        { status: 400 }
      );
    }

    let newStatus = '';
    let dispatchedAt: Date | null = null;
    let deliveredAt: Date | null = null;

    if (action === 'APPROVE') {
      newStatus = 'CONFIRMED';
    } else if (action === 'REJECT') {
      newStatus = 'CANCELLED';
    } else if (action === 'DISPATCH') {
      newStatus = 'SHIPPED';
      dispatchedAt = new Date();
    } else if (action === 'DELIVER') {
      newStatus = 'DELIVERED';
      deliveredAt = new Date();
    } else {
      newStatus = action;
    }

    const historyEntry = JSON.stringify({
      status: newStatus,
      action,
      timestamp: new Date().toISOString(),
      note: admin_note || (action === 'REJECT' ? rejection_reason : `Order ${action.toLowerCase()}`),
      courier,
      tracking_number
    });

    const updateSql = `
      UPDATE orders
      SET 
        status = $1,
        rejection_reason = COALESCE($2, rejection_reason),
        courier = COALESCE($3, courier),
        tracking_number = COALESCE($4, tracking_number),
        tracking_url = COALESCE($5, tracking_url),
        dispatched_at = COALESCE($6, dispatched_at),
        delivered_at = COALESCE($7, delivered_at),
        status_history = COALESCE(status_history, '[]'::jsonb) || $8::jsonb,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const result = await queryDb(updateSql, [
      newStatus,
      rejection_reason || null,
      courier || null,
      tracking_number || null,
      tracking_url || null,
      dispatchedAt,
      deliveredAt,
      historyEntry,
      order_id
    ]);

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ($1, 'orders', $2, $3)
    `, [
      `ORDER_${action}`,
      order_id,
      JSON.stringify({ newStatus, courier, tracking_number, rejection_reason })
    ]);

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
      order: result[0]
    });

  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
