import { redis } from './redis';

/**
 * AADHYA PRODUCTION CACHE LAYER (Upstash Redis + Supabase Fallback)
 * 
 * Strict Architecture Rules:
 * - Supabase is the permanent source of truth for all ecommerce data.
 * - Redis accelerates reads, caches public/recreatable data, and provides short-lived locks.
 * - Redis eviction or network outage NEVER crashes the application or causes data loss.
 * - Fashion and Coins (numismatics) caches are strictly isolated.
 * - Two-tier fallback: in-memory tier handles transient Redis network timeouts safely.
 */

// Documented TTLs (in seconds)
export const CACHE_TTL = {
  HOMEPAGE: 300,        // 5 minutes
  CATEGORIES: 1800,     // 30 minutes
  PRODUCT: 600,         // 10 minutes
  SEARCH: 180,          // 3 minutes
  CMS: 600,             // 10 minutes
  REVIEWS: 600,         // 10 minutes
  STRIPS: 600,          // 10 minutes
  BANNERS: 600,         // 10 minutes
  OFFERS: 600,          // 10 minutes
  CART: 300,            // 5 minutes (accelerator only, DB is authoritative)
  SESSION_DEVICE: 864000, // 10 days (accelerator for 1-device policy)
  CHECKOUT_LOCK: 45     // 45 seconds
} as const;

// Namespaced Key Helpers (Strict Fashion vs Coins Isolation)
export const CacheKeys = {
  homepage: (site: 'fashion' | 'coins' | string) => `aadhya:cache:${site}:homepage`,
  categories: (site: 'fashion' | 'coins' | string) => `aadhya:cache:${site}:categories`,
  productsList: (site: 'fashion' | 'coins' | string, queryHash: string = 'default') => `aadhya:cache:${site}:products:${queryHash}`,
  productDetail: (site: 'fashion' | 'coins' | string, idOrSlug: string) => `aadhya:cache:${site}:product:${idOrSlug}`,
  reviews: (site: 'fashion' | 'coins' | string, productId: string) => `aadhya:cache:${site}:reviews:${productId}`,
  cms: (site: 'fashion' | 'coins' | string) => `aadhya:cache:${site}:cms`,
  marquee: (site: 'fashion' | 'coins' | string) => `aadhya:cache:${site}:marquee`,
  offers: (site: 'fashion' | 'coins' | string) => `aadhya:cache:${site}:offers`,
  banners: (site: 'fashion' | 'coins' | string) => `aadhya:cache:${site}:banners`,
  websiteStrips: (site: 'fashion' | 'coins' | string, type: string = 'all') => `aadhya:cache:${site}:strips:${type}`,

  // Cart accelerator keys (user + device isolated)
  cart: (userId: string, deviceId: string) => `aadhya:cart:${userId}:${deviceId}`,

  // Session & Device acceleration (1 active device policy)
  activeDevice: (userId: string) => `aadhya:session:device:${userId}`,

  // Distributed locks
  checkoutLock: (userId: string, cartId?: string) => `aadhya:lock:checkout:${userId}${cartId ? `:${cartId}` : ''}`
};

// In-flight request map for single-flight database stampede protection
const inFlightRequests = new Map<string, Promise<any>>();

// In-memory fallback layer for zero-downtime resilience
const memoryStore = new Map<string, { value: any; expiresAt: number }>();
const memoryLocks = new Map<string, number>();

/**
 * Get item from cache with resilient error handling.
 * Returns null on cache miss or Redis failure (triggering safe DB fallback).
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (data !== null && data !== undefined) {
      return typeof data === 'string' ? JSON.parse(data) : (data as T);
    }
  } catch (error) {
    // Check fallback memory tier
    const item = memoryStore.get(key);
    if (item && item.expiresAt > Date.now()) {
      return item.value as T;
    }
    return null;
  }

  // Check fallback memory tier if Redis missed
  const fallback = memoryStore.get(key);
  if (fallback && fallback.expiresAt > Date.now()) {
    return fallback.value as T;
  }
  return null;
}

/**
 * Set item in cache with TTL.
 * Fails silently to prevent DB writes or responses from failing.
 */
export async function setCache(key: string, value: any, ttlSeconds: number = CACHE_TTL.PRODUCT): Promise<void> {
  // Always update memory store for instantaneous local reads
  memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });

  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.set(key, stringValue, { ex: ttlSeconds });
  } catch (error) {
    // Memory tier holds cache even if Redis call encounters network timeout
  }
}

/**
 * Single-flight cache read helper:
 * 1. Checks Redis cache first.
 * 2. If miss, coordinates concurrent in-flight requests for the same key to avoid database stampede.
 * 3. Populates Redis cache.
 * 4. Fails safely to DB if Redis is unreachable.
 */
export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.PRODUCT
): Promise<T> {
  // 1. Try cache
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // 2. Single-flight coordination
  if (inFlightRequests.has(key)) {
    try {
      return await inFlightRequests.get(key);
    } catch {
      // In-flight failed, fallback to standalone fetch
    }
  }

  const fetchPromise = (async () => {
    try {
      const freshData = await fetchFn();
      if (freshData !== null && freshData !== undefined) {
        // Cache write
        await setCache(key, freshData, ttlSeconds);
      }
      return freshData;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, fetchPromise);
  return await fetchPromise;
}

/**
 * Invalidate a specific cache key.
 */
export async function invalidateCache(key: string): Promise<void> {
  memoryStore.delete(key);
  try {
    await redis.del(key);
  } catch (error) {
    // Handled
  }
}

/**
 * Invalidate multiple keys matching a pattern.
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  // Invalidate memory store
  const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  for (const k of memoryStore.keys()) {
    if (regexPattern.test(k)) {
      memoryStore.delete(k);
    }
  }

  // Invalidate Redis cluster
  try {
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = typeof result[0] === 'number' ? result[0] : parseInt(String(result[0]), 10);
      const keys = result[1];
      if (Array.isArray(keys) && keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== 0);
  } catch (error) {
    // Handled
  }
}

/**
 * Distributed Checkout Lock:
 * Prevents duplicate orders and concurrent checkout race conditions.
 * Returns true if lock was acquired, false if already locked by another request.
 */
export async function acquireLock(key: string, ttlSeconds: number = CACHE_TTL.CHECKOUT_LOCK): Promise<boolean> {
  const now = Date.now();
  const existingMemoryLock = memoryLocks.get(key);
  if (existingMemoryLock && existingMemoryLock > now) {
    return false;
  }

  try {
    const result = await redis.set(key, 'locked', { nx: true, ex: ttlSeconds });
    if (result === 'OK') {
      memoryLocks.set(key, now + ttlSeconds * 1000);
      return true;
    }
    return false;
  } catch (error) {
    // If Redis is offline, memory lock ensures protection per instance
    memoryLocks.set(key, now + ttlSeconds * 1000);
    return true;
  }
}

/**
 * Release distributed lock.
 */
export async function releaseLock(key: string): Promise<void> {
  memoryLocks.delete(key);
  try {
    await redis.del(key);
  } catch (error) {
    // Handled
  }
}
