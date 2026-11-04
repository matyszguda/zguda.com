import './cieplo-metrics.css';
import { chartTooltip } from './chart-tooltip.js';
import { borschtCountAt, nextCounterRefreshDelay } from './cieplo-counter.js';

const figure = document.querySelector('.cieplo-metrics');
if (figure) {
  const triggers = [...figure.querySelectorAll('.cieplo-metric')];
  const borscht = figure.querySelector('[data-metric="borscht"]');
  const formatCount = new Intl.NumberFormat('pl-PL');
  const describe = trigger => {
    const value = trigger.querySelector('strong').textContent.trim();
    const label = trigger.querySelector('span').textContent.trim();
    return `${value} ${label}. Pokaż okres danych.`;
  };
  let refreshTimer;
  function refreshCounter() {
    clearTimeout(refreshTimer);
    const now = new Date();
    borscht.querySelector('strong').textContent = formatCount.format(borschtCountAt(now));
    borscht.setAttribute('aria-label', describe(borscht));
    if (!document.hidden) refreshTimer = setTimeout(refreshCounter, nextCounterRefreshDelay(now));
  }
  refreshCounter();
  chartTooltip({
    figure,
    triggers,
    id: 'cieplo-tooltip',
    className: 'cieplo-tooltip',
    describe,
    render: trigger => trigger === borscht
      ? '<p>Od początku działania restauracji w grudniu 2022. Stan na 04.11.2026: 38 632 porcje. Od tej daty licznik rośnie automatycznie o 29 porcji dziennie.</p>'
      : '<p>Dane za 12 miesięcy na dzień 04.11.2026.</p>',
  });
  // Keep native titles as the no-JavaScript fallback until enhancement succeeds.
  for (const trigger of triggers) trigger.removeAttribute('title');
  document.addEventListener('visibilitychange', refreshCounter);
  window.addEventListener('pageshow', refreshCounter);
}
