import './steady-chart.css';
import records from './steady-data.json';
import { chartTooltip } from './chart-tooltip.js';
import { currentLocale, t } from './i18n.js';

const figure = document.querySelector('.steady-chart');
if (figure) {
  const money = new Intl.NumberFormat(currentLocale(), { maximumFractionDigits: 0, style: 'currency', currency: 'PLN' });
  const byYear = new Map(records.map(record => [String(record.year), record]));
  figure.querySelector('svg').setAttribute('role', 'group');
  chartTooltip({
    figure,
    triggers: [...figure.querySelectorAll('.steady-year')],
    id: 'steady-tooltip',
    className: 'steady-tooltip',
    describe: trigger => {
      const record = byYear.get(trigger.dataset.year);
      return `${record.year}: ${t('przychody', 'revenue')} ${money.format(record.revenue)}. ${t('Pokaż przychody i zysk.', 'Show revenue and profit.')}`;
    },
    render: trigger => {
      const record = byYear.get(trigger.dataset.year);
      const profitLabel = t(record.profitLabel, record.profitLabel === 'Zysk netto' ? 'Net profit' : 'Profit');
      return `<p class="steady-tooltip-year">${record.year}</p><dl class="steady-tooltip-values"><div><dt>${t('Przychody', 'Revenue')}</dt><dd>${money.format(record.revenue)}</dd></div><div><dt>${profitLabel}</dt><dd>${money.format(record.profit)}</dd></div></dl>`;
    },
  });
}
