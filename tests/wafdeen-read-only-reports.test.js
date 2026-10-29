import test from 'node:test';
import assert from 'node:assert/strict';
import { reportPeriodBounds, reportPeriodKeyForDate, summarizeWafdeenUsage } from '../src/features/wafdeen/read-only-reports.js';

const fixture = [
  { teacherUsername: 'معلم-1', dateISO: '2026-10-17T09:00:00Z', category: 'quran', seconds: '120', studentId: 'private-id' },
  { teacherUsername: 'معلم-1', dateISO: '2026-10-18', category: 'educational', seconds: 60, subject: 'private-subject' },
  { teacherUsername: 'معلم-2', dateISO: '2026-10-18', category: 'quran', seconds: 30 },
  { teacherUsername: 'ignored', dateISO: '2026-10-18', category: 'other', seconds: 999 },
  { teacherUsername: 'ignored', dateISO: '2026-10-18', category: 'educational', seconds: -5 },
  { teacherUsername: '', dateISO: 'invalid', category: 'educational', seconds: 8 }
];

test('monthly report aggregation accepts only Quran and educational seconds and exposes no source rows', () => {
  const result = summarizeWafdeenUsage(fixture);
  assert.deepEqual(result.byTeacher.map(({ label, quranSeconds, educationSeconds, totalSeconds }) => [label, quranSeconds, educationSeconds, totalSeconds]), [
    ['معلم-1', 120, 60, 180],
    ['معلم-2', 30, 0, 30]
  ]);
  assert.deepEqual(result.byDate.map(({ label, quranSeconds, educationSeconds, totalSeconds }) => [label, quranSeconds, educationSeconds, totalSeconds]), [
    ['2026-10-17', 120, 0, 120],
    ['2026-10-18', 30, 60, 90]
  ]);
  assert.equal(JSON.stringify(result).includes('private-id'), false);
  assert.equal(JSON.stringify(result).includes('private-subject'), false);
  assert.deepEqual(result.byWeek.map(({ label, totalSeconds }) => [label, totalSeconds]), [
    ['2026-10-17 – 2026-10-23', 210]
  ]);
});

test('report periods match the existing 15th-to-14th server boundary', () => {
  assert.deepEqual(reportPeriodBounds('2026-10'), { start: '2026-10-15', end: '2026-11-14' });
  assert.equal(reportPeriodKeyForDate('2026-11-14'), '2026-10');
  assert.equal(reportPeriodKeyForDate('2026-11-15'), '2026-11');
  assert.equal(reportPeriodBounds('October 2026'), null);
  assert.equal(reportPeriodKeyForDate('bad-date'), '');
});
