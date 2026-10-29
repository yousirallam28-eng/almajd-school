import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const mainHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const reportApi = readFileSync(new URL('../src/api/wafdeen-report.api.js', import.meta.url), 'utf8');
const mainEntry = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const router = readFileSync(new URL('../src/app/router.js', import.meta.url), 'utf8');
const mainBridge = readFileSync(new URL('../legacy/js/inline-28.js', import.meta.url), 'utf8');
const vite = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');

test('the primary site exposes the standalone Wafdeen entry without embedding its legacy UI', () => {
  assert.match(mainHtml, /href="wafdeen\.html"/);
  assert.match(mainHtml, /موقع الوافدين/);
});

test('the application and build no longer load or publish Wafdeen frontend routes', () => {
  assert.doesNotMatch(mainEntry, /features\/wafdeen/);
  assert.doesNotMatch(router, /wafdeen|وافدين/i);
  assert.doesNotMatch(vite, /wafdeen|وافدين/i);
  assert.equal(existsSync(new URL('../public/wafdeen.html', import.meta.url)), true);
  assert.equal(existsSync(new URL('../src/features/wafdeen', import.meta.url)), false);
});

test('the existing Wafdeen API client and bridge remain present and report-scoped', () => {
  assert.match(reportApi, /purpose: 'report'/);
  assert.doesNotMatch(reportApi, /purpose: 'daily'/);
  assert.match(mainBridge, /listWafdeenSessionData: async function \(options\) \{ if \(!options \|\| options\.purpose !== 'report'/);
  assert.match(mainBridge, /REPORT_ONLY_IN_MAIN_SITE/);
  assert.match(mainBridge, /WAFDEEN_APP_ONLY/);
});
