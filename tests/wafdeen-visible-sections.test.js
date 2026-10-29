import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../wafdeen.html', import.meta.url), 'utf8');
const client = readFileSync(new URL('../public/wafdeen/js/script-05.js', import.meta.url), 'utf8');
const drawer = html.match(/<aside[^>]*id="wafdeen-drawer"[^>]*>([\s\S]*?)<\/aside>/)?.[1] || '';
const panelRouter = client.match(/function wafdeenShowPanel\(name\) \{([\s\S]*?)\n\}/)?.[1] || '';
const panelNames = ['daily', 'materials', 'grades', 'educationTime', 'cloudReview', 'teachers', 'students', 'report'];

function mockPanelRouter(user) {
  const visible = new Set();
  const elements = new Map(panelNames.map((name) => [
    `wafdeen-panel-${name}`,
    { classList: { toggle(className, shouldHide) {
      if (className !== 'hidden') return;
      if (shouldHide) visible.delete(name);
      else visible.add(name);
    } } }
  ]));
  const getPanel = new Function(
    'currentWafdeenTeacher', 'document', 'closeWafdeenMenu',
    'wafdeenRenderGrades', 'wafdeenRenderEducationTime', 'wafdeenReportPanelInit',
    'wafdeenRenderCloudReview', 'wafdeenRenderTeachersTable', 'wafdeenRenderStudentsTable', 'wafdeenRenderMaterials',
    `${client.slice(client.indexOf('function wafdeenShowPanel(name) {'), client.indexOf('/* -------- إدارة المعلمين والطلاب -------- */'))}; return wafdeenShowPanel;`
  );
  const route = getPanel(user, { getElementById: (id) => elements.get(id) || null }, () => {}, () => {}, () => {}, () => {}, () => {}, () => {}, () => {}, () => {}, () => {});
  return { route, visible };
}

test('Wafdeen navigation exposes only grades, accounts, and students', () => {
  const destinations = [...drawer.matchAll(/wafdeenShowPanel\('([^']+)'\)/g)].map((match) => match[1]);
  assert.deepEqual(destinations, ['grades', 'teachers', 'students']);
  assert.match(drawer, /درجات الوافدين/);
  assert.match(drawer, /حسابات الوافدين/);
  assert.match(drawer, /طلاب الوافدين/);

  for (const id of ['daily', 'educationTime', 'materials', 'cloudReview', 'report']) {
    const openingTag = html.match(new RegExp(`<div\\b(?=[^>]*\\bid="wafdeen-panel-${id}")(?=[^>]*\\bclass="[^"]*\\bhidden\\b[^"]*")[^>]*>`));
    assert.ok(openingTag, `${id} must remain hidden at page load`);
  }
});

test('panel routing allows only target panels and keeps admin data restricted', () => {
  assert.match(panelRouter, /!\['grades', 'teachers', 'students'\]\.includes\(name\)/);
  assert.match(panelRouter, /name === 'grades' && isStudent/);
  assert.match(panelRouter, /\(name === 'teachers' \|\| name === 'students'\) && !isAdmin/);
  assert.match(client, /wafdeen-admin-menu-items'\)\.style\.display = .*isAdmin/);
  assert.match(client, /wafdeen-admin-area'\)\.classList\.toggle\('show'.*isAdmin/);
});

test('student login does not open grades and gets an explicit safe-linkage notice', () => {
  assert.ok(/<div(?=[^>]*id="wafdeen-student-grades-unavailable")(?=[^>]*class="wafdeen-note hidden")/.test(html));
  assert.ok(html.includes('عرض درجات الطالب لنفسه غير متاح'));
  assert.match(client, /if \(!isStudent\) wafdeenShowPanel\('grades'\)/);
  assert.match(client, /name === 'grades' && isStudent\) return/);
});

test('mock roles can open only the panels allowed by their existing UI role', () => {
  const staff = mockPanelRouter({ role: 'teacher', isAdmin: false });
  staff.route('grades');
  assert.deepEqual([...staff.visible], ['grades']);
  staff.route('teachers');
  staff.route('students');
  staff.route('daily');
  assert.deepEqual([...staff.visible], ['grades']);

  const admin = mockPanelRouter({ role: 'admin', isAdmin: true });
  admin.route('teachers');
  assert.deepEqual([...admin.visible], ['teachers']);
  admin.route('students');
  assert.deepEqual([...admin.visible], ['students']);

  const student = mockPanelRouter({ role: 'student', isAdmin: false });
  student.route('grades');
  assert.deepEqual([...student.visible], []);
});
