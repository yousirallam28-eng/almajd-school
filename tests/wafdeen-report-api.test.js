import test from 'node:test';
import assert from 'node:assert/strict';
import { loadWafdeenReportData } from '../src/api/wafdeen-report.api.js';

const rawReport = {
  students: [],
  dailySessions: [{
    studentId: 'student-demo', studentName: 'يجب ألا يظهر', teacherUsername: 'teacher-demo',
    dateISO: '2026-10-20', sessionType: 'new', quranSessionTimeSeconds: '125',
    quranSessionTimeByType: { الجديد: '125', الماضي: 0, التلاوة: 0, extra: 900 },
    newLessonTimeSeconds: '125', record_id: 'must-not-return', grade: 10
  }],
  usage: [{
    studentId: 'student-demo', studentName: 'يجب ألا يظهر', teacherUsername: 'teacher-demo',
    dateISO: '2026-10-20', category: 'quran', type: 'الجديد', quranGradeType: 'الجديد',
    seconds: '125', sessionSeconds: '125', id: 'must-not-return', unrelated: true
  }]
};

test('monthly report adapter requests only report mode and projects an allowlisted response', async () => {
  const previousWindow = globalThis.window;
  const requests = [];
  globalThis.window = {
    MajdLocalDataAPI: {
      isAvailable: () => true,
      listWafdeenSessionData: async (options) => { requests.push(options); return rawReport; }
    }
  };
  try {
    const result = await loadWafdeenReportData('2026-10');
    assert.deepEqual(requests, [{ purpose: 'report', month: '2026-10' }]);
    assert.deepEqual(Object.keys(result.dailyRecords[0]).sort(), [
      'dateISO', 'newLessonTimeSeconds', 'oldRevisionTimeSeconds', 'quranSessionTimeByType',
      'quranSessionTimeSeconds', 'recitationTimeSeconds', 'sessionType', 'studentId', 'teacherUsername'
    ].sort());
    assert.equal(Object.hasOwn(result.dailyRecords[0], 'studentName'), false);
    assert.equal(Object.hasOwn(result.dailyRecords[0], 'record_id'), false);
    assert.deepEqual(result.dailyRecords[0].quranSessionTimeByType, { الجديد: 125, الماضي: 0, التلاوة: 0 });
    assert.deepEqual(Object.keys(result.usage[0]).sort(), [
      'category', 'dateISO', 'quranGradeType', 'seconds', 'sessionSeconds', 'studentId', 'teacherUsername', 'type'
    ].sort());
    assert.equal(Object.hasOwn(result.usage[0], 'studentName'), false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('invalid report periods fail before any bridge request', async () => {
  const previousWindow = globalThis.window;
  let calls = 0;
  globalThis.window = { MajdLocalDataAPI: { isAvailable: () => true, listWafdeenSessionData: async () => { calls += 1; return rawReport; } } };
  try {
    await assert.rejects(loadWafdeenReportData('October 2026'), /اختر شهرًا صالحًا للتقرير/);
    assert.equal(calls, 0);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
