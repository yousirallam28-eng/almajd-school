import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'docs/source-manifest.json'), 'utf8'));
const hash = (s) => createHash('sha256').update(s).digest('hex');

test('all original script payloads are preserved or have a documented compatibility patch', async () => {
  for (const item of manifest.legacy_scripts) {
    const body = await readFile(path.join(root, item.file), 'utf8');
    const override = manifest.compatibility_overrides?.find(entry => entry.file === item.file);
    if (override) {
      assert.equal(item.sha256, override.original_sha256, `original hash changed: ${item.file}`);
      assert.equal(hash(body.replace(/\n$/, '')), override.patched_sha256, `patch changed: ${item.file}`);
    } else {
      assert.equal(hash(body.replace(/\n$/, '')), item.sha256, item.file);
    }
  }
});

test('all CSS declarations are preserved and the cascade order remains recorded', async () => {
  const css = await readFile(path.join(root, manifest.styles.file), 'utf8');
  assert.equal(hash(css), manifest.styles.sha256);
  assert.equal(manifest.original_style_blocks, 30);
});

test('HTML retains all source IDs, event-handler attributes, tabs, and external dependencies', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid=["\']([^"\']+)["\']/gi)].map(m => m[1]);
  for (const id of manifest.source_dom.ids) assert.ok(ids.includes(id), `missing id ${id}`);
  const handlers = [...html.matchAll(/\bon(?:click|change|input|submit|keydown|load)\s*=["\']([^"\']*)["\']/gi)].map(m => m[1]);
  for (const handler of manifest.source_dom.handlers) assert.ok(handlers.includes(handler), `missing handler ${handler}`);
  for (const tab of manifest.source_dom.tabs) assert.ok(html.includes(`id="${tab}"`), `missing tab ${tab}`);
  for (const url of manifest.external_scripts) assert.ok(html.includes(url), `missing external dependency ${url}`);
});

test('all generated classic script files exist and are referenced in source order', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  let prior = -1;
  for (const item of manifest.legacy_scripts.filter(x => x.kind === 'classic')) {
    await readFile(path.join(root, item.file), 'utf8');
    const tag = `src="./legacy/${path.basename(item.file)}"`;
    const index = html.indexOf(tag);
    assert.ok(index >= 0, `missing script tag ${tag}`);
    assert.ok(index > prior, `script order changed: ${tag}`);
    prior = index;
  }
});

test('cloud record-size inspector remains a read-only ES module with its UI targets', async () => {
  const js = await readFile(path.join(root, 'src/modules/cloud-usage/record-sizes.js'), 'utf8');
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(js, /collection\(groups\[i\]\[0\]\)\.get\(\)/);
  assert.doesNotMatch(js, /\.(?:set|update|delete)\s*\(/);
  assert.ok(html.includes('cloud-record-size-results'));
  assert.ok(html.includes('cloud-record-size-filter'));
});

test('a persisted local teacher cannot bypass cloud auth, and student sync errors are visible', async () => {
  const core = await readFile(path.join(root, 'public/legacy/07-core-application.js'), 'utf8');
  const cache = await readFile(path.join(root, 'public/legacy/26-student-cache.js'), 'utf8');
  assert.match(core, /currentTeacher && window\.__MAJD_SUPABASE_APP__ && !window\.__MAJD_SUPABASE_APP__\.token\(\)/);
  assert.match(core, /window\.studentFastCloudError_\s*=\s*e/);
  assert.match(cache, /window\.studentFastCloudError_/);
});
