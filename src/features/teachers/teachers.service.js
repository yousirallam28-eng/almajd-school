import { cloudClient } from '../../api/client.js';
import { createTeacher, updateTeacher, deleteTeacher, validateTeacher } from '../../api/teachers.api.js';

export async function addTeacherRecord(input) {
  return createTeacher(validateTeacher(input));
}

export async function editTeacherRecord(id, input) {
  return updateTeacher(id, validateTeacher({ ...input, id }));
}

export async function removeTeacherRecord(id) {
  return deleteTeacher(id);
}

export async function loadTeachers() {
  return cloudClient.list('teachers');
}
