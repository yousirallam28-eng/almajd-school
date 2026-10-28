import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateMonthlyQuranUsage, monthKeyForDate, monthRange, scoreFromCounts } from '../src/features/wafdeen/model.js';

test('monthly report period runs from the 15th through the 14th of the next month', () => {
  assert.deepEqual(monthRange('2026-10'), { start: '2026-10-15', end: '2026-11-14' });
  assert.equal(monthKeyForDate('2026-10-15'), '2026-10');
  assert.equal(monthKeyForDate('2026-11-14'), '2026-10');
  assert.equal(monthKeyForDate('2026-11-15'), '2026-11');
  assert.equal(monthKeyForDate('2026-01-03'), '2025-12');
});

test('Wafdeen grading follows the current deduction weights and never drops below zero', () => {
  assert.equal(scoreFromCounts(1, 2, 2), 7.5);
  assert.equal(scoreFromCounts(12, 0, 0), 0);
  assert.equal(scoreFromCounts(-2, -1, -1), 10);
});

test('monthly Quran report sums only recitation usage within its period', () => {
  const rows = aggregateMonthlyQuranUsage([
    { id: 'a', dateISO: '2026-10-15', category: 'quran', teacherUsername: 'ahmed', sessionSeconds: 600 },
    { id: 'b', dateISO: '2026-11-14', category: 'quran_session', teacherUsername: 'ahmed', seconds: 300 },
    { id: 'c', dateISO: '2026-11-15', category: 'quran', teacherUsername: 'ahmed', seconds: 900 },
    { id: 'd', dateISO: '2026-10-20', category: 'educational', teacherUsername: 'ahmed', sessionSeconds: 1200 },
    { id: 'e', dateISO: '2026-10-21', category: 'unknown', teacherUsername: 'ahmed', sessionSeconds: 500 },
    { id: 'f', dateISO: '2026-10-21', category: 'quran', teacherUsername: 'sara', seconds: 120 }
  ], '2026-10');
  assert.deepEqual(rows.map(({ teacher, sessionSeconds, sessions }) => ({ teacher, sessionSeconds, sessions })), [
    { teacher: 'ahmed', sessionSeconds: 900, sessions: 2 },
    { teacher: 'sara', sessionSeconds: 120, sessions: 1 }
  ]);
});
