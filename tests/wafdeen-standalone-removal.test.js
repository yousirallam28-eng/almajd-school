import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const config = read('wafdeen/js/supabase-config.js');

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

test('the Wafdeen page has been removed from navigation and build inputs', () => {
  const index = read('index.html');
  const vite = read('vite.config.js');
  assert.doesNotMatch(index, /href="wafdeen\.html"|موقع الوافدين/);
  assert.equal(existsSync(resolve(root, 'wafdeen.html')), false);
  assert.equal(existsSync(resolve(root, 'public/wafdeen.html')), false);
  assert.doesNotMatch(vite, /wafdeen:\s*resolve\(projectRoot, 'wafdeen\.html'\)/);
});

test('the Supabase URL, key and table settings retain the verified main values', () => {
  for (const name of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_RECORDS_TABLE']) {
    const actual = settingLine(config, name);
    assert.ok(actual, `standalone config has the ${name} setting`);
    assert.equal(digest(actual), verifiedSettingDigests[name], `${name} must remain unchanged`);
  }
  assert.match(config, /window\.supabase\.createClient\(SUPABASE_URL, SUPABASE_ANON_KEY\)/);
  assert.equal(read('wafdeen/js/supabase-config.js'), read('public/wafdeen/js/supabase-config.js'));
});

test('Wafdeen account API retains its supported teacher classes and centers', () => {
  const admin = read('supabase/functions/majd-api/wafdeen_admin.js');
  const classesBlock = admin.match(/const ALLOWED_CLASSES = new Set\(\[([\s\S]*?)\]\);/)?.[1] || '';
  const centersBlock = admin.match(/const ALLOWED_CENTERS = new Set\(\[([\s\S]*?)\]\);/)?.[1] || '';
  const allowedClasses = [...classesBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  const allowedCenters = [...centersBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.ok(allowedClasses.length > 0 && allowedCenters.length > 0);
  assert.match(admin, /ALLOWED_CLASSES/);
  assert.match(admin, /ALLOWED_CENTERS/);
});
