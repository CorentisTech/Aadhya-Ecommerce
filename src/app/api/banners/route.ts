import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { getOrSetCache, CacheKeys, CACHE_TTL } from '@/lib/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || 'all';

    const cacheKey = CacheKeys.banners(department);

    const banners = await getOrSetCache(
      cacheKey,
      async () => {
        let query = `SELECT * FROM banners WHERE is_active = true`;
        const params: any[] = [];

        if (department && department !== 'all') {
          query += ` AND (department = $1 OR department = 'global')`;
          params.push(department);
        }

        query += ` ORDER BY sort_order ASC, created_at DESC`;
        return await queryDb(query, params);
      },
      CACHE_TTL.BANNERS
    );

    return NextResponse.json({ success: true, banners });
  } catch (err: any) {
    console.error('Error fetching banners:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
