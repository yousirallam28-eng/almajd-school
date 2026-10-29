import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const mainHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const reportApi = readFileSync(new URL('../src/api/wafdeen-report.api.js', import.meta.url), 'utf8');
const mainEntry = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const router = readFileSync(new URL('../src/app/router.js', import.meta.url), 'utf8');
const mainBridge = readFileSync(new URL('../legacy/js/inline-28.js', import.meta.url), 'utf8');
const vite = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');

test('the primary site has no Wafdeen login, navigation, report tab, or report controls', () => {
  assert.doesNotMatch(mainHtml, /wafdeen|وافدين|تقرير الشهري الوقتي/i);
});

test('the application and build no longer load or publish Wafdeen frontend routes', () => {
  assert.doesNotMatch(mainEntry, /features\/wafdeen/);
  assert.doesNotMatch(router, /wafdeen|وافدين/i);
  assert.doesNotMatch(vite, /wafdeen|وافدين/i);
  for (const asset of ['../wafdeen.html', '../src/features/wafdeen', '../public/wafdeen']) {
    assert.equal(existsSync(new URL(asset, import.meta.url)), false, `${asset} must not remain`);
  }
});

test('the existing Wafdeen API client and bridge remain present and report-scoped', () => {
  assert.match(reportApi, /purpose: 'report'/);
  assert.doesNotMatch(reportApi, /purpose: 'daily'/);
  assert.match(mainBridge, /listWafdeenSessionData: async function \(options\) \{ if \(!options \|\| options\.purpose !== 'report'/);
  assert.match(mainBridge, /REPORT_ONLY_IN_MAIN_SITE/);
  assert.match(mainBridge, /WAFDEEN_APP_ONLY/);
});
