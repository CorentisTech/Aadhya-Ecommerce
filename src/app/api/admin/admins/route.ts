import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { validateAdminSession, hasPermission } from '@/utils/sessionValidation';
import { createClient } from '@/utils/supabase/server';

// GET: List all admin users
export async function GET(request: Request) {
  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: session.error }, { status: session.status });
    }

    // Only super_admin can see all admins
    if (session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Only Super Admin can manage admins' }, { status: 403 });
    }

    const admins = await queryDb(`
      SELECT 
        a.id,
        a.full_name,
        a.email,
        a.role,
        CASE WHEN a.is_active THEN 'active' ELSE 'disabled' END AS status,
        a.is_active,
        a.permissions,
        a.created_at,
        a.updated_at
      FROM administrators a
      ORDER BY 
        CASE a.role 
          WHEN 'super_admin' THEN 1 
          WHEN 'admin' THEN 2 
          WHEN 'editor' THEN 3 
          WHEN 'support' THEN 4 
          ELSE 5
        END,
        a.created_at DESC
    `);

    return NextResponse.json({ success: true, admins });
  } catch (err: any) {
    console.error('Admin list error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create a new admin user
export async function POST(request: Request) {
  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: session.error }, { status: session.status });
    }

    if (session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Only Super Admin can add admins' }, { status: 403 });
    }

    const body = await request.json();
    const { fullName, email, role, password } = body;

    if (!fullName || !email || !role || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const validRoles = ['admin', 'editor', 'support'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role. Cannot create super_admin.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Use Supabase Admin API via service role to create user
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json({ success: false, error: 'Server configuration error: service role key not set' }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://scngfezqruhtgvyyuond.supabase.co';

    // Create auth user via Supabase Admin API
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
        }
      })
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      return NextResponse.json({ 
        success: false, 
        error: createData.msg || createData.message || 'Failed to create auth user' 
      }, { status: 400 });
    }

    const newUserId = createData.id;

    // Create record in dedicated administrators table
    await queryDb(
      `INSERT INTO administrators (id, email, full_name, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET 
         email = $2,
         full_name = $3,
         role = $4,
         is_active = true,
         updated_at = NOW()`,
      [newUserId, email.trim().toLowerCase(), fullName.trim(), role]
    );

    return NextResponse.json({ success: true, adminId: newUserId });
  } catch (err: any) {
    console.error('Admin create error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Update admin role/status
export async function PUT(request: Request) {
  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: session.error }, { status: session.status });
    }

    if (session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Only Super Admin can modify admins' }, { status: 403 });
    }

    const body = await request.json();
    const { adminId, role, status } = body;

    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 });
    }

    // Prevent modifying own super_admin role
    if (adminId === session.user.id && role && role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Cannot demote your own super admin account' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [adminId];
    let paramIndex = 2;

    if (role) {
      const validRoles = ['super_admin', 'admin', 'editor', 'support'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
      }
      updates.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    if (status) {
      const validStatuses = ['active', 'disabled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
      }
      updates.push(`is_active = $${paramIndex}`);
      params.push(status === 'active');
      paramIndex++;
    }

    updates.push('updated_at = NOW()');

    await queryDb(
      `UPDATE administrators SET ${updates.join(', ')} WHERE id = $1`,
      params
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin update error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove admin (deactivate in administrators table)
export async function DELETE(request: Request) {
  try {
    const session = await validateAdminSession(request);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: session.error }, { status: session.status });
    }

    if (session.role !== 'super_admin') {
      return NextResponse.json({ success: false, error: 'Only Super Admin can remove admins' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 });
    }

    // Cannot remove yourself
    if (adminId === session.user.id) {
      return NextResponse.json({ success: false, error: 'Cannot remove your own account' }, { status: 400 });
    }

    await queryDb(
      `DELETE FROM administrators WHERE id = $1`,
      [adminId]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin delete error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
