const GRADE_FIELDS = Object.freeze([
  'studentName', 'dateISO', 'sessionType', 'newLesson', 'oldRevision', 'recitation', 'total'
]);
const SCORE_FIELDS = new Set(['newLesson', 'oldRevision', 'recitation', 'total']);

function asText(value) {
  return String(value ?? '').trim();
}

function projectGrade(row) {
  const projected = {};
  for (const field of GRADE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(row || {}, field)) continue;
    const value = row[field];
    if (SCORE_FIELDS.has(field)) {
      if (value === null || value === undefined || value === '') continue;
      const score = Number(value);
      if (Number.isFinite(score)) projected[field] = score;
      continue;
    }
    projected[field] = asText(value);
  }
  return projected;
}

export async function loadWafdeenGrades() {
  const api = globalThis.window?.MajdLocalDataAPI;
  if (!api || typeof api.isAvailable !== 'function' || !api.isAvailable() || typeof api.listWafdeenGrades !== 'function') {
    throw new Error('خدمة الدرجات التاريخية غير متاحة؛ لم يتم تحميل أي سجلات.');
  }
  const response = await api.listWafdeenGrades();
  if (!response || !Array.isArray(response.grades)) throw new Error('استجابة الدرجات التاريخية غير صالحة.');
  return response.grades.map(projectGrade).filter((row) => row.studentName && row.dateISO &&
    ['newLesson', 'oldRevision', 'recitation', 'total'].some((field) => Object.hasOwn(row, field)));
}
