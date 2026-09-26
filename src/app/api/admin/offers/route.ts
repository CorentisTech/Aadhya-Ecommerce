import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const offers = await queryDb(`SELECT * FROM offers ORDER BY created_at DESC`);
    return NextResponse.json({ success: true, offers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, code, discount_percentage, discount_amount, department = 'global', end_date } = body;

    if (!title || !code) {
      return NextResponse.json({ success: false, error: 'Title and code are required' }, { status: 400 });
    }

    const id = uuidv4();
    const insertSql = `
      INSERT INTO offers (id, title, code, discount_percentage, discount_amount, department, end_date, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *
    `;

    const result = await queryDb(insertSql, [
      id,
      title,
      code.toUpperCase(),
      discount_percentage || null,
      discount_amount || null,
      department,
      end_date || null
    ]);

    return NextResponse.json({ success: true, offer: result[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, code, discount_percentage, discount_amount, department, is_active } = body;

    const updateSql = `
      UPDATE offers
      SET 
        title = COALESCE($1, title),
        code = COALESCE($2, code),
        discount_percentage = COALESCE($3, discount_percentage),
        discount_amount = COALESCE($4, discount_amount),
        department = COALESCE($5, department),
        is_active = COALESCE($6, is_active)
      WHERE id = $7
      RETURNING *
    `;

    const result = await queryDb(updateSql, [title, code?.toUpperCase(), discount_percentage, discount_amount, department, is_active, id]);
    return NextResponse.json({ success: true, offer: result[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await queryDb(`DELETE FROM offers WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: 'Offer deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
