import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const feature = readFileSync(new URL('../src/features/wafdeen/index.js', import.meta.url), 'utf8');

test('Wafdeen session is a standalone entry in the outer sidebar, not Sheikh Recordings', () => {
  const sidebar = html.match(/<aside[^>]*id="main-menu-drawer"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(sidebar, 'the outer sidebar must exist');

  const entryPosition = sidebar.indexOf('id="wafdeen-tab-btn"');
  const sheikhMenuPosition = sidebar.indexOf('id="sheikh-recordings-submenu"');
  assert.ok(entryPosition >= 0 && entryPosition < sheikhMenuPosition, 'the session entry must precede and sit outside the Sheikh Recordings submenu');
  assert.match(sidebar, /<button[^>]*id="wafdeen-tab-btn"[^>]*>🕌 جلسة الوافدين<\/button>/);

  const sheikhSubmenu = sidebar.match(/<div class="reports-submenu" id="sheikh-recordings-submenu">([\s\S]*?)<\/div>/)?.[1] || '';
  assert.doesNotMatch(sheikhSubmenu, /wafdeen-tab-btn|واجهة الوافدين|جلسة الوافدين/);
});

test('opening the standalone session no longer expands Sheikh Recordings automatically', () => {
  assert.match(html, /id="wafdeen-tab-btn" onclick="openWafdeenTab\(\)"/);
  assert.match(feature, /window\.openWafdeenTab = \(\) => openTab\('wafdeen-tab'\)/);
  const openBranch = feature.slice(feature.indexOf("if (tabId === 'wafdeen-tab' || tabId === 'wafdeen-monthly-report-tab')"));
  const sessionOpenBlock = openBranch.slice(0, openBranch.indexOf('Promise.resolve(window.MajdApp?.loadFeature(tabId))'));
  assert.doesNotMatch(sessionOpenBlock, /sheikh-recordings-menu/);
  assert.match(feature, /if \(tabId === 'wafdeen-monthly-report-tab'\) \{\s*byId\('sheikh-recordings-menu-wrap'\)\?\.classList\.add\('open'\);\s*byId\('sheikh-recordings-menu-btn'\)\?\.classList\.add\('active'\);/);
});
