import test from 'node:test';
import assert from 'node:assert/strict';

test('standalone entry blocks unsupported authenticated requests before mocked transport', async () => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const calls = [];
  const classes = () => {
    const values = new Set(['hidden']);
    return {
      add: (...names) => names.forEach((name) => values.add(name)),
      remove: (...names) => names.forEach((name) => values.delete(name)),
      contains: (name) => values.has(name)
    };
  };
  const elements = {
    'wafdeen-login-screen': { classList: classes() },
    'wafdeen-app-screen': { classList: classes() },
    wafdeenPassword: { value: 'old-in-memory-value' },
    wafdeenUsername: { focus() { this.focused = true; } }
  };
  let sessionCleared = false;
  let navigatedTo = '';
  const mockWindow = {
    location: { replace(path) { navigatedTo = path; } },
    stopSupabaseSession_() { sessionCleared = true; },
    showLoginScreen() {},
    async majdJsonRequest_(url, body, authenticated) {
      calls.push({ url, body, authenticated });
      return { transport: 'mock-only', ok: true };
    },
    majdAuthenticatedRequest_(body) {
      return mockWindow.majdJsonRequest_('/local/mock-api', body, true);
    }
  };
  const mockDocument = {
    body: { classList: classes() },
    getElementById(id) { return elements[id] || null; }
  };
  globalThis.window = mockWindow;
  globalThis.document = mockDocument;

  try {
    await import('../src/features/wafdeen/standalone-entry.js?mock-test=1');
    assert.equal(sessionCleared, true);
    assert.equal(elements['wafdeen-login-screen'].classList.contains('hidden'), false);
    assert.equal(elements['wafdeen-app-screen'].classList.contains('hidden'), true);
    assert.equal(elements.wafdeenPassword.value, '');
    assert.equal(elements.wafdeenUsername.focused, true);

    await assert.rejects(
      window.majdAuthenticatedRequest_({ op: 'upsert', collection: 'wafdeenDailyRecords', id: 'old', data: { score: 99 } }),
      /SESSION_SCOPE_FORBIDDEN/
    );
    await assert.rejects(
      window.majdJsonRequest_('/local/mock-api', { op: 'list', collection: 'wafdeenTeachers' }, true),
      /SESSION_SCOPE_FORBIDDEN/
    );
    assert.equal(calls.length, 0, 'unsupported operations must be stopped before transport');

    const roster = await window.majdAuthenticatedRequest_({ op: 'listWafdeenStudentNames' });
    assert.deepEqual(roster, { transport: 'mock-only', ok: true });
    const accounts = await window.majdAuthenticatedRequest_({ op: 'listWafdeenAccounts' });
    const grades = await window.majdAuthenticatedRequest_({ op: 'listWafdeenGrades' });
    assert.deepEqual(accounts, { transport: 'mock-only', ok: true });
    assert.deepEqual(grades, { transport: 'mock-only', ok: true });
    const login = await window.majdJsonRequest_('/local/mock-api', { op: 'login', mode: 'wafdeen' }, false);
    assert.deepEqual(login, { transport: 'mock-only', ok: true });
    assert.equal(calls.length, 4);
    assert.equal(calls[0].authenticated, true);
    assert.equal(calls[1].body.op, 'listWafdeenAccounts');
    assert.equal(calls[2].body.op, 'listWafdeenGrades');
    assert.equal(calls[3].authenticated, false);

    window.showLoginScreen();
    assert.equal(navigatedTo, './index.html');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
