import './team-chart.css';

const chart = document.querySelector('.team-chart');
if (chart) {
  const svg = chart.querySelector('svg');
  const years = [...chart.querySelectorAll('.chart-year')];
  let hovered = null;
  let focused = null;
  let tapped = null;
  let tapTimer;

  // Individual years stay readable to assistive technology once focusable.
  svg.setAttribute('role', 'group');
  function update() {
    const active = hovered || focused || tapped;
    chart.classList.toggle('is-highlighting', !!active);
    for (const year of years) year.classList.toggle('is-active', year === active);
  }

  for (const year of years) {
    year.setAttribute('tabindex', '0');
    year.setAttribute('role', 'img');
    year.setAttribute('aria-label', year.querySelector('.chart-bar title').textContent);
    year.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = year;
      update();
    });
    year.addEventListener('pointerleave', () => {
      if (hovered === year) hovered = null;
      update();
    });
    year.addEventListener('focusin', () => {
      if (year.matches(':focus-visible')) focused = year;
      update();
    });
    year.addEventListener('focusout', () => {
      if (focused === year) focused = null;
      update();
    });
    year.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch') return;
      clearTimeout(tapTimer);
      tapped = year;
      update();
      tapTimer = setTimeout(() => { tapped = null; update(); }, 750);
    }, { passive: true });
  }
}
