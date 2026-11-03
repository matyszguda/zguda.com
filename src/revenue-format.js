const amount = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const millions = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPln = value => amount.format(value).replace('-', '−');
export const formatMillions = value => millions.format(value / 1_000_000);
export const sumPln = (a, b) => Math.round((a + b) * 100) / 100;

// Shared by the static, no-JavaScript tables and the interactive detail panel.
export function breakdownTable(record) {
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
