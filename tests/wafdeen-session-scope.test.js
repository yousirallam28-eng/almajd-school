import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SITE_SESSION_SCOPE,
  WAFDEEN_SESSION_SCOPE,
  authorizeApiOperation,
  selectAccountForLogin,
  sessionScopeForLoginMode,
  sessionScopeFromClaims,
  signSessionToken,
  verifySessionToken
} from '../supabase/functions/majd-api/session_scope.js';

const isAdmin = (account) => account?.username_norm === 'admin' || account?.profile?.role === 'admin';
const canWafdeenStaff = { id: 'staff-1', username: 'teacher', username_norm: 'teacher', account_type: 'staff', profile: { canWafdeen: true } };
const ordinaryStaff = { id: 'staff-2', username: 'clerk', username_norm: 'clerk', account_type: 'staff', profile: { canWafdeen: false } };

async function signArbitraryClaims(claims, secret) {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
  return `${payload}.${Buffer.from(signature).toString('base64url')}`;
}

test('only the dedicated login mode receives Wafdeen scope, using existing eligible accounts', () => {
  assert.equal(sessionScopeForLoginMode(undefined), SITE_SESSION_SCOPE);
  assert.equal(sessionScopeForLoginMode('staff'), SITE_SESSION_SCOPE);
  assert.equal(sessionScopeForLoginMode('wafdeen'), WAFDEEN_SESSION_SCOPE);
  assert.equal(sessionScopeForLoginMode('unknown'), null);
  assert.equal(selectAccountForLogin('staff', [canWafdeenStaff], isAdmin), canWafdeenStaff);
  assert.equal(selectAccountForLogin('wafdeen', [canWafdeenStaff], isAdmin), canWafdeenStaff);
  assert.equal(selectAccountForLogin('wafdeen', [ordinaryStaff], isAdmin), null);
  const admin = { id: 'admin-1', username: 'admin', username_norm: 'admin', account_type: 'staff', profile: { role: 'admin' } };
  assert.equal(selectAccountForLogin('wafdeen', [admin], isAdmin), admin);
});

test('only a valid HMAC-authenticated claim establishes Wafdeen scope', async () => {
  const secret = 'local-test-secret-not-a-live-key';
  const now = Date.UTC(2026, 9, 28, 12, 0, 0);
  const wafdeenToken = await signSessionToken('account-1', WAFDEEN_SESSION_SCOPE, secret, 8 * 60 * 60, now);
  const siteToken = await signSessionToken('account-1', SITE_SESSION_SCOPE, secret, 8 * 60 * 60, now);
  assert.equal((await verifySessionToken(wafdeenToken, secret, now + 1000)).scope, WAFDEEN_SESSION_SCOPE);
  assert.equal((await verifySessionToken(siteToken, secret, now + 1000)).scope, SITE_SESSION_SCOPE);
  assert.equal(await verifySessionToken(wafdeenToken, 'different-local-test-secret', now + 1000), null);
  assert.equal(await verifySessionToken(wafdeenToken, secret, now + 9 * 60 * 60 * 1000), null);

  const [payload, signature] = wafdeenToken.split('.');
  const alteredClaims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  alteredClaims.scope = SITE_SESSION_SCOPE;
  const forged = `${Buffer.from(JSON.stringify(alteredClaims)).toString('base64url')}.${signature}`;
  assert.equal(await verifySessionToken(forged, secret, now + 1000), null, 'changing the signed scope invalidates the token');

  const legacyToken = await signArbitraryClaims({ sub: 'legacy-account', exp: Math.floor(now / 1000) + 60 }, secret);
  const legacyClaims = await verifySessionToken(legacyToken, secret, now + 1000);
  assert.equal(legacyClaims.scope, SITE_SESSION_SCOPE, 'pre-scope tokens remain ordinary site sessions');
  assert.equal(authorizeApiOperation(legacyClaims.scope, 'createWafdeenSession'), false, 'legacy site tokens cannot call Wafdeen endpoints');
  const unknownScopeToken = await signArbitraryClaims({ sub: 'account-1', scope: 'superuser', exp: Math.floor(now / 1000) + 60 }, secret);
  assert.equal(await verifySessionToken(unknownScopeToken, secret, now + 1000), null);
  assert.equal(sessionScopeFromClaims({ sub: 'old-account' }), SITE_SESSION_SCOPE);
  assert.equal(sessionScopeFromClaims({ sub: 'bad-account', scope: 'other' }), null);
});

test('ordinary site sessions are denied every Wafdeen session, student, and teacher endpoint', () => {
  const operations = [
    'addWafdeenStudent', 'listWafdeenTeachers', 'createWafdeenTeacher',
    'listWafdeenStudentNames', 'listWafdeenAccounts', 'listWafdeenGrades', 'createWafdeenSession'
  ];
  for (const operation of operations) {
    assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, operation), false, `${operation} requires Wafdeen scope`);
    assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, operation), true, `${operation} is within Wafdeen scope`);
  }
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'listWafdeenSessionData'), false, 'default daily reads require Wafdeen scope');
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'daily' }), false);
  assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'daily' }), true);
  assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'report', month: '2026-10' }), true);
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'listWafdeenAccounts'), false);
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'listWafdeenGrades'), false);
});

test('report reads are routed through either authenticated scope while generic Wafdeen record routes stay blocked', () => {
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'report', month: '2026-10' }), true);
  assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'report', month: '2026-10' }), true);
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'unknown' }), false);
  assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'listWafdeenSessionData', { purpose: 'unknown' }), false);

  for (const collection of ['wafdeenRoster', 'wafdeenDailyRecords', 'wafdeenStudents', 'wafdeenTeachers', 'wafdeenUsage']) {
    assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'list', { collection }), false, `site list blocked for ${collection}`);
    assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'get', { collection }), false, `site get blocked for ${collection}`);
    assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'upsert', { collection }), false, `site write blocked for ${collection}`);
    assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'list', { collection }), false, `generic Wafdeen route remains closed for ${collection}`);
  }
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'bulkUpsert', { records: [{ collection: 'wafdeenDailyRecords' }] }), false);
  assert.equal(authorizeApiOperation(SITE_SESSION_SCOPE, 'list', { collection: 'students' }), true);
  assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'list', { collection: 'students' }), false);
  assert.equal(authorizeApiOperation(WAFDEEN_SESSION_SCOPE, 'changePassword'), true);
  assert.equal(authorizeApiOperation('invalid', 'createWafdeenSession'), false);
});
