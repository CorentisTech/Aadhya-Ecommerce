import { createClient } from '@/utils/supabase/server';
import { queryDb } from '@/utils/db';
import { getCache, setCache, CACHE_TTL } from '@/lib/cache';

export async function validateUserSession(request: Request) {
  const supabase = await createClient();
  let user: any = null;

  // 1. Check Bearer token from Authorization header if present
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

  // 2. Fall back to cookie session
  if (!user) {
    const { data: { user: cookieUser }, error: authError } = await supabase.auth.getUser();
    if (!authError && cookieUser) user = cookieUser;
  }

  if (!user) {
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

// Admin-specific validation: checks user is authenticated against dedicated administrators table
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

  // Check role from dedicated administrators table (Redis accelerated)
  const adminCacheKey = `aadhya:session:admin:${user.id}`;
  try {
    let adminRecord = await getCache<{ role: string; is_active: boolean; permissions: any }>(adminCacheKey);

    if (!adminRecord) {
      const rows = await queryDb(
        'SELECT id, email, full_name, role, is_active, permissions FROM administrators WHERE id = $1 OR email = $2',
        [user.id, userEmail]
      );

      if ((!rows || rows.length === 0) && isSuperAdminEmail) {
        // Auto-provision primary super admin in dedicated table if missing
        adminRecord = { role: 'super_admin', is_active: true, permissions: ['all'] };
        try {
          await queryDb(`
            INSERT INTO administrators (id, email, full_name, role, is_active, permissions)
            VALUES ($1, $2, $3, 'super_admin', true, '["all"]'::jsonb)
            ON CONFLICT (id) DO UPDATE SET is_active = true, role = 'super_admin'
          `, [user.id, userEmail, user.user_metadata?.full_name || 'Admin']);
        } catch (syncErr) {
          console.warn('Auto-provision administrator error:', syncErr);
        }
      } else if (!rows || rows.length === 0) {
        return { valid: false, error: 'No administrator record found', status: 403 } as const;
      } else {
        adminRecord = rows[0];
      }

      // Cache admin role for 5 minutes
      if (adminRecord) {
        await setCache(adminCacheKey, adminRecord, 300);
      }
    }

    if (!adminRecord) {
      return { valid: false, error: 'No administrator record found', status: 403 } as const;
    }

    if (adminRecord.is_active === false) {
      return { valid: false, error: 'Administrator account has been deactivated', status: 403 } as const;
    }

    const role = (adminRecord.role || '').toLowerCase().trim();
    const validRoles = ['super_admin', 'admin', 'editor', 'support'];
    
    if (!validRoles.includes(role) && !isSuperAdminEmail) {
      return { valid: false, error: 'Insufficient admin permissions', status: 403 } as const;
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
