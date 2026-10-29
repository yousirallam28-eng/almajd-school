import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { listWafdeenStudentNames } from '../supabase/functions/majd-api/wafdeen_names.js';
import { listWafdeenStudentNames as listNamesFromClient } from '../src/api/wafdeen-names.api.js';

const bridge = readFileSync(new URL('../public/legacy/js/inline-28.js', import.meta.url), 'utf8');
const sourceBridge = readFileSync(new URL('../legacy/js/inline-28.js', import.meta.url), 'utf8');
const reportApiSource = readFileSync(new URL('../src/api/wafdeen-report.api.js', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mainEntrySource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const routerSource = readFileSync(new URL('../src/app/router.js', import.meta.url), 'utf8');
const viteSource = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const edgeSource = readFileSync(new URL('../supabase/functions/majd-api/index.ts', import.meta.url), 'utf8');
const namesHelperSource = readFileSync(new URL('../supabase/functions/majd-api/wafdeen_names.js', import.meta.url), 'utf8');
const adminHelperSource = readFileSync(new URL('../supabase/functions/majd-api/wafdeen_admin.js', import.meta.url), 'utf8');
const adminApiSource = readFileSync(new URL('../src/api/wafdeen-admin.api.js', import.meta.url), 'utf8');

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

test('Wafdeen standalone site is linked from the main login while cloud adapters remain protected', () => {
  assert.match(indexHtml, /href="wafdeen\.html"/);
  assert.match(indexHtml, /موقع الوافدين/);
  assert.doesNotMatch(mainEntrySource, /features\/wafdeen/);
  assert.doesNotMatch(routerSource, /wafdeen|وافدين/i);
  assert.match(viteSource, /wafdeen:\s*resolve\(projectRoot, 'wafdeen\.html'\)/);
  assert.equal(existsSync(new URL('../wafdeen.html', import.meta.url)), true);
  assert.equal(existsSync(new URL('../public/wafdeen.html', import.meta.url)), true);
  assert.match(reportApiSource, /purpose: 'report'/);
  assert.doesNotMatch(reportApiSource, /wafdeen-sessions\.api|createWafdeenSession|purpose: 'daily'|studentName/);
  assert.doesNotMatch(adminApiSource, /teacher\?\.password|password_hash|password_salt/i);
  const teacherProjection = adminHelperSource.match(/const TEACHER_SELECT = '([^']+)'/)?.[1] || '';
  assert.doesNotMatch(teacherProjection, /password|hash|salt|\*/i);
  assert.match(adminHelperSource, /\.insert\(row\)/);
  assert.doesNotMatch(adminHelperSource, /\.upsert\(|\.delete\(/);
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
  const scopeGatePosition = edgeSource.indexOf('if (!authorizeApiOperation(u.sessionScope, b.op, b))');
  assert.ok(scopeGatePosition > authPosition, 'the signed session scope must be checked after token authentication');
  assert.ok(scopeGatePosition < edgeSource.indexOf('if (b.op === "addWafdeenStudent")'), 'the scope gate must run before every Wafdeen handler');
  assert.match(edgeSource, /token: await sign\(a\.id, scope\)/);
  assert.match(edgeSource, /sessionScope: claims\.scope/);
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

test('the main-site bridge is report-only and Wafdeen Edge operations remain authenticated', () => {
  assert.match(sourceBridge, /listWafdeenSessionData: async function \(options\) \{ if \(!options \|\| options\.purpose !== 'report'\)/);
  assert.match(sourceBridge, /REPORT_ONLY_IN_MAIN_SITE/);
  assert.match(sourceBridge, /WAFDEEN_APP_ONLY/);
  assert.match(bridge, /listWafdeenSessionData: async function \(options\) \{ if \(!options \|\| options\.purpose !== 'report'\)/);
  assert.match(bridge, /REPORT_ONLY_IN_MAIN_SITE/);
  assert.match(bridge, /WAFDEEN_APP_ONLY/);
  assert.doesNotMatch(sourceBridge, /listWafdeenStudentNames|createWafdeenSession|addWafdeenStudent|listWafdeenTeachers|createWafdeenTeacher/);
  assert.doesNotMatch(bridge, /listWafdeenStudentNames|createWafdeenSession|addWafdeenStudent|listWafdeenTeachers|createWafdeenTeacher/);
  const authPosition = edgeSource.indexOf('const u = await authenticate(');
  for (const op of ['addWafdeenStudent', 'listWafdeenTeachers', 'createWafdeenTeacher']) {
    const opPosition = edgeSource.indexOf(`if (b.op === "${op}")`);
    assert.ok(opPosition > authPosition, `${op} must be behind existing session authentication`);
  }
  assert.match(edgeSource, /createWafdeenTeacher\(db!, u, admin, b\.teacher, passHash\)/);
  assert.match(adminHelperSource, /if \(typeof isAdmin !== 'function' \|\| !isAdmin\(user\)\) return \{ status: 403, error: 'FORBIDDEN' \}/);
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
