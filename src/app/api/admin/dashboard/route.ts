import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    // 1. Authenticate & retrieve admin profile
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let adminProfile: { id?: string; name: string; email: string; role: string; avatar: string } = {
      name: 'Prem Karnawat',
      email: 'admin@aadhya.co',
      role: 'Super Admin',
      avatar: 'male'
    };

    if (user) {
      const profiles = await queryDb(
        `SELECT id, first_name, last_name, phone, avatar, role FROM profiles WHERE id = $1`,
        [user.id]
      );
      if (profiles && profiles.length > 0) {
        const p = profiles[0];
        const fullName = [p.first_name, p.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'Admin';
        adminProfile = {
          id: p.id,
          name: fullName,
          email: user.email || 'admin@aadhya.co',
          role: p.role === 'super_admin' ? 'Super Admin' : 'Admin',
          avatar: p.avatar || 'male'
        };
      } else {
        adminProfile.email = user.email || adminProfile.email;
        adminProfile.name = user.email?.split('@')[0] || adminProfile.name;
      }
    }

    // 2. Product Counts (Total, Fashion, Numismatics, Active, Low Stock, Out of Stock)
    const productStatsRows = await queryDb(`
      SELECT 
        COUNT(*)::int AS total_products,
        COUNT(CASE WHEN department = 'fashion' THEN 1 END)::int AS fashion_products,
        COUNT(CASE WHEN department = 'numismatics' THEN 1 END)::int AS numismatic_products,
        COUNT(CASE WHEN is_active = true THEN 1 END)::int AS active_products
      FROM products
    `);
    const pStats = productStatsRows[0] || {};

    const stockStatsRows = await queryDb(`
      SELECT 
        COUNT(CASE WHEN stock_quantity <= 5 AND stock_quantity > 0 THEN 1 END)::int AS low_stock,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END)::int AS out_of_stock
      FROM product_variants
    `);
    const sStats = stockStatsRows[0] || {};

    // 3. Category Counts (Total, Fashion, Numismatics)
    const categoryStatsRows = await queryDb(`
      SELECT 
        COUNT(*)::int AS total_categories,
        COUNT(CASE WHEN department = 'fashion' THEN 1 END)::int AS fashion_categories,
        COUNT(CASE WHEN department = 'numismatics' THEN 1 END)::int AS numismatic_categories
      FROM categories
      WHERE is_active = true
    `);
    const cStats = categoryStatsRows[0] || {};

    // 4. User Counts (Total, New in last 30 days)
    const userStatsRows = await queryDb(`
      SELECT 
        COUNT(*)::int AS total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END)::int AS new_users
      FROM profiles
    `);
    const uStats = userStatsRows[0] || {};

    // 5. Order Pipeline Counts
    const orderStatsRows = await queryDb(`
      SELECT 
        COUNT(*)::int AS total_orders,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int AS orders_received,
        COUNT(CASE WHEN status IN ('CONFIRMED', 'PROCESSING') THEN 1 END)::int AS orders_approved,
        COUNT(CASE WHEN status = 'SHIPPED' THEN 1 END)::int AS orders_dispatched,
        COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END)::int AS orders_delivered,
        COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END)::int AS orders_cancelled,
        COUNT(CASE WHEN status IN ('RETURN_REQUESTED', 'RETURNED', 'REFUNDED') THEN 1 END)::int AS orders_returned
      FROM orders
    `);
    const oStats = orderStatsRows[0] || {};

    // 6. Authoritative Revenue Statistics (excluding CANCELLED and REFUNDED)
    const revenueRows = await queryDb(`
      SELECT 
        COALESCE(SUM(CASE WHEN status NOT IN ('CANCELLED', 'REFUNDED') THEN total_amount ELSE 0 END), 0)::numeric AS total_revenue,
        COALESCE(SUM(CASE WHEN status NOT IN ('CANCELLED', 'REFUNDED') AND created_at >= CURRENT_DATE THEN total_amount ELSE 0 END), 0)::numeric AS today_revenue,
        COALESCE(SUM(CASE WHEN status NOT IN ('CANCELLED', 'REFUNDED') AND created_at >= NOW() - INTERVAL '7 days' THEN total_amount ELSE 0 END), 0)::numeric AS weekly_revenue,
        COALESCE(SUM(CASE WHEN status NOT IN ('CANCELLED', 'REFUNDED') AND created_at >= NOW() - INTERVAL '30 days' THEN total_amount ELSE 0 END), 0)::numeric AS monthly_revenue,
        COALESCE(SUM(CASE WHEN status NOT IN ('CANCELLED', 'REFUNDED') AND created_at >= NOW() - INTERVAL '365 days' THEN total_amount ELSE 0 END), 0)::numeric AS yearly_revenue,
        COALESCE(SUM(CASE WHEN status IN ('PENDING', 'CONFIRMED', 'PROCESSING') THEN total_amount ELSE 0 END), 0)::numeric AS pending_revenue,
        COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN total_amount ELSE 0 END), 0)::numeric AS delivered_revenue,
        COALESCE(AVG(CASE WHEN status NOT IN ('CANCELLED', 'REFUNDED') THEN total_amount END), 0)::numeric AS average_order_value
      FROM orders
    `);
    const rStats = revenueRows[0] || {};

    // 7. Recent Orders (top 8)
    const recentOrders = await queryDb(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.payment_method,
        o.payment_status,
        o.created_at,
        COALESCE(CONCAT(p.first_name, ' ', p.last_name), a.full_name, 'Guest Customer') AS customer_name,
        COALESCE(
          (SELECT pr.department FROM order_items oi JOIN products pr ON oi.product_id = pr.id WHERE oi.order_id = o.id LIMIT 1),
          'fashion'
        ) AS domain
      FROM orders o
      LEFT JOIN profiles p ON o.user_id = p.id
      LEFT JOIN addresses a ON o.shipping_address_id = a.id
      ORDER BY o.created_at DESC
      LIMIT 8
    `);

    // 8. Low Stock Alert Variants (top 8)
    const lowStockAlerts = await queryDb(`
      SELECT 
        pv.id AS variant_id,
        pv.sku,
        pv.stock_quantity,
        p.id AS product_id,
        p.name AS product_name,
        p.product_no,
        p.department,
        pm.media_url AS image_url
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      LEFT JOIN product_media pm ON pm.product_id = p.id AND pm.is_primary = true
      WHERE pv.stock_quantity <= 5
      ORDER BY pv.stock_quantity ASC
      LIMIT 8
    `);

    // 9. Recent Registered Users (top 6)
    const recentUsers = await queryDb(`
      SELECT 
        p.id,
        COALESCE(CONCAT(p.first_name, ' ', p.last_name), 'Aadhya Member') AS name,
        p.phone,
        p.avatar,
        p.role,
        p.created_at,
        (SELECT COUNT(*)::int FROM orders o WHERE o.user_id = p.id) AS total_orders,
        COALESCE((SELECT SUM(o.total_amount)::numeric FROM orders o WHERE o.user_id = p.id AND o.status NOT IN ('CANCELLED', 'REFUNDED')), 0) AS total_spent
      FROM profiles p
      ORDER BY p.created_at DESC
      LIMIT 6
    `);

    // 10. Dynamic Revenue Analytics for the Chart (last 30 days time series)
    const dailyAnalytics = await queryDb(`
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '29 days',
          CURRENT_DATE,
          '1 day'::interval
        )::date AS day
      )
      SELECT 
        TO_CHAR(ds.day, 'DD Mon') AS label,
        TO_CHAR(ds.day, 'YYYY-MM-DD') AS date,
        COALESCE(SUM(CASE WHEN o.status NOT IN ('CANCELLED', 'REFUNDED') THEN o.total_amount ELSE 0 END), 0)::numeric AS revenue,
        COUNT(o.id)::int AS orders
      FROM date_series ds
      LEFT JOIN orders o ON DATE(o.created_at) = ds.day
      GROUP BY ds.day
      ORDER BY ds.day ASC
    `);

    // 11. Fashion vs Numismatics Analytics Comparison
    const domainComparisonRows = await queryDb(`
      SELECT 
        p.department,
        COUNT(DISTINCT p.id)::int AS product_count,
        COALESCE(SUM(oi.quantity), 0)::int AS units_sold,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0)::numeric AS department_revenue
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY p.department
    `);

    let fashionMetrics = { products: pStats.fashion_products || 0, units: 0, revenue: 0 };
    let numismaticsMetrics = { products: pStats.numismatic_products || 0, units: 0, revenue: 0 };

    domainComparisonRows.forEach((row: any) => {
      if (row.department === 'fashion') {
        fashionMetrics = {
          products: row.product_count,
          units: Number(row.units_sold),
          revenue: Number(row.department_revenue)
        };
      } else if (row.department === 'numismatics') {
        numismaticsMetrics = {
          products: row.product_count,
          units: Number(row.units_sold),
          revenue: Number(row.department_revenue)
        };
      }
    });

    return NextResponse.json({
      success: true,
      admin: adminProfile,
      statistics: {
        totalProducts: pStats.total_products || 0,
        fashionProducts: pStats.fashion_products || 0,
        numismaticProducts: pStats.numismatic_products || 0,
        activeProducts: pStats.active_products || 0,
        totalCategories: cStats.total_categories || 0,
        fashionCategories: cStats.fashion_categories || 0,
        numismaticCategories: cStats.numismatic_categories || 0,
        totalUsers: uStats.total_users || 0,
        newUsers: uStats.new_users || 0,
        totalOrders: oStats.total_orders || 0,
        ordersReceived: oStats.orders_received || 0,
        ordersApproved: oStats.orders_approved || 0,
        ordersDispatched: oStats.orders_dispatched || 0,
        ordersDelivered: oStats.orders_delivered || 0,
        ordersCancelled: oStats.orders_cancelled || 0,
        ordersReturned: oStats.orders_returned || 0,
        lowStockCount: sStats.low_stock || 0,
        outOfStockCount: sStats.out_of_stock || 0,
      },
      revenue: {
        total: Number(rStats.total_revenue || 0),
        today: Number(rStats.today_revenue || 0),
        weekly: Number(rStats.weekly_revenue || 0),
        monthly: Number(rStats.monthly_revenue || 0),
        yearly: Number(rStats.yearly_revenue || 0),
        pending: Number(rStats.pending_revenue || 0),
        delivered: Number(rStats.delivered_revenue || 0),
        averageOrderValue: Math.round(Number(rStats.average_order_value || 0))
      },
      chartData: dailyAnalytics,
      domainComparison: {
        fashion: fashionMetrics,
        numismatics: numismaticsMetrics
      },
      recentOrders,
      lowStockAlerts,
      recentUsers
    });

  } catch (err: any) {
    console.error('Error fetching admin dashboard data:', err);
    return NextResponse.json(
      { success: false, error: 'Database query error: ' + (err.message || 'Failed to load dashboard metrics') },
      { status: 500 }
    );
  }
}
