import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const wafdeen = readFileSync(new URL('../public/legacy/js/js__features__wafdeen-application.js', import.meta.url), 'utf8');
const main = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
const background = readFileSync(new URL('../public/legacy/js/js__features__background-timer-refresh.js', import.meta.url), 'utf8');

test('Wafdeen-only maintenance screens and education timer are not exposed in the portal', () => {
  assert.doesNotMatch(html, /wafdeen-admin-area|wafdeen-admin-menu-items|wafdeen-panel-teachers|wafdeen-panel-students|wafdeen-panel-educationTime|wafdeen-edu-timer/);
  assert.doesNotMatch(html, /wafdeenShowPanel\('(teachers|students|educationTime|materials|report|cloudReview)'\)/);
  assert.equal((html.match(/id="wafdeen-quran-timer"/g) || []).length, 1);
  assert.doesNotMatch(background, /wafdeenEduTimer|wafdeenEduTick|wafdeenTimerRunning/);
});

test('normal-school selectors and manager class tabs exclude Wafdeen', () => {
  assert.doesNotMatch(html, /<option[^>]+value="الوافدين"/);
  assert.doesNotMatch(html, /switchManagerClass\('الوافدين'/);
  assert.match(main, /var GENERAL_CLASSES = ALL_CLASSES\.filter\(function \(className\) \{ return String\(className\)\.trim\(\) !== 'الوافدين'; \}\)/);
});

test('recitation sessions are capped at 120 minutes and persisted to cloud with stable session IDs', () => {
  assert.match(wafdeen, /WAFDEEN_QURAN_SESSION_MAX_SECONDS = 2 \* 60 \* 60/);
  assert.match(wafdeen, /async function wafdeenPersistQuranSession_\(seconds\)/);
  assert.match(wafdeen, /writeRecord\('wafdeenUsage', id, record, \{ merge: true \}\)/);
  assert.match(wafdeen, /wafdeenQuranStopTimer\(true\)/);
  assert.match(wafdeen, /wafdeenQuranSessionSaved = true/);
  assert.match(wafdeen, /wafdeenQuranStudentId/);
});

test('grade saves use the cloud only and create no per-category duplicate timer rows', () => {
  const gradeSave = wafdeen.split('function wafdeenSaveGradeType(type) {')[1].split('function wafdeenSaveGradeAndTime()')[0];
  assert.match(gradeSave, /writeRecord\('wafdeenDailyRecords'/);
  assert.doesNotMatch(gradeSave, /wafdeenPersistLocal|localIsAvailable|writeRecord\('wafdeenUsage'/);
  assert.match(wafdeen, /category: 'quran_session'/);
  assert.match(wafdeen, /wafdeenTeacherCanSeeStudent_/);
});

test('ordinary-site Wafdeen time report is manager-gated and includes session and education time', () => {
  assert.match(main, /manager\.username==='admin' \|\| manager\.role==='admin' \|\| manager\.isAdmin===true/);
  assert.match(main, /u\.category==='quran_session' \|\| u\.category==='educational'/);
  assert.match(main, /مدة جلسة التسميع/);
  assert.match(main, /وقت التعليم/);
  assert.match(main, /renderWafdeenManagerGradesReport_/);
  assert.match(main, /saveWafdeenEducationTimeAsManager/);
  assert.match(main, /editWafdeenEducationRecordByIndex/);
  assert.match(html, /wafdeenGradesReportTable/);
  assert.match(html, /wafdeenEducationRecordsTable/);
});
