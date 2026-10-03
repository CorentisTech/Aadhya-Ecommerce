import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site') === 'coins' ? 'coins' : 'fashion';

    const rows = await queryDb(`SELECT * FROM website_settings WHERE id = $1`, [site]);
    if (!rows || rows.length === 0) {
      // Seed default if empty
      await queryDb(`
        INSERT INTO website_settings (id, brand_name, contact_email, contact_phone, contact_address)
        VALUES ($1, 'AADHYA', 'support@aadhya.co', '+91 98765 43210', 'Heritage Boulevard, Mumbai, India')
        ON CONFLICT DO NOTHING
      `, [site]);
      const newRows = await queryDb(`SELECT * FROM website_settings WHERE id = $1`, [site]);
      return NextResponse.json({ success: true, settings: newRows[0] });
    }
    return NextResponse.json({ success: true, settings: rows[0] });
  } catch (err: any) {
    console.error('Error fetching website settings:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let site = searchParams.get('site');
    
    const body = await request.json();
    if (!site && body.site) site = body.site;
    if (site !== 'coins') site = 'fashion'; // default to fashion

    const {
      brand_name,
      logo_url,
      contact_email,
      contact_phone,
      contact_address,
      privacy_policy,
      refund_policy,
      terms_conditions,
      shipping_policy,
      social_links,
      quick_links
    } = body;

    const updateSql = `
      UPDATE website_settings
      SET 
        brand_name = COALESCE($1, brand_name),
        logo_url = COALESCE($2, logo_url),
        contact_email = COALESCE($3, contact_email),
        contact_phone = COALESCE($4, contact_phone),
        contact_address = COALESCE($5, contact_address),
        privacy_policy = COALESCE($6, privacy_policy),
        refund_policy = COALESCE($7, refund_policy),
        terms_conditions = COALESCE($8, terms_conditions),
        shipping_policy = COALESCE($9, shipping_policy),
        social_links = COALESCE($10, social_links),
        quick_links = COALESCE($11, quick_links),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;

    const result = await queryDb(updateSql, [
      brand_name,
      logo_url,
      contact_email,
      contact_phone,
      contact_address,
      privacy_policy,
      refund_policy,
      terms_conditions,
      shipping_policy,
      social_links ? JSON.stringify(social_links) : null,
      quick_links ? JSON.stringify(quick_links) : null,
      site
    ]);

    await queryDb(`
      INSERT INTO audit_logs (action, entity, entity_id, details)
      VALUES ('UPDATE_WEBSITE_SETTINGS', 'website_settings', $1, $2)
    `, [site, JSON.stringify({ brand_name, contact_email })]);

    return NextResponse.json({
      success: true,
      message: 'Website settings updated successfully',
      settings: result[0]
    });
  } catch (err: any) {
    console.error('Error updating website settings:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
