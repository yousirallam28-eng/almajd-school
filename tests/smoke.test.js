import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('legacy assets are externalized and modular entry is present', () => {
  assert.ok(existsSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url)));
  assert.ok(existsSync(new URL('../public/legacy/css/style-1.css', import.meta.url)));
  assert.match(html, /src="src\/main\.js"/);
  assert.ok(!html.includes('function addTeacher()'));
});
