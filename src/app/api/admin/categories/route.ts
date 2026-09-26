import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department'); // 'fashion' | 'numismatics'

    let whereClause = '';
    let params: any[] = [];
    if (department) {
      whereClause = 'WHERE c.department = $1';
      params.push(department);
    }

    const query = `
      SELECT 
        c.*,
        COUNT(p.id)::int AS product_count,
        COUNT(CASE WHEN p.is_active = true THEN 1 END)::int AS active_product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `;

    const categories = await queryDb(query, params);
    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    console.error('Error fetching admin categories:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      department,
      description,
      image_url,
      visual_type,
      visual_color,
      sort_order = 0
    } = body;

    if (!name || !department) {
      return NextResponse.json(
        { success: false, error: 'Category name and department are required' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${department}`;

    const insertSql = `
      INSERT INTO categories (
        id, name, slug, description, image_url, visual_type, visual_color, department, sort_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `;

    const result = await queryDb(insertSql, [
      id,
      name,
      slug,
      description || '',
      image_url || '',
      visual_type || '',
      visual_color || '',
      department,
      sort_order
    ]);

    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ('CREATE_CATEGORY', 'categories', $1, $2)
    `, [id, JSON.stringify({ name, department, slug })]);

    return NextResponse.json({ success: true, category: result[0] });
  } catch (err: any) {
    console.error('Error creating category:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
