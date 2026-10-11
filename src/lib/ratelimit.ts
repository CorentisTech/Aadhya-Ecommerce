import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// Ephemeral cache for blocked requests to avoid hitting Redis repeatedly
const cache = new Map();

/**
 * AUTH / OTP
 * Strict limit to prevent brute force.
 * 5 requests per 15 minutes
 */
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  ephemeralCache: cache,
  prefix: 'aadhya:rate:auth'
})

/**
 * SEARCH
 * Reasonable limit per IP/User to prevent abuse.
 * 20 requests per 10 seconds
 */
export const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  analytics: true,
  ephemeralCache: cache,
  prefix: 'aadhya:rate:search'
})

/**
 * CHECKOUT & PAYMENT
 * Very strict limits.
 * 3 requests per 1 minute
 */
export const checkoutRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
  ephemeralCache: cache,
  prefix: 'aadhya:rate:checkout'
})

/**
 * REVIEWS & SUPPORT
 * Limit spam.
 * 3 requests per 5 minutes
 */
export const spamRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '5 m'),
  analytics: true,
  ephemeralCache: cache,
  prefix: 'aadhya:rate:spam'
})

/**
 * GENERAL PUBLIC BROWSING
 * Higher limit for normal product APIs.
 * 100 requests per 10 seconds
 */
export const publicApiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '10 s'),
  analytics: true,
  ephemeralCache: cache,
  prefix: 'aadhya:rate:public'
})

/**
 * ADMIN ACTIONS
 * 50 requests per minute
 */
export const adminRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 m'),
  analytics: true,
  ephemeralCache: cache,
  prefix: 'aadhya:rate:admin'
})
