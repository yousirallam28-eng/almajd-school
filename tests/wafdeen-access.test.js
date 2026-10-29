import test from 'node:test';
import assert from 'node:assert/strict';
import { listWafdeenAccounts, listWafdeenGrades } from '../supabase/functions/majd-api/wafdeen_access.js';

const isAdmin = (user) => user?.account_type === 'staff' && (user?.username === 'admin' || user?.profile?.role === 'admin');
const admin = { username: 'admin', username_norm: 'admin', account_type: 'staff', profile: { role: 'admin' } };
const authorizedStaff = { username: 'wafdeen-staff', account_type: 'staff', profile: { canWafdeen: true, center: 'رئيسي' } };
const student = { username: 'student-demo', id: 'account-demo', account_type: 'wafdeen_student', profile: { studentId: 'not-a-link' } };

function valueFor(row, field) {
  if (field.startsWith('profile->>')) {
    const key = field.slice('profile->>'.length);
    return row.profile?.[key] ?? row[key];
  }
  if (field.startsWith('data->>')) return row[field.slice('data->>'.length)];
  return row[field];
}

function fakeDb({ accounts = [], grades = [] } = {}) {
  const calls = [];
  const db = {
    calls,
    from(table) {
      const state = { table, select: '', filters: [], range: [0, 999], limit: Infinity, order: null };
      const query = {
        select(value) { state.select = value; calls.push(['select', table, value]); return this; },
        eq(field, value) { state.filters.push(['eq', field, value]); calls.push(['eq', table, field, value]); return this; },
        neq(field, value) { state.filters.push(['neq', field, value]); calls.push(['neq', table, field, value]); return this; },
        in(field, values) { state.filters.push(['in', field, values]); calls.push(['in', table, field, values]); return this; },
        order(field, options) { state.order = [field, options]; calls.push(['order', table, field, options]); return this; },
        limit(value) { state.limit = value; calls.push(['limit', table, value]); return this; },
        range(from, to) { state.range = [from, to]; calls.push(['range', table, from, to]); return this; },
        then(resolve, reject) {
          let rows = table === 'majd_accounts' ? accounts : table === 'majd_records' ? grades : [];
          rows = rows.filter((row) => state.filters.every(([kind, field, expected]) => {
            const value = valueFor(row, field);
            if (kind === 'eq') return String(value ?? '') === String(expected ?? '');
            if (kind === 'neq') return String(value ?? '') !== String(expected ?? '');
            if (kind === 'in') return expected.map(String).includes(String(value ?? ''));
            return true;
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

test('account list is limited to active Wafdeen accounts and authorized Wafdeen staff, with no credentials', async () => {
  const db = fakeDb({ accounts: [
    { username: 'student-a', account_type: 'wafdeen_student', is_active: true, name: 'طالب تجريبي', role: 'student', canWafdeen: false, password_hash: 'never-return', password_salt: 'never-return' },
    { username: 'teacher-a', account_type: 'wafdeen_teacher', is_active: true, assignedClass: 'وافدين', center: 'رئيسي', canWafdeen: false, password_hash: 'never-return' },
    { username: 'staff-a', account_type: 'staff', is_active: true, name: 'موظف تجريبي', canWafdeen: true, center: 'رئيسي', password_hash: 'never-return' },
    { username: 'staff-supervisor', account_type: 'staff', is_active: true, canWafdeen: true, center: 'مشرف' },
    { username: 'inactive-student', account_type: 'wafdeen_student', is_active: false, name: 'غير نشط' },
    { username: 'ordinary-staff', account_type: 'staff', is_active: true, canWafdeen: false, name: 'غير مخول' }
  ] });

  const result = await listWafdeenAccounts(db, authorizedStaff, isAdmin);
  assert.equal(result.status, 200);
  assert.deepEqual(result.accounts.map(({ username, accountType }) => [username, accountType]).sort(), [
    ['staff-a', 'staff'], ['student-a', 'wafdeen_student'], ['teacher-a', 'wafdeen_teacher']
  ]);
  assert.equal(Object.hasOwn(result.accounts[0], 'password_hash'), false);
  assert.equal(Object.hasOwn(result.accounts[0], 'password_salt'), false);
  const projections = db.calls.filter(([kind]) => kind === 'select').map(([, , value]) => value);
  assert.ok(projections.length === 3);
  assert.ok(projections.every((value) => !/password|hash|salt|select\(\*|profile\b(?!->>)/i.test(value)));
  assert.ok(projections.every((value) => value.includes('profile->>name')));
});

test('students and non-authorized staff cannot list Wafdeen accounts or trigger any query', async () => {
  for (const user of [student, { username: 'ordinary', account_type: 'staff', profile: { canWafdeen: false } }]) {
    const db = fakeDb();
    assert.deepEqual(await listWafdeenAccounts(db, user, isAdmin), { status: 403, error: 'FORBIDDEN' });
    assert.equal(db.calls.length, 0);
  }
});

test('admin and authorized staff receive only selected grade fields from fake rows', async () => {
  const db = fakeDb({ grades: [
    { collection: 'wafdeenDailyRecords', record_id: 'r1', studentName: 'طالبة تجريبية', dateISO: '2026-10-01', sessionType: 'new', newLesson: '8.5', total: '8.5', _deleted: false, studentId: 'internal-id', password: 'never-return' },
    { collection: 'wafdeenDailyRecords', record_id: 'r2', studentName: 'طالب تجريبي', dateISO: '2026-10-02', sessionType: 'old', oldRevision: 7, total: 7, _deleted: false, studentId: 'other-id' },
    { collection: 'wafdeenDailyRecords', record_id: 'r3', studentName: 'محذوف تجريبي', dateISO: '2026-10-03', sessionType: 'new', newLesson: 10, _deleted: true, studentId: 'deleted-id' },
    { collection: 'otherCollection', record_id: 'r4', studentName: 'خارج النطاق', dateISO: '2026-10-04', sessionType: 'new', newLesson: 10, _deleted: false }
  ] });
  const result = await listWafdeenGrades(db, admin, isAdmin);
  assert.equal(result.status, 200);
  assert.deepEqual(result.grades, [
    { studentName: 'طالبة تجريبية', dateISO: '2026-10-01', sessionType: 'new', newLesson: 8.5, total: 8.5 },
    { studentName: 'طالب تجريبي', dateISO: '2026-10-02', sessionType: 'old', oldRevision: 7, total: 7 }
  ]);
  const gradeSelect = db.calls.find(([kind, table]) => kind === 'select' && table === 'majd_records')[2];
  assert.match(gradeSelect, /data->>newLesson/);
  assert.match(gradeSelect, /data->>oldRevision/);
  assert.match(gradeSelect, /data->>recitation/);
  assert.match(gradeSelect, /data->>total/);
  assert.doesNotMatch(gradeSelect, /select\(\*|studentId|password|hash|salt/i);
  assert.equal(Object.hasOwn(result.grades[0], 'record_id'), false);
  assert.equal(Object.hasOwn(result.grades[0], 'studentId'), false);
  assert.equal(Object.hasOwn(result.grades[0], 'password'), false);
});

test('authorized staff can read grades only from the Wafdeen daily-record collection', async () => {
  const db = fakeDb({ grades: [
    { collection: 'wafdeenDailyRecords', record_id: 'g1', studentName: 'طالب صف', dateISO: '2026-10-05', sessionType: 'new', newLesson: 9, className: 'الوافدين', teacherUsername: 'other' },
    { collection: 'wafdeenDailyRecords', record_id: 'g2', studentName: 'طالب مدرس', dateISO: '2026-10-06', sessionType: 'old', oldRevision: 8, className: 'فصل آخر', teacherUsername: 'wafdeen-staff' }
  ] });
  const result = await listWafdeenGrades(db, authorizedStaff, isAdmin);
  assert.equal(result.status, 200);
  assert.equal(result.grades.length, 2);
  assert.ok(db.calls.some(([kind, table, field, value]) => kind === 'eq' && table === 'majd_records' && field === 'collection' && value === 'wafdeenDailyRecords'));
  assert.equal(db.calls.some(([kind, table, field]) => kind === 'eq' && table === 'majd_records' && field !== 'collection'), false);
  assert.equal(db.calls.some(([kind, table, field]) => kind === 'eq' && table === 'majd_records' && (field === 'data->>className' || field === 'data->>teacherUsername')), false);
});

test('student grade lookup is denied even if the client supplies a profile.studentId value', async () => {
  const db = fakeDb({ grades: [{ collection: 'wafdeenDailyRecords', record_id: 'must-not-read', studentId: 'not-a-link', studentName: 'طالب', dateISO: '2026-10-01', newLesson: 10 }] });
  assert.deepEqual(await listWafdeenGrades(db, student, isAdmin), { status: 403, error: 'FORBIDDEN' });
  assert.equal(db.calls.length, 0);
});
