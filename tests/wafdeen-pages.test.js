import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import viteConfig from '../vite.config.js';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('the Wafdeen page is removed from the site and production build routes', () => {
  assert.doesNotMatch(indexHtml, /href=["'](?:\.\/)?wafdeen\.html/i);
  assert.doesNotMatch(indexHtml, /موقع الوافدين/);
  assert.equal(existsSync(new URL('../wafdeen.html', import.meta.url)), false);
  assert.equal(existsSync(new URL('../public/wafdeen.html', import.meta.url)), false);
  assert.deepEqual(Object.keys(viteConfig.build.rollupOptions.input), ['main']);
});
