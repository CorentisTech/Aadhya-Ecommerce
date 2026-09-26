import { Pool } from 'pg';

let pool: Pool | null = null;

// Verified IPv4 Supabase Connection Pooler (AWS ap-southeast-1)
export const DEFAULT_DATABASE_URL = 'postgresql://postgres.scngfezqruhtgvyyuond:AadhyaDatabase%241001%23@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

export function getCleanConnectionString(): string {
  let conn = process.env.DATABASE_URL?.trim();
  // If no env is set or if env still has the IPv6-only direct connection host
  if (!conn || conn.includes('db.scngfezqruhtgvyyuond.supabase.co')) {
    return DEFAULT_DATABASE_URL;
  }
  return conn;
}

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = getCleanConnectionString();
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 7000,
    });

    pool.on('error', (err) => {
      console.warn('Unexpected pg client error on idle client:', err);
    });
  }
  return pool;
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const p = getDbPool();
    const res = await p.query(text, params);
    return res.rows as T[];
  } catch (err: any) {
    // If the pool failed due to hostname or connection drop, recreate with IPv4 pooler and retry once
    if (err?.code === 'ENOTFOUND' || err?.message?.includes('ENOTFOUND') || err?.message?.includes('connection')) {
      console.warn('Database query connection failure, retrying with pooler fallback...', err?.message);
      if (pool) {
        try { await pool.end(); } catch {}
        pool = null;
      }
      const retryPool = new Pool({
        connectionString: DEFAULT_DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 7000,
      });
      pool = retryPool;
      const res = await retryPool.query(text, params);
      return res.rows as T[];
    }
    throw err;
  }
}
