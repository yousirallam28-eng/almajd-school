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
