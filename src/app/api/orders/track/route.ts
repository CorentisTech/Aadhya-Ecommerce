import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNo = searchParams.get('orderNo');

    if (!orderNo) {
      return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    }

    // Fetch order details by order_number
    // We only expose public tracking info to avoid leaking customer PII.
    const query = `
      SELECT 
        order_number, status, total_amount, created_at,
        courier, tracking_number, tracking_url,
        dispatched_at, delivered_at, rejection_reason, status_history
      FROM orders
      WHERE order_number = $1
    `;

    const rows = await queryDb(query, [orderNo]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const order = rows[0];

    return NextResponse.json({ success: true, tracking: order });
  } catch (err: any) {
    console.error('Error fetching order tracking:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve tracking info' }, { status: 500 });
  }
}
