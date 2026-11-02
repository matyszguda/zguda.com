import './pointer-light.css';

const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const root = document.documentElement;
const cursor = document.createElement('div');
cursor.className = 'laser-cursor';
cursor.setAttribute('aria-hidden', 'true');
document.body.append(cursor);

const interactive = 'a[href],button,summary,input,textarea,select,[role="button"],[tabindex]:not([tabindex="-1"])';
const target = { x: 0, y: 0 };
let active = false;
let frame = 0;

function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
function hide() {
  active = false;
  cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
  root.classList.remove('has-laser');
  cancelAnimationFrame(frame);
  frame = 0;
}
function draw() {
  frame = 0;
  if (!active || !enabled.matches) return;
  const underPointer = document.elementFromPoint(target.x, target.y)?.closest(interactive);
  cursor.classList.toggle('is-interactive', !!underPointer && !underPointer.matches(':disabled,[aria-disabled="true"]'));
  cursor.style.transform = `translate3d(${target.x}px,${target.y}px,0)`;
}

addEventListener('pointermove', event => {
  if (!enabled.matches || event.pointerType !== 'mouse') { if (active) hide(); return; }
  target.x = event.clientX;
  target.y = event.clientY;
  active = true;
  cursor.classList.add('is-visible');
  root.classList.add('has-laser');
  schedule();
}, { passive: true });
addEventListener('pointerdown', () => { if (active) cursor.classList.add('is-pressed'); }, { passive: true });
addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
addEventListener('blur', hide);
addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
addEventListener('scroll', () => { if (active) schedule(); }, { passive: true });
addEventListener('resize', schedule);
addEventListener('pageshow', hide);
document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
enabled.addEventListener('change', () => { if (!enabled.matches) hide(); });
