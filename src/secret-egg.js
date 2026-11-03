import './secret-egg.css';

for (const [index, link] of [...document.querySelectorAll('a.easter-link')].entries()) {
  link.classList.add('secret-trigger');
  link.dataset.eggState = 'hidden';
  link.setAttribute('aria-label', 'Odkryj sekret');
  link.setAttribute('aria-expanded', 'false');
  link.removeAttribute('title');
  // Keep the destination a real link. Only its first activation reveals the egg.
  link.innerHTML = `<svg class="secret-egg" viewBox="0 0 40 48" width="30" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><defs><clipPath id="secret-egg-shell-${index}"><path d="M20 3C12 3 5 20 5 30a15 15 0 0 0 30 0C35 20 28 3 20 3Z"/></clipPath></defs><path class="secret-egg-shell" d="M20 3C12 3 5 20 5 30a15 15 0 0 0 30 0C35 20 28 3 20 3Z"/><g clip-path="url(#secret-egg-shell-${index})"><path d="m4 26 7-5 5 5 5-5 5 5 8-5 4 5M4 33c10 6 22 6 32 0"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="24" cy="17" r="1.5" fill="currentColor" stroke="none"/><circle cx="20" cy="39" r="1.5" fill="currentColor" stroke="none"/></g></svg>`;

  function reveal(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    if (link.dataset.eggState === 'revealed') return;
    event.preventDefault();
    link.dataset.eggState = 'revealed';
    link.setAttribute('aria-label', 'Otwórz sekretną listę');
    link.setAttribute('aria-expanded', 'true');
  }
  link.addEventListener('click', reveal);
  link.addEventListener('auxclick', reveal);

  // A page restored from the back/forward cache starts with the discovery again.
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    link.dataset.eggState = 'hidden';
    link.setAttribute('aria-label', 'Odkryj sekret');
    link.setAttribute('aria-expanded', 'false');
  });
}
