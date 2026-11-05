// Embedded in the head by scripts/update-locales.mjs, before content is painted.
(() => {
  const rootMeta = document.querySelector('meta[name="site-root"]');
  if (!rootMeta) return;
  const current = new URL(window.location.href);
  const root = new URL(rootMeta.content, current);
  if (!current.pathname.startsWith(root.pathname)) return;
  const relative = current.pathname.slice(root.pathname.length);
  const englishPage = relative === 'en' || relative.startsWith('en/');
  const pagePath = englishPage ? relative.replace(/^en\/?/, '') : relative;
  const requested = current.searchParams.get('lang')?.toLowerCase();
  const explicit = requested === 'en' || requested === 'pl' ? requested : null;
  let saved = null;
  try {
    const value = window.localStorage.getItem('zguda-language');
    if (value === 'en' || value === 'pl') saved = value;
    if (explicit) {
      window.localStorage.setItem('zguda-language', explicit);
      if (window.localStorage.getItem('zguda-language') !== explicit) throw new Error('Storage unavailable');
    }
  } catch {
    document.documentElement.dataset.languageStorage = 'unavailable';
  }
  const slavic = new Set([
    'pl', 'cs', 'sk', 'sl', 'hr', 'bs', 'sr', 'mk', 'bg', 'ru', 'uk', 'be',
    'sh', 'cnr', 'hsb', 'dsb', 'csb', 'szl', 'rue', 'cu',
    'pol', 'ces', 'cze', 'slk', 'slo', 'slv', 'hrv', 'bos', 'srp', 'scc',
    'scr', 'mkd', 'mac', 'bul', 'rus', 'ukr', 'bel', 'chu',
  ]);
  const primary = (window.navigator.languages?.[0] || window.navigator.language || 'en')
    .toLowerCase().replace(/_/g, '-').split('-')[0];
  const language = explicit || saved || (englishPage ? 'en' : slavic.has(primary) ? 'pl' : 'en');
  const target = new URL((language === 'en' ? 'en/' : '') + pagePath, root);
  target.search = current.search;
  target.hash = current.hash;
  if (target.pathname !== current.pathname) {
    document.documentElement.style.visibility = 'hidden';
    window.location.replace(target.href);
  }
})();
