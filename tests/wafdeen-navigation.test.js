import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const feature = readFileSync(new URL('../src/features/wafdeen/index.js', import.meta.url), 'utf8');
const loginEntry = readFileSync(new URL('../src/features/wafdeen/login-entry.js', import.meta.url), 'utf8');

test('Wafdeen login entry is directly below Parent Follow-up on the outer login screen', () => {
  assert.match(html, /class="action-btn student-login-link-btn modern-quick-btn"[^>]*>[\s\S]*?متابعة ولي الأمر\s*<\/button>\s*<button[^>]*id="wafdeen-login-btn"[^>]*>\s*🕌 دخول جلسة الوافدين\s*<\/button>/);
  assert.match(html, /id="wafdeen-entry-screen"[\s\S]*?id="wafdeen-login-username"[\s\S]*?id="wafdeen-login-password"/);
  const sidebar = html.match(/<aside[^>]*id="main-menu-drawer"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(sidebar, 'the authenticated sidebar must exist');
  assert.doesNotMatch(sidebar, /wafdeen-tab-btn|wafdeen-login-btn|openWafdeenTab/);
  const sheikhSubmenu = sidebar.match(/<div class="reports-submenu" id="sheikh-recordings-submenu">([\s\S]*?)<\/div>/)?.[1] || '';
  assert.match(sheikhSubmenu, /wafdeen-monthly-report-tab-btn/);
  assert.doesNotMatch(sheikhSubmenu, /wafdeen-tab-btn|wafdeen-login-btn|واجهة الوافدين|جلسة الوافدين/);
});

test('the Wafdeen screen uses its own standalone-style drawer with only retained destinations', () => {
  const drawer = html.match(/<aside[^>]*id="wafdeen-drawer"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(drawer, 'the Wafdeen screen must have its own internal drawer');
  for (const [id, label] of [
    ['daily', 'الرصد اليومي'],
    ['grades', 'الدرجات'],
    ['teachers', 'إضافة / إدارة المعلمين'],
    ['students', 'إضافة / إدارة الطلاب']
  ]) {
    assert.match(drawer, new RegExp(`data-wafdeen-panel-button="${id}"`));
    assert.match(drawer, new RegExp(label));
    assert.match(html, new RegExp(`data-wafdeen-panel="${id}"`));
  }
  assert.doesNotMatch(drawer, /تقرير الشهري الوقتي|التقرير الشهري|مراجعة أسماء السحابة|وقت التعليم|المواد التعليمية|Firebase|Firestore/i);
  assert.match(html, /id="wafdeen-monthly-report-tab-btn"[^>]*>[\s\S]*?تقرير الشهري الوقتي/);
});

test('the Wafdeen drawer replaces the general navigation only while its session tab is active', () => {
  assert.match(html, /id="main-menu-handle"/);
  assert.match(html, /id="main-menu-drawer"/);
  assert.match(html, /id="menu-overlay"/);
  assert.match(feature, /function setGeneralNavigationVisible\(visible\)/);
  assert.match(feature, /if \(!visible\) window\.closeMainMenu\?\.\(\)/);
  assert.match(feature, /if \(tabId === 'wafdeen-tab'\) setGeneralNavigationVisible\(false\)/);
  assert.match(feature, /setGeneralNavigationVisible\(true\);\s*setWafdeenMenuOpen\(false\)/);
  assert.match(feature, /setGeneralNavigationVisible\(true\);\s*\}/);
  assert.match(feature, /if \(byId\('app-screen'\)\?\.classList\.contains\('hidden'\)\) \{\s*setWafdeenMenuOpen\(false\);\s*setGeneralNavigationVisible\(true\);/);
});

test('Wafdeen login reuses staff authentication and checks the existing permission before opening the session', () => {
  assert.match(html, /id="wafdeen-login-btn" onclick="showWafdeenEntryScreen\(\)"/);
  assert.match(feature, /installWafdeenLoginEntry/);
  assert.match(html, /<link rel="stylesheet" href="src\/features\/wafdeen\/wafdeen\.css\?v=wafdeen-menu-1" id="wafdeen-style">/);
  assert.doesNotMatch(feature, /import\s+['"][^'"]+\.css['"]/);
  assert.match(loginEntry, /await window\.handleLogin\(\)/);
  assert.match(loginEntry, /if \(!canOpenFeature\('wafdeen', teacher\)\)/);
  assert.match(loginEntry, /openTab\('wafdeen-tab'\)/);
  assert.match(feature, /window\.openWafdeenTab = \(\) => openTab\('wafdeen-tab'\)/);
  const openBranch = feature.slice(feature.indexOf("if (tabId === 'wafdeen-tab' || tabId === 'wafdeen-monthly-report-tab')"));
  const sessionOpenBlock = openBranch.slice(0, openBranch.indexOf('Promise.resolve(window.MajdApp?.loadFeature(tabId))'));
  assert.doesNotMatch(sessionOpenBlock, /sheikh-recordings-menu/);
  assert.match(feature, /if \(tabId === 'wafdeen-monthly-report-tab'\) \{\s*byId\('sheikh-recordings-menu-wrap'\)\?\.classList\.add\('open'\);\s*byId\('sheikh-recordings-menu-btn'\)\?\.classList\.add\('active'\);/);
});
