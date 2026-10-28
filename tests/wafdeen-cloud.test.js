import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wafdeenMockStore } from '../src/features/wafdeen/mockData.js';
import { listWafdeenStudentNames } from '../supabase/functions/majd-api/wafdeen_names.js';
import { listWafdeenStudentNames as listNamesFromClient } from '../src/api/wafdeen-names.api.js';

const bridge = readFileSync(new URL('../public/legacy/js/inline-28.js', import.meta.url), 'utf8');
const sourceBridge = readFileSync(new URL('../legacy/js/inline-28.js', import.meta.url), 'utf8');
const wafdeenFeature = readFileSync(new URL('../src/features/wafdeen/index.js', import.meta.url), 'utf8');
const mockStoreSource = readFileSync(new URL('../src/features/wafdeen/mockData.js', import.meta.url), 'utf8');
const mainEntrySource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const edgeSource = readFileSync(new URL('../supabase/functions/majd-api/index.ts', import.meta.url), 'utf8');
const namesHelperSource = readFileSync(new URL('../supabase/functions/majd-api/wafdeen_names.js', import.meta.url), 'utf8');

test('cloud request timeout covers response-body reading', () => {
  const fetchPosition = bridge.indexOf('response = await fetch(EDGE_URL');
  const bodyPosition = bridge.indexOf('payload = await response.json()', fetchPosition);
  const timeoutCleanupPosition = bridge.indexOf('if (timeout) clearTimeout(timeout)', fetchPosition);
  assert.ok(fetchPosition >= 0 && bodyPosition > fetchPosition);
  assert.ok(timeoutCleanupPosition > bodyPosition, 'deadline must remain active until the response body is consumed');
  assert.match(bridge, /controller\.signal\.aborted\) throw bodyError/);
});

test('class-specific cloud hydration and write adapters are no longer exposed', () => {
  assert.doesNotMatch(bridge, /hydrateWafdeen|refreshWafdeenViews|wafdeenLogin|wafdeenLogout/);
  assert.doesNotMatch(bridge, /findWafdeenRecord|saveWafdeenUsage|loadWafdeen|getWafdeenMonthlyReports/);
  assert.doesNotMatch(bridge, /wafdeenTeachers|wafdeenStudents|wafdeenDailyRecords|wafdeenExams|wafdeenUsage/);
  assert.match(bridge, /async function hydrateMain\(\)/, "the general school's data loader remains available");
  assert.match(bridge, /writeRecord: async function/);
  assert.match(bridge, /deleteRecord: async function/);
  assert.doesNotMatch(bridge, /(?:writeRecord|deleteRecord)\(['"]wafdeen/i, 'the page no longer issues class-specific data mutations');
});

test('Wafdeen has a local mock fallback and the approved app entrypoint activates only the guarded session API', () => {
  assert.match(wafdeenFeature, /wafdeenMockStore\.list\('wafdeenDailyRecords'\)/);
  assert.match(wafdeenFeature, /wafdeenMockStore\.upsert\('wafdeenDailyRecords'/);
  assert.match(wafdeenFeature, /wafdeenMockStore\.upsert\('wafdeenUsage'/);
  assert.match(wafdeenFeature, /__MAJD_WAFDEEN_SESSIONS_ENABLED__ === true/);
  assert.match(wafdeenFeature, /loadWafdeenSessionData/);
  assert.match(wafdeenFeature, /createWafdeenSession/);
  assert.match(mainEntrySource, /window\.__MAJD_WAFDEEN_SESSIONS_ENABLED__ = true/);
  assert.match(mockStoreSource, /isMockOnly: true/);
  assert.doesNotMatch(wafdeenFeature, /cloudClient|MajdLocalDataAPI|fetch\(|teachersData|wafdeenStudents|password|firebase|firestore/i);
  assert.doesNotMatch(mockStoreSource, /password|wafdeenStudents/i);
});

test('mock store fixtures and writes stay local to this module', () => {
  const students = wafdeenMockStore.list('wafdeenRoster');
  assert.ok(students.length > 0);
  assert.ok(students.every((student) => student.name.includes('تجريبي')));
  assert.ok(students.every((student) => !Object.hasOwn(student, 'password')));
  wafdeenMockStore.upsert('wafdeenRoster', 'unit-test-only', { id: 'unit-test-only', name: 'اختبار وهمي' });
  assert.equal(wafdeenMockStore.get('wafdeenRoster', 'unit-test-only').name, 'اختبار وهمي');
});

test('the authenticated Edge operation projects only studentName from Wafdeen daily records', async () => {
  const calls = [];
  const rows = [
    { studentName: 'مريم تجريبية', record_id: 'not-returned', data: { score: 3 } },
    { studentName: 'علي تجريبي', record_id: 'not-returned-either', data: { topic: 'not-returned' } },
    { studentName: 'مريم تجريبية', record_id: 'duplicate', data: { otherField: 'not-returned' } }
  ];
  const query = {
    select(value) { calls.push(['select', value]); return this; },
    eq(field, value) { calls.push(['eq', field, value]); return this; },
    order(field, options) { calls.push(['order', field, options]); return this; },
    range(from, to) { calls.push(['range', from, to]); return this; },
    then(resolve, reject) { return Promise.resolve({ data: rows, error: null }).then(resolve, reject); }
  };
  const fakeDb = { from(table) { calls.push(['from', table]); return query; } };
  const user = { account_type: 'staff', profile: { canWafdeen: true, center: 'رئيسي' } };
  const result = await listWafdeenStudentNames(fakeDb, user, () => false);
  const expected = ['علي تجريبي', 'مريم تجريبية'].sort((a, b) => a.localeCompare(b, 'ar'));
  assert.deepEqual(result, { status: 200, names: expected });
  assert.deepEqual(calls, [
    ['from', 'majd_records'],
    ['select', 'data->>studentName'],
    ['eq', 'collection', 'wafdeenDailyRecords'],
    ['order', 'data->>studentName', { ascending: true }],
    ['range', 0, 999]
  ]);
  assert.doesNotMatch(namesHelperSource, /select\(['"]\*|record_id|wafdeenStudents|password|row\.data/i);
  const authPosition = edgeSource.indexOf('const u = await authenticate(');
  const operationPosition = edgeSource.indexOf('if (b.op === "listWafdeenStudentNames")');
  assert.ok(authPosition >= 0 && operationPosition > authPosition, 'the operation must run only after existing token authentication');
  const authBlock = edgeSource.slice(edgeSource.indexOf('async function authenticate('), edgeSource.indexOf('function ownerScope('));
  assert.match(authBlock, /select\("id,username,username_norm,account_type,profile,is_active"\)/);
  assert.doesNotMatch(authBlock, /select\("\*"|password_hash|password_salt/);
  assert.ok(edgeSource.indexOf('if (b.op === "listWafdeenSessionData")') > authPosition);
  assert.ok(edgeSource.indexOf('if (b.op === "createWafdeenSession")') > authPosition);
  assert.match(edgeSource, /Deno\.env\.get\("SUPABASE_SERVICE_ROLE_KEY"\)/);
  assert.doesNotMatch(edgeSource, /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']/);
});

test('name-only reads paginate in 1,000-row chunks and stop at the first short page', async () => {
  const pages = [
    { data: Array.from({ length: 1000 }, (_, i) => ({ studentName: `طالب تجريبي ${i}` })), error: null },
    { data: [{ studentName: 'طالب تجريبي من الصفحة الثانية' }], error: null }
  ];
  const ranges = [];
  const fakeDb = {
    from() {
      return {
        select() { return this; },
        eq() { return this; },
        order() { return this; },
        range(from, to) { ranges.push([from, to]); return this; },
        then(resolve, reject) { return Promise.resolve(pages.shift()).then(resolve, reject); }
      };
    }
  };
  const user = { account_type: 'staff', profile: { canWafdeen: true, center: 'رئيسي' } };
  const result = await listWafdeenStudentNames(fakeDb, user, () => false);
  assert.deepEqual(ranges, [[0, 999], [1000, 1999]]);
  assert.equal(result.names.length, 1001);
  assert.ok(result.names.includes('طالب تجريبي من الصفحة الثانية'));
});

test('the name-only route rejects ungranted staff without querying the database', async () => {
  let queried = false;
  const fakeDb = { from() { queried = true; throw new Error('must not query'); } };
  const result = await listWafdeenStudentNames(fakeDb, { account_type: 'staff', profile: { canWafdeen: false } }, () => false);
  assert.deepEqual(result, { status: 403, error: 'FORBIDDEN' });
  assert.equal(queried, false);
});

test('source and public bridges expose the same narrow Wafdeen session operations', () => {
  const readMethod = "listWafdeenSessionData: async function (options) { quota.reads++; options = options || {}; var fields = { purpose: options.purpose === 'report' ? 'report' : 'daily' }; if (fields.purpose === 'report') fields.month = String(options.month || ''); var r = await request('listWafdeenSessionData', fields); if (!Array.isArray(r.students) || !Array.isArray(r.dailySessions) || !Array.isArray(r.usage)) throw new Error('INVALID_WAFDEEN_SESSION_RESPONSE'); return r; },";
  const createMethod = "createWafdeenSession: async function (session) { quota.writes++; var r = await request('createWafdeenSession', { session: session || {} }); if (!r || r.ok !== true) throw new Error('WAFDEEN_SESSION_NOT_SAVED'); return { ok: true }; },";
  assert.ok(sourceBridge.includes(readMethod));
  assert.ok(bridge.includes(readMethod));
  assert.ok(sourceBridge.includes(createMethod));
  assert.ok(bridge.includes(createMethod));
  assert.match(sourceBridge, /createWafdeenSession'\]\.includes\(String\(op\)\)/);
  assert.match(bridge, /createWafdeenSession'\]\.includes\(String\(op\)\)/);
});

test('frontend API adapter validates names using a mocked browser API only', async () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    MajdLocalDataAPI: {
      isAvailable: () => true,
      listWafdeenStudentNames: async () => ['اسم تجريبي', 'اسم تجريبي', '  ', 'طالب آخر تجريبي']
    }
  };
  try {
    assert.deepEqual(await listNamesFromClient(), ['اسم تجريبي', 'طالب آخر تجريبي'].sort((a, b) => a.localeCompare(b, 'ar')));
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
