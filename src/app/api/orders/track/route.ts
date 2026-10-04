import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNo = searchParams.get('orderNo');

    if (!orderNo) {
      return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    }

    const query = `
      SELECT 
        order_number, status, total_amount, created_at,
        courier, tracking_number, tracking_url,
        dispatched_at, delivered_at, expected_delivery_date,
        rejection_reason, status_history
      FROM orders
      WHERE order_number = $1
    `;

    const rows = await queryDb(query, [orderNo]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const order = rows[0];

    // Also fetch detailed status history from order_status_history table
    let timeline: any[] = [];
    try {
      const historyRows = await queryDb(
        `SELECT id, status, note, created_at FROM order_status_history WHERE order_id = (SELECT id FROM orders WHERE order_number = $1 LIMIT 1) ORDER BY created_at ASC`,
        [orderNo]
      );
      timeline = historyRows || [];
    } catch {}

    return NextResponse.json({ success: true, tracking: order, timeline });
  } catch (err: any) {
    console.error('Error fetching order tracking:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve tracking info' }, { status: 500 });
  }
}

