import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const search = searchParams.get('q');
    
    let query = `
      SELECT r.*, p.name as product_name, p.department as product_department 
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (department && department !== 'all') {
      query += ` AND r.site_type = $${paramCount}`;
      params.push(department);
      paramCount++;
    }

    if (search) {
      query += ` AND (r.reviewer_name ILIKE $${paramCount} OR r.title ILIKE $${paramCount} OR p.name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY r.display_order ASC, r.created_at DESC`;

    const rows = await queryDb(query, params);
    return NextResponse.json({ success: true, reviews: rows });
  } catch (err: any) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      site_type,
      product_id,
      rating,
      title,
      content,
      reviewer_name,
      image_url,
      status,
      is_featured,
      display_order
    } = body;

    const result = await queryDb(`
      INSERT INTO reviews (
        site_type, product_id, rating, title, content, 
        reviewer_name, image_url, status, is_featured, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      site_type, product_id, rating, title, content,
      reviewer_name, image_url, status, is_featured, display_order
    ]);

    return NextResponse.json({ success: true, review: result[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      site_type,
      product_id,
      rating,
      title,
      content,
      reviewer_name,
      image_url,
      status,
      is_featured,
      display_order
    } = body;

    const result = await queryDb(`
      UPDATE reviews SET
        site_type = COALESCE($1, site_type),
        product_id = COALESCE($2, product_id),
        rating = COALESCE($3, rating),
        title = COALESCE($4, title),
        content = COALESCE($5, content),
        reviewer_name = COALESCE($6, reviewer_name),
        image_url = COALESCE($7, image_url),
        status = COALESCE($8, status),
        is_featured = COALESCE($9, is_featured),
        display_order = COALESCE($10, display_order),
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [
      site_type, product_id, rating, title, content,
      reviewer_name, image_url, status, is_featured, display_order, id
    ]);

    return NextResponse.json({ success: true, review: result[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await queryDb(`DELETE FROM reviews WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
