import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { createClient } from '@/utils/supabase/server';
import { getOrSetCache, invalidateCache, invalidateCachePattern, CacheKeys, CACHE_TTL } from '@/lib/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const department = searchParams.get('department');
    const featured = searchParams.get('featured');

    if (!productId && !department) {
      return NextResponse.json({ success: false, error: 'Product ID or department required' }, { status: 400 });
    }

    const deptKey = department || 'all';
    const cacheKey = productId
      ? CacheKeys.reviews(deptKey, productId)
      : `aadhya:cache:${deptKey}:reviews:${featured ? 'featured' : 'all'}`;

    const rows = await getOrSetCache(
      cacheKey,
      async () => {
        let query = `
          SELECT 
            r.id, 
            r.rating, 
            r.text, 
            r.title,
            r.is_verified, 
            r.is_featured,
            r.display_order,
            r.site_type,
            r.created_at,
            COALESCE(r.reviewer_name, NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Verified Customer') as author,
            COALESCE(r.reviewer_name, NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''), 'Verified Customer') as reviewer_name,
            COALESCE(prod.name, r.title, 'Curated Treasure') as product_name,
            p.avatar
          FROM reviews r
          LEFT JOIN profiles p ON r.user_id = p.id
          LEFT JOIN products prod ON r.product_id = prod.id
          WHERE r.is_approved = true
        `;
        const params: any[] = [];
        let pIdx = 1;

        if (productId) {
          query += ` AND r.product_id = $${pIdx}`;
          params.push(productId);
          pIdx++;
        }

        if (department) {
          const normDept = department.toLowerCase() === 'fashion' ? 'fashion' : 'coins';
          query += ` AND (r.site_type = $${pIdx} OR r.site_type = 'global')`;
          params.push(normDept);
          pIdx++;
        }

        if (featured === 'true') {
          query += ` AND r.is_featured = true`;
        }

        query += ` ORDER BY r.display_order ASC, r.created_at DESC`;
        return await queryDb(query, params);
      },
      CACHE_TTL.REVIEWS
    );

    return NextResponse.json({ success: true, reviews: rows });
  } catch (err: any) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, text, title } = await request.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    // Determine product department
    const prodRows = await queryDb('SELECT department FROM products WHERE id = $1', [productId]);
    const siteType = prodRows[0]?.department === 'fashion' ? 'fashion' : 'coins';

    // Server-side check if user actually purchased the product
    const orderRows = await queryDb(`
      SELECT o.id 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'DELIVERED'
    `, [user.id, productId]);

    const isVerified = orderRows && orderRows.length > 0;

    await queryDb(`
      INSERT INTO reviews (product_id, user_id, rating, text, title, is_verified, is_approved, site_type)
      VALUES ($1, $2, $3, $4, $5, $6, false, $7)
    `, [productId, user.id, rating, text, title || null, isVerified, siteType]);

    // Invalidate product reviews cache
    await invalidateCache(CacheKeys.reviews('all', productId));
    await invalidateCachePattern('aadhya:cache:*:reviews:*');

    return NextResponse.json({ success: true, message: 'Review submitted for approval' });
  } catch (err: any) {
    console.error('Error submitting review:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
