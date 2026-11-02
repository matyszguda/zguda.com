import './income-chart.css';

const figure = document.querySelector('.income-chart');
if (figure) {
  // Both layouts use the existing SVG values, so the mobile chart cannot drift.
  const years = [...figure.querySelectorAll('.chart-year[data-mln-pln]')];
  const maximum = Math.max(...years.map(year => Number(year.dataset.mlnPln)));
  if (years.length && Number.isFinite(maximum) && maximum > 0) {
    const chart = document.createElement('ol');
    chart.className = 'income-mobile-chart';
    chart.setAttribute('role', 'list');
    chart.setAttribute('aria-label', 'Roczne przychody KISS Digital i KISS Communications w mln PLN');
    for (const year of years) {
      const row = document.createElement('li');
      row.dataset.year = year.dataset.year;
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
      row.append(label, track, value);
      chart.append(row);
    }
    figure.querySelector('.chart-scroll').after(chart);
    figure.classList.add('has-mobile-chart');
  }
}
