import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { validateUserSession } from '@/utils/sessionValidation';

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
    const { items, shipping_address, payment_method, idempotency_key } = body;

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

    // SERVER-SIDE: Recalculate total from real product prices
    let serverSubtotal = 0;
    for (const item of items) {
      if (!item.product?.id || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ success: false, error: 'Invalid item in cart.' }, { status: 400 });
      }
      // Fetch real price from DB to prevent price manipulation
      const productRows = await queryDb('SELECT price FROM products WHERE id = $1', [item.product.id]);
      if (!productRows || productRows.length === 0) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.product.id}` }, { status: 400 });
      }
      serverSubtotal += Number(productRows[0].price) * item.quantity;
    }

    const shippingCost = serverSubtotal >= 5000 ? 0 : 150;
    
    // Apply real offer/discount if offer_code provided
    let discountAmount = 0;
    if (body.offer_code) {
      const offerRows = await queryDb(
        `SELECT * FROM offers WHERE code = $1 AND is_active = true AND (end_date IS NULL OR end_date > NOW())`,
        [body.offer_code]
      );
      if (offerRows && offerRows.length > 0) {
        const offer = offerRows[0];
        const minOrder = Number(offer.min_order_amount || 0);
        if (serverSubtotal >= minOrder) {
          if (offer.discount_percentage && Number(offer.discount_percentage) > 0) {
            discountAmount = Math.round(serverSubtotal * (Number(offer.discount_percentage) / 100));
          } else if (offer.discount_amount && Number(offer.discount_amount) > 0) {
            discountAmount = Math.min(Number(offer.discount_amount), serverSubtotal);
          }
        }
      }
    }

    const serverTotal = serverSubtotal + shippingCost - discountAmount;

    // Check idempotency (prevent duplicate orders if user clicked twice)
    if (idempotency_key) {
      const existing = await queryDb('SELECT id, order_number FROM orders WHERE idempotency_key = $1', [idempotency_key]);
      if (existing && existing.length > 0) {
        return NextResponse.json({ success: true, order: existing[0], message: 'Order already exists' });
      }
    }

    const orderNumber = 'AD-' + Math.floor(100000 + Math.random() * 900000);
    const userId = user.id;
    const isCOD = (payment_method || 'CARD').toUpperCase() === 'COD';
    const orderStatus = isCOD ? 'PLACED' : 'PENDING';
    const paymentStatus = isCOD ? 'COD_PENDING' : 'PENDING';
    
    // Insert order with server-calculated totals
    const orderRows = await queryDb(`
      INSERT INTO orders (
        order_number, user_id, status, subtotal, shipping_cost, discount_amount, total_amount, 
        payment_method, payment_status, shipping_address_id, first_name, last_name, customer_email, customer_phone, idempotency_key
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, $10, $11, $12, $13, $14
      ) RETURNING id, order_number, status, payment_status
    `, [
      orderNumber, 
      userId, 
      orderStatus,
      serverSubtotal, 
      shippingCost, 
      discountAmount, 
      serverTotal, 
      payment_method || 'CARD',
      paymentStatus,
      addr.firstName || '',
      addr.lastName || '',
      addr.email || '',
      addr.phone || '',
      idempotency_key || null
    ]);

    const newOrder = orderRows[0];

    // Insert items with server-verified prices
    if (items && items.length > 0) {
      for (const item of items) {
        const priceRows = await queryDb('SELECT price FROM products WHERE id = $1', [item.product.id]);
        const verifiedPrice = priceRows && priceRows.length > 0 ? Number(priceRows[0].price) : 0;
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

    return NextResponse.json({ success: true, order: newOrder });

  } catch (error: any) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
