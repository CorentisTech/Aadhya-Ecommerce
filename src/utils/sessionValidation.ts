import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';
import { getCache, setCache, CACHE_TTL } from '@/lib/cache';

export async function validateUserSession(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { valid: false, error: 'Unauthorized', status: 401 } as const;
  }

  // Get device id from header OR cookie
  let deviceId = request.headers.get('x-device-id');
  
  if (!deviceId) {
    // Try to read from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/aadhya_device_id=([^;]+)/);
    if (match) deviceId = match[1];
  }

  if (!deviceId) {
    // No device id available - allow request but skip device check
    // This handles initial page loads before device registration
    return { valid: true, user, deviceId: null } as const;
  }

  // 1-ACTIVE-DEVICE CHECK (Redis accelerated with Supabase DB fallback)
  const sessionCacheKey = `aadhya:session:device:${user.id}:${deviceId}`;
  try {
    // 1. Check Redis cache first
    const cachedState = await getCache<{ isActive: boolean }>(sessionCacheKey);
    if (cachedState !== null) {
      if (!cachedState.isActive) {
        return { valid: false, error: 'Session Revoked. Your account was signed in on another device.', status: 403, revoked: true } as const;
      }
      return { valid: true, user, deviceId } as const;
    }

    // 2. Cache miss / evicted -> Authoritative query from DB
    const rows = await queryDb(
      'SELECT is_active FROM user_devices WHERE user_id = $1 AND device_id = $2',
      [user.id, deviceId]
    );

    const isActive = rows && rows.length > 0 ? rows[0].is_active !== false : true;

    // Cache state in Redis with 10-day TTL (accelerator only)
    await setCache(sessionCacheKey, { isActive }, CACHE_TTL.SESSION_DEVICE);

    if (rows && rows.length > 0 && rows[0].is_active === false) {
      return { valid: false, error: 'Session Revoked. Your account was signed in on another device.', status: 403, revoked: true } as const;
    }
  } catch (err) {
    console.error('Device validation error:', err);
    // Fail-safe: Don't block requests if Redis or device table query encounters a transient error
  }

  return { valid: true, user, deviceId } as const;
}

const SUPER_ADMIN_EMAILS = ['admin@aadhya.co', 'premkarnawat1716@gmail.com'];

// Admin-specific validation: checks user is authenticated AND has an admin role
export async function validateAdminSession(request?: Request) {
  const supabase = await createClient();
  let user: any = null;

  // 1. Try Bearer token from request Authorization header if present
  if (request) {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.substring(7).trim();
      if (token) {
        try {
          const { data, error } = await supabase.auth.getUser(token);
          if (data?.user && !error) user = data.user;
        } catch {}
      }
    }
  }

  // 2. Fall back to cookie session
  if (!user) {
    const { data: { user: cookieUser }, error: authError } = await supabase.auth.getUser();
    if (!authError && cookieUser) user = cookieUser;
  }

  if (!user) {
    return { valid: false, error: 'Unauthorized', status: 401 } as const;
  }

  const userEmail = (user.email || '').toLowerCase().trim();
  const isSuperAdminEmail = SUPER_ADMIN_EMAILS.includes(userEmail);

  // Check role from profiles table (Redis accelerated)
  const adminCacheKey = `aadhya:session:admin:${user.id}`;
  try {
    let profile = await getCache<{ role: string; status: string }>(adminCacheKey);

    if (!profile) {
      const rows = await queryDb(
        'SELECT role, status FROM profiles WHERE id = $1',
        [user.id]
      );

      if ((!rows || rows.length === 0) && isSuperAdminEmail) {
        profile = { role: 'super_admin', status: 'active' };
      } else if (!rows || rows.length === 0) {
        return { valid: false, error: 'No admin profile found', status: 403 } as const;
      } else {
        profile = rows[0];
      }

      // If email is primary admin, ensure role is super_admin
      if (profile && isSuperAdminEmail && profile.role !== 'super_admin') {
        profile.role = 'super_admin';
        await queryDb(`UPDATE profiles SET role = 'super_admin' WHERE id = $1`, [user.id]);
      }

      // Cache admin role for 5 minutes
      await setCache(adminCacheKey, profile, 300);
    }

    if (!profile) {
      return { valid: false, error: 'No admin profile found', status: 403 } as const;
    }

    const role = (profile.role || '').toLowerCase().trim();
    const validRoles = ['super_admin', 'admin', 'editor', 'support'];
    
    if (!validRoles.includes(role) && !isSuperAdminEmail) {
      return { valid: false, error: 'Insufficient permissions', status: 403 } as const;
    }

    if (profile.status === 'disabled' || profile.status === 'removed') {
      return { valid: false, error: 'Account has been disabled', status: 403 } as const;
    }

    return { valid: true, user, role: isSuperAdminEmail ? 'super_admin' : role } as const;
  } catch (err) {
    console.error('Admin validation error:', err);
    return { valid: false, error: 'Internal error during validation', status: 500 } as const;
  }
}

// Permission matrix
const PERMISSIONS: Record<string, string[]> = {
  super_admin: ['*'],
  admin: ['products', 'categories', 'orders', 'users', 'tracking', 'reviews', 'revenue', 'cms', 'support'],
  editor: ['products', 'categories', 'banners', 'offers', 'cms'],
  support: ['users', 'orders', 'tracking', 'support'],
};

export function hasPermission(role: string, resource: string): boolean {
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes('*')) return true;
  return perms.includes(resource);
}
