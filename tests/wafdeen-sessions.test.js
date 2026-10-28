import test from 'node:test';
import assert from 'node:assert/strict';
import { createWafdeenSession, listWafdeenSessionData, DAILY_SESSION_SELECT, REPORT_DAILY_SESSION_SELECT, USAGE_SESSION_SELECT } from '../supabase/functions/majd-api/wafdeen_sessions.js';
import { createWafdeenSession as createFromClient, loadWafdeenSessionData } from '../src/api/wafdeen-sessions.api.js';

const admin = { account_type: 'staff', username: 'admin', username_norm: 'admin', profile: { role: 'admin' } };
const teacher = { account_type: 'staff', username: 'teacher-demo', username_norm: 'teacher-demo', profile: { canWafdeen: true, center: 'رئيسي' } };
const isAdmin = (user) => user?.username === 'admin';
const knownStudent = { studentId: 'student-demo-1', studentName: 'طالب تجريبي' };

function createFakeDb({ dailyRows = [], usageRows = [], studentRows = [{ ...knownStudent, teacherUsername: 'teacher-demo', className: 'الوافدين' }], insertError = null } = {}) {
  const calls = [];
  const inserts = [];
  const db = {
    calls,
    inserts,
    from(table) {
      const state = { table, select: '', filters: [], range: [0, 999], limit: Infinity };
      const query = {
        select(value) { state.select = value; calls.push(['select', value]); return this; },
        eq(field, value) { state.filters.push(['eq', field, value]); calls.push(['eq', field, value]); return this; },
        gte(field, value) { state.filters.push(['gte', field, value]); calls.push(['gte', field, value]); return this; },
        lte(field, value) { state.filters.push(['lte', field, value]); calls.push(['lte', field, value]); return this; },
        order(field, options) { calls.push(['order', field, options]); return this; },
        range(from, to) { state.range = [from, to]; calls.push(['range', from, to]); return this; },
        limit(value) { state.limit = value; calls.push(['limit', value]); return this; },
        insert(rows) { inserts.push(rows); calls.push(['insert', rows]); return Promise.resolve({ error: insertError }); },
        then(resolve, reject) {
          let rows = state.select === 'data->>studentId,data->>studentName'
            ? studentRows
            : state.table === 'majd_records' && state.filters.some(([operator, key, value]) => operator === 'eq' && key === 'collection' && value === 'wafdeenUsage')
              ? usageRows
              : dailyRows;
          rows = rows.filter((row) => state.filters.every(([operator, field, value]) => {
            if (field === 'collection') return true;
            const property = field.startsWith('data->>') ? field.slice(7) : field;
            const actual = String(row[property] ?? '');
            const expected = String(value ?? '');
            if (operator === 'gte') return actual >= expected;
            if (operator === 'lte') return actual <= expected;
            return actual === expected;
          }));
          const [from, to] = state.range;
          rows = rows.slice(from, Math.min(to + 1, state.limit));
          return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
        }
      };
      return query;
    }
  };
  return db;
}

test('monthly report uses narrow projections, excludes student names, and drops unselected row properties', async () => {
  const db = createFakeDb({
    dailyRows: [{
      studentId: knownStudent.studentId, studentName: knownStudent.studentName, teacherUsername: 'teacher-demo',
      dateISO: '2026-10-20', sessionType: 'new', quranSessionTimeSeconds: '125',
      quranSessionTimeByType: { الجديد: 125, الماضي: 0, التلاوة: 0, unrelated: 900 },
      newLessonTimeSeconds: '125', legacyGradeField: 'not selected'
    }],
    usageRows: [{
      studentId: knownStudent.studentId, teacherUsername: 'teacher-demo', dateISO: '2026-10-20',
      category: 'quran', type: 'الجديد', quranGradeType: 'الجديد', seconds: '125', sessionSeconds: '125',
      record_id: 'not selected', unrelatedField: 'not selected'
    }]
  });
  const result = await listWafdeenSessionData(db, admin, isAdmin, { purpose: 'report', month: '2026-10' });
  assert.equal(result.status, 200);
  assert.deepEqual(result.students, []);
  assert.deepEqual(Object.keys(result.dailySessions[0]).sort(), [
    'dateISO', 'newLessonTimeSeconds', 'quranSessionTimeByType', 'quranSessionTimeSeconds',
    'sessionType', 'studentId', 'teacherUsername'
  ].sort());
  assert.equal(Object.hasOwn(result.dailySessions[0], 'studentName'), false);
  assert.deepEqual(Object.keys(result.usage[0]).sort(), [
    'category', 'dateISO', 'quranGradeType', 'seconds', 'sessionSeconds', 'studentId', 'teacherUsername', 'type'
  ].sort());
  assert.deepEqual(result.dailySessions[0].quranSessionTimeByType, { الجديد: 125, الماضي: 0, التلاوة: 0 });
  assert.ok(db.calls.some((call) => call[0] === 'select' && call[1] === REPORT_DAILY_SESSION_SELECT));
  assert.doesNotMatch(REPORT_DAILY_SESSION_SELECT, /studentName/);
  assert.ok(db.calls.some((call) => call[0] === 'select' && call[1] === USAGE_SESSION_SELECT));
  assert.ok(db.calls.filter((call) => call[0] === 'gte').every((call) => call[1] === 'data->>dateISO' && call[2] === '2026-10-15'));
  assert.ok(db.calls.filter((call) => call[0] === 'lte').every((call) => call[1] === 'data->>dateISO' && call[2] === '2026-11-14'));
  assert.doesNotMatch(`${REPORT_DAILY_SESSION_SELECT},${USAGE_SESSION_SELECT}`, /select\(\*|record_id|password|newLesson,|oldRevision,|recitation,/i);
});

test('daily mode loads only the roster and session timing projection and never queries usage', async () => {
  const db = createFakeDb({ dailyRows: [{ ...knownStudent, teacherUsername: 'teacher-demo', dateISO: '2026-10-20', quranSessionTimeSeconds: 60 }] });
  const result = await listWafdeenSessionData(db, admin, isAdmin);
  assert.deepEqual(result.students, [knownStudent]);
  assert.deepEqual(result.usage, []);
  assert.ok(db.calls.some((call) => call[0] === 'select' && call[1] === DAILY_SESSION_SELECT));
  assert.equal(db.calls.some((call) => call[0] === 'select' && call[1] === USAGE_SESSION_SELECT), false);
});

test('monthly report reads require an admin and a valid month', async () => {
  let queried = false;
  const db = { from() { queried = true; throw new Error('unexpected database query'); } };
  const denied = await listWafdeenSessionData(db, teacher, isAdmin, { purpose: 'report', month: '2026-10' });
  assert.deepEqual(denied, { status: 403, error: 'FORBIDDEN' });
  const invalid = await listWafdeenSessionData(db, admin, isAdmin, { purpose: 'report', month: 'October 2026' });
  assert.deepEqual(invalid, { status: 400, error: 'INVALID_REPORT_MONTH' });
  assert.equal(queried, false);
});

test('ordinary Wafdeen staff are scoped to their own or shared guest-class daily records', async () => {
  const db = createFakeDb({ dailyRows: [{ ...knownStudent, teacherUsername: 'teacher-demo', dateISO: '2026-10-20' }] });
  const result = await listWafdeenSessionData(db, teacher, isAdmin);
  assert.equal(result.status, 200);
  assert.ok(db.calls.some((call) => call[0] === 'eq' && call[1] === 'data->>teacherUsername' && call[2] === 'teacher-demo'));
  assert.ok(db.calls.some((call) => call[0] === 'eq' && call[1] === 'data->>className' && call[2] === 'الوافدين'));
});

test('ungranted staff cannot read session data or create sessions', async () => {
  let queried = false;
  const db = { from() { queried = true; throw new Error('unexpected database query'); } };
  const denied = { account_type: 'staff', username: 'teacher-demo', profile: { canWafdeen: false, center: 'رئيسي' } };
  assert.deepEqual(await listWafdeenSessionData(db, denied, isAdmin), { status: 403, error: 'FORBIDDEN' });
  assert.deepEqual(await createWafdeenSession(db, denied, isAdmin, {}), { status: 403, error: 'FORBIDDEN' });
  assert.equal(queried, false);
});

test('session creation validates known student, derives teacher identity, and inserts both new rows without upsert', async () => {
  const db = createFakeDb();
  const result = await createWafdeenSession(db, teacher, isAdmin, {
    studentId: knownStudent.studentId, studentName: knownStudent.studentName,
    dateISO: '2026-10-20', gradeType: 'new', pages: '4', topic: 'سورة تجريبية',
    errors: 1, tashkeel: 2, repetition: 2, sessionSeconds: 125, teacherUsername: 'forged-teacher'
  });
  assert.deepEqual(result, { status: 201, ok: true });
  assert.equal(db.inserts.length, 1);
  assert.equal(db.inserts[0].length, 2);
  const daily = db.inserts[0].find((row) => row.collection === 'wafdeenDailyRecords');
  const usage = db.inserts[0].find((row) => row.collection === 'wafdeenUsage');
  assert.ok(daily && usage);
  assert.equal(daily.data.teacherUsername, 'teacher-demo');
  assert.equal(daily.data.className, 'الوافدين');
  assert.equal(daily.data.newLesson, 7.5);
  assert.equal(daily.data.quranSessionTimeSeconds, 125);
  assert.equal(usage.data.teacherUsername, 'teacher-demo');
  assert.equal(usage.data.className, 'الوافدين');
  assert.equal(usage.data.sessionSeconds, 125);
  assert.ok(db.calls.some((call) => call[0] === 'insert'));
  assert.equal(db.calls.some((call) => ['upsert', 'update', 'delete'].includes(call[0])), false);
});

test('session creation refuses a duplicate type and never changes an old row', async () => {
  const db = createFakeDb({ dailyRows: [{ studentId: knownStudent.studentId, dateISO: '2026-10-20', sessionType: 'new' }] });
  const result = await createWafdeenSession(db, admin, isAdmin, {
    studentId: knownStudent.studentId, studentName: knownStudent.studentName, dateISO: '2026-10-20',
    gradeType: 'new', pages: '2', topic: 'مقرر تجريبي', errors: 0, tashkeel: 0, repetition: 0, sessionSeconds: 90
  });
  assert.deepEqual(result, { status: 409, error: 'SESSION_ALREADY_EXISTS' });
  assert.equal(db.inserts.length, 0);
});

test('frontend adapter strips extra rows and uses a name-free selected-month report response', async () => {
  const previousWindow = globalThis.window;
  let savedPayload;
  globalThis.window = {
    MajdLocalDataAPI: {
      isAvailable: () => true,
      listWafdeenSessionData: async (options) => options?.purpose === 'report' ? ({
        students: [],
        dailySessions: [{
          studentId: knownStudent.studentId, teacherUsername: 'teacher-demo', dateISO: '2026-10-20', sessionType: 'new',
          quranSessionTimeSeconds: '125', quranSessionTimeByType: { الجديد: '125', غير_مسموح: '999' },
          newLesson: 'not returned', record_id: 'not returned'
        }],
        usage: [{ studentId: knownStudent.studentId, teacherUsername: 'teacher-demo', dateISO: '2026-10-20', category: 'quran', type: 'الجديد', quranGradeType: 'الجديد', seconds: '125', sessionSeconds: '125', id: 'not returned' }]
      }) : ({
        students: [{ studentId: knownStudent.studentId, studentName: knownStudent.studentName, extra: 'not returned' }],
        dailySessions: [{
          ...knownStudent, teacherUsername: 'teacher-demo', dateISO: '2026-10-20', sessionType: 'new',
          quranSessionTimeSeconds: '125', quranSessionTimeByType: { الجديد: '125', غير_مسموح: '999' },
          newLesson: 'not returned', record_id: 'not returned'
        }],
        usage: [{ studentId: knownStudent.studentId, teacherUsername: 'teacher-demo', dateISO: '2026-10-20', category: 'quran', type: 'الجديد', quranGradeType: 'الجديد', seconds: '125', sessionSeconds: '125', id: 'not returned' }]
      }),
      createWafdeenSession: async (payload) => { savedPayload = payload; return { ok: true }; }
    }
  };
  try {
    const loaded = await loadWafdeenSessionData();
    assert.deepEqual(loaded.students, [{ id: knownStudent.studentId, name: knownStudent.studentName }]);
    assert.equal(Object.hasOwn(loaded.dailyRecords[0], 'newLesson'), false);
    assert.equal(Object.hasOwn(loaded.dailyRecords[0], 'record_id'), false);
    assert.deepEqual(loaded.dailyRecords[0].quranSessionTimeByType, { الجديد: 125 });
    const report = await loadWafdeenSessionData({ purpose: 'report', month: '2026-10' });
    assert.deepEqual(report.students, []);
    assert.equal(report.dailyRecords[0].studentName, '');
    await createFromClient({
      studentId: knownStudent.studentId, studentName: knownStudent.studentName, dateISO: '2026-10-20',
      gradeType: 'new', pages: '4', topic: 'مقرر تجريبي', errors: 1, tashkeel: 0, repetition: 0,
      sessionSeconds: 125, teacherUsername: 'ignored', recordId: 'ignored'
    });
    assert.deepEqual(Object.keys(savedPayload).sort(), [
      'dateISO', 'errors', 'gradeType', 'pages', 'repetition', 'sessionSeconds', 'studentId', 'studentName', 'tashkeel', 'topic'
    ].sort());
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
