import test from 'node:test';
import assert from 'node:assert/strict';
import { borschtCountAt, nextCounterRefreshDelay } from '../src/cieplo-counter.js';

test('starts with the supplied total and adds once per Warsaw calendar day', () => {
  for (const [iso, expected] of [
    ['2026-11-03T12:00:00Z', 38632],
    ['2026-11-04T00:00:00Z', 38632],
    ['2026-11-04T22:59:59Z', 38632],
    ['2026-11-04T23:00:00Z', 38661],
    ['2026-11-05T23:00:00Z', 38690],
    ['2026-12-31T23:00:00Z', 40314],
  ]) assert.equal(borschtCountAt(new Date(iso)), expected, iso);
});

test('handles daylight-saving changes and leap years without extra increments', () => {
  for (const [iso, expected] of [
    ['2027-03-27T23:00:00Z', 42808],
    ['2027-03-28T00:59:59Z', 42808],
    ['2027-03-28T01:00:00Z', 42808],
    ['2027-03-28T22:00:00Z', 42837],
    ['2027-10-31T00:59:59Z', 49101],
    ['2027-10-31T01:00:00Z', 49101],
    ['2027-10-31T23:00:00Z', 49130],
    ['2028-02-28T23:00:00Z', 52610],
  ]) assert.equal(borschtCountAt(new Date(iso)), expected, iso);
});

test('refreshes at midnight and rechecks within an hour for clock changes', () => {
  assert.equal(nextCounterRefreshDelay(new Date('2026-11-04T22:59:59.500Z')), 550);
  assert.equal(nextCounterRefreshDelay(new Date('2026-11-04T12:00:00Z')), 3_600_000);
});
