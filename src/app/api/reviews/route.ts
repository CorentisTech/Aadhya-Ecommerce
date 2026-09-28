import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const rows = await queryDb(`
      SELECT 
        r.id, r.rating, r.text, r.is_verified, r.created_at,
        p.first_name, p.last_name, p.avatar
      FROM reviews r
      JOIN profiles p ON r.user_id = p.id
      WHERE r.product_id = $1 AND r.is_approved = true
      ORDER BY r.created_at DESC
    `, [productId]);

    return NextResponse.json({ success: true, reviews: rows });
  } catch (err: any) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, text } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    // Server-side check if user actually purchased the product
    const orderRows = await queryDb(`
      SELECT o.id 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'DELIVERED'
    `, [user.id, productId]);

    const isVerified = orderRows && orderRows.length > 0;

    await queryDb(`
      INSERT INTO reviews (product_id, user_id, rating, text, is_verified, is_approved)
      VALUES ($1, $2, $3, $4, $5, false)
    `, [productId, user.id, rating, text, isVerified]);

    return NextResponse.json({ success: true, message: 'Review submitted for approval' });
  } catch (err: any) {
    console.error('Error submitting review:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
