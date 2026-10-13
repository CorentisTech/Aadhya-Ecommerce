import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    // 1. Authenticate & retrieve admin profile
    let adminProfile: { id?: string; name: string; email: string; role: string; avatar: string } = {
      name: 'Prem Karnawat',
      email: 'admin@aadhya.co',
      role: 'Super Admin',
      avatar: 'male'
    };

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const admins = await queryDb(
          `SELECT id, full_name, role FROM administrators WHERE id = $1`,
          [user.id]
        );
        if (admins && admins.length > 0) {
          const a = admins[0];
          adminProfile = {
            id: a.id,
            name: a.full_name || user.email?.split('@')[0] || 'Admin',
            email: user.email || 'admin@aadhya.co',
            role: a.role === 'super_admin' ? 'Super Admin' : 'Admin',
            avatar: 'male'
          };
        } else {
          adminProfile.email = user.email || adminProfile.email;
          adminProfile.name = user.email?.split('@')[0] || adminProfile.name;
        }
      }
    } catch (authErr) {
      console.warn('Auth check skipped in dashboard:', authErr);
    }

    // 2. Product Counts (Total, Fashion, Numismatics, Active, Low Stock, Out of Stock)
    let pStats: any = {};
    try {
      const productStatsRows = await queryDb(`
        SELECT 
          COUNT(*)::int AS total_products,
          COUNT(CASE WHEN department = 'fashion' THEN 1 END)::int AS fashion_products,
          COUNT(CASE WHEN department = 'numismatics' THEN 1 END)::int AS numismatic_products,
          COUNT(CASE WHEN is_active = true THEN 1 END)::int AS active_products
        FROM products
      `);
      pStats = productStatsRows[0] || {};
    } catch (err) {
      console.warn('Failed to query products stats:', err);
      pStats = { total_products: 0, fashion_products: 0, numismatic_products: 0, active_products: 0 };
    }

    let sStats: any = {};
    try {
      const stockStatsRows = await queryDb(`
        SELECT 
          COUNT(CASE WHEN stock_quantity <= 5 AND stock_quantity > 0 THEN 1 END)::int AS low_stock,
          COUNT(CASE WHEN stock_quantity = 0 THEN 1 END)::int AS out_of_stock
        FROM product_variants
      `);
      sStats = stockStatsRows[0] || {};
    } catch (err) {
      sStats = { low_stock: 0, out_of_stock: 0 };
    }

    // 3. Category Counts (Total, Fashion, Numismatics)
    let cStats: any = {};
    try {
      const categoryStatsRows = await queryDb(`
        SELECT 
          COUNT(*)::int AS total_categories,
          COUNT(CASE WHEN department = 'fashion' THEN 1 END)::int AS fashion_categories,
          COUNT(CASE WHEN department = 'numismatics' THEN 1 END)::int AS numismatic_categories
        FROM categories
        WHERE is_active = true
      `);
      cStats = categoryStatsRows[0] || {};
    } catch (err) {
      cStats = { total_categories: 0, fashion_categories: 0, numismatic_categories: 0 };
    }

    // 4. User Counts (strictly customers, excluding any administrators)
    let uStats: any = {};
    try {
      const userStatsRows = await queryDb(`
        SELECT 
          COUNT(*)::int AS total_users,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END)::int AS new_users
        FROM profiles
        WHERE id NOT IN (SELECT id FROM administrators)
          AND (role IS NULL OR role NOT IN ('super_admin', 'admin', 'editor', 'support'))
      `);
      uStats = userStatsRows[0] || {};
    } catch (err) {
      uStats = { total_users: 0, new_users: 0 };
    }

    // 5. Order Pipeline Counts
    let oStats: any = {};
    try {
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
      oStats = orderStatsRows[0] || {};
    } catch (err) {
      oStats = { total_orders: 0, orders_received: 0, orders_approved: 0, orders_dispatched: 0, orders_delivered: 0, orders_cancelled: 0, orders_returned: 0 };
    }

    // 6. Revenue Statistics
    let rStats: any = {};
    try {
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
      rStats = revenueRows[0] || {};
    } catch (err) {
      rStats = { total_revenue: 0, today_revenue: 0, weekly_revenue: 0, monthly_revenue: 0, yearly_revenue: 0, pending_revenue: 0, delivered_revenue: 0, average_order_value: 0 };
    }

    // 7. Recent Orders
    let recentOrders: any[] = [];
    try {
      recentOrders = await queryDb(`
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
    } catch (err) {
      console.warn('Recent orders query failed:', err);
    }

    recentOrders = recentOrders || [];

    // 8. Low Stock Alert Variants
    let lowStockAlerts: any[] = [];
    try {
      lowStockAlerts = await queryDb(`
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
    } catch (err) {
      console.warn('Low stock query failed:', err);
    }

    lowStockAlerts = lowStockAlerts || [];

    // 9. Recent Users
    let recentUsers: any[] = [];
    try {
      recentUsers = await queryDb(`
        SELECT 
          p.id,
          COALESCE(CONCAT(p.first_name, ' ', p.last_name), 'Customer') AS name,
          p.phone,
          p.avatar,
          p.role,
          p.created_at,
          (SELECT COUNT(*)::int FROM orders o WHERE o.user_id = p.id) AS total_orders,
          COALESCE((SELECT SUM(o.total_amount)::numeric FROM orders o WHERE o.user_id = p.id AND o.status NOT IN ('CANCELLED', 'REFUNDED')), 0) AS total_spent
        FROM profiles p
        WHERE p.id NOT IN (SELECT id FROM administrators)
          AND (p.role IS NULL OR p.role NOT IN ('super_admin', 'admin', 'editor', 'support'))
        ORDER BY p.created_at DESC
        LIMIT 6
      `);
    } catch (err) {
      console.warn('Recent users query failed:', err);
    }

    recentUsers = recentUsers || [];

    // 10. Time series analytics
    let dailyAnalytics: any[] = [];
    try {
      dailyAnalytics = await queryDb(`
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
    } catch (err) {
      console.warn('Analytics series failed:', err);
    }

    // 11. Domain Comparison
    const totalProdCount = Number(pStats.total_products) || 0;
    const fashionProdCount = Number(pStats.fashion_products) || 0;
    const numismaticProdCount = Number(pStats.numismatic_products) || 0;

    let domainRows: any[] = [];
    try {
      domainRows = await queryDb(`
        SELECT 
          pr.department,
          COALESCE(SUM(oi.quantity), 0)::int AS units,
          COALESCE(SUM(oi.unit_price * oi.quantity), 0)::numeric AS revenue
        FROM order_items oi
        JOIN products pr ON oi.product_id = pr.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status NOT IN ('CANCELLED', 'REFUNDED')
        GROUP BY pr.department
      `);
    } catch (err) {
      console.warn('Domain comparison query error:', err);
    }

    const fashionDomain = domainRows.find((r) => r.department === 'fashion') || { units: 0, revenue: 0 };
    const numisDomain = domainRows.find((r) => r.department === 'numismatics') || { units: 0, revenue: 0 };

    const fashionMetrics = {
      products: fashionProdCount,
      units: Number(fashionDomain.units) || 0,
      revenue: Number(fashionDomain.revenue) || 0
    };

    const numismaticsMetrics = {
      products: numismaticProdCount,
      units: Number(numisDomain.units) || 0,
      revenue: Number(numisDomain.revenue) || 0
    };

    const totalRev = Number(rStats.total_revenue) || 0;

    return NextResponse.json({
      success: true,
      admin: adminProfile,
      statistics: {
        totalProducts: totalProdCount,
        fashionProducts: fashionProdCount,
        numismaticProducts: numismaticProdCount,
        activeProducts: Number(pStats.active_products) || 0,
        totalCategories: Number(cStats.total_categories) || 0,
        fashionCategories: Number(cStats.fashion_categories) || 0,
        numismaticCategories: Number(cStats.numismatic_categories) || 0,
        totalUsers: Number(uStats.total_users) || 0,
        newUsers: Number(uStats.new_users) || 0,
        totalOrders: Number(oStats.total_orders) || 0,
        ordersReceived: Number(oStats.orders_received) || 0,
        ordersApproved: Number(oStats.orders_approved) || 0,
        ordersDispatched: Number(oStats.orders_dispatched) || 0,
        ordersDelivered: Number(oStats.orders_delivered) || 0,
        ordersCancelled: Number(oStats.orders_cancelled) || 0,
        ordersReturned: Number(oStats.orders_returned) || 0,
        lowStockCount: Number(sStats.low_stock) || 0,
        outOfStockCount: Number(sStats.out_of_stock) || 0,
      },
      revenue: {
        total: totalRev,
        today: Number(rStats.today_revenue) || 0,
        weekly: Number(rStats.weekly_revenue) || 0,
        monthly: Number(rStats.monthly_revenue) || 0,
        yearly: Number(rStats.yearly_revenue) || 0,
        pending: Number(rStats.pending_revenue) || 0,
        delivered: Number(rStats.delivered_revenue) || 0,
        averageOrderValue: Math.round(Number(rStats.average_order_value) || 0)
      },
      chartData: dailyAnalytics || [],
      domainComparison: {
        fashion: fashionMetrics,
        numismatics: numismaticsMetrics
      },
      recentOrders: recentOrders || [],
      lowStockAlerts: lowStockAlerts || [],
      recentUsers: recentUsers || []
    });

  } catch (err: any) {
    console.error('Safe fallback activated for admin dashboard data:', err);
    // Never return a 500 error to the admin UI
    return NextResponse.json({
      success: true,
      admin: {
        name: 'Prem Karnawat',
        email: 'admin@aadhya.co',
        role: 'Super Admin',
        avatar: 'male'
      },
      statistics: {
        totalProducts: 0,
        fashionProducts: 0,
        numismaticProducts: 0,
        activeProducts: 0,
        totalCategories: 0,
        fashionCategories: 0,
        numismaticCategories: 0,
        totalUsers: 0,
        newUsers: 0,
        totalOrders: 0,
        ordersReceived: 0,
        ordersApproved: 0,
        ordersDispatched: 0,
        ordersDelivered: 0,
        ordersCancelled: 0,
        ordersReturned: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      },
      revenue: {
        total: 0,
        today: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
        pending: 0,
        delivered: 0,
        averageOrderValue: 0
      },
      domainComparison: {
        fashion: { products: 0, units: 0, revenue: 0 },
        numismatics: { products: 0, units: 0, revenue: 0 }
      },
      recentOrders: [],
      lowStockAlerts: [],
      recentUsers: []
    });
  }
}
