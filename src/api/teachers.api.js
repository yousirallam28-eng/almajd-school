import { cloudClient } from './client.js';

export function normalizeTeacher(input) {
  return {
    ...input,
    id: String(input.id),
    username: String(input.username || '').trim(),
    password: String(input.password || '').trim(),
    assignedClass: String(input.assignedClass || '').trim(),
    center: String(input.center || '').trim(),
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

export function validateTeacher(input) {
  const teacher = normalizeTeacher(input);
  if (!teacher.id || !teacher.username || !teacher.password) throw new Error('اسم المستخدم وكلمة المرور مطلوبان.');
  if (!teacher.assignedClass || !teacher.center) throw new Error('يجب اختيار الصف والدور.');
  return teacher;
}

export async function createTeacher(input) {
  const teacher = validateTeacher(input);
  return cloudClient.upsert('teachers', teacher.id, teacher, { merge: true });
}

export async function updateTeacher(id, input) {
  const teacher = validateTeacher({ ...input, id });
  return cloudClient.upsert('teachers', id, teacher, { merge: true });
}

export async function deleteTeacher(id) {
  return cloudClient.remove('teachers', id);
}
