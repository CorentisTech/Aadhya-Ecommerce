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
    const cleanDeviceName = (deviceName || 'Web Client').slice(0, 100);
    const userAgent = request.headers.get('user-agent') || '';

    // Register or update device record in DB
    await queryDb(
      `INSERT INTO user_devices (user_id, device_id, device_name, user_agent, last_active)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, device_id) 
       DO UPDATE SET last_active = NOW(), device_name = EXCLUDED.device_name, user_agent = EXCLUDED.user_agent`,
      [user.id, cleanDeviceId, cleanDeviceName, userAgent]
    );

    return NextResponse.json({ success: true, deviceId: cleanDeviceId, userId: user.id });
  } catch (error: any) {
    console.error('Device registration failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
