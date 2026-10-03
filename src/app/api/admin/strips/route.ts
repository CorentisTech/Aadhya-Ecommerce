import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || 'fashion';

    const strips = await queryDb(
      `SELECT * FROM website_strips WHERE department = $1 ORDER BY sort_order ASC, created_at DESC`,
      [department]
    );

    return NextResponse.json({ success: true, strips });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department, strip_type, text_content, link_url, bg_color, text_color } = body;

    if (!department || !strip_type) {
      return NextResponse.json({ success: false, error: 'Department and strip type are required' }, { status: 400 });
    }

    await queryDb(
      `INSERT INTO website_strips (department, strip_type, text_content, link_url, bg_color, text_color)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [department, strip_type, JSON.stringify(text_content || []), link_url || null, bg_color || '#000000', text_color || '#FFFFFF']
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, text_content, link_url, bg_color, text_color, is_active, sort_order } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await queryDb(
      `UPDATE website_strips SET
        text_content = COALESCE($2, text_content),
        link_url = COALESCE($3, link_url),
        bg_color = COALESCE($4, bg_color),
        text_color = COALESCE($5, text_color),
        is_active = COALESCE($6, is_active),
        sort_order = COALESCE($7, sort_order),
        updated_at = NOW()
       WHERE id = $1`,
      [id, text_content ? JSON.stringify(text_content) : null, link_url, bg_color, text_color, is_active, sort_order]
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

    await queryDb('DELETE FROM website_strips WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
