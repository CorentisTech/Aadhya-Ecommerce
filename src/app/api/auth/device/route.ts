import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const { deviceId, deviceName } = body;

    if (!deviceId || typeof deviceId !== 'string' || deviceId.trim().length === 0) {
      return NextResponse.json({ error: 'Valid device ID is required.' }, { status: 400 });
    }

    const cleanDeviceId = deviceId.trim().slice(0, 100);
    const sessionVersion = Math.random().toString(36).substring(2, 15);

    // Call the Postgres function to revoke all other devices and activate this one
    await queryDb(
      'SELECT handle_new_device_login($1, $2, $3)',
      [user.id, cleanDeviceId, sessionVersion]
    );

    const response = NextResponse.json({ success: true, deviceId: cleanDeviceId, userId: user.id });
    response.cookies.set('aadhya_device_id', cleanDeviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Device registration failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
