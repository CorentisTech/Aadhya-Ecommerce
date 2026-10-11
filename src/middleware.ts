import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  authRateLimit,
  searchRateLimit,
  checkoutRateLimit,
  spamRateLimit,
  publicApiRateLimit,
  adminRateLimit
} from '@/lib/ratelimit';

/**
 * PRODUCTION TRAFFIC CONTROL MIDDLEWARE (Upstash Rate Limiting)
 * 
 * Protects APIs from bursts, abuse, and brute force while ensuring
 * normal product browsing remains fast and unrestricted.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only apply to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Derive client identifier (IP + optional forwarded headers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1');

  try {
    let limitResult = null;

    if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/profile')) {
      // Strict limits on auth and profile
      limitResult = await authRateLimit.limit(`auth:${ip}`);
    } else if (pathname.startsWith('/api/admin')) {
      // Admin dashboard and management APIs
      limitResult = await adminRateLimit.limit(`admin:${ip}`);
    } else if (pathname.includes('/checkout') || pathname.includes('/payment') || pathname.startsWith('/api/orders')) {
      // High-priority protection on checkout & order operations
      limitResult = await checkoutRateLimit.limit(`checkout:${ip}`);
    } else if (pathname.startsWith('/api/reviews') || pathname.startsWith('/api/support') || pathname.startsWith('/api/admin/support')) {
      // Spam prevention for reviews and tickets
      limitResult = await spamRateLimit.limit(`spam:${ip}`);
    } else if (
      pathname.includes('/search') ||
      request.nextUrl.searchParams.has('search') ||
      request.nextUrl.searchParams.has('q')
    ) {
      // Search query abuse protection
      limitResult = await searchRateLimit.limit(`search:${ip}`);
    } else {
      // Standard public browsing APIs (products, categories, strips)
      limitResult = await publicApiRateLimit.limit(`public:${ip}`);
    }

    if (limitResult && !limitResult.success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((limitResult.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please slow down.',
          retryAfter: retryAfterSeconds
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfterSeconds.toString(),
            'X-RateLimit-Limit': limitResult.limit.toString(),
            'X-RateLimit-Remaining': limitResult.remaining.toString(),
            'X-RateLimit-Reset': limitResult.reset.toString()
          }
        }
      );
    }
  } catch (error) {
    // Fail-open behavior: A Redis network timeout should never produce a blank website
    // or block legitimate customers from normal browsing.
    console.warn('[RateLimit Middleware Fail-Open]:', (error as any)?.message || error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
