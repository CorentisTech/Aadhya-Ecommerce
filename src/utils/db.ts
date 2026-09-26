import { Pool } from 'pg';

let pool: Pool | null = null;

const DEFAULT_DATABASE_URL = 'postgresql://postgres:AadhyaDatabase%241001%23@db.scngfezqruhtgvyyuond.supabase.co:5432/postgres';

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getDbPool();
  const res = await p.query(text, params);
  return res.rows as T[];
}
