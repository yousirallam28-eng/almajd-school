export function isAdmin(teacher = window.currentTeacher) {
  return teacher?.username === 'admin';
}

export function isSupervisor(teacher = window.currentTeacher) {
  return teacher?.center === 'مشرف';
}

export function canOpenFeature(feature, teacher = window.currentTeacher) {
  if (feature === 'wafdeen-time') return false;
  if (isAdmin(teacher)) return true;
  if (feature === 'expenses' || feature === 'notes' || feature === 'status' || feature === 'top-students') return Boolean(teacher);
  return !isSupervisor(teacher) || feature === 'status';
}
