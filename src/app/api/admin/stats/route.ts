import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify Admin Role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // 1. Total Revenue
    const { data: revenueData } = await supabase.from('orders').select('total_amount').in('status', ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED']);
    const totalRevenue = revenueData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

    // 2. Active Orders
    const { count: activeOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['PENDING', 'PROCESSING']);

    // 3. New Customers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: newCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString());

    // 4. Low Stock Alerts
    const { data: stockAlerts } = await supabase.from('product_variants')
        .select('sku, stock_quantity, products(name)')
        .lte('stock_quantity', 5)
        .order('stock_quantity', { ascending: true })
        .limit(10);

    return NextResponse.json({
        totalRevenue,
        activeOrders,
        newCustomers,
        stockAlerts
    });

  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
