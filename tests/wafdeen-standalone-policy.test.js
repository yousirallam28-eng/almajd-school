import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedWafdeenStandaloneOperation } from '../src/features/wafdeen/standalone-policy.js';

test('the standalone page allows only explicitly supported Wafdeen operations', () => {
  for (const op of [
    'changePassword',
    'addWafdeenStudent',
    'listWafdeenTeachers',
    'createWafdeenTeacher',
    'listWafdeenStudentNames',
    'listWafdeenAccounts',
    'listWafdeenGrades',
    'createWafdeenSession'
  ]) {
    assert.equal(isAllowedWafdeenStandaloneOperation({ op }), true, `${op} should remain on the approved API surface`);
  }
  assert.equal(isAllowedWafdeenStandaloneOperation({ op: 'listWafdeenSessionData', purpose: 'daily' }), true);
});

test('generic collection operations and report reads are blocked for the standalone session', () => {
  for (const body of [
    { op: 'list', collection: 'wafdeenDailyRecords' },
    { op: 'get', collection: 'wafdeenTeachers', id: 'old-account' },
    { op: 'upsert', collection: 'wafdeenUsage', id: 'old-record', data: { score: 10 } },
    { op: 'delete', collection: 'wafdeenDailyRecords', id: 'old-record' },
    { op: 'bulkUpsert', records: [{ collection: 'wafdeenStudents' }] },
    { op: 'listWafdeenSessionData', purpose: 'report', month: '2026-10' },
    { op: 'listWafdeenSessionData' }
  ]) {
    assert.equal(isAllowedWafdeenStandaloneOperation(body), false, `${body.op} must not bypass the local API contract`);
  }
});
