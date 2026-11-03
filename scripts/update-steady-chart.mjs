import { readFile, writeFile } from 'node:fs/promises';
import { formatMillions } from '../src/revenue-format.js';

const root = new URL('../', import.meta.url);
const records = JSON.parse(await readFile(new URL('src/steady-data.json', root), 'utf8'));
const money = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0, style: 'currency', currency: 'PLN' });
const maximum = 2.5e6;
const baseline = 190;
const height = 154;
if (records.length !== 3 || records.some((record, i) => record.year !== 2024 + i || !Number.isFinite(record.revenue) || record.revenue <= 0 || record.revenue > maximum || !Number.isFinite(record.profit) || !['Zysk', 'Zysk netto'].includes(record.profitLabel))) {
  throw new Error('Invalid Steady chart data.');
}
const ticks = [0, 1, 2].map(value => `<text class="steady-tick" x="18" y="${baseline - value * 1e6 / maximum * height + 3}" text-anchor="end">${value}</text>`).join('');
const bars = records.map((record, i) => {
  const center = 70 + i * 96;
  const barHeight = record.revenue / maximum * height;
  const top = baseline - barHeight;
  return `<g class="steady-year" data-year="${record.year}"><title>${record.year}: przychody ${money.format(record.revenue)}; ${record.profitLabel.toLowerCase()} ${money.format(record.profit)}</title><rect class="steady-hit-area" x="${center - 40}" y="24" width="80" height="192" fill="transparent"/><rect class="steady-bar" x="${center - 21}" y="${top.toFixed(3)}" width="42" height="${barHeight.toFixed(3)}"/><text x="${center}" y="${(top - 9).toFixed(3)}" text-anchor="middle">${formatMillions(record.revenue)}</text><text x="${center}" y="213" text-anchor="middle">${record.year}</text></g>`;
}).join('');
const figure = `<figure class="steady-chart"><figcaption class="sr-only">Roczne przychody Steady w latach 2024–2026, w mln zł. Szczegóły po najechaniu, dotknięciu słupka lub wskazaniu klawiaturą.</figcaption><svg viewBox="0 0 320 225" role="img" aria-labelledby="steady-chart-title steady-chart-desc"><title id="steady-chart-title">Przychody Steady 2024–2026</title><desc id="steady-chart-desc">${records.map(record => `${record.year}: przychody ${money.format(record.revenue)}, ${record.profitLabel.toLowerCase()} ${money.format(record.profit)}`).join('. ')}.</desc><text class="steady-unit" x="0" y="12">Przychody · mln zł</text>${ticks}<line class="steady-baseline" x1="26" x2="310" y1="190" y2="190"/>${bars}</svg></figure>`;
const path = new URL('index.html', root);
const original = await readFile(path, 'utf8');
const start = '<!-- steady-chart:start -->';
const end = '<!-- steady-chart:end -->';
const a = original.indexOf(start);
const b = original.indexOf(end, a);
if (a < 0 || b < 0) throw new Error('Steady chart markers missing.');
const next = original.slice(0, a + start.length) + figure + original.slice(b);
if (process.argv.includes('--check')) {
  if (original !== next) throw new Error('Steady chart is stale. Run npm run charts:generate.');
  console.log('Steady chart matches its dataset.');
} else if (original !== next) {
  await writeFile(path, next);
  console.log('Updated static Steady chart.');
}
