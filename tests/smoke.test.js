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

test('keep-login preserves the Supabase session and reloads cloud data', () => {
  assert.match(html, /checked[^>]*id="keepLogin"/);
  const authCore = readFileSync(new URL('../public/legacy/js/js__core__admin-analysis-visibility.js', import.meta.url), 'utf8');
  const bridge = readFileSync(new URL('../public/legacy/js/inline-28.js', import.meta.url), 'utf8');
  assert.match(authCore, /window\.localStorage/);
  assert.match(authCore, /window\.sessionStorage/);
  assert.match(authCore, /keepLogin/);
  assert.match(bridge, /readSessionToken_\(\)/);
  assert.match(bridge, /localStorage\.setItem\('majdSessionToken'/);
  assert.match(bridge, /clearSessionToken_\(\)/);
  assert.match(bridge, /persistentAuthStorage\.setItem\('currentTeacher'/);
  assert.match(bridge, /syncDataFromLocal = async function/);
  assert.match(bridge, /localIsAvailable = function \(\) \{ return !!sessionToken; \}/);
});

test('sheikh registration only exports supported classes', () => {
  const sheikhClasses = html.match(/<select id="sheikhRegClassSelect"[^>]*>([\s\S]*?)<\/select>/)?.[1] || '';
  assert.ok(sheikhClasses, 'the Sheikh registration class picker must exist');
  assert.doesNotMatch(sheikhClasses, /<option value="تمهيدي">/);
  assert.doesNotMatch(sheikhClasses, /<option value="الوافدين">/);
  const sheikhCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(sheikhCode, /function isSheikhRegistrationExportClass_\(className\)/);
  assert.match(sheikhCode, /return ALL_CLASSES\.includes\(normalized\) && normalized !== 'تمهيدي'/);
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

test('sheikh Excel exports include daily details, times, and orange incomplete rows', () => {
  const publicCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  const liveCode = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(publicCode, /function formatSheikhExcelTime_\(seconds\)/);
  assert.match(publicCode, /'وقت الجديد'.*'وقت الماضي'.*'وقت التلاوة'/s);
  assert.match(publicCode, /'حالة التفاصيل'/);
  assert.match(publicCode, /FCE4D6/);
  assert.match(publicCode, /makeSheikhDetailedExcelSheet_\(rows\)/);
  const exportSection = (code) => code.slice(code.indexOf('function exportSheikhRegistrationExcel() {'), code.indexOf('function isFifthClass(className) {'));
  assert.equal(exportSection(publicCode), exportSection(liveCode), 'Excel export sections must stay synchronized');
});

test('sheeta tab shows all students by day, week, or month with percentage bands', () => {
  assert.match(html, /id="sheeta-tab-btn"[^>]*>🗂️ الشيتة/);
  assert.match(html, /id="sheetaPeriodSelect"/);
  assert.match(html, /id="sheetaClassSelect"/);
  assert.match(html, /option value="">كل الفصول/);
  assert.match(html, /option value="day">شيتة اليوم/);
  assert.match(html, /option value="week">شيتة الأسبوع/);
  assert.match(html, /option value="month">شيتة الشهر/);
  assert.match(html, /id="sheetaTable"/);
  const publicCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  const liveCode = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(publicCode, /function renderSheetaTable\(\)/);
  assert.match(publicCode, /percentage >= 70/);
  assert.match(publicCode, /percentage >= 50/);
  assert.match(publicCode, /sheetaClassSelect/);
  assert.match(publicCode, /!selectedClass \|\| student\.className === selectedClass/);
  assert.match(publicCode, /tableId === 'sheetaTable'/);
  assert.match(publicCode, /E5F6E9/);
  assert.match(publicCode, /FFF6CF/);
  assert.match(publicCode, /FFE5E2/);
  const sheetaSection = (code) => code.slice(code.indexOf('function populateSheetaWeekOptions_()'), code.indexOf('var weeklySheetRows_ = []'));
  assert.equal(sheetaSection(publicCode), sheetaSection(liveCode), 'sheeta logic must stay synchronized');
  const exportSection = (code) => code.slice(code.indexOf('function exportToExcel(tableId, filename) {'), code.indexOf('function initCurrentDate() {'));
  assert.equal(exportSection(publicCode), exportSection(liveCode), 'sheeta Excel color export must stay synchronized');
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

test('buttons use orange feedback in the new appearance and golden yellow in the old appearance', () => {
  const feedback = readFileSync(new URL('../legacy/css/button-press-feedback.css', import.meta.url), 'utf8');
  const fallbackFeedback = readFileSync(new URL('../public/legacy/css/button-press-feedback.css', import.meta.url), 'utf8');
  assert.match(html, /button-press-feedback\.css\?v=3/);
  assert.match(feedback, /:not\(:disabled\):active/);
  assert.match(feedback, /--button-feedback-background: #f28c28;/);
  assert.match(feedback, /html\[data-site-appearance="old"\]\s*\{[^}]*--button-feedback-background: #d4af37;/s);
  assert.match(feedback, /--button-feedback-text: #302400;/);
  assert.match(feedback, /background: var\(--button-feedback-background\) !important/);
  assert.match(feedback, /background-color 240ms ease/);
  assert.match(feedback, /:is\(\s*\.active,\s*\.selected,\s*\.is-active,/);
  assert.match(feedback, /\[aria-pressed="true"\]/);
  assert.equal(fallbackFeedback, feedback);
  assert.match(feedback, /:focus-visible/);
});

test('PWA install control is available on desktop and mobile and hides after installation', () => {
  const manifest = readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8');
  const serviceWorker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');
  const installCode = readFileSync(new URL('../public/legacy/js/js__features__install-app-prompt.js', import.meta.url), 'utf8');
  const installStyles = readFileSync(new URL('../public/legacy/css/install-app-prompt.css', import.meta.url), 'utf8');
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  assert.match(html, /class="install-app-btn"[^>]*hidden/);
  assert.match(manifest, /"display": "standalone"/);
  assert.match(manifest, /"start_url": "\.\/"/);
  assert.match(serviceWorker, /addEventListener\('fetch'/);
  assert.match(installCode, /beforeinstallprompt/);
  assert.match(installCode, /btn\.hidden = installed/);
  assert.match(installCode, /appinstalled/);
  assert.match(installCode, /serviceWorker\.register\('sw\.js'/);
  assert.match(installStyles, /position: fixed/);
  assert.match(installStyles, /left: max/);
  assert.match(installStyles, /@media \(max-width: 600px\)/);
});
