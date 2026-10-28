import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bridge = readFileSync(new URL('../public/legacy/js/inline-28.js', import.meta.url), 'utf8');

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
