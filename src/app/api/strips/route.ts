import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || 'fashion';
    const stripType = searchParams.get('type');

    let query = `SELECT * FROM website_strips WHERE department = $1 AND is_active = true`;
    const params: any[] = [department];

    if (stripType) {
      query += ` AND strip_type = $2`;
      params.push(stripType);
    }

    query += ` ORDER BY sort_order ASC`;

    const strips = await queryDb(query, params);
    return NextResponse.json({ success: true, strips });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
