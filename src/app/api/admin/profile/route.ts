import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = await queryDb(`SELECT * FROM profiles WHERE id = $1`, [user.id]);
    const profile = profiles[0] || {
      id: user.id,
      first_name: user.email?.split('@')[0] || 'Admin',
      last_name: '',
      email: user.email,
      role: 'admin',
      avatar: 'male'
    };

    return NextResponse.json({
      success: true,
      profile: { ...profile, email: user.email }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await request.json();
    const { first_name, last_name, phone, avatar, password } = body;

    if (password && password.length >= 6) {
      await supabase.auth.updateUser({ password });
    }

    if (user) {
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
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
