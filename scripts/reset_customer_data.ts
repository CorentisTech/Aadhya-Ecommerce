import { queryDb } from '../src/utils/db';
import { invalidateCachePattern } from '../src/lib/cache';

async function resetCustomerData() {
  console.log('--- STARTING SAFE CUSTOMER DATA RESET ---');

  try {
    // 1. Ensure premkarnawat1716@gmail.com is in administrators table as super_admin
    const premUser = await queryDb("SELECT id, email FROM auth.users WHERE email = 'premkarnawat1716@gmail.com'");
    if (premUser && premUser.length > 0) {
      const premId = premUser[0].id;
      await queryDb(`
        INSERT INTO administrators (id, email, full_name, role, is_active, permissions)
        VALUES ($1, 'premkarnawat1716@gmail.com', 'Prem Karnawat', 'super_admin', true, '["all"]'::jsonb)
        ON CONFLICT (id) DO UPDATE 
        SET email = 'premkarnawat1716@gmail.com', role = 'super_admin', is_active = true, permissions = '["all"]'::jsonb;
      `, [premId]);
      console.log('✓ Verified and ensured premkarnawat1716@gmail.com in administrators table.');
    }

    // 2. Ensure admin@aadhya.co is in administrators table as super_admin
    const adminCoUser = await queryDb("SELECT id, email FROM auth.users WHERE email = 'admin@aadhya.co'");
    if (adminCoUser && adminCoUser.length > 0) {
      const adminId = adminCoUser[0].id;
      await queryDb(`
        INSERT INTO administrators (id, email, full_name, role, is_active, permissions)
        VALUES ($1, 'admin@aadhya.co', 'Admin', 'super_admin', true, '["all"]'::jsonb)
        ON CONFLICT (id) DO UPDATE 
        SET email = 'admin@aadhya.co', role = 'super_admin', is_active = true, permissions = '["all"]'::jsonb;
      `, [adminId]);
      console.log('✓ Verified and ensured admin@aadhya.co in administrators table.');
    }

    // 3. Remove administrator accounts from profiles table to maintain strict separation
    // (Administrators must not have customer profile records)
    const adminIds = ['47f19d93-abec-4305-8176-a7eedf2cb2e7', '14c2ed71-f237-4835-97b8-0418e540b722'];
    await queryDb('DELETE FROM profiles WHERE id = ANY($1)', [adminIds]);
    console.log('✓ Removed administrator accounts from customer profiles table.');

    // Also delete any test carts or addresses for admin IDs from customer tables
    await queryDb('DELETE FROM addresses WHERE user_id = ANY($1)', [adminIds]);
    await queryDb('DELETE FROM carts WHERE user_id = ANY($1)', [adminIds]);
    console.log('✓ Cleaned admin test carts and addresses from customer tables.');

    // 4. Delete test customer accounts from auth.users (cascades to profiles, addresses, carts, devices)
    const testCustomerEmails = ['aadhyaecomweb@gmail.com', 'corentistechnologies@gmail.com'];
    const deletedUsers = await queryDb(
      'DELETE FROM auth.users WHERE email = ANY($1) RETURNING id, email',
      [testCustomerEmails]
    );
    console.log(`✓ Deleted ${deletedUsers.length} test customer user(s) from auth.users:`, deletedUsers);

    // Also clean up any lingering carts without user_id or orphaned records
    await queryDb('DELETE FROM carts WHERE user_id IS NULL OR user_id NOT IN (SELECT id FROM auth.users)');
    await queryDb('DELETE FROM addresses WHERE user_id NOT IN (SELECT id FROM auth.users)');
    console.log('✓ Cleaned orphaned carts and addresses.');

    // 5. Invalidate caches
    try {
      await invalidateCachePattern('aadhya:session:*');
      await invalidateCachePattern('aadhya:cache:*');
      console.log('✓ Cleared Redis cache.');
    } catch (cacheErr) {
      console.warn('Redis cache clear notice:', cacheErr);
    }

    // 6. Verification
    console.log('\n=== VERIFICATION AFTER RESET ===');
    const remainingAdmins = await queryDb('SELECT id, email, full_name, role, is_active FROM administrators');
    console.log('Administrators count:', remainingAdmins.length);
    console.log(remainingAdmins);

    const remainingAuthUsers = await queryDb('SELECT id, email, created_at FROM auth.users');
    console.log('Total auth.users:', remainingAuthUsers.length);
    console.log(remainingAuthUsers);

    const remainingProfiles = await queryDb('SELECT id, first_name, last_name, role FROM profiles');
    console.log('Customer profiles count:', remainingProfiles.length);
    console.log(remainingProfiles);

    const remainingOrders = await queryDb('SELECT count(*)::int as count FROM orders');
    console.log('Orders count:', remainingOrders[0]?.count || 0);

    const remainingAddresses = await queryDb('SELECT count(*)::int as count FROM addresses');
    console.log('Addresses count:', remainingAddresses[0]?.count || 0);

    const remainingCarts = await queryDb('SELECT count(*)::int as count FROM carts');
    console.log('Carts count:', remainingCarts[0]?.count || 0);

    console.log('\n--- CUSTOMER DATA RESET COMPLETE & VERIFIED ---');
  } catch (err) {
    console.error('Reset error:', err);
  } finally {
    process.exit(0);
  }
}

resetCustomerData();
