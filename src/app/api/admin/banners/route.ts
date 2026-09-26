import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    let whereClause = '';
    let params: any[] = [];
    if (department && department !== 'all') {
      whereClause = 'WHERE department = $1 OR department = \'global\'';
      params.push(department);
    }

    const query = `SELECT * FROM banners ${whereClause} ORDER BY sort_order ASC, created_at DESC`;
    const banners = await queryDb(query, params);
    return NextResponse.json({ success: true, banners });
  } catch (err: any) {
    console.error('Error fetching banners:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, image_url, cta_text, cta_link, department = 'global', sort_order = 0 } = body;

    if (!title || !image_url) {
      return NextResponse.json({ success: false, error: 'Title and image_url are required' }, { status: 400 });
    }

    const id = uuidv4();
    const insertSql = `
      INSERT INTO banners (id, title, subtitle, image_url, cta_text, cta_link, department, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *
    `;

    const result = await queryDb(insertSql, [id, title, subtitle || '', image_url, cta_text || 'EXPLORE', cta_link || '/catalog', department, sort_order]);
    return NextResponse.json({ success: true, banner: result[0] });
  } catch (err: any) {
    console.error('Error creating banner:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, subtitle, image_url, cta_text, cta_link, department, sort_order, is_active } = body;

    if (!id) return NextResponse.json({ success: false, error: 'Banner ID required' }, { status: 400 });

    const updateSql = `
      UPDATE banners
      SET 
        title = COALESCE($1, title),
        subtitle = COALESCE($2, subtitle),
        image_url = COALESCE($3, image_url),
        cta_text = COALESCE($4, cta_text),
        cta_link = COALESCE($5, cta_link),
        department = COALESCE($6, department),
        sort_order = COALESCE($7, sort_order),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const result = await queryDb(updateSql, [title, subtitle, image_url, cta_text, cta_link, department, sort_order, is_active, id]);
    return NextResponse.json({ success: true, banner: result[0] });
  } catch (err: any) {
    console.error('Error updating banner:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Banner ID required' }, { status: 400 });

    await queryDb(`DELETE FROM banners WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (err: any) {
    console.error('Error deleting banner:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
