import test from 'node:test';
import assert from 'node:assert/strict';
import { PREFERENCE_LIFETIME, analyticsAllowed, analyticsEnabled, analyticsPreferenceRecord, analyticsScriptURL, analyticsURL, parseAnalyticsPreference } from '../src/analytics-policy.js';

test('the installed Google tag keeps its own identity while GA4 keeps its measurement ID', () => {
  assert.equal(analyticsScriptURL('G-787SY0YXF7', 'GTM-P4CJBB6B'), 'https://www.googletagmanager.com/gtm.js?id=GTM-P4CJBB6B');
  assert.equal(analyticsScriptURL('G-787SY0YXF7'), 'https://www.googletagmanager.com/gtag/js?id=G-787SY0YXF7');
  assert.equal(analyticsScriptURL('G-787SY0YXF7', 'GTM-P4CJBB6B&extra=1'), 'https://www.googletagmanager.com/gtag/js?id=G-787SY0YXF7');
  assert.equal(analyticsScriptURL('GTM-P4CJBB6B', 'GTM-P4CJBB6B'), '');
});

test('analytics requires a configured ID and the public site, excluding secret and redirecting pages', () => {
  const page = { measurementId: 'G-ABC1234567', hostname: 'zguda.com', pathname: '/', allowedHosts: ['zguda.com'] };
  assert.equal(analyticsAllowed(page), true);
  for (const change of [
    { measurementId: '' }, { measurementId: 'G-ABC1234567<script>' },
    { hostname: 'localhost' }, { hostname: 'zguda.com.example.org' },
    { pathname: '/nofollow/' }, { pathname: '/en/nofollow/' },
    { pathname: '/zguda.com/en/nofollow/' }, { robots: 'noindex,nofollow' },
    { redirecting: true },
  ]) assert.equal(analyticsAllowed({ ...page, ...change }), false, JSON.stringify(change));
});

test('analytics defaults on while retaining existing explicit opt-outs for 180 days', () => {
  const now = Date.UTC(2026, 10, 7);
  assert.equal(analyticsEnabled(null, now), true);
  assert.equal(analyticsEnabled(analyticsPreferenceRecord(true, now), now + 1), true);
  assert.equal(analyticsEnabled(analyticsPreferenceRecord(false, now), now + 1), false);
  assert.equal(analyticsEnabled(JSON.stringify({ version: 1, choice: 'denied', updatedAt: now }), now + 1), false);
  assert.equal(parseAnalyticsPreference(analyticsPreferenceRecord(false, now), now + PREFERENCE_LIFETIME), null);
  assert.equal(analyticsEnabled(analyticsPreferenceRecord(false, now), now + PREFERENCE_LIFETIME), true);
  assert.equal(parseAnalyticsPreference(analyticsPreferenceRecord(true, now + 1), now), null);
  for (const value of [null, '', 'granted', '{}', '{"choice":"granted"}', '{"version":1,"choice":"granted","updatedAt":"today"}']) {
    assert.equal(parseAnalyticsPreference(value, now), null);
  }
});

test('analytics URLs exclude personal query values, fragments and secret content', () => {
  assert.equal(analyticsURL('https://zguda.com/en/?email=someone@example.org#kontakt'), 'https://zguda.com/en/');
  assert.equal(analyticsURL('https://user:password@example.org/page?q=private'), 'https://example.org/page');
  assert.equal(analyticsURL('https://zguda.com/en/nofollow/?lang=en'), '');
  assert.equal(analyticsURL('mailto:someone@example.org'), '');
  assert.equal(analyticsURL(''), '');
});
