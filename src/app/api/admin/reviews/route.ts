import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || 'fashion';

    const reviews = await queryDb(
      `SELECT * FROM featured_reviews WHERE department = $1 ORDER BY sort_order ASC, created_at DESC`,
      [department]
    );

    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, reviewer_name, reviewer_location, rating, review_text } = body;

    if (!review_text || !department) {
      return NextResponse.json({ success: false, error: 'Review text and department are required' }, { status: 400 });
    }

    await queryDb(
      `INSERT INTO featured_reviews (department, reviewer_name, reviewer_location, rating, review_text)
       VALUES ($1, $2, $3, $4, $5)`,
      [department, reviewer_name || 'Anonymous', reviewer_location || '', rating || 5, review_text]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, reviewer_name, reviewer_location, rating, review_text, is_active, sort_order } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await queryDb(
      `UPDATE featured_reviews SET
        reviewer_name = COALESCE($2, reviewer_name),
        reviewer_location = COALESCE($3, reviewer_location),
        rating = COALESCE($4, rating),
        review_text = COALESCE($5, review_text),
        is_active = COALESCE($6, is_active),
        sort_order = COALESCE($7, sort_order)
       WHERE id = $1`,
      [id, reviewer_name, reviewer_location, rating, review_text, is_active, sort_order]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await queryDb('DELETE FROM featured_reviews WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
