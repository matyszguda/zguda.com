export const BORSCHT_BASE_COUNT = 38632;
export const BORSCHT_DAILY_INCREMENT = 29;
const dayMs = 86_400_000;
const baseDay = Date.UTC(2026, 10, 4) / dayMs;
const clock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function warsawParts(date) {
  return Object.fromEntries(clock.formatToParts(date)
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, Number(part.value)]));
}

export function borschtCountAt(date = new Date()) {
  const { year, month, day } = warsawParts(date);
  const elapsedDays = Math.max(0, Date.UTC(year, month - 1, day) / dayMs - baseDay);
  return BORSCHT_BASE_COUNT + elapsedDays * BORSCHT_DAILY_INCREMENT;
}

export function nextCounterRefreshDelay(date = new Date()) {
  const { hour, minute, second } = warsawParts(date);
  const untilMidnight = (86_400 - hour * 3600 - minute * 60 - second) * 1000 - date.getMilliseconds();
  // Recheck hourly so clock and daylight-saving changes cannot skip midnight.
  return Math.min(untilMidnight + 50, 3_600_000);
}
