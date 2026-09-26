import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const filter = searchParams.get('filter') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIdx = 1;

    if (search.trim()) {
      whereConditions.push(`(
        p.first_name ILIKE $${paramIdx} 
        OR p.last_name ILIKE $${paramIdx} 
        OR p.phone ILIKE $${paramIdx} 
        OR au.email ILIKE $${paramIdx}
        OR EXISTS (SELECT 1 FROM orders o WHERE o.user_id = p.id AND o.order_number ILIKE $${paramIdx})
      )`);
      params.push(`%${search.trim()}%`);
      paramIdx++;
    }

    if (filter === 'with_orders') {
      whereConditions.push(`EXISTS (SELECT 1 FROM orders o WHERE o.user_id = p.id)`);
    } else if (filter === 'without_orders') {
      whereConditions.push(`NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = p.id)`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count total matching
    const countResult = await queryDb(
      `SELECT COUNT(*)::int AS total FROM profiles p LEFT JOIN auth.users au ON p.id = au.id ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Fetch paginated users
    const query = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        COALESCE(CONCAT(p.first_name, ' ', p.last_name), 'Aadhya Member') AS full_name,
        p.phone,
        p.avatar,
        p.role,
        p.created_at,
        au.email,
        (SELECT COUNT(*)::int FROM orders o WHERE o.user_id = p.id) AS total_orders,
        COALESCE((SELECT SUM(o.total_amount)::numeric FROM orders o WHERE o.user_id = p.id AND o.status NOT IN ('CANCELLED', 'REFUNDED')), 0) AS total_spent,
        (
          SELECT json_build_object(
            'id', o.id,
            'order_number', o.order_number,
            'status', o.status,
            'total_amount', o.total_amount,
            'created_at', o.created_at
          )
          FROM orders o 
          WHERE o.user_id = p.id 
          ORDER BY o.created_at DESC 
          LIMIT 1
        ) AS latest_order
      FROM profiles p
      LEFT JOIN auth.users au ON p.id = au.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    params.push(limit, offset);
    const users = await queryDb(query, params);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
