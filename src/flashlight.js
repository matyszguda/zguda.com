import './flashlight.css';

const root = document.documentElement;
const shade = document.createElement('div');
shade.className = 'flashlight-shade';
shade.setAttribute('aria-hidden', 'true');
document.body.append(shade);

let active = false;
let frame = 0;
let pointerKnown = false;
let keyboardInput = false;
let x = innerWidth / 2;
let y = Math.min(160, innerHeight / 3);
let focusTarget = null;

function draw() {
  frame = 0;
  if (!active || document.hidden) return;
  if (focusTarget?.isConnected) {
    const rect = focusTarget.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }
  const left = Math.max(0, Math.min(innerWidth, x));
  const top = Math.max(0, Math.min(innerHeight, y));
  shade.style.setProperty('--flashlight-x', `${left}px`);
  shade.style.setProperty('--flashlight-y', `${top}px`);
}

function schedule() {
  if (active && !frame) frame = requestAnimationFrame(draw);
}

function syncMode() {
  const next = root.dataset.wash === 'flashlight';
  if (!next) {
    active = false;
    cancelAnimationFrame(frame);
    frame = 0;
    focusTarget = null;
    return;
  }
  if (!active) {
    const focused = document.activeElement;
    focusTarget = (keyboardInput || !pointerKnown) && focused?.matches('a[href],button,summary,input,textarea,select,[tabindex]') ? focused : null;
    if (!focusTarget && !pointerKnown) {
      x = innerWidth / 2;
      y = Math.min(160, innerHeight / 3);
    }
  }
  active = true;
  schedule();
}

// Keep the last pointer location ready for switching modes, without rendering
// or running an animation loop while this wash is inactive.
function trackPointer(event) {
  pointerKnown = true;
  keyboardInput = false;
  focusTarget = null;
  x = event.clientX;
  y = event.clientY;
  schedule();
}
addEventListener('pointermove', trackPointer, { passive: true });
addEventListener('pointerdown', trackPointer, { passive: true });
document.addEventListener('keydown', event => {
  if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) keyboardInput = true;
});
document.addEventListener('focusin', event => {
  if (!active || !keyboardInput || !(event.target instanceof Element)) return;
  focusTarget = event.target;
  schedule();
});
addEventListener('scroll', () => { if (focusTarget) schedule(); }, { passive: true });
addEventListener('resize', schedule);
addEventListener('pageshow', syncMode);
document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
new MutationObserver(syncMode).observe(root, { attributes: true, attributeFilter: ['data-wash'] });
syncMode();
