import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const applicationFiles = [
  ['main source', new URL('../legacy/js/js__features__main-application.js', import.meta.url)],
  ['main published fallback', new URL('../public/legacy/js/js__features__main-application.js', import.meta.url)],
  ['Wafdeen source bundle', new URL('../wafdeen/js/script-03.js', import.meta.url)],
  ['Wafdeen published bundle', new URL('../public/wafdeen/js/script-03.js', import.meta.url)]
];

for (const [label, fileUrl] of applicationFiles) {
  test(`${label} application defines safe escapeHtml for results summary`, () => {
    const source = readFileSync(fileUrl, 'utf8');
    const start = source.indexOf('function escapeHtml(value) {');
    const end = source.indexOf('\nfunction renderResultsAdminSummary()', start);
    assert.notEqual(start, -1, 'escapeHtml helper must exist');
    assert.notEqual(end, -1, 'escapeHtml helper must be defined before the results summary');
    const context = vm.createContext({});
    vm.runInContext(source.slice(start, end), context);
    assert.equal(context.escapeHtml(`<>&"'`), '&lt;&gt;&amp;&quot;&#39;');
    assert.equal(context.escapeHtml(null), '');
  });
}
