// Client and Server Device Utility for AADHYA Multi-Device Scoping

const DEVICE_ID_KEY = 'aadhya_device_id';

/**
 * Returns the persistent unique device identifier stored on the client.
 * Generated using cryptographic entropy if not already set.
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    return 'server_environment';
  }
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId || deviceId.trim().length === 0) {
      deviceId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'dev_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return 'fallback_device_' + Date.now();
  }
}

/**
 * Helper to identify a friendly label for device registration.
 */
export function getDeviceName(): string {
  if (typeof window === 'undefined') return 'Web Client';
  const ua = window.navigator.userAgent || '';
  if (/iPhone|Android.*Mobile|Mobile/i.test(ua)) return 'Mobile Device';
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS Browser';
  if (/Windows NT/i.test(ua)) return 'Windows PC';
  if (/Linux/i.test(ua)) return 'Linux Browser';
  return 'Desktop Browser';
}
