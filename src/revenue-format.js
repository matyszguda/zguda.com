const amount = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const millions = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPln = value => amount.format(value).replace('-', '−');
export const formatMillions = value => millions.format(value / 1_000_000);
export const sumPln = (a, b) => Math.round((a + b) * 100) / 100;
export const hasBreakdown = record => Boolean(record.digital && record.communications);
export const annualRevenue = record => hasBreakdown(record)
  ? sumPln(record.digital.revenue, record.communications.revenue)
  : record.totalRevenue;
export const detailNote = record => hasBreakdown(record)
  ? 'Wynik netto: zysk / − strata.'
  : 'Dla tego roku dostępny jest łączny przychód. Podział na spółki i wynik netto są dostępne od 2017 roku.';

// Shared by the static, no-JavaScript tables and the interactive detail panel.
export function breakdownTable(record) {
  if (!hasBreakdown(record)) {
    return `<table class="income-breakdown"><caption class="sr-only">${record.year}: roczne przychody, w PLN</caption><tbody><tr class="income-total"><th scope="row">Przychody roczne · PLN</th><td>${formatPln(annualRevenue(record))}</td></tr></tbody></table>`;
  }
  const rows = [
    ['KISS digital', record.digital],
    ['KISS communications', record.communications],
    ['Razem', {
      revenue: sumPln(record.digital.revenue, record.communications.revenue),
      netResult: sumPln(record.digital.netResult, record.communications.netResult),
    }],
  ];
  return `<table class="income-breakdown"><caption class="sr-only">${record.year}: przychody ze sprzedaży i wynik netto, w PLN</caption><thead><tr><th scope="col">Spółka</th><th scope="col">Przychody<br>PLN</th><th scope="col">Wynik netto<br>PLN</th></tr></thead><tbody>${rows.map(([name, values]) => `<tr${name === 'Razem' ? ' class="income-total"' : ''}><th scope="row">${name}</th><td>${formatPln(values.revenue)}</td><td>${formatPln(values.netResult)}</td></tr>`).join('')}</tbody></table>`;
}
