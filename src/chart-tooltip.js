let dismissCurrent = null;

// One detail panel at a time, shared by the revenue charts.
export function chartTooltip({ figure, triggers, id, render, describe, className = '' }) {
  const tooltip = document.createElement('div');
  tooltip.className = `income-tooltip ${className}`.trim();
  tooltip.id = id;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);
  let active = null;
  let pinned = false;
  let hideTimer;
  let positionFrame = 0;

  function close() {
    clearTimeout(hideTimer);
    cancelAnimationFrame(positionFrame);
    positionFrame = 0;
    if (active) {
      active.classList.remove('is-active');
      active.setAttribute('aria-expanded', 'false');
      active.removeAttribute('aria-describedby');
    }
    active = null;
    pinned = false;
    tooltip.hidden = true;
    figure.classList.remove('is-highlighting');
    if (dismissCurrent === close) dismissCurrent = null;
  }

  function position() {
    positionFrame = 0;
    if (!active) return;
    const anchor = active.getBoundingClientRect();
    if (anchor.bottom < 0 || anchor.top > innerHeight || !anchor.width) {
      close();
      return;
    }
    const box = tooltip.getBoundingClientRect();
    const left = Math.max(12, Math.min(innerWidth - box.width - 12, anchor.left + anchor.width / 2 - box.width / 2));
    let top = anchor.top - box.height - 10;
    if (top < 12) top = anchor.bottom + 10;
    top = Math.max(12, Math.min(innerHeight - box.height - 12, top));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function open(trigger, pin = false) {
    clearTimeout(hideTimer);
    if (active !== trigger) {
      close();
      dismissCurrent?.();
      tooltip.innerHTML = render(trigger);
      active = trigger;
      active.classList.add('is-active');
      active.setAttribute('aria-expanded', 'true');
      tooltip.hidden = false;
      active.setAttribute('aria-describedby', tooltip.id);
      figure.classList.add('is-highlighting');
      dismissCurrent = close;
    }
    pinned = pin;
    position();
  }

  function deferClose() {
    if (pinned || active?.matches(':focus-visible')) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(close, 180);
  }

  function toggle(trigger) {
    if (active === trigger && pinned) close();
    else open(trigger, true);
  }

  for (const trigger of triggers) {
    trigger.setAttribute('aria-controls', tooltip.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', describe(trigger));
    if (trigger.tagName.toLowerCase() === 'g') {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.querySelector('title')?.remove();
      trigger.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        toggle(trigger);
      });
    }
    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') open(trigger, active === trigger && pinned);
    });
    trigger.addEventListener('pointerleave', deferClose);
    trigger.addEventListener('focus', () => {
      if (trigger.matches(':focus-visible')) open(trigger);
    });
    trigger.addEventListener('blur', () => {
      if (active === trigger) close();
    });
    trigger.addEventListener('click', () => toggle(trigger));
  }
  tooltip.addEventListener('pointerenter', () => clearTimeout(hideTimer));
  tooltip.addEventListener('pointerleave', deferClose);
  document.addEventListener('pointerdown', event => {
    if (active && !active.contains(event.target) && !tooltip.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      close();
      event.preventDefault();
    }
  });
  window.addEventListener('scroll', () => {
    if (active && !positionFrame) positionFrame = requestAnimationFrame(position);
  }, { capture: true, passive: true });
  window.addEventListener('resize', close);
  document.addEventListener('visibilitychange', () => { if (document.hidden) close(); });
}
