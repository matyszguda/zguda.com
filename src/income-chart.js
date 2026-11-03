import './income-chart.css';
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

  const tooltip = document.createElement('div');
  tooltip.className = 'income-tooltip';
  tooltip.id = 'income-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);

  const triggers = [...years, ...chart.querySelectorAll('button')];
  let active = null;
  let pinned = false;
  let hideTimer;
  let positionFrame = 0;

  function close() {
    clearTimeout(hideTimer);
    cancelAnimationFrame(positionFrame);
    positionFrame = 0;
    if (active) {
      active.classList.remove('is-active');
      active.setAttribute('aria-expanded', 'false');
      active.removeAttribute('aria-describedby');
    }
    active = null;
    pinned = false;
    tooltip.hidden = true;
    figure.classList.remove('is-highlighting');
  }

  function position() {
    positionFrame = 0;
    if (!active) return;
    const anchor = active.getBoundingClientRect();
    if (anchor.bottom < 0 || anchor.top > innerHeight || !anchor.width) {
      close();
      return;
    }
    const box = tooltip.getBoundingClientRect();
    const left = Math.max(12, Math.min(innerWidth - box.width - 12, anchor.left + anchor.width / 2 - box.width / 2));
    let top = anchor.top - box.height - 10;
    if (top < 12) top = anchor.bottom + 10;
    top = Math.max(12, Math.min(innerHeight - box.height - 12, top));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function open(trigger, pin = false) {
    clearTimeout(hideTimer);
    const record = byYear.get(trigger.dataset.year);
    if (!record) return;
    if (active !== trigger) {
      close();
      const total = annualRevenue(record);
      tooltip.innerHTML = `<div class="income-tooltip-heading"><span>Rok ${record.year}</span><strong>${formatMillions(total)} <small>mln PLN</small></strong></div>${breakdownTable(record)}<p>${detailNote(record)}${record.year === 2022 ? '<br>1 kw. 2022 · Sprzedaż do THG. Dane za cały rok.' : ''}</p>`;
      active = trigger;
      active.classList.add('is-active');
      active.setAttribute('aria-expanded', 'true');
      tooltip.hidden = false;
      active.setAttribute('aria-describedby', tooltip.id);
      figure.classList.add('is-highlighting');
    }
    pinned = pin;
    position();
  }

  function deferClose() {
    if (pinned || active?.matches(':focus-visible')) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(close, 180);
  }

  function toggle(trigger) {
    if (active === trigger && pinned) close();
    else open(trigger, true);
  }

  for (const trigger of triggers) {
    trigger.classList.add('income-trigger');
    trigger.setAttribute('aria-controls', tooltip.id);
    trigger.setAttribute('aria-expanded', 'false');
    const record = byYear.get(trigger.dataset.year);
    trigger.setAttribute('aria-label', `${record.year}: ${formatMillions(annualRevenue(record))} mln PLN przychodów. ${hasBreakdown(record) ? 'Pokaż podział i wynik netto.' : 'Pokaż łączny przychód. Podział i wynik netto są dostępne od 2017 roku.'}`);
    if (trigger.tagName.toLowerCase() === 'g') {
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      // The custom panel replaces the browser's duplicate native tooltip.
      trigger.querySelector('title')?.remove();
      trigger.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        toggle(trigger);
      });
    }
    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') open(trigger, active === trigger && pinned);
    });
    trigger.addEventListener('pointerleave', deferClose);
    trigger.addEventListener('focus', () => {
      if (trigger.matches(':focus-visible')) open(trigger);
    });
    trigger.addEventListener('blur', () => {
      if (active === trigger) close();
    });
    trigger.addEventListener('click', () => toggle(trigger));
  }

  tooltip.addEventListener('pointerenter', () => clearTimeout(hideTimer));
  tooltip.addEventListener('pointerleave', deferClose);
  document.addEventListener('pointerdown', event => {
    if (active && !active.contains(event.target) && !tooltip.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      close();
      event.preventDefault();
    }
  });
  window.addEventListener('scroll', () => {
    if (active && !positionFrame) positionFrame = requestAnimationFrame(position);
  }, { capture: true, passive: true });
  window.addEventListener('resize', close);
  document.addEventListener('visibilitychange', () => { if (document.hidden) close(); });
}
