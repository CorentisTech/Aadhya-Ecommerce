import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if profile exists, if not create default
    let profileRows = await queryDb(
      `SELECT id, first_name, last_name, phone, avatar, role, created_at, updated_at 
       FROM profiles WHERE id = $1`,
      [user.id]
    );

    if (profileRows.length === 0) {
      const defaultFirstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'Aadhya';
      const defaultLastName = user.user_metadata?.last_name || 'Member';
      await queryDb(
        `INSERT INTO profiles (id, first_name, last_name, role)
         VALUES ($1, $2, $3, 'customer')
         ON CONFLICT (id) DO NOTHING`,
        [user.id, defaultFirstName, defaultLastName]
      );
      profileRows = await queryDb(
        `SELECT id, first_name, last_name, phone, avatar, role, created_at, updated_at 
         FROM profiles WHERE id = $1`,
        [user.id]
      );
    }

    // Get default address if exists
    const addressRows = await queryDb(
      `SELECT id, full_name, email, street_name, address_line1, landmark, city, state, zip_code, country, alt_phone, is_default
       FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC LIMIT 1`,
      [user.id]
    );

    const profile = profileRows[0] || {};
    const address = addressRows[0] || null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        avatar: profile.avatar || 'female',
        role: profile.role || 'customer',
        address: address ? `${address.street_name || ''}, ${address.landmark ? address.landmark + ', ' : ''}${address.city || ''}, ${address.state || ''} - ${address.zip_code || ''}` : '',
        streetName: address?.street_name || '',
        landmark: address?.landmark || '',
        city: address?.city || '',
        state: address?.state || '',
        zip: address?.zip_code || '',
        otherPhone: address?.alt_phone || '',
        createdAt: profile.created_at
      }
    });
  } catch (err: any) {
    console.error('Fetch profile error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      phone, 
      avatar,
      streetName, 
      landmark, 
      city, 
      state, 
      zip, 
      otherPhone 
    } = body;

    // Update profiles table
    await queryDb(
      `INSERT INTO profiles (id, first_name, last_name, phone, avatar, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) 
       DO UPDATE SET 
         first_name = COALESCE($2, profiles.first_name),
         last_name = COALESCE($3, profiles.last_name),
         phone = COALESCE($4, profiles.phone),
         avatar = COALESCE($5, profiles.avatar),
         updated_at = NOW()`,
      [
        user.id, 
        firstName !== undefined ? firstName : null, 
        lastName !== undefined ? lastName : null, 
        phone !== undefined ? phone : null, 
        avatar === 'male' || avatar === 'female' ? avatar : null
      ]
    );

    // If address info was provided, update or insert in addresses table
    if (streetName !== undefined || city !== undefined || state !== undefined || zip !== undefined) {
      const existingAddress = await queryDb(
        `SELECT id FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC LIMIT 1`,
        [user.id]
      );

      if (existingAddress.length > 0) {
        await queryDb(
          `UPDATE addresses SET
             street_name = COALESCE($2, street_name),
             landmark = COALESCE($3, landmark),
             city = COALESCE($4, city),
             state = COALESCE($5, state),
             zip_code = COALESCE($6, zip_code),
             alt_phone = COALESCE($7, alt_phone),
             updated_at = NOW()
           WHERE id = $1`,
          [
            existingAddress[0].id,
            streetName !== undefined ? streetName : null,
            landmark !== undefined ? landmark : null,
            city !== undefined ? city : null,
            state !== undefined ? state : null,
            zip !== undefined ? zip : null,
            otherPhone !== undefined ? otherPhone : null
          ]
        );
      } else {
        await queryDb(
          `INSERT INTO addresses (user_id, street_name, landmark, city, state, zip_code, alt_phone, is_default)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
          [
            user.id,
            streetName || '',
            landmark || '',
            city || '',
            state || '',
            zip || '',
            otherPhone || ''
          ]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
