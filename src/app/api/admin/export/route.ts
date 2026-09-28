import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const rows = await queryDb('SELECT role FROM profiles WHERE id = $1', [user.id]);
  if (!rows || rows.length === 0) return null;
  const role = rows[0].role;
  if (role !== 'admin' && role !== 'super_admin') return null;
  return user;
}

function toCSV(rows: any[], columns: { key: string; label: string }[]): string {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const body = rows.map(row => 
    columns.map(c => {
      const val = row[c.key];
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',')
  ).join('\n');
  return header + '\n' + body;
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let rows: any[] = [];
    let columns: { key: string; label: string }[] = [];
    let filename = 'export';

    switch (type) {
      case 'users': {
        rows = await queryDb(`
          SELECT id, first_name, last_name, email, phone, city, state, role, created_at 
          FROM profiles ORDER BY created_at DESC
        `);
        columns = [
          { key: 'first_name', label: 'First Name' },
          { key: 'last_name', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'city', label: 'City' },
          { key: 'state', label: 'State' },
          { key: 'role', label: 'Role' },
          { key: 'created_at', label: 'Registered' },
        ];
        filename = 'aadhya-users';
        break;
      }
      case 'products': {
        rows = await queryDb(`
          SELECT p.product_no, p.name, p.slug, p.department, c.name as category, p.price, p.compare_at_price, p.stock_quantity, p.is_active, p.created_at
          FROM products p LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.created_at DESC
        `);
        columns = [
          { key: 'product_no', label: 'SKU' },
          { key: 'name', label: 'Product Name' },
          { key: 'department', label: 'Department' },
          { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price' },
          { key: 'compare_at_price', label: 'Compare Price' },
          { key: 'stock_quantity', label: 'Stock' },
          { key: 'is_active', label: 'Active' },
          { key: 'created_at', label: 'Created' },
        ];
        filename = 'aadhya-products';
        break;
      }
      case 'orders': {
        rows = await queryDb(`
          SELECT order_number, status, first_name, last_name, customer_email, customer_phone,
                 subtotal, shipping_cost, discount_amount, total_amount, payment_method, payment_status,
                 courier, tracking_number, created_at
          FROM orders ORDER BY created_at DESC
        `);
        columns = [
          { key: 'order_number', label: 'Order No' },
          { key: 'status', label: 'Status' },
          { key: 'first_name', label: 'First Name' },
          { key: 'last_name', label: 'Last Name' },
          { key: 'customer_email', label: 'Email' },
          { key: 'customer_phone', label: 'Phone' },
          { key: 'subtotal', label: 'Subtotal' },
          { key: 'shipping_cost', label: 'Shipping' },
          { key: 'discount_amount', label: 'Discount' },
          { key: 'total_amount', label: 'Total' },
          { key: 'payment_method', label: 'Payment Method' },
          { key: 'payment_status', label: 'Payment Status' },
          { key: 'courier', label: 'Courier' },
          { key: 'tracking_number', label: 'Tracking' },
          { key: 'created_at', label: 'Date' },
        ];
        filename = 'aadhya-orders';
        break;
      }
      case 'categories': {
        rows = await queryDb(`
          SELECT name, slug, department, description, is_active, sort_order, created_at
          FROM categories ORDER BY department, sort_order
        `);
        columns = [
          { key: 'name', label: 'Category' },
          { key: 'slug', label: 'Slug' },
          { key: 'department', label: 'Department' },
          { key: 'description', label: 'Description' },
          { key: 'is_active', label: 'Active' },
          { key: 'sort_order', label: 'Sort Order' },
          { key: 'created_at', label: 'Created' },
        ];
        filename = 'aadhya-categories';
        break;
      }
      case 'reviews': {
        rows = await queryDb(`
          SELECT r.rating, r.text, r.is_verified, r.is_approved, r.created_at,
                 p.name as product_name, pr.first_name, pr.last_name, pr.email
          FROM reviews r
          JOIN products p ON r.product_id = p.id
          JOIN profiles pr ON r.user_id = pr.id
          ORDER BY r.created_at DESC
        `);
        columns = [
          { key: 'product_name', label: 'Product' },
          { key: 'first_name', label: 'Reviewer First Name' },
          { key: 'last_name', label: 'Reviewer Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'rating', label: 'Rating' },
          { key: 'text', label: 'Review' },
          { key: 'is_verified', label: 'Verified Purchase' },
          { key: 'is_approved', label: 'Approved' },
          { key: 'created_at', label: 'Date' },
        ];
        filename = 'aadhya-reviews';
        break;
      }
      case 'revenue': {
        rows = await queryDb(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as total_orders,
            SUM(total_amount) as revenue,
            SUM(CASE WHEN status = 'DELIVERED' THEN total_amount ELSE 0 END) as delivered_revenue
          FROM orders
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `);
        columns = [
          { key: 'date', label: 'Date' },
          { key: 'total_orders', label: 'Orders' },
          { key: 'revenue', label: 'Total Revenue' },
          { key: 'delivered_revenue', label: 'Delivered Revenue' },
        ];
        filename = 'aadhya-revenue';
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    const csv = toCSV(rows || [], columns);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
