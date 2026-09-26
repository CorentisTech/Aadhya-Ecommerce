import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

async function getOrCreateCart(supabase: any, userId: string) {
  // Try to find existing cart
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();
    
  if (!cart) {
    // Create new cart
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single();
      
    if (error) throw error;
    cart = newCart;
  }
  return cart.id;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('carts')
    .select(`
      id,
      cart_items (
        id, quantity, selected_size, selected_color,
        products ( id, name, slug, department, base_price, base_discount, product_media ( media_url, is_primary ) ),
        product_variants ( id, sku, price, discount )
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means zero rows
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }

  return NextResponse.json(data || { cart_items: [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { productId, variantId, quantity = 1, size, color } = body;

  try {
    const cartId = await getOrCreateCart(supabase, user.id);

    // Upsert logic for cart items
    // First, check if the item already exists in the cart with same params
    let query = supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', productId);
      
    if (variantId) query = query.eq('variant_id', variantId);
    if (size) query = query.eq('selected_size', size);
    if (color) query = query.eq('selected_color', color);

    const { data: existingItems } = await query;
    const existingItem = existingItems?.[0];

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          product_id: productId,
          variant_id: variantId || null,
          quantity,
          selected_size: size || null,
          selected_color: color || null
        });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
