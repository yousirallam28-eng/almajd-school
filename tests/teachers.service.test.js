import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTeacher, validateTeacher } from '../src/api/teachers.api.js';

test('normalizeTeacher keeps teacher fields consistent', () => {
  const teacher = normalizeTeacher({ id: 12, username: '  ahmed ', password: '123', assignedClass: 'أولى', center: 'رئيسي', canWafdeen: 1 });
  assert.equal(teacher.id, '12');
  assert.equal(teacher.username, 'ahmed');
  assert.equal(teacher.canWafdeen, true);
  assert.ok(teacher.updatedAt);
});

test('validateTeacher rejects incomplete teacher data', () => {
  assert.throws(() => validateTeacher({ id: '1', username: '', password: '' }), /مطلوبان/);
});
