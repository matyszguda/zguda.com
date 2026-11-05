import { currentLocale, t } from './i18n.js';

const amount = new Intl.NumberFormat(currentLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const millions = new Intl.NumberFormat(currentLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPln = value => amount.format(value).replace('-', '−');
export const formatMillions = value => millions.format(value / 1_000_000);
export const sumPln = (a, b) => Math.round((a + b) * 100) / 100;
export const hasBreakdown = record => Boolean(record.digital && record.communications);
export const annualRevenue = record => hasBreakdown(record)
  ? sumPln(record.digital.revenue, record.communications.revenue)
  : record.totalRevenue;
export const detailNote = record => hasBreakdown(record)
  ? t('Wynik netto: zysk / − strata.', 'Net result: profit / − loss.')
  : t('Dla tego roku dostępny jest łączny przychód. Podział na spółki i wynik netto są dostępne od 2017 roku.', 'Only total revenue is available for this year. Company breakdowns and net results are available from 2017.');

// Shared by the static, no-JavaScript tables and the interactive detail panel.
export function breakdownTable(record) {
  if (!hasBreakdown(record)) {
    return `<table class="income-breakdown"><caption class="sr-only">${record.year}: ${t('roczne przychody, w PLN', 'annual revenue, in PLN')}</caption><tbody><tr class="income-total"><th scope="row">${t('Przychody roczne · PLN', 'Annual revenue · PLN')}</th><td>${formatPln(annualRevenue(record))}</td></tr></tbody></table>`;
  }
  const totalLabel = t('Razem', 'Total');
  const rows = [
    ['KISS digital', record.digital],
    ['KISS communications', record.communications],
    [totalLabel, {
      revenue: sumPln(record.digital.revenue, record.communications.revenue),
      netResult: sumPln(record.digital.netResult, record.communications.netResult),
    }],
  ];
  return `<table class="income-breakdown"><caption class="sr-only">${record.year}: ${t('przychody ze sprzedaży i wynik netto, w PLN', 'sales revenue and net result, in PLN')}</caption><thead><tr><th scope="col">${t('Spółka', 'Company')}</th><th scope="col">${t('Przychody', 'Revenue')}<br>PLN</th><th scope="col">${t('Wynik netto', 'Net result')}<br>PLN</th></tr></thead><tbody>${rows.map(([name, values]) => `<tr${name === totalLabel ? ' class="income-total"' : ''}><th scope="row">${name}</th><td>${formatPln(values.revenue)}</td><td>${formatPln(values.netResult)}</td></tr>`).join('')}</tbody></table>`;
}
