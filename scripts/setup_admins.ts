import { queryDb } from '../src/utils/db';

async function main() {
  try {
    console.log('--- 1. Checking / Creating administrators table ---');
    await queryDb(`
      CREATE TABLE IF NOT EXISTS administrators (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT DEFAULT 'Administrator',
        role TEXT NOT NULL DEFAULT 'admin',
        is_active BOOLEAN NOT NULL DEFAULT true,
        permissions JSONB DEFAULT '["all"]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('administrators table is ready.');

    // Find auth user for admin@aadhya.co
    const authAdmins = await queryDb(`
      SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'admin@aadhya.co'
    `);
    console.log('auth.users matching admin@aadhya.co:', authAdmins);

    if (authAdmins.length > 0) {
      const adminUser = authAdmins[0];
      await queryDb(`
        INSERT INTO administrators (id, email, full_name, role, is_active, permissions)
        VALUES ($1, $2, $3, 'super_admin', true, '["all"]'::jsonb)
        ON CONFLICT (id) DO UPDATE SET 
          role = 'super_admin',
          is_active = true,
          updated_at = NOW();
      `, [adminUser.id, adminUser.email, adminUser.raw_user_meta_data?.full_name || 'Admin']);
      console.log('Admin inserted/updated in administrators table.');
    }

    const currentAdmins = await queryDb(`SELECT * FROM administrators;`);
    console.log('Current administrators:', currentAdmins);

    const profilesCount = await queryDb(`SELECT count(*) FROM profiles;`);
    console.log('Total profiles count:', profilesCount[0].count);

  } catch (err) {
    console.error('Error running setup_admins:', err);
  }
}

main();
