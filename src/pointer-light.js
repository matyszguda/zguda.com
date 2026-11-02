import './pointer-light.css';

const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const root = document.documentElement;
const cursor = document.createElement('div');
cursor.className = 'laser-cursor';
cursor.setAttribute('aria-hidden', 'true');
document.body.append(cursor);
const sparkLayer = document.createElement('div');
sparkLayer.className = 'laser-sparks';
sparkLayer.setAttribute('aria-hidden', 'true');
document.body.append(sparkLayer);

const interactive = 'a[href],button,summary,input,textarea,select,[role="button"],[tabindex]:not([tabindex="-1"])';
const target = { x: 0, y: 0 };
let active = false;
let frame = 0;
let sparkTimer = 0;
const sparks = new Set();

function clickableAtPointer() {
  const element = document.elementFromPoint(target.x, target.y)?.closest(interactive);
  return element && !element.matches(':disabled,[aria-disabled="true"]') ? element : null;
}

function emitSparks(count) {
  for (let i = 0; i < count && sparks.size < 32; i++) {
    const particle = document.createElement('span');
    particle.className = 'laser-spark';
    particle.style.width = `${1 + Math.random() * .7}px`;
    particle.style.height = `${2 + Math.random() * 2}px`;
    const angle = -Math.PI * (.08 + Math.random() * .84);
    const speed = 28 + Math.random() * 60;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const gravity = 140 + Math.random() * 100;
    const duration = 360 + Math.random() * 300;
    const x = target.x + (Math.random() - .5) * 3;
    const y = target.y + (Math.random() - .5) * 3;
    sparkLayer.append(particle);
    const animation = particle.animate([0, .2, .45, .7, 1].map(progress => {
      const t = duration / 1000 * progress;
      const rotation = Math.atan2(vy + gravity * t, vx) * 180 / Math.PI + 90;
      return {
        offset: progress,
        transform: `translate3d(${x + vx * t}px,${y + vy * t + .5 * gravity * t * t}px,0) rotate(${rotation}deg) scale(${1 - progress * .75})`,
        opacity: progress === 1 ? 0 : 1 - progress * .45,
      };
    }), { duration, easing: 'linear', fill: 'forwards' });
    const entry = { particle, animation };
    sparks.add(entry);
    animation.onfinish = () => { sparks.delete(entry); particle.remove(); };
  }
}

function stopSparks(clear = false) {
  clearTimeout(sparkTimer);
  sparkTimer = 0;
  if (clear) {
    for (const { particle, animation } of sparks) { animation.cancel(); particle.remove(); }
    sparks.clear();
  }
}

function nextSparks() {
  sparkTimer = 0;
  const overControl = active && enabled.matches && !document.hidden && clickableAtPointer();
  cursor.classList.toggle('is-interactive', !!overControl);
  if (!overControl) return;
  emitSparks(2);
  sparkTimer = setTimeout(nextSparks, 85 + Math.random() * 35);
}

function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
function hide() {
  active = false;
  cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
  root.classList.remove('has-laser');
  cancelAnimationFrame(frame);
  frame = 0;
  stopSparks(true);
}
function draw() {
  frame = 0;
  if (!active || !enabled.matches) return;
  const underPointer = clickableAtPointer();
  cursor.classList.toggle('is-interactive', !!underPointer);
  cursor.style.transform = `translate3d(${target.x}px,${target.y}px,0)`;
  if (underPointer && !sparkTimer) {
    emitSparks(4);
    sparkTimer = setTimeout(nextSparks, 95);
  } else if (!underPointer) stopSparks();
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
addEventListener('pointerdown', () => {
  if (!active) return;
  cursor.classList.add('is-pressed');
  if (clickableAtPointer()) emitSparks(5);
}, { passive: true });
addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
addEventListener('pointerout', event => { if (!event.relatedTarget) hide(); });
addEventListener('blur', hide);
addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
addEventListener('scroll', () => { if (active) schedule(); }, { passive: true });
addEventListener('resize', schedule);
addEventListener('pageshow', hide);
document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
enabled.addEventListener('change', () => { if (!enabled.matches) hide(); });
