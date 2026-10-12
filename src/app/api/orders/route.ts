import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { validateUserSession } from '@/utils/sessionValidation';
import { acquireLock, releaseLock, invalidateCache, CacheKeys } from '@/lib/cache';
import { publishJob } from '@/lib/queue';

export async function GET(request: Request) {
  try {
    const session = await validateUserSession(request);
    if (!session.valid) {
      return NextResponse.json({ error: session.error, revoked: session.revoked }, { status: session.status });
    }
    const user = session.user;

    const orders = await queryDb(
      `SELECT 
        o.id,
        o.order_number,
        o.status,
        o.subtotal,
        o.shipping_cost,
        o.discount_amount,
        o.total_amount,
        o.payment_method,
        o.payment_status,
        o.courier,
        o.tracking_number,
        o.tracking_url,
        o.dispatched_at,
        o.delivered_at,
        o.expected_delivery_date,
        o.status_history,
        o.rejection_reason,
        o.created_at,
        o.updated_at,
        (
          SELECT json_agg(json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'selected_size', oi.selected_size,
            'selected_color', oi.selected_color,
            'product_name', p.name,
            'product_no', p.product_no,
            'product_slug', p.slug,
            'product_image', (
              SELECT pm.media_url 
              FROM product_media pm 
              WHERE pm.product_id = p.id 
              ORDER BY pm.is_primary DESC, pm.sort_order ASC 
              LIMIT 1
            )
          ))
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) AS items
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user.id]
    );

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await validateUserSession(request);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: session.error, revoked: session.revoked }, { status: session.status });
    }
    const user = session.user;

    const body = await request.json();
    const { items, shipping_address, payment_method, idempotency_key, cartId } = body;

    // CHECKOUT CONCURRENCY PROTECTION: Distributed Lock (TTL 45s)
    const lockKey = CacheKeys.checkoutLock(user.id, cartId || idempotency_key || 'active');
    const lockAcquired = await acquireLock(lockKey, 45);

    if (!lockAcquired) {
      return NextResponse.json({
        success: false,
        error: 'A checkout is already in progress for this order. Please wait.'
      }, { status: 409 });
    }

    try {
      // SERVER-SIDE VALIDATION: Items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ success: false, error: 'Cart is empty.' }, { status: 400 });
      }

      // SERVER-SIDE VALIDATION: Shipping address
      const addr = shipping_address || {};
      const requiredFields: { key: string; label: string }[] = [
        { key: 'firstName', label: 'First name' },
        { key: 'lastName', label: 'Last name' },
        { key: 'phone', label: 'Mobile number' },
        { key: 'address', label: 'Address' },
        { key: 'streetName', label: 'Street name' },
        { key: 'landmark', label: 'Landmark' },
        { key: 'zip', label: 'Pincode' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
      ];
      for (const f of requiredFields) {
        if (!addr[f.key] || String(addr[f.key]).trim() === '') {
          return NextResponse.json({ success: false, error: `${f.label} is required.` }, { status: 400 });
        }
      }
      if (!/^\d{6}$/.test(String(addr.zip).trim())) {
        return NextResponse.json({ success: false, error: 'Invalid pincode. Must be 6 digits.' }, { status: 400 });
      }

      // SERVER-SIDE: Recalculate total from real product prices (never trust frontend price)
      let serverSubtotal = 0;
      for (const item of items) {
        if (!item.product?.id || !item.quantity || item.quantity < 1) {
          return NextResponse.json({ success: false, error: 'Invalid item in cart.' }, { status: 400 });
        }
        // Fetch authoritative price from DB (column is base_price)
        const productRows = await queryDb('SELECT base_price, is_active FROM products WHERE id = $1', [item.product.id]);
        if (!productRows || productRows.length === 0 || !productRows[0].is_active) {
          return NextResponse.json({ success: false, error: `Product not available: ${item.product.id}` }, { status: 400 });
        }
        serverSubtotal += Number(productRows[0].base_price) * item.quantity;
      }

      const shippingCost = serverSubtotal >= 5000 ? 0 : 150;
      
      // Authoritative offer calculation
      let discountAmount = 0;
      let appliedOfferCode: string | null = null;
      const offerCode = body.offer_code || body.promo_code;
      if (offerCode) {
        const cleanCode = String(offerCode).trim().toUpperCase();
        const offerRows = await queryDb(
          `SELECT * FROM offers WHERE UPPER(code) = $1 AND is_active = true AND (end_date IS NULL OR end_date > NOW())`,
          [cleanCode]
        );
        if (offerRows && offerRows.length > 0) {
          const offer = offerRows[0];
          const minOrder = Number(offer.min_order_amount || 0);
          if (serverSubtotal >= minOrder) {
            appliedOfferCode = offer.code;
            if (offer.discount_percentage && Number(offer.discount_percentage) > 0) {
              discountAmount = Math.round(serverSubtotal * (Number(offer.discount_percentage) / 100));
            } else if (offer.discount_amount && Number(offer.discount_amount) > 0) {
              discountAmount = Math.min(Number(offer.discount_amount), serverSubtotal);
            }
          }
        }
      }

      const serverTotal = Math.max(0, serverSubtotal + shippingCost - discountAmount);

      // Create or link shipping address record
      const addressRows = await queryDb(`
        INSERT INTO addresses (
          id, user_id, full_name, email, street_name, address_line1, landmark, city, state, zip_code, country, alt_phone, is_default
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true
        ) RETURNING id
      `, [
        user.id,
        `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
        addr.email || user.email || '',
        addr.streetName || '',
        addr.address || '',
        addr.landmark || '',
        addr.city || '',
        addr.state || '',
        addr.zip || '',
        addr.country || 'India',
        addr.phone || ''
      ]);

      const shippingAddressId = addressRows?.[0]?.id || null;

      const orderNumber = 'AD-' + Math.floor(100000 + Math.random() * 900000);
      const userId = user.id;

      // Validate payment method against database enum ('CARD', 'UPI', 'NET_BANKING', 'COD')
      const rawMethod = String(payment_method || 'CARD').toUpperCase();
      const validMethods = ['CARD', 'UPI', 'NET_BANKING', 'COD'];
      const paymentMethod = validMethods.includes(rawMethod) ? rawMethod : 'CARD';
      const isCOD = paymentMethod === 'COD';

      // Statuses strictly constrained to Postgres order_status and payment_status enums
      const orderStatus = isCOD ? 'CONFIRMED' : 'PENDING';
      const paymentStatus = isCOD ? 'PENDING' : 'PAID';
      
      // Authoritative order insertion in Supabase / Postgres
      const orderRows = await queryDb(`
        INSERT INTO orders (
          order_number, user_id, status, subtotal, shipping_cost, discount_amount, promo_code, total_amount, 
          payment_method, payment_status, shipping_address_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) RETURNING id, order_number, status, payment_status, total_amount
      `, [
        orderNumber, 
        userId, 
        orderStatus,
        serverSubtotal, 
        shippingCost, 
        discountAmount,
        appliedOfferCode,
        serverTotal, 
        paymentMethod,
        paymentStatus,
        shippingAddressId
      ]);

      const newOrder = orderRows[0];

      // Insert items with verified base_price
      if (items && items.length > 0) {
        for (const item of items) {
          const priceRows = await queryDb('SELECT base_price FROM products WHERE id = $1', [item.product.id]);
          const verifiedPrice = priceRows && priceRows.length > 0 ? Number(priceRows[0].base_price) : 0;
          await queryDb(`
            INSERT INTO order_items (order_id, product_id, quantity, unit_price, selected_size, selected_color)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            newOrder.id,
            item.product.id,
            item.quantity,
            verifiedPrice,
            item.selectedSize || null,
            item.selectedColor || null
          ]);
        }
      }

      // Invalidate customer's cart accelerator in Redis
      const deviceId = request.headers.get('x-device-id') || 'default_device';
      await invalidateCache(CacheKeys.cart(user.id, deviceId));

      // Asynchronous background job (notification & receipt) via QStash / worker
      publishJob({
        type: 'ORDER_NOTIFICATION',
        payload: { orderId: newOrder.id, orderNumber: newOrder.order_number, total: serverTotal }
      }).catch(() => {});

      return NextResponse.json({ success: true, order: newOrder });

    } finally {
      // Always release distributed lock
      await releaseLock(lockKey);
    }

  } catch (error: any) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
