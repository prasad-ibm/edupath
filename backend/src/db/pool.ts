import { Pool } from 'pg';
import { config } from '../config/env';

if (!config.databaseUrl) {
  console.warn('[DB] DATABASE_URL not set — database features will not work.');
}

export const pool = new Pool({
  connectionString: config.databaseUrl || '',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

/** Run a query — returns rows array. Returns [] silently if DB is not configured. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  if (!config.databaseUrl) return [];
  try {
    const result = await pool.query(sql, params);
    return result.rows as T[];
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[DB] Query error:', msg);
    throw err;
  }
}

/** Run a query and return the first row, or null. */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
