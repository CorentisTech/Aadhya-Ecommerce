import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { invalidateCachePattern } from '@/lib/cache';

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

    // Invalidate Redis categories and homepage caches
    await invalidateCachePattern('aadhya:cache:*:categories');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

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
    
    // Check if any products are using this category
    const prodCheck = await queryDb(
      `SELECT count(*)::int as count FROM products WHERE category_id = $1`,
      [id]
    );
    const prodCount = prodCheck[0]?.count || 0;

    if (prodCount > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete category: it still contains ${prodCount} product(s). Please reassign or delete them first.`
      }, { status: 400 });
    }

    // Safely delete category
    await queryDb(`DELETE FROM categories WHERE id = $1`, [id]);
    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ('DELETE_CATEGORY', 'categories', $1, '{"status": "deleted"}')
    `, [id]);

    // Invalidate Redis categories and homepage caches
    await invalidateCachePattern('aadhya:cache:*:categories*');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting category:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
