import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const bridge = readFileSync(new URL('../public/legacy/js/inline-28.js', import.meta.url), 'utf8');

test('cloud request timeout covers response-body reading', () => {
  const fetchPosition = bridge.indexOf('response = await fetch(EDGE_URL');
  const bodyPosition = bridge.indexOf('payload = await response.json()', fetchPosition);
  const timeoutCleanupPosition = bridge.indexOf('if (timeout) clearTimeout(timeout)', fetchPosition);
  assert.ok(fetchPosition >= 0 && bodyPosition > fetchPosition);
  assert.ok(timeoutCleanupPosition > bodyPosition, 'deadline must remain active until the response body is consumed');
  assert.match(bridge, /controller\.signal\.aborted\) throw bodyError/);
});

test('wafdeen hydration does not silently turn cloud read failures into empty datasets', () => {
  const start = bridge.indexOf('async function hydrateWafdeen()');
  const end = bridge.indexOf('\n  function ', start + 1);
  assert.ok(start >= 0 && end > start);
  const hydrate = bridge.slice(start, end);
  assert.match(hydrate, /Promise\.all\(names\.map\(async function \(name\) \{ return \[name, await readAll\(name\)\]; \}\)\)/);
  assert.doesNotMatch(hydrate, /catch\s*\([^)]*\)\s*\{\s*return\s*\[name,\s*\[\]\]/);
});
