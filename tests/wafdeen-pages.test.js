import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import viteConfig from '../vite.config.js';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const wafdeenHtml = readFileSync(new URL('../wafdeen.html', import.meta.url), 'utf8');

test('the Wafdeen login entry stays after Parent Follow-up and outside the general navigation', () => {
  const parentButton = indexHtml.indexOf('متابعة ولي الأمر');
  const routeButton = indexHtml.indexOf('id="wafdeen-login-route-btn"');
  assert.ok(parentButton >= 0 && routeButton > parentButton);
  assert.match(indexHtml.slice(parentButton, routeButton), /button/);
  assert.match(indexHtml.slice(routeButton, routeButton + 240), /wafdeen\.html/);
  assert.doesNotMatch(indexHtml.slice(0, routeButton), /wafdeen-login-route-btn/);
});

test('the standalone page assets resolve from raw repository-root hosting', () => {
  assert.match(wafdeenHtml, /href="\.\/public\/wafdeen\//);
  assert.match(wafdeenHtml, /src="\.\/public\/wafdeen\//);
  assert.match(wafdeenHtml, /src="\.\/src\/features\/wafdeen\/standalone-entry\.js"/);
  assert.ok(wafdeenHtml.indexOf('script-09.js') < wafdeenHtml.indexOf('standalone-entry.js'));
  assert.ok(wafdeenHtml.indexOf('standalone-entry.js') < wafdeenHtml.indexOf('</body>'));
});

test('Vite builds the main and standalone page and rewrites source-public URLs', () => {
  assert.ok(viteConfig.build.rollupOptions.input.main.endsWith('/index.html'));
  assert.ok(viteConfig.build.rollupOptions.input.wafdeen.endsWith('/wafdeen.html'));
  const plugin = viteConfig.plugins.find((item) => item.name === 'wafdeen-public-paths');
  assert.ok(plugin);
  const transformed = plugin.transformIndexHtml.handler('<link href="./public/wafdeen/css/route.css">');
  assert.equal(transformed, '<link href="./wafdeen/css/route.css">');
});
