import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getOrSetCache, CacheKeys, CACHE_TTL } from '@/lib/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department') || 'all';

  const cacheKey = CacheKeys.categories(department);

  try {
    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const supabase = await createClient();
        let query = supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (department && department !== 'all') {
          query = query.eq('department', department);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      },
      CACHE_TTL.CATEGORIES
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
