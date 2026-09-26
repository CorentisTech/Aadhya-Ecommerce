import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIdx = 1;

    if (status && status !== 'all') {
      whereConditions.push(`st.status = $${paramIdx}`);
      params.push(status);
      paramIdx++;
    }

    if (priority && priority !== 'all') {
      whereConditions.push(`st.priority = $${paramIdx}`);
      params.push(priority);
      paramIdx++;
    }

    if (search.trim()) {
      whereConditions.push(`(
        st.ticket_number ILIKE $${paramIdx} 
        OR st.customer_name ILIKE $${paramIdx} 
        OR st.customer_email ILIKE $${paramIdx} 
        OR st.subject ILIKE $${paramIdx}
      )`);
      params.push(`%${search.trim()}%`);
      paramIdx++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await queryDb(
      `SELECT COUNT(*)::int AS total FROM support_tickets st ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const query = `
      SELECT 
        st.*,
        o.order_number AS related_order_number,
        (
          SELECT tm.message 
          FROM ticket_messages tm 
          WHERE tm.ticket_id = st.id 
          ORDER BY tm.created_at DESC 
          LIMIT 1
        ) AS last_message,
        (SELECT COUNT(*)::int FROM ticket_messages tm WHERE tm.ticket_id = st.id) AS total_messages
      FROM support_tickets st
      LEFT JOIN orders o ON st.related_order_id = o.id
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN st.status = 'OPEN' THEN 1 
          WHEN st.status = 'IN_PROGRESS' THEN 2 
          WHEN st.status = 'WAITING_FOR_CUSTOMER' THEN 3 
          ELSE 4 
        END,
        st.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    params.push(limit, offset);
    const tickets = await queryDb(query, params);

    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err: any) {
    console.error('Error fetching support tickets:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, customer_phone, subject, category, message, related_order_id, priority = 'MEDIUM' } = body;

    if (!customer_name || !customer_email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'Customer name, email, subject, and message are required' }, { status: 400 });
    }

    const ticketId = uuidv4();
    const ticketNumber = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

    const insertTicketSql = `
      INSERT INTO support_tickets (
        id, ticket_number, customer_name, customer_email, customer_phone, subject, category, related_order_id, priority, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'OPEN')
      RETURNING *
    `;

    const ticketResult = await queryDb(insertTicketSql, [
      ticketId,
      ticketNumber,
      customer_name,
      customer_email,
      customer_phone || null,
      subject,
      category || 'General Inquiry',
      related_order_id || null,
      priority
    ]);

    // Insert first message
    await queryDb(`
      INSERT INTO ticket_messages (ticket_id, sender_name, sender_role, message)
      VALUES ($1, $2, 'customer', $3)
    `, [ticketId, customer_name, message]);

    return NextResponse.json({ success: true, ticket: ticketResult[0] });
  } catch (err: any) {
    console.error('Error creating support ticket:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
