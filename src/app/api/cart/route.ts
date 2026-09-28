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

async function getOrCreateDeviceCart(userId: string, deviceId: string): Promise<string> {
  // Register or update device
  await queryDb(
    `INSERT INTO user_devices (user_id, device_id, device_name, last_active)
     VALUES ($1, $2, 'Web Device', NOW())
     ON CONFLICT (user_id, device_id) DO UPDATE SET last_active = NOW()`,
    [userId, deviceId]
  );

  // Check existing cart
  const rows = await queryDb(
    `SELECT id FROM carts WHERE user_id = $1 AND device_id = $2`,
    [userId, deviceId]
  );

  if (rows.length > 0) {
    return rows[0].id;
  }

  // Create new cart for user + device
  const newCart = await queryDb(
    `INSERT INTO carts (user_id, device_id, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     RETURNING id`,
    [userId, deviceId]
  );

  return newCart[0].id;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const deviceId = getHeaderOrParamDeviceId(request);
    const cartId = await getOrCreateDeviceCart(user.id, deviceId);

    // Fetch items with validated product details
    const items = await queryDb(
      `SELECT 
        ci.id AS cart_item_id,
        ci.cart_id,
        ci.product_id,
        ci.variant_id,
        ci.quantity,
        ci.selected_size,
        ci.selected_color,
        ci.created_at,
        p.product_no,
        p.name,
        p.slug,
        p.department,
        p.base_price,
        p.base_mrp,
        p.base_discount,
        (
          SELECT pm.media_url 
          FROM product_media pm 
          WHERE pm.product_id = p.id 
          ORDER BY pm.is_primary DESC, pm.sort_order ASC 
          LIMIT 1
        ) AS image_url,
        pv.stock_quantity AS variant_stock,
        pv.price AS variant_price,
        pv.sku AS variant_sku
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE ci.cart_id = $1
       ORDER BY ci.created_at ASC`,
      [cartId]
    );

    // Calculate verified totals on backend
    let subtotal = 0;
    const formattedItems = items.map((item: any) => {
      const price = Number(item.variant_price || item.base_price || 0);
      const totalItemPrice = price * item.quantity;
      subtotal += totalItemPrice;
      return {
        ...item,
        verifiedPrice: price,
        totalItemPrice
      };
    });

    return NextResponse.json({
      cartId,
      deviceId,
      items: formattedItems,
      subtotal,
      itemCount: items.reduce((acc: number, cur: any) => acc + cur.quantity, 0)
    });
  } catch (error: any) {
    console.error('Cart GET error:', error);
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
    const { productId, variantId, quantity = 1, size, color } = body;
    const deviceId = getHeaderOrParamDeviceId(request, body.deviceId);

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const qty = Math.max(1, parseInt(quantity, 10));

    // Backend verification of product & stock
    const prods = await queryDb(
      `SELECT id, is_active FROM products WHERE id = $1`,
      [productId]
    );

    if (prods.length === 0 || !prods[0].is_active) {
      return NextResponse.json({ error: 'Product not available.' }, { status: 404 });
    }

    const cartId = await getOrCreateDeviceCart(user.id, deviceId);

    // Check if matching item already exists in this cart
    const existing = await queryDb(
      `SELECT id, quantity FROM cart_items 
       WHERE cart_id = $1 
         AND product_id = $2 
         AND (variant_id IS NOT DISTINCT FROM $3)
         AND (selected_size IS NOT DISTINCT FROM $4)
         AND (selected_color IS NOT DISTINCT FROM $5)`,
      [cartId, productId, variantId || null, size || null, color || null]
    );

    if (existing.length > 0) {
      await queryDb(
        `UPDATE cart_items 
         SET quantity = quantity + $1, updated_at = NOW() 
         WHERE id = $2`,
        [qty, existing[0].id]
      );
    } else {
      await queryDb(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, selected_size, selected_color, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [cartId, productId, variantId || null, qty, size || null, color || null]
      );
    }

    return NextResponse.json({ success: true, message: 'Added to device cart' });
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { cartItemId, productId, size, color, quantity } = body;
    const deviceId = getHeaderOrParamDeviceId(request, body.deviceId);

    const newQty = parseInt(quantity, 10);
    const cartId = await getOrCreateDeviceCart(user.id, deviceId);

    if (cartItemId) {
      if (newQty <= 0) {
        await queryDb(
          `DELETE FROM cart_items WHERE id = $1 AND cart_id = $2`,
          [cartItemId, cartId]
        );
      } else {
        await queryDb(
          `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 AND cart_id = $3`,
          [newQty, cartItemId, cartId]
        );
      }
    } else if (productId) {
      if (newQty <= 0) {
        await queryDb(
          `DELETE FROM cart_items 
           WHERE cart_id = $1 
             AND product_id = $2 
             AND (selected_size IS NOT DISTINCT FROM $3) 
             AND (selected_color IS NOT DISTINCT FROM $4)`,
          [cartId, productId, size || null, color || null]
        );
      } else {
        await queryDb(
          `UPDATE cart_items 
           SET quantity = $1, updated_at = NOW() 
           WHERE cart_id = $2 
             AND product_id = $3 
             AND (selected_size IS NOT DISTINCT FROM $4) 
             AND (selected_color IS NOT DISTINCT FROM $5)`,
          [newQty, cartId, productId, size || null, color || null]
        );
      }
    } else {
      return NextResponse.json({ error: 'Cart Item ID or Product ID is required.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart PUT error:', error);
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
    const cartItemId = searchParams.get('cartItemId');
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const clearAll = searchParams.get('clearAll') === 'true';
    const deviceId = getHeaderOrParamDeviceId(request);

    const cartId = await getOrCreateDeviceCart(user.id, deviceId);

    if (clearAll) {
      await queryDb(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
      return NextResponse.json({ success: true, message: 'Cart cleared' });
    }

    if (cartItemId) {
      await queryDb(
        `DELETE FROM cart_items WHERE id = $1 AND cart_id = $2`,
        [cartItemId, cartId]
      );
      return NextResponse.json({ success: true, message: 'Item removed from cart' });
    }

    if (productId) {
      await queryDb(
        `DELETE FROM cart_items 
         WHERE cart_id = $1 
           AND product_id = $2 
           AND ($3::text IS NULL OR selected_size = $3) 
           AND ($4::text IS NULL OR selected_color = $4)`,
        [cartId, productId, size || null, color || null]
      );
      return NextResponse.json({ success: true, message: 'Item removed from cart' });
    }

    return NextResponse.json({ error: 'Cart Item ID or Product ID is required.' }, { status: 400 });
  } catch (error: any) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
