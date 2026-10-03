const fs = require('fs');
const { Pool } = require('pg');

const DEFAULT_DATABASE_URL = 'postgresql://postgres.scngfezqruhtgvyyuond:AadhyaDatabase%241001%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: DEFAULT_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const sql = fs.readFileSync('supabase/migrations/20260929000000_multi_admin.sql', 'utf8');
  try {
    await pool.query(sql);
    console.log("Migration applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

main();
