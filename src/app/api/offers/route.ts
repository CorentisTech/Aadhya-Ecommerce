import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { getOrSetCache, CacheKeys, CACHE_TTL } from '@/lib/cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const department = searchParams.get('department') || 'fashion';

    // If specific code requested, validate it directly against database
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      const offerRows = await queryDb(
        `SELECT id, title, code, discount_percentage, discount_amount, department, end_date, is_active
         FROM offers
         WHERE UPPER(code) = $1
           AND is_active = true
           AND (end_date IS NULL OR end_date > NOW())
           AND (department = $2 OR department = 'global')
         LIMIT 1`,
        [cleanCode, department]
      );

      if (!offerRows || offerRows.length === 0) {
        return NextResponse.json({
          success: false,
          error: `Promo code "${cleanCode}" is invalid, expired, or not applicable.`
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        offer: offerRows[0]
      });
    }

    // Otherwise, return all active offers for the department (cached)
    const cacheKey = CacheKeys.offers(department);
    const offers = await getOrSetCache(
      cacheKey,
      async () => {
        return await queryDb(
          `SELECT id, title, code, discount_percentage, discount_amount, department, end_date, is_active
           FROM offers
           WHERE is_active = true
             AND (end_date IS NULL OR end_date > NOW())
             AND (department = $1 OR department = 'global')
           ORDER BY created_at DESC`,
          [department]
        );
      },
      CACHE_TTL.OFFERS
    );

    return NextResponse.json({
      success: true,
      offers
    });
  } catch (err: any) {
    console.error('Offers GET error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch offers' }, { status: 500 });
  }
}
