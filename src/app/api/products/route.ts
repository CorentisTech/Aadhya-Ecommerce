import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Filters
  const department = searchParams.get('department');
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const sort = searchParams.get('sort');

  let query = supabase
    .from('products')
    .select(`
      id, product_no, name, slug, department, description, 
      visual_type, visual_color, visual_pattern,
      base_price, base_mrp, base_discount, 
      is_bestseller, avg_rating, reviews_count,
      categories(name, slug),
      product_variants(id, sku, price, mrp, discount, stock_quantity, fashion_variant_details(*)),
      product_media(media_url, is_primary, color_name)
    `, { count: 'exact' })
    .eq('is_active', true);

  if (department) {
    query = query.eq('department', department);
  }

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`); // Simple search for now
  }

  // Sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('base_price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('base_price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'bestseller':
      query = query.order('is_bestseller', { ascending: false }).order('reviews_count', { ascending: false });
      break;
    default:
      // 'recommended' or default
      query = query.order('is_bestseller', { ascending: false }).order('avg_rating', { ascending: false });
      break;
  }

  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  return NextResponse.json({
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    }
  });
}
