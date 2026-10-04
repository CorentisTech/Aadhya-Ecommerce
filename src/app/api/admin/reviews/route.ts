import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const search = searchParams.get('q');
    
    let query = 
      SELECT r.*, p.name as product_name, p.department as product_department 
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    ;
    const params: any[] = [];
    let paramCount = 1;

    if (department && department !== 'all') {
      query +=  AND r.site_type = $ + paramCount;
      params.push(department);
      paramCount++;
    }

    if (search) {
      query +=  AND (r.reviewer_name ILIKE $ + paramCount +  OR r.title ILIKE $ + paramCount +  OR p.name ILIKE $ + paramCount + );
      params.push(% + search + %);
      paramCount++;
    }

    query +=  ORDER BY r.is_featured DESC, r.display_order ASC, r.created_at DESC;

    const reviews = await queryDb(query, params);
    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, site_type, reviewer_name, rating, title, text, image_url, is_approved, is_featured, display_order } = body;

    if (!product_id || !site_type || !text) {
      return NextResponse.json({ success: false, error: 'Product, site type, and content are required' }, { status: 400 });
    }

    await queryDb(
      INSERT INTO reviews (product_id, site_type, reviewer_name, rating, title, text, image_url, is_approved, is_featured, display_order)
       VALUES (, , , , , , , , , ),
      [product_id, site_type, reviewer_name || 'Anonymous', rating || 5, title || '', text, image_url || null, is_approved !== false, is_featured || false, display_order || 0]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, product_id, site_type, reviewer_name, rating, title, text, image_url, is_approved, is_featured, display_order } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await queryDb(
      UPDATE reviews SET
        product_id = COALESCE(, product_id),
        site_type = COALESCE(, site_type),
        reviewer_name = COALESCE(, reviewer_name),
        rating = COALESCE(, rating),
        title = COALESCE(, title),
        text = COALESCE(, text),
        image_url = ,
        is_approved = COALESCE(, is_approved),
        is_featured = COALESCE(, is_featured),
        display_order = COALESCE(, display_order),
        updated_at = NOW()
       WHERE id = ,
      [id, product_id, site_type, reviewer_name, rating, title, text, image_url, is_approved, is_featured, display_order]
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

    await queryDb('DELETE FROM reviews WHERE id = ', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
