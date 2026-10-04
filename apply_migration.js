import pg from 'pg';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let dbUrl = '';
envContent.split('\n').forEach(line => {
  if (line.startsWith('DATABASE_URL=')) dbUrl = line.split('=')[1].trim();
});

const pool = new pg.Pool({ connectionString: dbUrl });

async function run() {
  const sql = fs.readFileSync('supabase/migrations/20261004000000_reviews_and_tracking_extended.sql', 'utf8');
  await pool.query(sql);
  console.log('Migration applied.');
  process.exit(0);
}
run().catch(console.error);
