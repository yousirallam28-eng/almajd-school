import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import viteConfig from '../vite.config.js';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('the main site contains a standalone Wafdeen entry without embedding its legacy forms', () => {
  assert.match(indexHtml, /href="wafdeen\.html"/);
  assert.match(indexHtml, /موقع الوافدين/);
});

test('the standalone Wafdeen page is published while no embedded feature module is added', () => {
  assert.equal(existsSync(new URL('../public/wafdeen.html', import.meta.url)), true);
  assert.equal(existsSync(new URL('../src/features/wafdeen', import.meta.url)), false);
});

test('Vite builds only the main site and has no Wafdeen path rewrite', () => {
  assert.deepEqual(Object.keys(viteConfig.build.rollupOptions.input), ['main']);
  assert.equal(Boolean(viteConfig.plugins?.some((plugin) => plugin.name === 'wafdeen-public-paths')), false);
});
