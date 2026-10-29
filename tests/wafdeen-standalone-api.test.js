import test from 'node:test';
import assert from 'node:assert/strict';
import { createWafdeenStandaloneBridge } from '../src/features/wafdeen/standalone-api.js';
import { loadWafdeenSessionData, createWafdeenSession } from '../src/api/wafdeen-sessions.api.js';
import { isAllowedWafdeenStandaloneOperation } from '../src/features/wafdeen/standalone-policy.js';

const fixture = {
  students: [{ studentId: 'roster-test-1', studentName: 'طالب تجريبي' }],
  dailySessions: [{
    studentId: 'roster-test-1', studentName: 'طالب تجريبي', dateISO: '2026-10-29',
    sessionType: 'الجديد', quranSessionTimeSeconds: 75, score: 2, privateNote: 'must not be projected'
  }],
  usage: []
};

test('the standalone API bridge calls only allowlisted operations with bounded fields', async () => {
  const calls = [];
  const fakeRequest = async (body) => {
    calls.push(structuredClone(body));
    if (body.op === 'listWafdeenSessionData') return fixture;
    if (body.op === 'createWafdeenSession') return { ok: true };
    if (body.op === 'addWafdeenStudent') return { student: { id: 'roster-test-2', studentId: 'roster-test-2', studentName: body.studentName } };
    if (body.op === 'listWafdeenTeachers') return { teachers: [{ id: 'teacher-test-1', username: 'teacher-test', assignedClass: 'أولى - أولاد', center: 'رئيسي' }] };
    if (body.op === 'createWafdeenTeacher') return { teacher: { id: 'teacher-test-2', username: body.teacher.username } };
    throw new Error('Unexpected mock operation');
  };
  const bridge = createWafdeenStandaloneBridge(fakeRequest, () => true);
  const previousWindow = globalThis.window;
  globalThis.window = { MajdLocalDataAPI: bridge };

  try {
    const data = await loadWafdeenSessionData({ purpose: 'daily' });
    assert.deepEqual(data.students, [{ id: 'roster-test-1', name: 'طالب تجريبي' }]);
    assert.equal(data.dailyRecords[0].quranSessionTimeSeconds, 75);
    assert.equal('score' in data.dailyRecords[0], false);
    assert.equal('privateNote' in data.dailyRecords[0], false);

    await createWafdeenSession({
      studentId: 'roster-test-1', studentName: 'طالب تجريبي', dateISO: '2026-10-29',
      gradeType: 'new', pages: 'صفحتان', topic: 'مقرر تجريبي', errors: 1,
      tashkeel: 2, repetition: 0, sessionSeconds: 75, privateNote: 'must not be sent'
    });
    await bridge.addWafdeenStudent('طالب جديد تجريبي');
    await bridge.listWafdeenTeachers();
    await bridge.createWafdeenTeacher({
      username: 'teacher-test-2', password: 'temporary-test-pass-123',
      assignedClass: 'أولى - أولاد', center: 'رئيسي', unexpected: 'must not be sent'
    });

    assert.deepEqual(calls, [
      { op: 'listWafdeenSessionData', purpose: 'daily' },
      { op: 'createWafdeenSession', session: {
        studentId: 'roster-test-1', studentName: 'طالب تجريبي', dateISO: '2026-10-29',
        gradeType: 'new', pages: 'صفحتان', topic: 'مقرر تجريبي', errors: 1,
        tashkeel: 2, repetition: 0, sessionSeconds: 75
      } },
      { op: 'addWafdeenStudent', studentName: 'طالب جديد تجريبي' },
      { op: 'listWafdeenTeachers' },
      { op: 'createWafdeenTeacher', teacher: {
        username: 'teacher-test-2', password: 'temporary-test-pass-123',
        assignedClass: 'أولى - أولاد', center: 'رئيسي'
      } }
    ]);
    assert.equal(bridge.isAvailable(), true);
    assert.equal(bridge.deleteWafdeenStudent, undefined);
    assert.equal(bridge.deleteRecord, undefined);
    await assert.rejects(bridge.listWafdeenSessionData({ purpose: 'report' }), /WAFDEEN_REPORT_UNAVAILABLE/);
    await assert.rejects(loadWafdeenSessionData({ purpose: 'report', month: '2026-10' }), /WAFDEEN_REPORT_UNAVAILABLE/);
    assert.equal(isAllowedWafdeenStandaloneOperation({ op: 'deleteWafdeenStudent' }), false);
    assert.equal(isAllowedWafdeenStandaloneOperation({ op: 'listWafdeenGrades' }), false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
