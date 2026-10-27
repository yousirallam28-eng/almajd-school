import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('legacy assets are externalized and modular entry is present', () => {
  assert.ok(existsSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url)));
  assert.ok(existsSync(new URL('../public/legacy/css/style-1.css', import.meta.url)));
  assert.match(html, /src="src\/main\.js"/);
  assert.ok(!html.includes('function addTeacher()'));
});

test('sheikh registration excludes preparatory and wafdeen classes', () => {
  assert.doesNotMatch(html, /<select id="sheikhRegClassSelect"[\s\S]*?<option value="تمهيدي">/);
  assert.doesNotMatch(html, /<select id="sheikhRegClassSelect"[\s\S]*?<option value="الوافدين">/);
  const sheikhCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(sheikhCode, /function isSheikhRegistrationExportClass_\(className\)/);
  assert.match(sheikhCode, /لا يمكن تصدير التمهيدي أو الوافدين/);
});

test('sheikh registration supports exporting a selected date range', () => {
  assert.match(html, /تصدير الأيام المحددة/);
  assert.match(html, /id="sheikhExportStartDate"/);
  assert.match(html, /id="sheikhExportEndDate"/);
  const sheikhCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(sheikhCode, /function exportSheikhRegistrationDateRangeExcel\(\)/);
  assert.match(sheikhCode, /تسجيل_الشيوخ_من_/);
});

test('selected sheikh date range skips Friday and Saturday', () => {
  const sheikhCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(sheikhCode, /dayOfWeek !== 5 && dayOfWeek !== 6/);
});

test('student code portal shows full-screen daily grades and behavior reason action', () => {
  const portalCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('../public/legacy/css/style-1.css', import.meta.url), 'utf8');
  assert.match(portalCode, /function renderStudentPortalGradeTable_\(area, stats\)/);
  assert.match(portalCode, /showStudentBehaviorReason_/);
  assert.match(portalCode, /التاريخ.*الحضور.*السلوك.*الواجب.*الجديد.*الماضي.*التلاوة.*التجويد/);
  assert.match(styles, /\.student-portal-fullscreen/);
  assert.match(styles, /\.student-behavior-reason-btn/);
});

test('quick student registration has behavior reason list and full-screen records list', () => {
  const quickCode = readFileSync(new URL('../public/legacy/js/js__features__quick-registration.js', import.meta.url), 'utf8');
  const quickStyles = readFileSync(new URL('../public/legacy/css/quick-registration-style.js.css', import.meta.url), 'utf8');
  assert.match(quickCode, /quick-behavior-reason/);
  assert.match(quickCode, /behaviorReasonsText/);
  assert.match(quickCode, /qtoggleListFullscreen/);
  assert.match(quickStyles, /quick-list-fullscreen/);
});

test('student code portal shows the same full grades for week and month', () => {
  const portalCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(portalCode, /درجات الأسبوع الحالي/);
  assert.match(portalCode, /درجات الشهر الحالي/);
  assert.match(portalCode, /stats\.weekRecords/);
  assert.match(portalCode, /stats\.monthRecords/);
});

test('student code screen is labeled for parent follow-up', () => {
  assert.match(html, /متابعة ولي الأمر/);
  assert.doesNotMatch(html, /<h2 class="login-header-text"[^>]*>تسجيل دخول الطالب<\/h2>/);
});

test('ordinary student Excel results choose the normal sheet and show only imported columns', () => {
  const main = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  const liveMain = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(main, /function readResultsExcelFilePreserveShape\(file, preparatoryOnly\)/);
  assert.match(main, /requestedPrep \? \/تمهيد\|تمهيدي\|تمهيدى\|prepar\/i/);
  assert.match(main, /sourceHeaders: \(parsed\.headers \|\| \[\]\)/);
  assert.match(main, /function renderNormalExcelResultCards_\(result, displayArea, titleText\)/);
  assert.match(main, /renderNormalExcelResultCards_\(result, displayArea, requestedPrep \? 'نتيجة الطالب التمهيدي' : 'نتيجة الطالب'\)/);
  assert.match(main, /headers\.forEach\(function\(header\)/);
  assert.match(main, /fields\.__excelRawFields/);
  assert.match(main, /normalizeResultHeaderName\(header\)/);
  assert.match(main, /function isExcelDisplayedPercentageField_\(field\)/);
  assert.match(main, /isExcelDisplayedPercentageField_\(header\) \? formatMonthlyPercentage_\(raw\)/);
  assert.match(main, /f\.includes\('مجموع'\) && f\.includes\('كلي'\) && f\.includes\('عربي'\) && f\.includes\('حساب'\)/);
  assert.match(main, /normalizeExcelHeaderKey_\(h\) !== 'م'/);
  assert.match(liveMain, /function renderNormalExcelResultCards_\(result, displayArea, titleText\)/);
  assert.match(liveMain, /normalizeExcelHeaderKey_\(h\) !== 'م'/);
});

test('liquid glass branch uses one round logo across all HTML image slots', () => {
  const themedHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const theme = readFileSync(new URL('../legacy/css/liquid-glass-theme.css', import.meta.url), 'utf8');
  assert.ok(!themedHtml.includes('data:image/'), 'old inline logo images should not remain');
  assert.ok((themedHtml.match(/<img\b[^>]*src="public\/almajd-logo-round\.png"/g) || []).length >= 6);
  assert.match(themedHtml, /liquid-glass-theme\.css/);
  assert.match(theme, /\.watermark-bg[\s\S]*\.header-logo[\s\S]*\.menu-brand-icon/);
  assert.match(theme, /Final unified surface pass/);
  assert.match(theme, /\.student-portal-fullscreen-toolbar/);
});

test('liquid glass contrast pass covers daily workspace, reports, logout, and drawer', () => {
  const theme = readFileSync(new URL('../legacy/css/liquid-glass-theme.css', import.meta.url), 'utf8');
  assert.match(theme, /#daily-workspace/);
  assert.match(theme, /#app-screen table tbody tr:nth-child\(even\)/);
  assert.match(theme, /#app-screen \.user-bar button/);
  assert.match(theme, /#main-menu-drawer\.sidebar-nav/);
  assert.match(theme, /body::before, body::after/);
  assert.match(theme, /display: none !important/);
  assert.match(theme, /Catch legacy inline white surfaces/);
});
