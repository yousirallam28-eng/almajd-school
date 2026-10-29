import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
const publicMain = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
const classFallback = readFileSync(new URL('../legacy/js/js__compat__class-quick-registration-guard.js', import.meta.url), 'utf8');
const publicClassFallback = readFileSync(new URL('../public/legacy/js/js__compat__class-quick-registration-guard.js', import.meta.url), 'utf8');
const classRenderFallback = readFileSync(new URL('../legacy/js/js__compat__class-render-compatibility.js', import.meta.url), 'utf8');
const publicClassRenderFallback = readFileSync(new URL('../public/legacy/js/js__compat__class-render-compatibility.js', import.meta.url), 'utf8');
const storage = readFileSync(new URL('../legacy/js/inline-28.js', import.meta.url), 'utf8');
const publicStorage = readFileSync(new URL('../public/legacy/js/inline-28.js', import.meta.url), 'utf8');
const optionalCompat = readFileSync(new URL('../legacy/js/js__core__optional-local-compat.js', import.meta.url), 'utf8');
const background = readFileSync(new URL('../legacy/js/js__features__background-timer-refresh.js', import.meta.url), 'utf8');
const quickRegistration = readFileSync(new URL('../legacy/js/js__features__quick-registration.js', import.meta.url), 'utf8');
const dailyReports = readFileSync(new URL('../legacy/js/js__features__sharia-and-daily-reports.js', import.meta.url), 'utf8');
const neutralTheme = readFileSync(new URL('../public/appearance/almajd-global-redesign.css', import.meta.url), 'utf8');
const teacherController = readFileSync(new URL('../src/features/teachers/teachers.controller.js', import.meta.url), 'utf8');
const sheikhFeature = readFileSync(new URL('../src/features/sheikh-recordings/index.js', import.meta.url), 'utf8');
const dateFixes = readFileSync(new URL('../legacy/js/js__features__date-navigation-fixes.js', import.meta.url), 'utf8');
const stableGuard = readFileSync(new URL('../legacy/js/js__compat__stable-record-navigation-guard.js', import.meta.url), 'utf8');
const globalApiCompat = readFileSync(new URL('../legacy/js/js__compat__legacy-global-api-compatibility.js', import.meta.url), 'utf8');
const adminVisibility = readFileSync(new URL('../legacy/js/js__core__admin-analysis-visibility.js', import.meta.url), 'utf8');
const studentPortalCss = readFileSync(new URL('../legacy/css/style-1.css', import.meta.url), 'utf8');
const publicStudentPortalCss = readFileSync(new URL('../public/legacy/css/style-1.css', import.meta.url), 'utf8');
const contrastCss = readFileSync(new URL('../legacy/css/final-contrast-overrides.css', import.meta.url), 'utf8');
const publicContrastCss = readFileSync(new URL('../public/legacy/css/final-contrast-overrides.css', import.meta.url), 'utf8');
const appearanceContrastCss = readFileSync(new URL('../public/appearance/final-contrast-overrides.css', import.meta.url), 'utf8');
const routeMetadata = readFileSync(new URL('../public/manus-routes.json', import.meta.url), 'utf8');

const removedAssets = [
  '../legacy/js/js__features__wafdeen-application.js',
  '../legacy/js/js__compat__wafdeen-quran-timer-exports.js',
  '../legacy/js/js__features__wafdeen-performance.js',
  '../legacy/js/js__features__daily-wafdeen-ui-rules.js',
  '../legacy/js/js__compat__standalone-mode-flags.js',
  '../public/legacy/js/js__compat__standalone-mode-flags.js',
  '../legacy/css/wafdeen-30-rules.js.css',
  '../legacy/css/wafdeen-buttons-click-fix.js.css',
  '../legacy/css/wafdeen-click-fix.js.css',
  '../legacy/css/wafdeen-login-button-fix.js.css',
  '../legacy/css/wafdeen-performance-v5-css.js.css',
  '../legacy/css/wafdeen-same-theme.css',
  '../legacy/css/wafdeen-time-report-style.js.css',
  '../public/appearance/wafdeen-redesign.css'
];
const removedAssetDirs = ['../legacy/js', '../public/legacy/js', '../legacy/css', '../public/legacy/css', '../public/appearance'];

test('all Wafdeen pages, sections, forms, lists, and monthly report are absent from the site', () => {
  assert.doesNotMatch(html, /wafdeen|وافدين|تقرير الشهري الوقتي/i);
  for (const asset of ['../wafdeen.html', '../src/features/wafdeen', '../public/wafdeen']) {
    assert.equal(existsSync(new URL(asset, import.meta.url)), false, `${asset} must not ship`);
  }
  const sidebar = html.match(/<aside[^>]*id="main-menu-drawer"[^>]*>([\s\S]*?)<\/aside>/)?.[1] || '';
  const sheikhSubmenu = sidebar.match(/id="sheikh-recordings-submenu">([\s\S]*?)<\/div>/)?.[1] || '';
  assert.doesNotMatch(sheikhSubmenu, /wafdeen|وافدين/i);
  assert.doesNotMatch(html, /wafdeen-login-route-btn|wafdeen-monthly-report-tab|openWafdeenMonthlyReport/i);
  assert.equal(html.slice(html.indexOf('</body>') + '</body>'.length).trim(), '</html>', 'all loaded resources must be inside the document body');
  for (const asset of removedAssets) assert.equal(existsSync(new URL(asset, import.meta.url)), false, `${asset} should no longer ship`);
  for (const directory of removedAssetDirs) {
    const retiredNames = readdirSync(new URL(directory, import.meta.url)).filter((name) => /wafdeen/i.test(name));
    assert.deepEqual(retiredNames, [], `${directory} should not ship class-specific assets`);
  }
});

test('retired permission, report, and date handlers are absent while shared daily behavior remains', () => {
  assert.doesNotMatch(teacherController, /canWafdeen|newTeacherWafdeen/);
  assert.doesNotMatch(sheikhFeature, /renderWafdeenTimeReport/);
  assert.doesNotMatch(dateFixes, /wafdeen|Wafdeen/);
  assert.match(dateFixes, /function currentDailyDateV10/);
  assert.match(dateFixes, /window\.v10SetDailyDate/);
  assert.doesNotMatch(stableGuard, /currentWafdeenTeacher|wafdeen-app-screen|saveWafdeenDailyRecord|wafdeenSave/);
  assert.match(stableGuard, /wrap_\('addGrade'\)/);
  assert.match(stableGuard, /wrap_\('saveShariaGrade'\)/);
  assert.doesNotMatch(globalApiCompat, /wafdeen/i);
  assert.doesNotMatch(adminVisibility, /wafdeenRestoreRegistrationState_/);
});

test('public storage fallback normalizes records through the shared mapper', () => {
  assert.match(storage, /w\.studentsData = \(map\.students \|\| \[\]\)\.map\(function \(student\)/);
  assert.match(publicStorage, /w\.studentsData = \(map\.students \|\| \[\]\)\.map\(function \(student\)/);
  assert.match(publicStorage, /w\.applyDataMapping\(result\.user\)/);
  assert.doesNotMatch(publicStorage, /wafdeenLogin|hydrateWafdeen|refreshWafdeenViews|findWafdeenRecord|saveWafdeenUsage|loadWafdeen|getWafdeenMonthlyReports/);
});

test('supported class lists exclude the retired class without rewriting stored students', () => {
  const canonical = main.match(/var ALL_CLASSES = \[([\s\S]*?)\];/)?.[1];
  assert.ok(canonical, 'the supported class list must exist');
  assert.doesNotMatch(canonical, /الوافدين|wafdeen/i);
  assert.match(main, /var GENERAL_CLASSES = ALL_CLASSES;/);
  assert.match(classFallback, /CANONICAL_CLASSES=\["تمهيدي","أولى - أولاد"/);
  assert.equal(classFallback, publicClassFallback, 'public fallback must not restore the retired class');
  assert.doesNotMatch(classFallback, /الوافدين|wafdeen/i);
  assert.equal(classRenderFallback, publicClassRenderFallback, 'class render fallback must match the source');
  assert.doesNotMatch(classRenderFallback, /الوافدين|wafdeen/i);
  assert.match(main, /if \(!ALL_CLASSES\.includes\(teacherClassNormalize_\(student\.className\)\)\)/);
  assert.match(main, /var visibleStudents = \(studentsData \|\| \[\]\)\.filter\(function \(student\)/);
  assert.match(main, /هذا السجل محفوظ من فصل لم يعد مدعوماً؛ لم يتم حذفه/);
});

test('historical teacher accounts remain read-only and cannot reopen the retired class', () => {
  assert.match(main, /function teacherHasUnsupportedClass_\(teacher\)/);
  assert.match(main, /if \(teacherHasUnsupportedClass_\(currentTeacher\)\)/);
  assert.match(main, /if \(teacherHasUnsupportedClass_\(teacher\)\)/);
  assert.match(main, /if \(teacherHasUnsupportedClass_\(teacherToDelete\)\)/);
  assert.match(main, /var archived = teacherHasUnsupportedClass_\(t\)/);
  assert.match(main, /var classLabel = archived \? 'سجل محفوظ غير مدعوم'/);
  assert.match(main, /هذا الحساب مرتبط بفصل لم يعد مدعوماً؛ بياناته محفوظة ولم يتم تعديلها/);
  assert.match(main, /هذا حساب محفوظ مرتبط بفصل متوقف؛ لم يتم حذفه/);
});

test('shared daily behavior, draft, and general timer features are retained', () => {
  assert.match(html, /toggleBehaviorPanel\('daily'\)/);
  assert.match(main, /function toggleBehaviorPanel\(prefix\)/);
  assert.match(main, /function saveDailyDraft_\(\)/);
  assert.match(main, /return 'wafdeenDailyDraft:' \+ student \+ ':' \+ date/);
  assert.match(quickRegistration, /DAILY_BEHAVIOR_REASONS/);
  assert.match(dailyReports, /toggleBehaviorPanel/);
  assert.match(background, /dailyTimerRunning/);
  assert.match(background, /renderDailyTimer/);
  assert.doesNotMatch(background, /wafdeen|الوافدين/i);
});

test('removing class support does not add a client-side deletion of historical records', () => {
  assert.match(storage, /writeRecord: async function/);
  assert.match(storage, /deleteRecord: async function/);
  assert.match(storage, /hydrateMain\(\)/);
  for (const bridge of [storage, publicStorage]) {
    assert.match(bridge, /listWafdeenSessionData: async function/);
    assert.match(bridge, /purpose !== 'report'/);
    assert.doesNotMatch(bridge, /listWafdeenStudentNames|createWafdeenSession|addWafdeenStudent|listWafdeenTeachers|createWafdeenTeacher/);
    assert.doesNotMatch(bridge, /wafdeenLogin|hydrateWafdeen|refreshWafdeenViews|findWafdeenRecord|saveWafdeenUsage|loadWafdeen|getWafdeenMonthlyReports|wafdeenTeachers|wafdeenStudents|wafdeenDailyRecords|wafdeenUsage/i);
  }
  assert.doesNotMatch(optionalCompat, /wafdeen|الوافدين/i);
  assert.doesNotMatch(main, /(?:writeRecord|deleteRecord)\(['"]wafdeen/i);
  assert.doesNotMatch(publicMain, /(?:writeRecord|deleteRecord)\(['"]wafdeen/i);
  assert.equal(main, publicMain, 'public fallback must match the source application');
});

test('general appearance is retained under neutral assets only', () => {
  assert.match(html, /almajd-global-redesign\.css/);
  assert.match(neutralTheme, /#login-screen/);
  assert.match(neutralTheme, /#results-screen/);
  assert.match(neutralTheme, /#app-screen\.container/);
  assert.match(neutralTheme, /#main-menu-drawer/);
  assert.doesNotMatch(neutralTheme, /wafdeen|الوافدين/i);
  assert.equal(studentPortalCss, publicStudentPortalCss, 'student portal CSS fallback must match the source');
  assert.match(studentPortalCss, /\.student-portal-fullscreen/);
  assert.equal(contrastCss, publicContrastCss, 'contrast CSS fallback must match the source');
  assert.equal(contrastCss, appearanceContrastCss, 'appearance contrast layer must include the same shared fixes');
  assert.doesNotMatch(routeMetadata, /بوابة الوافدين|wafdeen/i);
});
