import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTeacher, validateTeacher } from '../src/api/teachers.api.js';

test('teacher feature preserves cloud-safe teacher shape', () => {
  const teacher = validateTeacher({
    id: 42,
    username: ' teacher ',
    password: 'secret',
    assignedClass: 'الأول',
    center: 'رئيسي'
  });
  assert.deepEqual({ id: teacher.id, username: teacher.username, assignedClass: teacher.assignedClass }, {
    id: '42', username: 'teacher', assignedClass: 'الأول'
  });
  assert.equal('canWafdeen' in teacher, false);
});

test('teacher normalization does not mutate input', () => {
  const input = { id: 7, username: 'a', password: 'b', assignedClass: 'الكل', center: 'الكل' };
  const normalized = normalizeTeacher(input);
  assert.equal(input.id, 7);
  assert.equal(normalized.id, '7');
});
