const ALLOWED_WAFDEEN_OPERATIONS = new Set([
  'changePassword',
  'addWafdeenStudent',
  'listWafdeenTeachers',
  'createWafdeenTeacher',
  'listWafdeenStudentNames',
  'listWafdeenAccounts',
  'listWafdeenGrades',
  'createWafdeenSession'
]);

export function isAllowedWafdeenStandaloneOperation(body) {
  const operation = String(body?.op || '');
  if (operation === 'listWafdeenSessionData') return body?.purpose === 'daily';
  return ALLOWED_WAFDEEN_OPERATIONS.has(operation);
}
