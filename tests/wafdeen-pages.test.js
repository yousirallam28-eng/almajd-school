import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import viteConfig from '../vite.config.js';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const standaloneHtml = readFileSync(new URL('../wafdeen.html', import.meta.url), 'utf8');

test('the main site links to the Wafdeen page at the project root', () => {
  assert.match(indexHtml, /href="wafdeen\.html"/);
  assert.match(indexHtml, /موقع الوافدين/);
  assert.equal(existsSync(new URL('../wafdeen.html', import.meta.url)), true);
});

test('the standalone Wafdeen route and every local HTML asset exist at the published paths', () => {
  assert.equal(existsSync(new URL('../public/wafdeen.html', import.meta.url)), true, 'keep the previous public-page route intact');
  assert.equal(existsSync(new URL('../src/features/wafdeen/standalone-entry.js', import.meta.url)), true);
  assert.equal(existsSync(new URL('../src/features/wafdeen/standalone-policy.js', import.meta.url)), true);

  const refs = [...standaloneHtml.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((ref) => !/^[a-z][a-z\d+.-]*:/i.test(ref) && !ref.startsWith('#'));
  for (const ref of refs) {
    const localPath = new URL(`../${ref.replace(/^\.\//, '').split(/[?#]/, 1)[0]}`, import.meta.url);
    assert.equal(existsSync(localPath), true, `missing local route asset: ${ref}`);
    if (ref.startsWith('./wafdeen/js/')) {
      assert.equal(existsSync(new URL(`../public/${ref.replace(/^\.\//, '')}`, import.meta.url)), true, `missing Vite static copy: ${ref}`);
    }
  }
});

test('Vite builds both the main site and the root-level Wafdeen page', () => {
  assert.deepEqual(Object.keys(viteConfig.build.rollupOptions.input), ['main', 'wafdeen']);
  assert.equal(Boolean(viteConfig.plugins?.some((plugin) => plugin.name === 'wafdeen-public-paths')), false);
});
