import { NextResponse } from 'next/server';
import { queryDb } from '@/utils/db';
import { getOrSetCache, CacheKeys, CACHE_TTL } from '@/lib/cache';

export async function GET() {
  try {
    const settings = await getOrSetCache(
      CacheKeys.cms('global'),
      async () => {
        const rows = await queryDb(`SELECT * FROM website_settings WHERE id = 'default'`);
        if (!rows || rows.length === 0) {
          return {
            brand_name: 'AADHYA',
            contact_email: 'support@aadhya.co',
            contact_phone: '+91 98765 43210',
            contact_address: 'Heritage Boulevard, Mumbai, India',
            social_links: { instagram: '#', facebook: '#', youtube: '#' },
            quick_links: []
          };
        }
        return rows[0];
      },
      CACHE_TTL.CMS
    );

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error('Error fetching public website settings:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
