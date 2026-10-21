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

test('sheikh registration excludes preparatory and wafdeen classes', () => {
  assert.doesNotMatch(html, /<select id="sheikhRegClassSelect"[\s\S]*?<option value="تمهيدي">/);
  assert.doesNotMatch(html, /<select id="sheikhRegClassSelect"[\s\S]*?<option value="الوافدين">/);
  const sheikhCode = readFileSync(new URL('../public/legacy/js/js__features__main-application.js', import.meta.url), 'utf8');
  assert.match(sheikhCode, /normalized !== 'تمهيدي' && normalized !== 'الوافدين'/);
});
