import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createWafdeenStudent,
  createWafdeenTeacher,
  listWafdeenRoster,
  listWafdeenTeachers
} from '../supabase/functions/majd-api/wafdeen_admin.js';

const admin = { username: 'admin', username_norm: 'admin', account_type: 'staff', profile: { role: 'admin' } };
const teacher = { username: 'teacher-demo', account_type: 'staff', profile: { canWafdeen: true, center: 'رئيسي' } };
const isAdmin = (user) => user?.username === 'admin';

function fakeDb({ rosterRows = [], dailyRows = [], accounts = [], insertError = null } = {}) {
  const calls = [];
  const inserts = [];
  const db = {
    calls,
    inserts,
    from(table) {
      const state = { table, select: '', filters: [], range: [0, 999], limit: Infinity };
      const query = {
        select(value) { state.select = value; calls.push(['select', value]); return this; },
        eq(field, value) { state.filters.push([field, value]); calls.push(['eq', field, value]); return this; },
        order(field, options) { calls.push(['order', field, options]); return this; },
        range(from, to) { state.range = [from, to]; calls.push(['range', from, to]); return this; },
        limit(value) { state.limit = value; calls.push(['limit', value]); return this; },
        insert(row) { inserts.push({ table, row }); calls.push(['insert', table]); return Promise.resolve({ error: insertError }); },
        then(resolve, reject) {
          let rows = [];
          if (table === 'majd_accounts') {
            if (state.select === 'id') rows = accounts.filter((account) => state.filters.every(([field, value]) => String(account[field] ?? '') === String(value)));
            else rows = accounts;
          } else {
            const collection = state.filters.find(([field]) => field === 'collection')?.[1];
            rows = collection === 'wafdeenRoster' ? rosterRows : collection === 'wafdeenDailyRecords' ? dailyRows : [];
          }
          rows = rows.filter((row) => state.filters.every(([field, value]) => {
            if (field === 'collection') return true;
            const key = field.startsWith('data->>') ? field.slice(7) : field;
            return String(row[key] ?? '') === String(value ?? '');
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

test('student addition is admin-only and appends one new dedicated roster row', async () => {
  let queried = false;
  const denied = await createWafdeenStudent({ from() { queried = true; throw new Error('must not query'); } }, teacher, isAdmin, { studentName: 'طالب جديد' });
  assert.deepEqual(denied, { status: 403, error: 'FORBIDDEN' });
  assert.equal(queried, false);

  const db = fakeDb();
  const result = await createWafdeenStudent(db, admin, isAdmin, { studentName: '  طالب   جديد  ' });
  assert.equal(result.status, 201);
  assert.equal(result.student.studentName, 'طالب جديد');
  assert.equal(result.student.className, 'الوافدين');
  assert.match(result.student.studentId, /^wafdeen_roster_[0-9a-f-]{36}$/);
  assert.equal(db.inserts.length, 1);
  assert.equal(db.inserts[0].table, 'majd_records');
  assert.equal(db.inserts[0].row.collection, 'wafdeenRoster');
  assert.equal(db.inserts[0].row.data.studentId, result.student.studentId);
  assert.equal(db.calls.some(([operation]) => ['upsert', 'update', 'delete'].includes(operation)), false);
});

test('student addition rejects names already present in the new roster or prior sessions', async () => {
  const rosterDb = fakeDb({ rosterRows: [{ studentName: 'طالبة موجودة' }] });
  assert.deepEqual(await createWafdeenStudent(rosterDb, admin, isAdmin, { studentName: 'طالبة موجودة' }), { status: 409, error: 'STUDENT_ALREADY_EXISTS' });
  assert.equal(rosterDb.inserts.length, 0);

  const historyDb = fakeDb({ dailyRows: [{ studentName: 'طالب قديم' }] });
  assert.deepEqual(await createWafdeenStudent(historyDb, admin, isAdmin, { studentName: 'طالب قديم' }), { status: 409, error: 'STUDENT_ALREADY_EXISTS' });
  assert.equal(historyDb.inserts.length, 0);
});

test('roster list is available only to authorized Wafdeen staff and returns minimal identity fields', async () => {
  const db = fakeDb({ rosterRows: [{ record_id: 'roster-id', studentId: 'roster-id', studentName: 'طالب قائمة', className: 'الوافدين', password: 'must-not-return' }] });
  assert.deepEqual(await listWafdeenRoster(db, teacher, isAdmin), {
    status: 200,
    students: [{ studentId: 'roster-id', studentName: 'طالب قائمة' }]
  });
  assert.deepEqual(Object.keys((await listWafdeenRoster(db, teacher, isAdmin)).students[0]).sort(), ['studentId', 'studentName']);
  assert.ok(db.calls.some(([operation, projection]) => operation === 'select' && projection === 'record_id,data->>studentId,data->>studentName'));
});

test('teacher listing selects no credentials and returns only safe account profile fields', async () => {
  const db = fakeDb({ accounts: [
    { id: 't1', username: 'teacher1', username_norm: 'teacher1', account_type: 'staff', is_active: true, assignedClass: 'أولى - أولاد', center: 'رئيسي', canWafdeen: true, password_hash: 'must-not-return' }
  ] });
  const result = await listWafdeenTeachers(db, admin, isAdmin);
  assert.equal(result.status, 200);
  assert.deepEqual(result.teachers, [{ id: 't1', username: 'teacher1', assignedClass: 'أولى - أولاد', center: 'رئيسي', canWafdeen: true }]);
  assert.doesNotMatch(db.calls.find(([operation]) => operation === 'select')[1], /password|select\(\*|salt|hash/i);
  assert.equal(Object.hasOwn(result.teachers[0], 'password'), false);
  assert.deepEqual(await listWafdeenTeachers(db, teacher, isAdmin), { status: 403, error: 'FORBIDDEN' });
});

test('teacher creation inserts a new staff account with Wafdeen permission and never replaces an existing account', async () => {
  const db = fakeDb();
  const hashPassword = async (password) => ({ salt: `salt:${password.length}`, hash: `hash:${password.length}` });
  const result = await createWafdeenTeacher(db, admin, isAdmin, {
    username: 'new-teacher', password: 'initial-pass-123', assignedClass: 'أولى - أولاد', center: 'رئيسي'
  }, hashPassword);
  assert.equal(result.status, 201);
  assert.equal(result.teacher.username, 'new-teacher');
  assert.equal(result.teacher.canWafdeen, true);
  assert.equal(Object.hasOwn(result.teacher, 'password'), false);
  assert.equal(db.inserts.length, 1);
  const row = db.inserts[0].row;
  assert.equal(row.account_type, 'staff');
  assert.equal(row.profile.canWafdeen, true);
  assert.equal(row.profile.assignedClass, 'أولى - أولاد');
  assert.equal(row.profile.center, 'رئيسي');
  assert.equal(row.password_change_required, true);
  assert.equal(row.password_hash, 'hash:16');
  assert.equal(db.calls.some(([operation]) => ['upsert', 'update', 'delete'].includes(operation)), false);

  const duplicateDb = fakeDb({ accounts: [{ id: 'existing', username_norm: 'new-teacher' }] });
  const duplicate = await createWafdeenTeacher(duplicateDb, admin, isAdmin, {
    username: 'new-teacher', password: 'initial-pass-123', assignedClass: 'أولى - أولاد', center: 'رئيسي'
  }, hashPassword);
  assert.deepEqual(duplicate, { status: 409, error: 'USERNAME_EXISTS' });
  assert.equal(duplicateDb.inserts.length, 0);
});

test('teacher creation rejects non-admin, invalid class, supervisor center, and short initial passwords', async () => {
  const db = fakeDb();
  const args = { username: 'new-teacher', password: 'short', assignedClass: 'الكل', center: 'مشرف' };
  assert.deepEqual(await createWafdeenTeacher(db, teacher, isAdmin, args, async () => ({ salt: '', hash: '' })), { status: 403, error: 'FORBIDDEN' });
  assert.deepEqual(await createWafdeenTeacher(db, admin, isAdmin, args, async () => ({ salt: '', hash: '' })), { status: 400, error: 'INVALID_TEACHER_DETAILS' });
  assert.equal(db.inserts.length, 0);
});
