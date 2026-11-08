import config from './analytics-config.json';
import { t } from './i18n.js';
import { PREFERENCE_KEY, analyticsAllowed, analyticsEnabled, analyticsPreferenceRecord, analyticsURL } from './analytics-policy.js';

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
const disableKey = `ga-disable-${measurementId}`;
let started = false;
let storageAvailable = true;

function preferenceEnabled() {
  let record = null;
  try { record = localStorage.getItem(PREFERENCE_KEY); }
  catch { storageAvailable = false; }
  if (new URL(location.href).searchParams.get('analytics') === 'off') return false;
  return analyticsEnabled(record);
}

const enabledAtLoad = preferenceEnabled();

function clearAnalyticsCookies() {
  let cookies;
  try { cookies = document.cookie; } catch { return; }
  const names = cookies.split(';').map(cookie => cookie.split('=')[0].trim())
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
  if (started && preferenceEnabled()) window.gtag('event', 'page_view', pageContext());
}

function enableAnalytics() {
  if (!eligible || !enabledAtLoad || started) return;
  started = true;
  window[disableKey] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  const settings = {
    ...pageContext(),
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 180 * 24 * 60 * 60,
    cookie_flags: 'SameSite=Lax;Secure',
  };
  // Set these before 'js': the published tag can otherwise send its own view.
  window.gtag('set', { ...settings });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { ...settings });
  pageView();
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.analytics = 'ga4';
  document.head.append(script);
}

// Only the privacy page contains a control; there is no banner or consent panel.
const checkbox = document.querySelector('#analytics-enabled');
const status = document.querySelector('#analytics-preference-status');
if (checkbox) {
  checkbox.checked = enabledAtLoad;
  checkbox.disabled = false;
  if (status) status.textContent = enabledAtLoad
    ? t('Analityka jest włączona.', 'Analytics is enabled.')
    : t('Analityka jest wyłączona.', 'Analytics is disabled.');
  checkbox.addEventListener('change', () => {
    const enabled = checkbox.checked;
    window[disableKey] = true;
    let saved = false;
    try {
      const record = analyticsPreferenceRecord(enabled);
      localStorage.setItem(PREFERENCE_KEY, record);
      saved = localStorage.getItem(PREFERENCE_KEY) === record;
    } catch { storageAvailable = false; }
    const current = new URL(location.href);
    current.searchParams.delete('analytics');
    if (!enabled && !saved) current.searchParams.set('analytics', 'off');
    // A blocked storage must not turn tracking back on when this page reloads.
    history.replaceState(history.state, '', current.href);
    if (!enabled) clearAnalyticsCookies();
    location.reload();
  });
}

function propagateOptOut(link) {
  if (!link?.href || new URL(location.href).searchParams.get('analytics') !== 'off') return;
  const target = new URL(link.href, location.href);
  if (target.origin !== location.origin) return;
  target.searchParams.set('analytics', 'off');
  link.href = target.href;
}
if (new URL(location.href).searchParams.get('analytics') === 'off') {
  document.querySelectorAll('a[href]').forEach(propagateOptOut);
  for (const event of ['click', 'auxclick', 'contextmenu']) {
    document.addEventListener(event, e => propagateOptOut(e.target.closest?.('a[href]')), true);
  }
  if (status && !storageAvailable) status.textContent = t(
    'Analityka jest wyłączona. Przeglądarka blokuje zapis ustawień, więc zachowam ten wybór podczas przechodzenia przez linki na stronie.',
    'Analytics is disabled. Your browser blocks saving settings, so this choice will be kept when you follow links within the site.',
  );
}

if (eligible) {
  if (enabledAtLoad) enableAnalytics();
  else {
    window[disableKey] = true;
    clearAnalyticsCookies();
  }
  function refreshPreference() {
    const current = preferenceEnabled();
    if (current === enabledAtLoad) return true;
    window[disableKey] = true;
    if (!current) clearAnalyticsCookies();
    location.reload();
    return false;
  }
  addEventListener('storage', event => {
    if (event.key === PREFERENCE_KEY || event.key === null) refreshPreference();
  });
  addEventListener('pageshow', event => {
    if (event.persisted && refreshPreference()) pageView();
  });
}
