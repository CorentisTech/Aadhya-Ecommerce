import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, subtotal, shipping_cost, discount_amount, total_amount, created_at,
      order_items (
        id, quantity, unit_price, selected_size, selected_color,
        products ( id, name, image_url )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // In a real application, you would:
  // 1. Fetch the user's cart from the DB
  // 2. Validate stock for each item using the reserve_stock RPC
  // 3. Create the order & order_items
  // 4. Clear the cart
  // 5. Integrate with a payment gateway (e.g. Razorpay/Stripe)

  const body = await request.json();
  const { addressId, paymentMethod } = body;

  try {
    // Basic implementation outline
    const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
    if (!cart) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    const { data: cartItems } = await supabase.from('cart_items').select('*, products(*), product_variants(*)').eq('cart_id', cart.id);
    if (!cartItems || cartItems.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

    let subtotal = 0;
    cartItems.forEach(item => {
       const price = item.product_variants?.price || item.products.base_price;
       subtotal += (price * item.quantity);
    });
    
    const shipping_cost = subtotal >= 5000 ? 0 : 150;
    const discount_amount = subtotal * 0.1; // Example 10% discount
    const total_amount = subtotal + shipping_cost - discount_amount;

    // Create Order
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      order_number: 'AD-' + Math.floor(Math.random() * 100000),
      user_id: user.id,
      shipping_address_id: addressId,
      subtotal,
      shipping_cost,
      discount_amount,
      total_amount,
      payment_method: paymentMethod || 'COD'
    }).select().single();

    if (orderError) throw orderError;

    // Create Order Items
    const orderItemsToInsert = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.product_variants?.price || item.products.base_price,
      selected_size: item.selected_size,
      selected_color: item.selected_color
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
    if (itemsError) throw itemsError;

    // Clear cart
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
