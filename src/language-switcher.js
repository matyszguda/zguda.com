import './language-switcher.css';

const control = document.querySelector('.language-toggle');
const rootMeta = document.querySelector('meta[name="site-root"]');

if (control && rootMeta) {
  const siteRoot = new URL(rootMeta.content, location.href);
  const currentLanguage = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pl';
  const otherLanguage = currentLanguage === 'en' ? 'pl' : 'en';
  const relativePath = location.pathname.slice(siteRoot.pathname.length);
  const pagePath = (relativePath.startsWith('en/') ? relativePath.slice(3) : relativePath).replace(/index\.html$/, '');
  const target = new URL(`${otherLanguage === 'en' ? 'en/' : ''}${pagePath}`, siteRoot);
  target.search = location.search;
  target.hash = location.hash;
  target.searchParams.set('lang', otherLanguage);

  control.href = target.href;
  control.lang = otherLanguage;
  control.hreflang = otherLanguage;
  control.textContent = otherLanguage.toUpperCase();
  control.setAttribute('aria-label', currentLanguage === 'en' ? 'Switch to Polish' : 'Przełącz na angielski');

  control.addEventListener('click', () => {
    try {
      localStorage.setItem('zguda-language', otherLanguage);
    } catch {
      // The explicit language in the destination URL also works without storage.
    }
  });

  // Keep an explicit choice during navigation when privacy settings block storage.
  if (document.documentElement.dataset.languageStorage === 'unavailable') {
    for (const link of document.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href');
      if (link === control || !href || href.startsWith('#')) continue;
      const url = new URL(href, location.href);
      if (url.origin !== siteRoot.origin || !url.pathname.startsWith(siteRoot.pathname)) continue;
      if (!url.pathname.endsWith('/') && !url.pathname.endsWith('.html')) continue;
      url.searchParams.set('lang', currentLanguage);
      link.href = url.href;
    }
  }
}
