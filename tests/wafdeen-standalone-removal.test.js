import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const html = read('wafdeen.html');
const publicHtml = read('public/wafdeen.html');
const config = read('wafdeen/js/supabase-config.js');
const sourceAssets = readdirSync(resolve(root, 'wafdeen/js')).filter((name) => name.endsWith('.js'));
const publicAssets = readdirSync(resolve(root, 'public/wafdeen/js')).filter((name) => name.endsWith('.js'));
const legacyPatterns = [
  new RegExp(['fire', 'base'].join(''), 'i'),
  new RegExp(['fire', 'store'].join(''), 'i'),
  new RegExp(['fire', 'base', 'storage'].join(''), 'i')
];

function settingLine(source, name) {
  return source.match(new RegExp(`^var ${name} = .+$`, 'm'))?.[0] || '';
}
function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

const verifiedSettingDigests = Object.freeze({
  SUPABASE_URL: '98094854fdc27eab536aef8538feee07e7b86c114916ae9e3d75d8480e584eda',
  SUPABASE_ANON_KEY: '95ce6c1fc84608924f196faf1319296af47d0b78c0d08b0939af36fe1bb4a0b5',
  SUPABASE_RECORDS_TABLE: '802d5aa10c485eb8fd6b479426c7913866c0281b0651100bc3dd0c089978a902'
});

test('the Wafdeen page and all of its local assets exclude the old cloud implementation', () => {
  assert.equal(html, publicHtml, 'source and public page copies must stay identical');
  const files = [
    ['wafdeen.html', html],
    ['public/wafdeen.html', publicHtml],
    ...sourceAssets.map((name) => [`wafdeen/js/${name}`, read(`wafdeen/js/${name}`)]),
    ...publicAssets.map((name) => [`public/wafdeen/js/${name}`, read(`public/wafdeen/js/${name}`)])
  ];
  for (const [filename, contents] of files) {
    for (const pattern of legacyPatterns) assert.doesNotMatch(contents, pattern, `${filename} contains a removed cloud marker`);
  }
  assert.match(html, /@supabase\/supabase-js@2/);
  assert.match(html, /src="\.\/src\/features\/wafdeen\/standalone-entry\.js"/);
  assert.match(read('src/features/wafdeen/standalone-entry.js'), /wafdeen-classic-assets-ready/);
  assert.match(read('wafdeen/js/script-09.js'), /__WAFDEEN_CLASSIC_ASSETS_READY__/);
  assert.doesNotMatch(html, /wafdeen-panel-cloudReview/);
  assert.match(html, /الدرجات التاريخية/);
  assert.match(html, /wafdeen-open-grades/);
  assert.match(html, /wafdeen-historical-grades-table/);
  assert.match(html, /wafdeen-open-report/);
  assert.match(html, /لا يتضمن المسار أسماء الطلاب/);
  assert.match(html, /المسار لا يعيد اسم المادة أو معرف الطالب/);
  assert.doesNotMatch(html, /التقارير اليومية والأسبوعية والشهرية غير متاحة/);
  assert.match(html, /تُضاف الأسماء إلى قائمة الوافدين فقط/);
  assert.doesNotMatch(html, /wafdeenNewStudentPass/);
  assert.match(html, /wafdeenNewTeacherClass/);
  assert.match(html, /wafdeenNewTeacherCenter/);
});

test('the Supabase URL, key and table settings retain the verified main values', () => {
  for (const name of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_RECORDS_TABLE']) {
    const actual = settingLine(config, name);
    assert.ok(actual, `standalone config has the ${name} setting`);
    assert.equal(digest(actual), verifiedSettingDigests[name], `${name} must remain unchanged`);
  }
  assert.match(config, /window\.supabase\.createClient\(SUPABASE_URL, SUPABASE_ANON_KEY\)/);
  assert.equal(read('wafdeen/js/supabase-config.js'), read('public/wafdeen/js/supabase-config.js'));
  assert.match(html, /https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2/);
});

test('teacher account form offers only class and center options accepted by the current API', () => {
  const admin = read('supabase/functions/majd-api/wafdeen_admin.js');
  const classesBlock = admin.match(/const ALLOWED_CLASSES = new Set\(\[([\s\S]*?)\]\);/)?.[1] || '';
  const centersBlock = admin.match(/const ALLOWED_CENTERS = new Set\(\[([\s\S]*?)\]\);/)?.[1] || '';
  const allowedClasses = [...classesBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const allowedCenters = [...centersBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.ok(allowedClasses.length > 0 && allowedCenters.length > 0);
  for (const value of [...allowedClasses, ...allowedCenters]) assert.ok(html.includes(`>${value}</option>`), `missing supported option ${value}`);
});
