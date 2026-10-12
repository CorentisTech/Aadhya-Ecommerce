import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { invalidateCachePattern } from '@/lib/cache';

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
    const { department, strip_type, text_content, link_url, bg_color, text_color, is_active, sort_order } = body;

    if (!department || !strip_type) {
      return NextResponse.json({ success: false, error: 'Department and strip type are required' }, { status: 400 });
    }

    await queryDb(
      `INSERT INTO website_strips (department, strip_type, text_content, link_url, bg_color, text_color, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [department, strip_type, JSON.stringify(text_content || []), link_url || null, bg_color || '#000000', text_color || '#FFFFFF', is_active !== undefined ? Boolean(is_active) : true, Number(sort_order || 0)]
    );

    // Invalidate Redis strips and marquee caches immediately
    await invalidateCachePattern('aadhya:cache:*:strips*');
    await invalidateCachePattern('aadhya:cache:*:marquee*');
    await invalidateCachePattern('aadhya:cache:*:offers*');

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

    const updateFields: string[] = ['updated_at = NOW()'];
    const params: any[] = [id];
    let pIdx = 2;

    if (text_content !== undefined) {
      updateFields.push(`text_content = $${pIdx}`);
      params.push(JSON.stringify(text_content));
      pIdx++;
    }
    if (link_url !== undefined) {
      updateFields.push(`link_url = $${pIdx}`);
      params.push(link_url);
      pIdx++;
    }
    if (bg_color !== undefined) {
      updateFields.push(`bg_color = $${pIdx}`);
      params.push(bg_color);
      pIdx++;
    }
    if (text_color !== undefined) {
      updateFields.push(`text_color = $${pIdx}`);
      params.push(text_color);
      pIdx++;
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${pIdx}`);
      params.push(Boolean(is_active));
      pIdx++;
    }
    if (sort_order !== undefined) {
      updateFields.push(`sort_order = $${pIdx}`);
      params.push(Number(sort_order));
      pIdx++;
    }

    await queryDb(
      `UPDATE website_strips SET ${updateFields.join(', ')} WHERE id = $1`,
      params
    );

    // Invalidate Redis strips and marquee caches immediately
    await invalidateCachePattern('aadhya:cache:*:strips*');
    await invalidateCachePattern('aadhya:cache:*:marquee*');
    await invalidateCachePattern('aadhya:cache:*:offers*');

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

    // Invalidate Redis strips and marquee caches immediately
    await invalidateCachePattern('aadhya:cache:*:strips*');
    await invalidateCachePattern('aadhya:cache:*:marquee*');
    await invalidateCachePattern('aadhya:cache:*:offers*');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
