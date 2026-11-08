// Reuse the existing key and record format to preserve earlier opt-outs.
export const PREFERENCE_KEY = 'zguda-analytics-consent';
export const PREFERENCE_LIFETIME = 180 * 24 * 60 * 60 * 1000;

export function parseAnalyticsPreference(value, now = Date.now()) {
  try {
    const record = JSON.parse(value);
    if (record?.version !== 1 || !['granted', 'denied'].includes(record.choice)) return null;
    if (!Number.isFinite(record.updatedAt) || record.updatedAt > now || now - record.updatedAt >= PREFERENCE_LIFETIME) return null;
    return record.choice === 'granted';
  } catch { return null; }
}

export function analyticsPreferenceRecord(enabled, now = Date.now()) {
  if (typeof enabled !== 'boolean') throw new Error('Invalid analytics preference');
  return JSON.stringify({ version: 1, choice: enabled ? 'granted' : 'denied', updatedAt: now });
}

export function analyticsEnabled(value, now = Date.now()) {
  return parseAnalyticsPreference(value, now) !== false;
}

export function isSecretPath(pathname) {
  return /(?:^|\/)nofollow(?:\/|$)/i.test(pathname);
}

export function analyticsAllowed({ measurementId, hostname, pathname, robots = '', redirecting = false, allowedHosts = [] }) {
  return typeof measurementId === 'string' && /^G-[A-Z0-9]{6,20}$/.test(measurementId)
    && allowedHosts.includes(hostname) && !isSecretPath(pathname)
    && !/\bnoindex\b/i.test(robots) && !redirecting;
}

// Never send query strings, fragments, credentials or the secret backlog URL.
export function analyticsURL(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || isSecretPath(url.pathname)) return '';
    return url.origin + url.pathname;
  } catch { return ''; }
}
