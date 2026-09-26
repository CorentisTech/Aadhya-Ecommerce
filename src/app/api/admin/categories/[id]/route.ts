import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image_url, sort_order, is_active } = body;

    const updateSql = `
      UPDATE categories
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        image_url = COALESCE($3, image_url),
        sort_order = COALESCE($4, sort_order),
        is_active = COALESCE($5, is_active),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;

    const result = await queryDb(updateSql, [name, description, image_url, sort_order, is_active, id]);

    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ('UPDATE_CATEGORY', 'categories', $1, $2)
    `, [id, JSON.stringify({ name, is_active })]);

    return NextResponse.json({ success: true, category: result[0] });
  } catch (err: any) {
    console.error('Error updating category:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await queryDb(`UPDATE categories SET is_active = false, updated_at = NOW() WHERE id = $1`, [id]);
    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ('ARCHIVE_CATEGORY', 'categories', $1, '{"is_active": false}')
    `, [id]);

    return NextResponse.json({ success: true, message: 'Category archived successfully' });
  } catch (err: any) {
    console.error('Error archiving category:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
