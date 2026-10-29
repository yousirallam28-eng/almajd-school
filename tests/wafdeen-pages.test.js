import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import viteConfig from '../vite.config.js';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('the main site contains no Wafdeen entry, section, form, or monthly report', () => {
  assert.doesNotMatch(indexHtml, /wafdeen|وافدين|تقرير الشهري الوقتي/i);
});

test('the standalone Wafdeen page, frontend modules, and public assets are removed', () => {
  for (const asset of ['../wafdeen.html', '../src/features/wafdeen', '../public/wafdeen']) {
    assert.equal(existsSync(new URL(asset, import.meta.url)), false, `${asset} must not remain in the site`);
  }
});

test('Vite builds only the main site and has no Wafdeen path rewrite', () => {
  assert.deepEqual(Object.keys(viteConfig.build.rollupOptions.input), ['main']);
  assert.equal(Boolean(viteConfig.plugins?.some((plugin) => plugin.name === 'wafdeen-public-paths')), false);
});
