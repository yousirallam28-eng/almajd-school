import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const mainHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const reportFeature = readFileSync(new URL('../src/features/wafdeen/report.js', import.meta.url), 'utf8');
const reportApi = readFileSync(new URL('../src/api/wafdeen-report.api.js', import.meta.url), 'utf8');
const mainEntry = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const router = readFileSync(new URL('../src/app/router.js', import.meta.url), 'utf8');
const mainBridge = readFileSync(new URL('../legacy/js/inline-28.js', import.meta.url), 'utf8');
const vite = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');

test('the primary site keeps the monthly report in Sheikh Recordings without a Wafdeen session page', () => {
  assert.doesNotMatch(mainHtml, /id="wafdeen-login-btn"|id="wafdeen-entry-screen"|id="wafdeen-tab"/);
  assert.match(mainHtml, /id="wafdeen-monthly-report-tab-btn"[^>]*>[^<]*تقرير الشهري الوقتي/);
  assert.match(mainHtml, /id="wafdeen-monthly-report-tab"/);
  const sidebar = mainHtml.match(/<aside[^>]*id="main-menu-drawer"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(sidebar, 'the main authenticated navigation must exist');
  const sheikhSubmenu = sidebar.match(/<div class="reports-submenu" id="sheikh-recordings-submenu">([\s\S]*?)<\/div>/)?.[1] || '';
  assert.match(sheikhSubmenu, /wafdeen-monthly-report-tab-btn/);
  assert.doesNotMatch(sheikhSubmenu, /wafdeen-tab-btn|wafdeen-login-btn|واجهة الوافدين|جلسة الوافدين/);
});

test('the main client imports only the report feature and its report-only API path', () => {
  assert.match(mainEntry, /features\/wafdeen\/report\.js/);
  assert.doesNotMatch(mainEntry, /features\/wafdeen\/index\.js|__MAJD_WAFDEEN_SESSIONS_ENABLED__/);
  assert.match(router, /'wafdeen-monthly-report-tab': 'wafdeen-report'/);
  assert.match(router, /'wafdeen-report': \(\) => import\('\.\.\/features\/wafdeen\/report\.js'\)/);
  assert.doesNotMatch(router, /features\/wafdeen\/index\.js/);
  assert.doesNotMatch(reportFeature, /wafdeen-sessions\.api|wafdeen-admin\.api|createWafdeenSession|loadWafdeenSessionData|renderWafdeenView|wafdeen-tab|wafdeen-student-select/);
  assert.doesNotMatch(reportApi, /wafdeen-sessions\.api|createWafdeenSession|purpose: 'daily'|studentName/);
  assert.match(reportApi, /purpose: 'report'/);
});

test('the independent page and its frontend assets are absent from the local project', () => {
  for (const asset of [
    '../wafdeen.html',
    '../src/features/wafdeen/standalone-entry.js',
    '../src/features/wafdeen/standalone.css',
    '../src/api/wafdeen-standalone.api.js'
  ]) {
    assert.equal(existsSync(new URL(asset, import.meta.url)), false, `${asset} must not remain`);
  }
  assert.doesNotMatch(vite, /wafdeen\.html|standalone-entry/);
});

test('the main-site API bridge remains report-only', () => {
  assert.match(mainBridge, /listWafdeenSessionData: async function \(options\) \{ if \(!options \|\| options\.purpose !== 'report'/);
  assert.match(mainBridge, /REPORT_ONLY_IN_MAIN_SITE/);
  assert.match(mainBridge, /WAFDEEN_APP_ONLY/);
  assert.doesNotMatch(mainBridge, /createWafdeenSession|addWafdeenStudent|listWafdeenTeachers|createWafdeenTeacher|listWafdeenStudentNames/);
});
