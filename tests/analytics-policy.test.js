import test from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_LIFETIME, analyticsAllowed, analyticsURL, consentRecord, parseConsent } from '../src/analytics-policy.js';

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

test('consent is explicit, versioned and expires instead of silently renewing', () => {
  const now = Date.UTC(2026, 10, 7);
  assert.equal(parseConsent(consentRecord('granted', now), now + 1), 'granted');
  assert.equal(parseConsent(consentRecord('denied', now), now + 1), 'denied');
  assert.equal(parseConsent(consentRecord('granted', now), now + CONSENT_LIFETIME), null);
  assert.equal(parseConsent(consentRecord('granted', now + 1), now), null);
  for (const value of [null, '', 'granted', '{}', '{"choice":"granted"}', '{"version":1,"choice":"granted","updatedAt":"today"}']) {
    assert.equal(parseConsent(value, now), null);
  }
});

test('analytics URLs exclude personal query values, fragments and secret content', () => {
  assert.equal(analyticsURL('https://zguda.com/en/?email=someone@example.org#kontakt'), 'https://zguda.com/en/');
  assert.equal(analyticsURL('https://user:password@example.org/page?q=private'), 'https://example.org/page');
  assert.equal(analyticsURL('https://zguda.com/en/nofollow/?lang=en'), '');
  assert.equal(analyticsURL('mailto:someone@example.org'), '');
  assert.equal(analyticsURL(''), '');
});
