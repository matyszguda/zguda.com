import './cieplo-metrics.css';
import { chartTooltip } from './chart-tooltip.js';

const figure = document.querySelector('.cieplo-metrics');
if (figure) {
  const triggers = [...figure.querySelectorAll('.cieplo-metric')];
  chartTooltip({
    figure,
    triggers,
    id: 'cieplo-tooltip',
    className: 'cieplo-tooltip',
    describe: trigger => {
      const value = trigger.querySelector('strong').textContent.trim();
      const label = trigger.querySelector('span').textContent.trim();
      return `${value} ${label}. Pokaż okres danych.`;
    },
    render: () => '<p>Dane za 12 miesięcy na dzień 04.11.2026.</p>',
  });
  // Keep native titles as the no-JavaScript fallback until enhancement succeeds.
  for (const trigger of triggers) trigger.removeAttribute('title');
}
