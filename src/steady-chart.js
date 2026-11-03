import './steady-chart.css';
import records from './steady-data.json';
import { chartTooltip } from './chart-tooltip.js';

const figure = document.querySelector('.steady-chart');
if (figure) {
  const money = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0, style: 'currency', currency: 'PLN' });
  const byYear = new Map(records.map(record => [String(record.year), record]));
  figure.querySelector('svg').setAttribute('role', 'group');
  chartTooltip({
    figure,
    triggers: [...figure.querySelectorAll('.steady-year')],
    id: 'steady-tooltip',
    className: 'steady-tooltip',
    describe: trigger => {
      const record = byYear.get(trigger.dataset.year);
      return `${record.year}: przychody ${money.format(record.revenue)}. Pokaż przychody i zysk.`;
    },
    render: trigger => {
      const record = byYear.get(trigger.dataset.year);
      return `<p class="steady-tooltip-year">${record.year}</p><dl class="steady-tooltip-values"><div><dt>Przychody</dt><dd>${money.format(record.revenue)}</dd></div><div><dt>${record.profitLabel}</dt><dd>${money.format(record.profit)}</dd></div></dl>`;
    },
  });
}
