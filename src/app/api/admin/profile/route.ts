import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { createClient } from '@/utils/supabase/server';

const SUPER_ADMIN_EMAILS = ['admin@aadhya.co', 'premkarnawat1716@gmail.com'];

async function getAuthUser(request: Request) {
  const supabase = await createClient();

  // 1. Check Bearer token from Authorization header first
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) return { user, supabase };
      } catch (err) {
        // Fall back to cookies
      }
    }
  }

  // 2. Check cookies
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) return { user, supabase };
  } catch (err) {
    // Ignore
  }

  return { user: null, supabase };
}

export async function GET(request: Request) {
  try {
    const { user } = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.email?.toLowerCase().trim() || '';
    const isSuperAdminEmail = SUPER_ADMIN_EMAILS.includes(email);

    let profiles = await queryDb(`SELECT * FROM profiles WHERE id = $1`, [user.id]);
    
    // Auto-heal super_admin role if user email is in SUPER_ADMIN_EMAILS
    if (isSuperAdminEmail && (!profiles[0] || profiles[0].role !== 'super_admin')) {
      if (profiles[0]) {
        await queryDb(`UPDATE profiles SET role = 'super_admin', updated_at = NOW() WHERE id = $1`, [user.id]);
      } else {
        await queryDb(
          `INSERT INTO profiles (id, first_name, last_name, role, status) VALUES ($1, $2, '', 'super_admin', 'active') ON CONFLICT (id) DO UPDATE SET role = 'super_admin'`,
          [user.id, user.user_metadata?.first_name || email.split('@')[0] || 'Admin']
        );
      }
      profiles = await queryDb(`SELECT * FROM profiles WHERE id = $1`, [user.id]);
    }

    const profile = profiles[0] || {
      id: user.id,
      first_name: user.email?.split('@')[0] || 'Admin',
      last_name: '',
      email: user.email,
      role: isSuperAdminEmail ? 'super_admin' : 'admin',
      avatar: 'male'
    };

    const finalRole = isSuperAdminEmail ? 'super_admin' : (profile.role || 'customer');

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        email: user.email,
        role: finalRole
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { user, supabase } = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, phone, avatar, password } = body;

    if (password && password.length >= 6) {
      await supabase.auth.updateUser({ password });
    }

    await queryDb(`
      UPDATE profiles
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        avatar = COALESCE($4, avatar),
        updated_at = NOW()
      WHERE id = $5
    `, [first_name, last_name, phone, avatar, user.id]);

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
