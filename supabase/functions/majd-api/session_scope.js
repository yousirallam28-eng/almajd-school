export const SITE_SESSION_SCOPE = 'site';
export const WAFDEEN_SESSION_SCOPE = 'wafdeen';

const WAFDEEN_OPERATIONS = new Set([
  'addWafdeenStudent',
  'listWafdeenTeachers',
  'createWafdeenTeacher',
  'listWafdeenStudentNames',
  'createWafdeenSession'
]);

const encoder = new TextEncoder();

function base64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromBase64Url(value) {
  const standard = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(standard + '==='.slice((standard.length + 3) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hmacKey(secret, usage) {
  return crypto.subtle.importKey('raw', encoder.encode(String(secret || '')), { name: 'HMAC', hash: 'SHA-256' }, false, [usage]);
}

export function sessionScopeForLoginMode(mode) {
  const requestedMode = String(mode || 'staff');
  if (requestedMode === 'staff') return SITE_SESSION_SCOPE;
  if (requestedMode === 'wafdeen') return WAFDEEN_SESSION_SCOPE;
  return null;
}

export function selectAccountForLogin(mode, activeAccounts, isAdmin) {
  const scope = sessionScopeForLoginMode(mode);
  if (!scope || !Array.isArray(activeAccounts)) return null;
  if (scope === SITE_SESSION_SCOPE) return activeAccounts.find((account) => account?.account_type === 'staff') || null;
  return activeAccounts.find((account) => account?.account_type === 'wafdeen_teacher')
    || activeAccounts.find((account) => account?.account_type === 'wafdeen_student')
    || activeAccounts.find((account) => account?.account_type === 'staff' && (isAdmin(account) || account?.profile?.canWafdeen))
    || null;
}

export function sessionScopeFromClaims(claims) {
  if (!claims || typeof claims !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(claims, 'scope')) return SITE_SESSION_SCOPE;
  return claims.scope === SITE_SESSION_SCOPE || claims.scope === WAFDEEN_SESSION_SCOPE ? claims.scope : null;
}

export function authorizeApiOperation(scope, operation, body = {}) {
  if (scope !== SITE_SESSION_SCOPE && scope !== WAFDEEN_SESSION_SCOPE) return false;
  const op = String(operation || '');
  if (op === 'changePassword') return true;

  if (op === 'listWafdeenSessionData') {
    const purpose = String(body.purpose || 'daily');
    if (purpose === 'report') return scope === SITE_SESSION_SCOPE;
    return purpose === 'daily' && scope === WAFDEEN_SESSION_SCOPE;
  }

  if (WAFDEEN_OPERATIONS.has(op)) return scope === WAFDEEN_SESSION_SCOPE;

  if (op === 'bulkUpsert') {
    const records = Array.isArray(body.records) ? body.records : [];
    if (records.some((record) => String(record?.collection || '').toLowerCase().startsWith('wafdeen'))) return false;
  }

  const collection = String(body.collection || '').toLowerCase();
  if (collection.startsWith('wafdeen')) return false;

  // The standalone session is deliberately limited to the named Wafdeen API surface.
  return scope === SITE_SESSION_SCOPE;
}

export async function signSessionToken(subject, scope, secret, ttlSeconds, nowMs = Date.now()) {
  if (scope !== SITE_SESSION_SCOPE && scope !== WAFDEEN_SESSION_SCOPE) throw new Error('INVALID_SESSION_SCOPE');
  const claims = { sub: String(subject), scope, exp: Math.floor(nowMs / 1000) + Number(ttlSeconds) };
  const payload = base64Url(encoder.encode(JSON.stringify(claims)));
  const key = await hmacKey(secret, 'sign');
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
  return `${payload}.${base64Url(signature)}`;
}

export async function verifySessionToken(token, secret, nowMs = Date.now()) {
  try {
    const [payload, signature, extra] = String(token || '').split('.');
    if (!payload || !signature || extra !== undefined) return null;
    const key = await hmacKey(secret, 'verify');
    const isValid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(payload));
    if (!isValid) return null;
    const claims = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (!claims?.sub || !Number.isFinite(claims.exp) || claims.exp < nowMs / 1000) return null;
    const scope = sessionScopeFromClaims(claims);
    if (!scope) return null;
    return { ...claims, scope };
  } catch {
    return null;
  }
}
