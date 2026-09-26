import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticketRows = await queryDb(`
      SELECT 
        st.*,
        o.order_number AS related_order_number,
        o.total_amount AS related_order_total,
        o.status AS related_order_status
      FROM support_tickets st
      LEFT JOIN orders o ON st.related_order_id = o.id
      WHERE st.id = $1 OR st.ticket_number = $1
    `, [id]);

    if (!ticketRows || ticketRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = ticketRows[0];

    const messages = await queryDb(`
      SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC
    `, [ticket.id]);

    return NextResponse.json({
      success: true,
      ticket,
      messages
    });

  } catch (err: any) {
    console.error('Error fetching ticket detail:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message, sender_name = 'AADHYA Support Specialist', sender_role = 'admin', status_change } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    const messageId = uuidv4();
    await queryDb(`
      INSERT INTO ticket_messages (id, ticket_id, sender_name, sender_role, message)
      VALUES ($1, $2, $3, $4, $5)
    `, [messageId, id, sender_name, sender_role, message.trim()]);

    const newStatus = status_change || (sender_role === 'admin' ? 'WAITING_FOR_CUSTOMER' : 'IN_PROGRESS');

    await queryDb(`
      UPDATE support_tickets 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2
    `, [newStatus, id]);

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      status: newStatus
    });

  } catch (err: any) {
    console.error('Error posting ticket reply:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, priority, assigned_to } = body;

    const updateSql = `
      UPDATE support_tickets
      SET 
        status = COALESCE($1, status),
        priority = COALESCE($2, priority),
        assigned_to = COALESCE($3, assigned_to),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const result = await queryDb(updateSql, [status, priority, assigned_to, id]);
    return NextResponse.json({ success: true, ticket: result[0] });
  } catch (err: any) {
    console.error('Error updating ticket:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
