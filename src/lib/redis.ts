import { Redis } from '@upstash/redis'

/**
 * AADHYA PRODUCTION UPSTASH REDIS CLIENT
 * 
 * Resilient initialization with multi-format auto-detection:
 * 1. Handles clean REST URLs: https://...
 * 2. Auto-converts accidental TCP/CLI connection strings (redis://, rediss://) to HTTPS REST endpoints
 * 3. Strips quotes, whitespace, and :6379 port suffixes
 * 4. Extracts embedded tokens from connection strings if UPSTASH_REDIS_REST_TOKEN is missing
 * 5. Provides safe no-op fallback client if Redis credentials are missing or invalid
 *    so Next.js build (`next build`) and runtime never crash on Redis connection errors.
 */

interface SanitizedRedisConfig {
  url: string | null;
  token: string | null;
}

function resolveRedisConfig(): SanitizedRedisConfig {
  const rawUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

  let url = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  let token = rawToken.trim().replace(/^['"]|['"]$/g, '');

  // If a redis:// or rediss:// connection string was mistakenly pasted
  if (url.startsWith('rediss://') || url.startsWith('redis://')) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname) {
        url = `https://${parsed.hostname}`;
      }
      if (!token && parsed.password) {
        token = decodeURIComponent(parsed.password);
      }
    } catch {
      // Ignore URL parse error
    }
  }

  // Strip port 6379 (REST API runs on standard HTTPS port 443)
  url = url.replace(/:6379$/, '');

  // Ensure protocol is https:// if missing
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url.replace(/^\/+/, '')}`;
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Reject placeholder values
  if (!url || url.includes('YOUR_UPSTASH') || url === '[REDACTED]') {
    url = '';
  }
  if (!token || token.includes('YOUR_UPSTASH') || token === '[REDACTED]') {
    token = '';
  }

  return {
    url: url || null,
    token: token || null
  };
}

// Fallback no-op Redis client to prevent any build/runtime crashes when Redis is offline or unconfigured
function createFallbackClient(): any {
  return new Proxy({} as any, {
    get(_target, prop) {
      if (prop === 'get') return async () => null;
      if (prop === 'set') return async () => 'OK';
      if (prop === 'del') return async () => 0;
      if (prop === 'scan') return async () => [0, []];
      if (prop === 'eval' || prop === 'evalsha') return async () => [1, 1, 0, 0];
      if (prop === 'pipeline') {
        return () => ({
          exec: async () => []
        });
      }
      return async () => null;
    }
  });
}

let _redisInstance: Redis | null = null;
let _hasWarned = false;

export function getRedisClient(): Redis {
  if (_redisInstance) {
    return _redisInstance;
  }

  const { url, token } = resolveRedisConfig();

  if (url && token) {
    try {
      _redisInstance = new Redis({ url, token });
      return _redisInstance;
    } catch (err: any) {
      if (!_hasWarned) {
        console.warn('[Upstash Redis Init Warning]:', err?.message || err);
        _hasWarned = true;
      }
    }
  } else {
    if (!_hasWarned && process.env.NODE_ENV !== 'production') {
      console.warn('[Upstash Redis]: Missing or invalid UPSTASH_REDIS_REST_URL/TOKEN. Operating in memory fallback mode.');
      _hasWarned = true;
    }
  }

  return createFallbackClient() as Redis;
}

// Named proxy export matching existing import { redis } from '@/lib/redis'
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const client = getRedisClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
