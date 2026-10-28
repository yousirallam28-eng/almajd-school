import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const switcher = readFileSync(new URL('../legacy/js/theme-switcher.js', import.meta.url), 'utf8');
const liveApp = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
const liquidTheme = readFileSync(new URL('../legacy/css/liquid-glass-theme.css', import.meta.url), 'utf8');

const themeStylesheetIds = [
  'wafdeen-redesign',
  'unified-reference-theme',
  'liquid-glass-theme',
  'final-contrast-overrides'
];

test('theme links retain Vite IDs and fall back to direct GitHub Pages public paths', () => {
  for (const id of themeStylesheetIds) {
    assert.match(html, new RegExp(`<link[^>]*href="%BASE_URL%appearance/[^\"]+"[^>]*id="${id}"[^>]*onerror="[^"]*public/appearance/`));
  }
});

test('appearance changes do not force layout or rebuild the analysis report', () => {
  assert.doesNotMatch(switcher, /getClientRects|renderStudentDataAnalysis\s*\(/);
  assert.match(switcher, /scheduleChartAppearanceUpdate\(\)/);
  assert.match(liveApp, /function updateStudentDataAnalysisAppearance\(\)/);
  assert.match(liveApp, /chart\.update\('none'\)/);
});

test('appearance switch updates linked styles, persists selection, and coalesces chart refreshes', () => {
  const elements = new Map();
  const stylesheets = new Map(themeStylesheetIds.map((id) => [id, { disabled: false }]));
  const attrs = new Map();
  const localValues = new Map([['almajd-site-appearance', 'old']]);
  const frames = [];
  let chartRefreshes = 0;

  const root = {
    setAttribute(name, value) { attrs.set(name, value); },
    getAttribute(name) { return attrs.get(name) ?? null; }
  };
  const button = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
  const label = { textContent: '' };
  elements.set('theme-switcher', button);
  elements.set('theme-switcher-current', label);

  const document = {
    documentElement: root,
    getElementById(id) {
      if (stylesheets.has(id)) return stylesheets.get(id);
      if (id === 'theme-switcher' || id === 'theme-switcher-current') return elements.get(id);
      if (id === 'analysis-charts-grid') throw new Error('theme toggle must not inspect layout');
      return null;
    }
  };
  const window = {
    localStorage: {
      getItem(key) { return localValues.get(key) ?? null; },
      setItem(key, value) { localValues.set(key, value); }
    },
    requestAnimationFrame(callback) { frames.push(callback); },
    updateStudentDataAnalysisAppearance() { chartRefreshes += 1; }
  };

  vm.runInNewContext(switcher, { window, document });
  assert.equal(attrs.get('data-site-appearance'), 'old');
  assert.equal(stylesheets.get('liquid-glass-theme').disabled, true);
  assert.equal(label.textContent, 'الشكل القديم');

  window.toggleSiteAppearance();
  assert.equal(attrs.get('data-site-appearance'), 'new');
  assert.equal(stylesheets.get('liquid-glass-theme').disabled, false);
  assert.equal(localValues.get('almajd-site-appearance'), 'new');
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(label.textContent, 'الشكل الجديد');
  assert.equal(frames.length, 1);

  window.toggleSiteAppearance();
  assert.equal(attrs.get('data-site-appearance'), 'old');
  assert.equal(frames.length, 1, 'rapid toggles should share one chart update');
  frames[0]();
  assert.equal(chartRefreshes, 1);
});

test('touch devices skip backdrop filters and decorative blurred login layers', () => {
  assert.match(liquidTheme, /@media \(hover: none\), \(pointer: coarse\), \(max-width: 650px\)/);
  assert.match(liquidTheme, /backdrop-filter:\s*none\s*!important/);
  assert.match(liquidTheme, /body\.login-screen-active::before[\s\S]*display:\s*none\s*!important/);
});
