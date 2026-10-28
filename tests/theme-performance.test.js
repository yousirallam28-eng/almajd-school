import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const switcher = readFileSync(new URL('../legacy/js/theme-switcher.js', import.meta.url), 'utf8');
const liveApp = readFileSync(new URL('../legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
const liquidTheme = readFileSync(new URL('../legacy/css/liquid-glass-theme.css', import.meta.url), 'utf8');
const appearanceBootstrap = html.match(/<script id="appearance-bootstrap">([\s\S]*?)<\/script>/)?.[1];

const themeStylesheetIds = [
  'modern-almajd-theme',
  'wafdeen-redesign',
  'unified-reference-theme',
  'wafdeen-same-theme',
  'liquid-glass-theme',
  'final-contrast-overrides'
];
const publicAppearanceStylesheetIds = ['wafdeen-redesign', 'unified-reference-theme', 'liquid-glass-theme', 'final-contrast-overrides'];

test('theme links retain Vite IDs and fall back to direct GitHub Pages public paths', () => {
  for (const id of publicAppearanceStylesheetIds) {
    assert.match(html, new RegExp(`<link[^>]*href="%BASE_URL%appearance/[^\"]+"[^>]*id="${id}"[^>]*onerror="[^"]*public/appearance/`));
  }
});

test('saved appearance is applied before theme stylesheets can paint over the old design', () => {
  assert.ok(appearanceBootstrap, 'an early appearance bootstrap must be present in the document head');
  assert.ok(html.indexOf('id="appearance-bootstrap"') < html.indexOf('id="modern-almajd-theme"'));
  for (const id of themeStylesheetIds) {
    assert.match(html, new RegExp(`id="${id}"[^>]*media="not all"`), `${id} must start inactive`);
  }

  const attributes = new Map();
  const window = { localStorage: { getItem() { return 'old'; } } };
  const document = { documentElement: { setAttribute(name, value) { attributes.set(name, value); } } };
  vm.runInNewContext(appearanceBootstrap, { window, document });
  assert.equal(attributes.get('data-site-appearance'), 'old');
  assert.equal(window.__almajdSiteAppearance, 'old');
});

test('appearance changes do not force layout or rebuild the analysis report', () => {
  assert.doesNotMatch(switcher, /getClientRects|renderStudentDataAnalysis\s*\(/);
  assert.match(switcher, /scheduleChartAppearanceUpdate\(\)/);
  assert.match(liveApp, /function updateStudentDataAnalysisAppearance\(\)/);
  assert.match(liveApp, /chart\.update\('none'\)/);
});

test('appearance switch updates linked styles, persists selection, and coalesces chart refreshes', () => {
  const elements = new Map();
  const stylesheets = new Map(themeStylesheetIds.map((id) => [id, { media: 'not all' }]));
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
  assert.equal(stylesheets.get('liquid-glass-theme').media, 'not all');
  assert.equal(stylesheets.get('modern-almajd-theme').media, 'not all');
  assert.equal(stylesheets.get('wafdeen-same-theme').media, 'not all');
  assert.equal(label.textContent, 'الشكل القديم');

  window.toggleSiteAppearance();
  assert.equal(attrs.get('data-site-appearance'), 'new');
  assert.equal(stylesheets.get('liquid-glass-theme').media, 'all');
  assert.equal(stylesheets.get('modern-almajd-theme').media, 'all');
  assert.equal(stylesheets.get('wafdeen-same-theme').media, 'all');
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

test('desktop glass keeps its look with bounded blur and lighter interaction transitions', () => {
  assert.match(liquidTheme, /@media \(hover: hover\) and \(pointer: fine\) and \(min-width: 651px\)/);
  assert.match(liquidTheme, /backdrop-filter:\s*blur\(12px\) saturate\(145%\)\s*!important/);
  assert.match(liquidTheme, /transition:\s*transform \.16s ease, background-color \.16s ease, color \.16s ease\s*!important/);
});
