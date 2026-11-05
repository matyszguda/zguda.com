import './washer-help.css';

const button = document.querySelector('.style-washer');
const help = document.querySelector('#style-wash-help');

if (button && help) {
  // Reuse the existing accessible description rather than duplicating its text.
  // It remains available through aria-describedby while visually clipped.
  help.classList.add('washer-help-tooltip');
  help.setAttribute('role', 'tooltip');
  document.body.append(help);
  button.removeAttribute('title');

  let hoveringButton = false;
  let hoveringHelp = false;
  let suppressed = false;
  let showTimer;
  let hideTimer;
  const visible = () => help.classList.contains('is-visible');
  const keyboardFocused = () => document.activeElement === button && button.matches(':focus-visible');

  function hide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    showTimer = undefined;
    hideTimer = undefined;
    help.classList.remove('is-visible');
    hoveringHelp = false;
  }

  function dismiss() {
    suppressed = true;
    hide();
  }

  function position() {
    const anchor = button.getBoundingClientRect();
    const below = innerHeight - anchor.bottom - 22;
    const above = anchor.top - 22;
    help.style.maxHeight = `${Math.max(48, Math.min(innerHeight - 24, Math.max(above, below)))}px`;
    const box = help.getBoundingClientRect();
    const left = Math.max(12, Math.min(innerWidth - box.width - 12, anchor.right - box.width));
    let top = box.height <= below || below >= above ? anchor.bottom + 10 : anchor.top - box.height - 10;
    top = Math.max(12, Math.min(innerHeight - box.height - 12, top));
    help.style.left = `${left}px`;
    help.style.top = `${top}px`;
  }

  function show() {
    showTimer = undefined;
    if (suppressed || document.hidden || !(hoveringButton || keyboardFocused())) return;
    help.classList.add('is-visible');
    position();
  }

  function scheduleHide() {
    clearTimeout(showTimer);
    showTimer = undefined;
    if (!visible() || hoveringButton || hoveringHelp || keyboardFocused()) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 180);
  }

  button.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hoveringButton = true;
    suppressed = false;
    clearTimeout(hideTimer);
    if (!visible()) {
      clearTimeout(showTimer);
      showTimer = setTimeout(show, 2100);
    }
  });
  button.addEventListener('pointerleave', () => {
    hoveringButton = false;
    scheduleHide();
  });
  button.addEventListener('pointerdown', dismiss);
  button.addEventListener('click', dismiss);
  button.addEventListener('focus', () => {
    if (!keyboardFocused()) return;
    suppressed = false;
    show();
  });
  button.addEventListener('blur', scheduleHide);
  help.addEventListener('pointerenter', () => {
    hoveringHelp = true;
    clearTimeout(hideTimer);
  });
  help.addEventListener('pointerleave', () => {
    hoveringHelp = false;
    scheduleHide();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !(visible() || showTimer)) return;
    dismiss();
    event.preventDefault();
  });
  document.addEventListener('pointerdown', event => {
    if (!button.contains(event.target) && !help.contains(event.target)) dismiss();
  });
  addEventListener('scroll', event => {
    if (!help.contains(event.target)) dismiss();
  }, { capture: true, passive: true });
  addEventListener('resize', dismiss);
  addEventListener('pagehide', dismiss);
  addEventListener('pageshow', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) dismiss(); });
  new MutationObserver(dismiss).observe(document.documentElement, { attributes: true, attributeFilter: ['data-wash'] });
}
