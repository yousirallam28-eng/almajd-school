import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
const match = source.match(/function sheetaWeaknessReasons_\(records\) \{[\s\S]*?\n\}/);
assert.ok(match, 'weakness reason helper should exist');
const getReasons = vm.runInNewContext(`(${match[0].replace(/^function sheetaWeaknessReasons_/, 'function')})`);

test('returns up to three weakest metrics below 70 percent, ordered from lowest', () => {
  const records = [
    { newLesson: 9, oldRevision: 6, recitation: 4, attendance: 8, behavior: 5 },
    { newLesson: 8, oldRevision: 6, recitation: 5, attendance: 8, behavior: 6 }
  ];
  assert.deepEqual(JSON.parse(JSON.stringify(getReasons(records))), [
    { label: 'التلاوة', percentage: 45, order: 2 },
    { label: 'السلوك', percentage: 55, order: 4 },
    { label: 'الماضي', percentage: 60, order: 1 }
  ]);
});

test('uses actual recorded fields only and handles absences as zero attendance', () => {
  const result = getReasons([{ isAbsent: true }, { attendance: 10, behavior: 7 }]);
  assert.deepEqual(JSON.parse(JSON.stringify(result)), [
    { label: 'الحضور', percentage: 50, order: 3 }
  ]);
});

test('does not flag scores at or above 70 percent', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(getReasons([{ newLesson: 7, oldRevision: 10, recitation: 8, attendance: 7, behavior: 9 }]))), []);
});
