const paths = {
  'up-right': 'M5 19 19 5M5 5h14v14',
  up: 'M12 20V4M5 11l7-7 7 7',
  down: 'M12 4v16M5 13l7 7 7-7',
  left: 'M20 12H4M11 5l-7 7 7 7',
};

// Use the same vector in generated links and static HTML, independent of fonts.
export function arrowIcon(direction = 'up-right') {
  if (!(direction in paths)) throw new Error(`Unknown arrow direction: ${direction}`);
  return `<svg class="link-arrow" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="${paths[direction]}"/></svg>`;
}
