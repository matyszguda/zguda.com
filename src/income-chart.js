import './income-chart.css';
import { chartTooltip } from './chart-tooltip.js';
import records from './revenue-data.json';
import { annualRevenue, breakdownTable, detailNote, formatMillions, hasBreakdown } from './revenue-format.js';

const figure = document.querySelector('.income-chart');
if (figure) {
  const byYear = new Map(records.map(record => [String(record.year), record]));
  const years = [...figure.querySelectorAll('.chart-year[data-mln-pln]')];
  const maximum = Math.max(...years.map(year => Number(year.dataset.mlnPln)));
  const chart = document.createElement('ol');
  chart.className = 'income-mobile-chart';
  chart.setAttribute('aria-label', 'Roczne przychody KISS Digital i KISS Communications w mln PLN');

  for (const year of years) {
    const row = document.createElement('li');
    row.dataset.year = year.dataset.year;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'income-mobile-row';
    button.dataset.year = year.dataset.year;
    const label = document.createElement('span');
    label.className = 'income-mobile-year-label';
    label.textContent = year.dataset.year;
    const track = document.createElement('span');
    track.className = 'income-mobile-track';
    track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('span');
    bar.className = 'income-mobile-bar';
    bar.style.width = `${Number(year.dataset.mlnPln) / maximum * 100}%`;
    track.append(bar);
    const value = document.createElement('span');
    value.className = 'income-mobile-value';
    value.textContent = year.querySelector('.chart-value').textContent;
    button.append(label, track, value);
    row.append(button);
    chart.append(row);
  }
  figure.querySelector('.chart-scroll').after(chart);
  figure.classList.add('has-mobile-chart');
  figure.querySelector('.income-interaction-hint').hidden = false;
  figure.querySelector('svg[aria-labelledby]').setAttribute('role', 'group');

  const triggers = [...years, ...chart.querySelectorAll('button')];
  for (const trigger of triggers) trigger.classList.add('income-trigger');
  chartTooltip({
    figure,
    triggers,
    id: 'income-tooltip',
    describe: trigger => {
      const record = byYear.get(trigger.dataset.year);
      return `${record.year}: ${formatMillions(annualRevenue(record))} mln PLN przychodów. ${hasBreakdown(record) ? 'Pokaż podział i wynik netto.' : 'Pokaż łączny przychód. Podział i wynik netto są dostępne od 2017 roku.'}`;
    },
    render: trigger => {
      const record = byYear.get(trigger.dataset.year);
      const total = annualRevenue(record);
      return `<div class="income-tooltip-heading"><span>Rok ${record.year}</span><strong>${formatMillions(total)} <small>mln PLN</small></strong></div>${breakdownTable(record)}<p>${detailNote(record)}${record.year === 2022 ? '<br>1 kw. 2022 · Sprzedaż do THG. Dane za cały rok.' : ''}</p>`;
    },
  });
}
