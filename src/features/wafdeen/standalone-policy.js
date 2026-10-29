const ALLOWED_WAFDEEN_OPERATIONS = new Set([
  'changePassword',
  'addWafdeenStudent',
  'listWafdeenTeachers',
  'createWafdeenTeacher',
  'listWafdeenStudentNames',
  'listWafdeenGrades',
  'createWafdeenSession'
]);

export function isAllowedWafdeenStandaloneOperation(body, user = globalThis.window?.currentWafdeenTeacher) {
  const operation = String(body?.op || '');
  if (operation === 'listWafdeenSessionData') {
    if (body?.purpose === 'daily') return true;
    return body?.purpose === 'report' && user?.isAdmin === true && /^\d{4}-(0[1-9]|1[0-2])$/.test(String(body?.month || ''));
  }
  return ALLOWED_WAFDEEN_OPERATIONS.has(operation);
}
