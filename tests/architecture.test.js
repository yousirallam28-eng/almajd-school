import test from 'node:test';
import assert from 'node:assert/strict';
import { featureForTab } from '../src/app/router.js';
import { canOpenFeature, isAdmin, isSupervisor } from '../src/app/permissions.js';

test('router maps heavy tabs to feature chunks', () => {
  assert.equal(featureForTab('reports-tab'), 'reports');
  assert.equal(featureForTab('payments-tab'), 'expenses');
  assert.equal(featureForTab('notes-tab'), 'notes');
  assert.equal(featureForTab('sheikh-registration-tab'), 'sheikh-recordings');
  assert.equal(featureForTab('wafdeen-time-tab'), null);
});

test('permissions distinguish admin and supervisor', () => {
  assert.equal(isAdmin({ username: 'admin' }), true);
  assert.equal(isSupervisor({ center: 'مشرف' }), true);
  assert.equal(canOpenFeature('expenses', { username: 'admin' }), true);
  assert.equal(canOpenFeature('wafdeen-time', { username: 'admin' }), false);
  assert.equal(canOpenFeature('wafdeen-time', { username: 'teacher', center: 'رئيسي' }), false);
});
