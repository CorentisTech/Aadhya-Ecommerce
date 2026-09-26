import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      product_id,
      products (
        id, name, slug, department, base_price, base_mrp, base_discount,
        is_bestseller, visual_type, visual_color, visual_pattern,
        product_media ( media_url, is_primary )
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { productId } = body;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, product_id: productId });

  if (error) {
    // If it's a unique constraint violation, it's already in the wishlist. Ignore.
    if (error.code === '23505') {
      return NextResponse.json({ success: true, message: 'Already in wishlist' });
    }
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);

  if (error) {
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
