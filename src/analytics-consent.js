import { t } from './i18n.js';
import './analytics-consent.css';

export function createAnalyticsConsent({ choice = null, onChoose }) {
  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.id = 'analytics-consent';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'analytics-consent-title');

  const heading = document.createElement('div');
  heading.className = 'analytics-consent__heading';
  const title = document.createElement('h2');
  title.id = 'analytics-consent-title';
  title.className = 'analytics-consent__title';
  title.textContent = t('Analityka strony', 'Website analytics');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'analytics-consent__close';
  close.setAttribute('aria-label', t('Zamknij ustawienia analityki', 'Close analytics settings'));
  close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="m6 6 12 12M6 18 18 6"/></svg>';
  heading.append(title, close);

  const text = document.createElement('p');
  text.className = 'analytics-consent__text';
  text.textContent = t(
    'Google Analytics 4 używa plików cookie, żeby pomóc mi sprawdzić, ile osób odwiedza stronę i które treści są czytane. Uruchomię je tylko za Twoją zgodą. Możesz ją później wycofać w stopce.',
    'Google Analytics 4 uses cookies to help me understand how many people visit the site and which content they read. I will only enable it with your consent. You can withdraw your consent later in the footer.',
  );
  const information = document.createElement('a');
  information.className = 'analytics-consent__information';
  information.href = t('https://policies.google.com/technologies/partner-sites?hl=pl', 'https://policies.google.com/technologies/partner-sites?hl=en');
  information.target = '_blank';
  information.rel = 'noopener noreferrer';
  information.textContent = t('Jak Google wykorzystuje dane', 'How Google uses data');

  const actions = document.createElement('div');
  actions.className = 'analytics-consent__actions';
  const allow = document.createElement('button');
  allow.type = 'button';
  allow.textContent = t('Zezwól na analitykę', 'Allow analytics');
  const refuse = document.createElement('button');
  refuse.type = 'button';
  refuse.textContent = t('Odmów', 'Decline');
  actions.append(allow, refuse);
  panel.append(heading, text, information, actions);

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = t('Ustawienia analityki', 'Analytics settings');
  settings.setAttribute('aria-controls', panel.id);
  let openedFromSettings = false;
  const header = document.querySelector('header');

  function limitHeight() {
    const bottom = Number.parseFloat(getComputedStyle(panel).bottom) || 16;
    const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
    panel.style.maxHeight = `${Math.max(44, innerHeight - headerBottom - bottom - 12)}px`;
  }

  function hide() {
    const returnFocus = openedFromSettings && panel.contains(document.activeElement);
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    openedFromSettings = false;
    if (returnFocus) settings.focus({ preventScroll: true });
  }

  function show() {
    openedFromSettings = true;
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
    limitHeight();
    allow.focus({ preventScroll: true });
  }

  function setChoice(next) {
    choice = next;
    hide();
  }

  function choose(next) {
    setChoice(next);
    onChoose(next);
  }

  function escape(event) {
    if (event.key === 'Escape' && !panel.hidden) {
      hide();
      event.preventDefault();
    }
  }

  panel.hidden = choice !== null;
  settings.setAttribute('aria-expanded', String(!panel.hidden));
  document.body.append(panel);
  (document.querySelector('footer .footer-links') ?? document.querySelector('footer') ?? document.body).append(settings);
  limitHeight();
  const headerResize = typeof ResizeObserver === 'function' ? new ResizeObserver(limitHeight) : null;
  if (header) headerResize?.observe(header);
  addEventListener('resize', limitHeight, { passive: true });
  settings.addEventListener('click', show);
  close.addEventListener('click', hide);
  allow.addEventListener('click', () => choose('granted'));
  refuse.addEventListener('click', () => choose('denied'));
  document.addEventListener('keydown', escape);

  return {
    setChoice,
    destroy() {
      document.removeEventListener('keydown', escape);
      removeEventListener('resize', limitHeight);
      headerResize?.disconnect();
      panel.remove();
      settings.remove();
    },
  };
}
