import { t } from './i18n.js';
import './cosmic-animal.js';

const button = document.querySelector('.style-washer');
const modes = ['invert', 'ornate', 'blue', 'mono-light', 'mono-dark', 'flashlight', 'cosmic-animal'];
const labels = {
  base: t('Styl podstawowy', 'Original style'),
  invert: t('Inwersja kolorów', 'Inverted colours'),
  ornate: t('Krój szeryfowy i ozdobny', 'Decorative serif type'),
  blue: t('Błękit zamiast czerwieni', 'Blue instead of red'),
  'mono-light': t('Czerń na bieli', 'Black on white'),
  'mono-dark': t('Biel na czerni', 'White on black'),
  flashlight: t('Ciemna strona z latarką', 'Dark page with a flashlight'),
  'cosmic-animal': t('Kosmiczne zwierzę', 'Cosmic animal'),
};
const storageKey = 'zguda-style-wash';
function savedMode() {
  try {
    const mode = sessionStorage.getItem(storageKey);
    return modes.includes(mode) ? mode : 'base';
  } catch { return 'base'; }
}
if (button) {
  const root = document.documentElement;
  const status = document.querySelector('.style-wash-status');
  let holdTimer;
  let animationTimer;
  let ignoreClickUntil = 0;
  function applyMode(mode, announce = true, remember = true) {
    if (mode === 'base') root.removeAttribute('data-wash');
    else root.dataset.wash = mode;
    if (remember) {
      try {
        if (mode === 'base') sessionStorage.removeItem(storageKey);
        else sessionStorage.setItem(storageKey, mode);
      } catch { /* Appearance controls also work without browser storage. */ }
    }
    const label = labels[mode];
    const action = mode === 'base' ? t('Wylosuj alternatywny styl', 'Choose a random style') : t('Przywróć oryginalny styl', 'Restore the original style');
    button.setAttribute('aria-label', t(`Pralka — ${action.toLowerCase()}. Aktualnie: ${label}.`, `Washing machine — ${action.toLowerCase()}. Current style: ${label}.`));
    button.setAttribute('aria-pressed', String(mode !== 'base'));
    if (announce && status) status.textContent = label;
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) {
      const channels = getComputedStyle(document.body).backgroundColor.match(/\d+/g).slice(0, 3).map(Number);
      theme.content = '#' + channels.map(value => (mode === 'invert' ? 255 - value : value).toString(16).padStart(2, '0')).join('');
    }
  }
  // A reload starts a fresh play session; internal navigation keeps the selection.
  const reloaded = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  applyMode(reloaded ? 'base' : savedMode(), false, reloaded);
  addEventListener('pageshow', () => applyMode(savedMode(), false, false));
  button.addEventListener('click', event => {
    if (performance.now() < ignoreClickUntil) return;
    if (event.shiftKey) { applyMode('base'); return; }
    // Every variation is followed by the original appearance before another draw.
    if (modes.includes(root.dataset.wash)) applyMode('base');
    else applyMode(modes[Math.floor(Math.random() * modes.length)]);
    button.classList.add('is-washing');
    clearTimeout(animationTimer);
    animationTimer = setTimeout(() => button.classList.remove('is-washing'), 520);
  });
  button.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      applyMode('base');
      ignoreClickUntil = performance.now() + 700;
    }, 650);
  });
  for (const name of ['pointerup', 'pointercancel', 'pointerleave']) {
    button.addEventListener(name, () => clearTimeout(holdTimer));
  }
  button.addEventListener('contextmenu', event => event.preventDefault());
}
