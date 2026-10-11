import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { getOrSetCache, CacheKeys, CACHE_TTL } from '@/lib/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || 'fashion';
    const stripType = searchParams.get('type') || 'all';

    const cacheKey = CacheKeys.websiteStrips(department, stripType);

    const strips = await getOrSetCache(
      cacheKey,
      async () => {
        let query = `SELECT * FROM website_strips WHERE department = $1 AND is_active = true`;
        const params: any[] = [department];

        if (stripType && stripType !== 'all') {
          query += ` AND strip_type = $2`;
          params.push(stripType);
        }

        query += ` ORDER BY sort_order ASC`;
        return await queryDb(query, params);
      },
      CACHE_TTL.STRIPS
    );

    return NextResponse.json({ success: true, strips });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
