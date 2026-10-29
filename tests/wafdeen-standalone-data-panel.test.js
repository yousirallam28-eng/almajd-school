import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchWafdeenAdminData, isWafdeenDataViewer } from '../src/features/wafdeen/standalone-data-panel.js';

test('only Wafdeen admin and authorized non-supervisor staff can see the limited data panel', () => {
  assert.equal(isWafdeenDataViewer({ isAdmin: true, accountType: 'staff' }), true);
  assert.equal(isWafdeenDataViewer({ accountType: 'staff', canWafdeen: true, center: 'رئيسي' }), true);
  assert.equal(isWafdeenDataViewer({ accountType: 'staff', canWafdeen: 1, center: 'مساعد' }), true);
  assert.equal(isWafdeenDataViewer({ accountType: 'staff', canWafdeen: true, center: 'مشرف' }), false);
  assert.equal(isWafdeenDataViewer({ accountType: 'wafdeen_teacher', canWafdeen: true }), false);
  assert.equal(isWafdeenDataViewer({ accountType: 'wafdeen_student', isAdmin: false, canWafdeen: true }), false);
});

test('the data panel calls only the two named read operations and has no student-id input', async () => {
  const requests = [];
  const data = await fetchWafdeenAdminData(async (body) => {
    requests.push(body);
    return body.op === 'listWafdeenAccounts'
      ? { accounts: [{ username: 'demo-staff', accountType: 'staff' }] }
      : { grades: [{ studentName: 'طالب وهمي', dateISO: '2026-10-01', total: 9 }] };
  });
  assert.deepEqual(requests, [{ op: 'listWafdeenAccounts' }, { op: 'listWafdeenGrades' }]);
  assert.deepEqual(data.accounts, [{ username: 'demo-staff', accountType: 'staff' }]);
  assert.deepEqual(data.grades, [{ studentName: 'طالب وهمي', dateISO: '2026-10-01', total: 9 }]);
  assert.equal(requests.some((request) => Object.hasOwn(request, 'studentId')), false);
});

test('the data panel does not substitute or fabricate local data after API failure', async () => {
  await assert.rejects(fetchWafdeenAdminData(async () => { throw new Error('offline'); }), /offline/);
  await assert.rejects(fetchWafdeenAdminData(async () => ({ accounts: [] })), /INVALID_WAFDEEN_DATA_RESPONSE/);
});
