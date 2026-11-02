const button = document.querySelector('.style-washer');
const modes = ['invert', 'ornate', 'blue', 'mono-light', 'mono-dark'];
const labels = {
  base: 'Styl podstawowy',
  invert: 'Inwersja kolorów',
  ornate: 'Krój szeryfowy i ozdobny',
  blue: 'Błękit zamiast czerwieni',
  'mono-light': 'Czerń na bieli',
  'mono-dark': 'Biel na czerni',
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
    button.setAttribute('aria-label', `Pralka — wylosuj styl strony. Aktualnie: ${label}.`);
    button.title = `${label}. Kliknij, by losować. Przytrzymaj, by przywrócić podstawowy.`;
    if (announce && status) status.textContent = label;
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = ['invert', 'mono-dark'].includes(mode) ? '#000000' : '#ffffff';
  }
  // A reload starts a fresh play session; internal navigation keeps the selection.
  const reloaded = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  applyMode(reloaded ? 'base' : savedMode(), false, reloaded);
  addEventListener('pageshow', () => applyMode(savedMode(), false, false));
  button.addEventListener('click', event => {
    if (performance.now() < ignoreClickUntil) return;
    if (event.shiftKey) { applyMode('base'); return; }
    // Effects replace one another; the next draw never repeats the current mode.
    const candidates = modes.filter(mode => mode !== root.dataset.wash);
    applyMode(candidates[Math.floor(Math.random() * candidates.length)]);
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
