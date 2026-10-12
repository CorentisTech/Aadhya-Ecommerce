import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { invalidateCachePattern, CacheKeys, invalidateCache } from '@/lib/cache';

function normalizeSiteType(dep?: string | null): string {
  if (!dep) return 'fashion';
  const lower = dep.toLowerCase();
  if (lower.includes('coin') || lower.includes('numis')) return 'coins';
  return 'fashion';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const search = searchParams.get('q');
    
    let query = `
      SELECT 
        r.id,
        r.id as _id,
        r.product_id,
        r.product_id as "productId",
        r.rating,
        r.text,
        r.text as "reviewContent",
        r.title,
        r.title as "reviewTitle",
        r.reviewer_name,
        r.reviewer_name as "customerName",
        r.image_url,
        r.image_url as image,
        r.is_approved,
        CASE WHEN r.is_approved THEN 'approved' ELSE 'pending' END as status,
        r.is_featured as "isFeatured",
        r.is_featured,
        r.is_verified as "isVerified",
        r.is_verified,
        r.display_order as "displayOrder",
        r.display_order,
        r.site_type,
        r.site_type as department,
        r.created_at,
        p.name as product_name, 
        p.department as product_department 
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (department && department !== 'all') {
      const siteType = normalizeSiteType(department);
      query += ` AND (r.site_type = $${paramCount} OR r.site_type = 'global')`;
      params.push(siteType);
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
    console.error('Error fetching admin reviews:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const site_type = normalizeSiteType(body.site_type || body.department);
    const product_id = body.product_id || body.productId || null;
    const rating = Number(body.rating) || 5;
    const title = body.title || body.reviewTitle || '';
    const text = body.text || body.content || body.reviewContent || '';
    const reviewer_name = body.reviewer_name || body.customerName || 'Verified Customer';
    const image_url = body.image_url || body.image || null;
    const is_approved = body.is_approved !== undefined 
      ? Boolean(body.is_approved) 
      : (body.status === 'approved' || body.status === undefined);
    const is_featured = Boolean(body.is_featured || body.isFeatured);
    const display_order = Number(body.display_order || body.displayOrder || 0);

    const result = await queryDb(`
      INSERT INTO reviews (
        site_type, product_id, rating, title, text, 
        reviewer_name, image_url, is_approved, is_featured, display_order, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
      RETURNING *
    `, [
      site_type, product_id, rating, title, text,
      reviewer_name, image_url, is_approved, is_featured, display_order
    ]);

    // Invalidate review caches
    if (product_id) {
      await invalidateCache(CacheKeys.reviews('all', product_id));
    }
    await invalidateCachePattern('aadhya:cache:*:reviews:*');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

    return NextResponse.json({ success: true, review: result[0] });
  } catch (err: any) {
    console.error('Error creating admin review:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    const body = await request.json();
    const id = body.id || body._id || queryId;

    if (!id) return NextResponse.json({ success: false, error: 'Review ID required' }, { status: 400 });

    const site_type = body.site_type || body.department ? normalizeSiteType(body.site_type || body.department) : undefined;
    const product_id = body.product_id !== undefined ? body.product_id : body.productId;
    const rating = body.rating !== undefined ? Number(body.rating) : undefined;
    const title = body.title !== undefined ? body.title : body.reviewTitle;
    const text = body.text !== undefined ? body.text : (body.content !== undefined ? body.content : body.reviewContent);
    const reviewer_name = body.reviewer_name !== undefined ? body.reviewer_name : body.customerName;
    const image_url = body.image_url !== undefined ? body.image_url : body.image;
    const is_approved = body.is_approved !== undefined 
      ? Boolean(body.is_approved) 
      : (body.status !== undefined ? body.status === 'approved' : undefined);
    const is_featured = body.is_featured !== undefined 
      ? Boolean(body.is_featured) 
      : (body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined);
    const display_order = body.display_order !== undefined 
      ? Number(body.display_order) 
      : (body.displayOrder !== undefined ? Number(body.displayOrder) : undefined);

    const updateFields: string[] = ['updated_at = NOW()'];
    const params: any[] = [id];
    let pIdx = 2;

    if (site_type !== undefined) {
      updateFields.push(`site_type = $${pIdx}`);
      params.push(site_type);
      pIdx++;
    }
    if (product_id !== undefined) {
      updateFields.push(`product_id = $${pIdx}`);
      params.push(product_id || null);
      pIdx++;
    }
    if (rating !== undefined) {
      updateFields.push(`rating = $${pIdx}`);
      params.push(rating);
      pIdx++;
    }
    if (title !== undefined) {
      updateFields.push(`title = $${pIdx}`);
      params.push(title);
      pIdx++;
    }
    if (text !== undefined) {
      updateFields.push(`text = $${pIdx}`);
      params.push(text);
      pIdx++;
    }
    if (reviewer_name !== undefined) {
      updateFields.push(`reviewer_name = $${pIdx}`);
      params.push(reviewer_name);
      pIdx++;
    }
    if (image_url !== undefined) {
      updateFields.push(`image_url = $${pIdx}`);
      params.push(image_url);
      pIdx++;
    }
    if (is_approved !== undefined) {
      updateFields.push(`is_approved = $${pIdx}`);
      params.push(is_approved);
      pIdx++;
    }
    if (is_featured !== undefined) {
      updateFields.push(`is_featured = $${pIdx}`);
      params.push(is_featured);
      pIdx++;
    }
    if (display_order !== undefined) {
      updateFields.push(`display_order = $${pIdx}`);
      params.push(display_order);
      pIdx++;
    }

    const result = await queryDb(`
      UPDATE reviews SET ${updateFields.join(', ')}
      WHERE id = $1
      RETURNING *
    `, params);

    // Invalidate review caches
    if (product_id) {
      await invalidateCache(CacheKeys.reviews('all', product_id));
    }
    await invalidateCachePattern('aadhya:cache:*:reviews:*');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

    return NextResponse.json({ success: true, review: result[0] });
  } catch (err: any) {
    console.error('Error updating admin review:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const reviewRows = await queryDb(`SELECT product_id FROM reviews WHERE id = $1`, [id]);
    const productId = reviewRows[0]?.product_id;

    await queryDb(`DELETE FROM reviews WHERE id = $1`, [id]);

    if (productId) {
      await invalidateCache(CacheKeys.reviews('all', productId));
    }
    await invalidateCachePattern('aadhya:cache:*:reviews:*');
    await invalidateCachePattern('aadhya:cache:*:homepage*');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting admin review:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
