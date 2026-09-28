import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';

function getHeaderOrParamDeviceId(request: Request, bodyDeviceId?: string): string {
  if (bodyDeviceId && bodyDeviceId.trim().length > 0) return bodyDeviceId.trim().slice(0, 100);
  const headerId = request.headers.get('x-device-id');
  if (headerId && headerId.trim().length > 0) return headerId.trim().slice(0, 100);
  const url = new URL(request.url);
  const queryId = url.searchParams.get('deviceId');
  if (queryId && queryId.trim().length > 0) return queryId.trim().slice(0, 100);
  return 'default_device';
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const deviceId = getHeaderOrParamDeviceId(request);

    // Query device-scoped wishlist with full product details
    const rows = await queryDb(
      `SELECT 
        w.id AS wishlist_item_id,
        w.product_id,
        w.variant_id,
        w.created_at,
        p.id,
        p.product_no,
        p.name,
        p.slug,
        p.department,
        p.base_price,
        p.base_mrp,
        p.base_discount,
        p.is_bestseller,
        p.avg_rating,
        p.reviews_count,
        p.visual_type,
        p.visual_color,
        p.visual_pattern,
        (
          SELECT pm.media_url 
          FROM product_media pm 
          WHERE pm.product_id = p.id 
          ORDER BY pm.is_primary DESC, pm.sort_order ASC 
          LIMIT 1
        ) AS image_url
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1 AND w.device_id = $2
       ORDER BY w.created_at DESC`,
      [user.id, deviceId]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, variantId } = body;
    const deviceId = getHeaderOrParamDeviceId(request, body.deviceId);

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    // Ensure product exists
    const prod = await queryDb(`SELECT id FROM products WHERE id = $1`, [productId]);
    if (prod.length === 0) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Ensure device is registered to this user
    await queryDb(
      `INSERT INTO user_devices (user_id, device_id, device_name, last_active)
       VALUES ($1, $2, 'Web Device', NOW())
       ON CONFLICT (user_id, device_id) DO UPDATE SET last_active = NOW()`,
      [user.id, deviceId]
    );

    // Insert into wishlists scoped strictly to (user_id, device_id)
    await queryDb(
      `INSERT INTO wishlists (user_id, device_id, product_id, variant_id, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, device_id, product_id, variant_id) DO NOTHING`,
      [user.id, deviceId, productId, variantId || null]
    );

    return NextResponse.json({ success: true, message: 'Added to device wishlist' });
  } catch (error: any) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const deviceId = getHeaderOrParamDeviceId(request);

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    await queryDb(
      `DELETE FROM wishlists 
       WHERE user_id = $1 AND device_id = $2 AND product_id = $3`,
      [user.id, deviceId, productId]
    );

    return NextResponse.json({ success: true, message: 'Removed from device wishlist' });
  } catch (error: any) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
