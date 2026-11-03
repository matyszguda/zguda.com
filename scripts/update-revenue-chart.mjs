import { readFile, writeFile } from 'node:fs/promises';
import { breakdownTable, formatMillions, sumPln } from '../src/revenue-format.js';

const root = new URL('../', import.meta.url);
const records = JSON.parse(await readFile(new URL('src/revenue-data.json', root), 'utf8'));
const sources = JSON.parse(await readFile(new URL('docs/revenue-source-rows.json', root), 'utf8'));
const totals = records.map(record => sumPln(record.digital.revenue, record.communications.revenue));
const maximum = 10;
const baseline = 270;
const plotHeight = 230;
const centers = records.map((_, i) => 110 + i * 120);
const label = 'Przychody ze sprzedaży w poszczególnych latach, 2017–2022 · mln PLN';

if (records.length !== 6 || records.some((r, i) => r.year !== 2017 + i || !Number.isFinite(totals[i]) || totals[i] <= 0 || totals[i] > maximum * 1e6 || ['digital', 'communications'].some(company => !Number.isFinite(r[company].revenue) || !Number.isFinite(r[company].netResult)))) {
  throw new Error('Invalid annual financial data or chart range.');
}
for (const record of records) {
  for (const [company, source] of [['digital', 'digital'], ['communications', 'human']]) {
    const rows = sources.companies[source].periods.find(period => period.year === record.year)?.rzis;
    if (!rows || sumPln(rows.A_I, rows.A_IV) !== record[company].revenue || rows.L !== record[company].netResult) {
      throw new Error(`${record.year} ${company}: financial data does not match the recorded income statement rows.`);
    }
  }
}

const ticks = [0, 2, 4, 6, 8, 10].map(value => `<text class="chart-tick" x="42" y="${baseline - value / maximum * plotHeight + 4}" text-anchor="end">${value}</text>`).join('');
const bars = records.map((record, i) => {
  const height = totals[i] / 1e6 / maximum * plotHeight;
  const y = baseline - height;
  const center = centers[i];
  return `<g class="chart-year" data-year="${record.year}" data-mln-pln="${totals[i] / 1e6}"><title>${record.year}: ${formatMillions(totals[i])} mln PLN przychodów ze sprzedaży</title><rect class="chart-hit-area" x="${center - 50}" y="32" width="100" height="284" fill="transparent"/><rect class="chart-bar" x="${center - 28}" y="${y.toFixed(3)}" width="56" height="${height.toFixed(3)}" fill="var(--accent)"/><text class="chart-value" x="${center}" y="${(y - 10).toFixed(3)}" text-anchor="middle">${formatMillions(totals[i])}</text><text class="chart-year-label" x="${center}" y="307" text-anchor="middle">${record.year}</text></g>`;
}).join('');

const figure = `<figure class="growth-chart income-chart"><figcaption><span class="index">KISS DIGITAL + KISS COMMUNICATIONS (HUMAN)</span><h3>Przychody roczne</h3><p>${label}</p></figcaption><p class="income-interaction-hint" hidden><span class="income-hint-desktop">Najedź na słupek, aby zobaczyć podział i wynik netto.</span><span class="income-hint-touch">Dotknij słupka, aby zobaczyć podział i wynik netto.</span></p><p class="chart-scroll-hint"><svg viewBox="0 0 18 12" width="18" height="12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1 6h16m-5-4 5 4-5 4M6 2 1 6l5 4"/></svg>Przesuń, aby zobaczyć wszystkie lata.</p><div class="chart-scroll" tabindex="0" role="region" aria-label="Wykres rocznych przychodów od 2017 do 2022 roku, przewijany poziomo na małym ekranie"><svg viewBox="0 0 760 335" role="img" aria-labelledby="chart-income-title chart-income-desc"><title id="chart-income-title">Roczne przychody KISS Digital i KISS Communications w latach 2017–2022</title><desc id="chart-income-desc">Każdy słupek to suma rocznych przychodów ze sprzedaży obu spółek, w mln PLN. ${records.map((record, i) => `${record.year}: ${formatMillions(totals[i])}`).join('; ')}. Bez kumulacji między latami i bez wyłączeń transakcji między spółkami. W pierwszym kwartale 2022 roku sprzedaż obu firm do THG. Dokładne przychody i wyniki netto znajdują się w tabelach pod wykresem.</desc>${ticks}<line class="chart-zero" x1="50" x2="750" y1="270" y2="270"/>${bars}<g class="chart-milestone" data-event-year="2022"><circle cx="710" cy="327" r="4"/></g></svg></div><p class="chart-sale-marker" data-event-year="2022"><span class="chart-sale-dot" aria-hidden="true"></span><span><strong>1 kw. 2022</strong> · Sprzedaż do THG</span></p><p class="annual-revenue-note">Każdy słupek pokazuje przychody obu firm w jednym roku. Wartości nie są sumowane narastająco między latami.</p><details class="chart-table"><summary>Dane wykresu</summary><p class="income-table-note">Pełne lata 2017–2022. Suma danych jednostkowych obu spółek, bez wyłączeń transakcji między nimi. Kwoty w PLN; wynik netto uwzględnia podatek.</p>${records.map(record => `<section class="income-data-year" aria-labelledby="income-data-${record.year}"><h4 id="income-data-${record.year}">${record.year}</h4>${breakdownTable(record)}</section>`).join('')}</details></figure>`;

const path = new URL('index.html', root);
const original = await readFile(path, 'utf8');
const start = '<!-- revenue-chart:start -->';
const end = '<!-- revenue-chart:end -->';
const a = original.indexOf(start);
const b = original.indexOf(end, a);
if (a < 0 || b < 0) throw new Error('Revenue chart markers missing.');
const next = original.slice(0, a + start.length) + figure + original.slice(b);
if (process.argv.includes('--check')) {
  if (original !== next) throw new Error('Revenue chart is stale. Run npm run charts:generate.');
  console.log('Revenue chart and tables match the financial dataset.');
} else if (original !== next) {
  await writeFile(path, next);
  console.log('Updated static revenue chart and tables.');
}
