import config from './analytics-config.json';
import { createAnalyticsConsent } from './analytics-consent.js';
import { CONSENT_KEY, analyticsAllowed, analyticsURL, consentRecord, parseConsent } from './analytics-policy.js';

const measurementId = typeof config.measurementId === 'string' ? config.measurementId.trim() : '';
const robots = document.querySelector('meta[name="robots"]')?.content || '';
const eligible = analyticsAllowed({
  measurementId,
  allowedHosts: config.allowedHosts,
  hostname: location.hostname,
  pathname: location.pathname,
  robots,
  redirecting: document.documentElement.style.visibility === 'hidden',
});

if (eligible) {
  let choice = null;
  try { choice = parseConsent(localStorage.getItem(CONSENT_KEY)); } catch { /* A choice can still apply to the current page. */ }
  let enabled = false;
  const disableKey = `ga-disable-${measurementId}`;

  function clearAnalyticsCookies() {
    const names = document.cookie.split(';').map(cookie => cookie.split('=')[0].trim())
      .filter(name => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
    const labels = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < labels.length - 1; i++) {
      domains.push(`;domain=${labels.slice(i).join('.')}`, `;domain=.${labels.slice(i).join('.')}`);
    }
    const paths = new Set(['/']);
    const segments = location.pathname.split('/').filter(Boolean);
    for (let i = 1; i <= segments.length; i++) paths.add('/' + segments.slice(0, i).join('/') + '/');
    for (const name of names) for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domain};SameSite=Lax`;
    }
  }

  function pageContext() {
    return {
      page_location: analyticsURL(location.href),
      page_referrer: analyticsURL(document.referrer),
      page_title: document.title,
    };
  }

  function pageView() {
    if (enabled && choice === 'granted') window.gtag('event', 'page_view', pageContext());
  }

  function enableAnalytics() {
    if (enabled || choice !== 'granted') return;
    enabled = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    // Basic consent mode: no Google script or requests exist before approval.
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      ...pageContext(),
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    pageView();
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.analytics = 'ga4';
    document.head.append(script);
  }

  function choose(next) {
    choice = next;
    try { localStorage.setItem(CONSENT_KEY, consentRecord(next)); } catch { /* No consent is inferred on a later page if storage is unavailable. */ }
    controls.setChoice(next);
    if (next === 'granted') {
      enableAnalytics();
    } else {
      window[disableKey] = true;
      clearAnalyticsCookies();
      // Unload an already running tag; the saved refusal prevents it reloading.
      if (enabled) location.reload();
    }
  }

  const controls = createAnalyticsConsent({ choice, onChoose: choose });
  if (choice === 'granted') enableAnalytics();
  else {
    window[disableKey] = true;
    clearAnalyticsCookies();
  }

  addEventListener('storage', event => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    const updated = parseConsent(event.newValue);
    if (updated === choice) return;
    // Keep all tabs aligned, including immediate opt-out of an existing tag.
    window[disableKey] = true;
    if (updated !== 'granted') clearAnalyticsCookies();
    location.reload();
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    // A restored document may predate a refusal on another page or expiry.
    let current = null;
    try { current = parseConsent(localStorage.getItem(CONSENT_KEY)); } catch { /* A restored page needs a fresh choice if storage is blocked. */ }
    if (current !== choice) {
      window[disableKey] = true;
      if (current !== 'granted') clearAnalyticsCookies();
      location.reload();
      return;
    }
    pageView();
  });
}
