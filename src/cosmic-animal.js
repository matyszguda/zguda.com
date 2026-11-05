import './cosmic-animal.css';
import deerURL from './assets/cosmic-deer.svg';

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const edges = ['left', 'bottom', 'right', 'top'];
let orbits;
let peekLayer;
let deer;
let motion;
let animation;
let timer;
let active = false;
let previousEdge = -1;
let fadeOnExit = true;

function createScene() {
  orbits = document.createElement('div');
  orbits.className = 'cosmic-orbits';
  orbits.setAttribute('aria-hidden', 'true');
  const positions = [
    [-8, 5, 'clamp(180px,28vw,420px)', .45, 30, -13, 110, 80, 'soft'],
    [80, 22, 'clamp(140px,24vw,360px)', .48, 26, -16, -95, 110, ''],
    [12, 68, 'clamp(65px,10vw,140px)', .55, 23, -9, 85, -100, 'ringed'],
    [62, 75, 'clamp(100px,16vw,230px)', .35, 34, -23, -120, -65, 'soft'],
    [49, -6, 'clamp(38px,6vw,85px)', .5, 21, -18, -65, 90, ''],
    [37, 46, 'clamp(45px,7vw,100px)', .28, 28, -5, 100, 75, 'soft'],
    [92, 82, 'clamp(32px,5vw,68px)', .6, 22, -11, -70, -65, ''],
  ];
  for (const [x, y, size, opacity, duration, delay, dx, dy, style] of positions) {
    const orb = document.createElement('span');
    orb.className = `cosmic-orb${style ? ` cosmic-orb--${style}` : ''}`;
    orb.style.cssText = `left:${x}%;top:${y}%;--orb-size:${size};--orb-opacity:${opacity};--orb-duration:${duration}s;--orb-delay:${delay}s;--orb-x:${dx}px;--orb-y:${dy}px`;
    orbits.append(orb);
  }
  peekLayer = document.createElement('div');
  peekLayer.className = 'cosmic-peek-layer';
  peekLayer.setAttribute('aria-hidden', 'true');
  deer = document.createElement('div');
  deer.className = 'cosmic-deer';
  motion = document.createElement('div');
  motion.className = 'cosmic-deer-motion';
  const image = document.createElement('img');
  image.src = deerURL;
  image.alt = '';
  image.draggable = false;
  image.width = 260;
  image.height = 283;
  motion.append(image);
  deer.append(motion);
  peekLayer.append(deer);
  document.body.append(orbits);
  // The header's isolated stacking context puts the deer above its paper
  // background while keeping navigation and controls in front of the artwork.
  (document.querySelector('header') ?? document.body).append(peekLayer);
}

function stopPeek() {
  clearTimeout(timer);
  timer = null;
  animation?.cancel();
  animation = null;
}

function schedulePeek(delay = 4800 + Math.random() * 4300) {
  if (active && !document.hidden && !reducedMotion.matches) timer = setTimeout(peek, delay);
}

function peek() {
  timer = null;
  if (!active || document.hidden || reducedMotion.matches) return;
  const edgeIndex = (previousEdge + 1 + Math.floor(Math.random() * 3)) % edges.length;
  previousEdge = edgeIndex;
  const edge = edges[edgeIndex];
  deer.dataset.edge = edge;
  // Top peeks stay away from the right-hand menu, washer and language control.
  deer.style.setProperty('--peek-position', `${edge === 'top' ? 20 + Math.random() * 43 : 22 + Math.random() * 57}%`);
  const horizontal = edge === 'left' || edge === 'right';
  const sign = edge === 'left' || edge === 'top' ? -1 : 1;
  const axis = horizontal ? 'X' : 'Y';
  const hidden = `translate${axis}(${sign * 108}%) rotate(${sign * 9}deg)`;
  const visible = `translate${axis}(${sign * 17}%) rotate(${sign * -3}deg)`;
  const fading = fadeOnExit;
  fadeOnExit = !fadeOnExit;
  const softMotion = 'cubic-bezier(.45,0,.2,1)';
  animation = motion.animate([
    { offset: 0, transform: hidden, opacity: 0, easing: softMotion },
    { offset: .34, transform: visible, opacity: 1, easing: 'linear' },
    { offset: .66, transform: visible, opacity: 1, easing: fading ? 'ease-in-out' : softMotion },
    { offset: 1, transform: fading ? visible : hidden, opacity: fading ? 0 : 1 },
  ], { duration: 4400, easing: 'linear', fill: 'both' });
  animation.onfinish = () => {
    animation?.cancel();
    animation = null;
    schedulePeek();
  };
}

function syncScene() {
  const next = root.dataset.wash === 'cosmic-animal';
  const entering = next && !active;
  active = next;
  stopPeek();
  if (!next) {
    if (orbits) orbits.hidden = peekLayer.hidden = true;
    return;
  }
  if (!orbits) createScene();
  orbits.hidden = peekLayer.hidden = false;
  orbits.classList.toggle('is-paused', document.hidden);
  if (!document.hidden && !reducedMotion.matches) schedulePeek(entering ? 1000 : 1800);
}

new MutationObserver(syncScene).observe(root, { attributes: true, attributeFilter: ['data-wash'] });
document.addEventListener('visibilitychange', syncScene);
reducedMotion.addEventListener('change', syncScene);
addEventListener('pagehide', stopPeek);
addEventListener('pageshow', syncScene);
syncScene();
