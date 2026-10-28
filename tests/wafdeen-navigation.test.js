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

test('Wafdeen login reuses staff authentication and checks the existing permission before opening the session', () => {
  assert.match(html, /id="wafdeen-login-btn" onclick="showWafdeenEntryScreen\(\)"/);
  assert.match(feature, /installWafdeenLoginEntry/);
  assert.match(loginEntry, /await window\.handleLogin\(\)/);
  assert.match(loginEntry, /if \(!canOpenFeature\('wafdeen', teacher\)\)/);
  assert.match(loginEntry, /openTab\('wafdeen-tab'\)/);
  assert.match(feature, /window\.openWafdeenTab = \(\) => openTab\('wafdeen-tab'\)/);
  const openBranch = feature.slice(feature.indexOf("if (tabId === 'wafdeen-tab' || tabId === 'wafdeen-monthly-report-tab')"));
  const sessionOpenBlock = openBranch.slice(0, openBranch.indexOf('Promise.resolve(window.MajdApp?.loadFeature(tabId))'));
  assert.doesNotMatch(sessionOpenBlock, /sheikh-recordings-menu/);
  assert.match(feature, /if \(tabId === 'wafdeen-monthly-report-tab'\) \{\s*byId\('sheikh-recordings-menu-wrap'\)\?\.classList\.add\('open'\);\s*byId\('sheikh-recordings-menu-btn'\)\?\.classList\.add\('active'\);/);
});
