import './pointer-light.css';
import { createLogoRelief, loadReliefData } from './logo-relief.js';

const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const root = document.documentElement;
const cursor = document.createElement('div');
cursor.className = 'laser-cursor';
cursor.setAttribute('aria-hidden', 'true');
document.body.append(cursor);

const interactive = 'a[href],button,summary,input,textarea,select,[role="button"],[tabindex]:not([tabindex="-1"])';
const target = { x: 0, y: 0 };
const light = { x: 0, y: 0 };
let active = false;
let strength = 0;
let frame = 0;
let loading = false;
let renderers = [];

function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
function hide() {
  active = false;
  cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
  root.classList.remove('has-laser');
  schedule();
}
function draw() {
  frame = 0;
  const desired = active && enabled.matches ? 1 : 0;
  light.x += (target.x - light.x) * .25;
  light.y += (target.y - light.y) * .25;
  strength += (desired - strength) * .2;
  if (Math.abs(desired - strength) < .001) strength = desired;
  const underPointer = active ? document.elementFromPoint(target.x, target.y)?.closest(interactive) : null;
  cursor.classList.toggle('is-interactive', !!underPointer && !underPointer.matches(':disabled,[aria-disabled="true"]'));
  cursor.style.transform = `translate3d(${target.x}px,${target.y}px,0)`;
  for (const renderer of renderers) renderer.render(light, strength);
  if (Math.abs(desired - strength) > .001 || Math.hypot(target.x - light.x, target.y - light.y) > .2) schedule();
}

async function prepareRelief() {
  if (loading) return;
  loading = true;
  try {
    const data = await loadReliefData();
    if (!enabled.matches) { loading = false; return; }
    renderers = (await Promise.all([...document.querySelectorAll('.site-wordmark')].map(anchor => createLogoRelief(anchor, data)))).filter(Boolean);
    strength = 0;
    const visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const renderer = renderers.find(item => item.anchor === entry.target);
        if (renderer) renderer.visible = entry.isIntersecting;
      }
      schedule();
    });
    const size = new ResizeObserver(schedule);
    for (const renderer of renderers) {
      visibility.observe(renderer.anchor);
      size.observe(renderer.anchor);
    }
    schedule();
  } catch { /* Original bitmap remains visible when enhancement is unavailable. */ }
}

addEventListener('pointermove', event => {
  if (!enabled.matches || event.pointerType !== 'mouse') { if (active) hide(); return; }
  if (!active) { light.x = event.clientX; light.y = event.clientY; }
  target.x = event.clientX;
  target.y = event.clientY;
  active = true;
  cursor.classList.add('is-visible');
  root.classList.add('has-laser');
  prepareRelief();
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
