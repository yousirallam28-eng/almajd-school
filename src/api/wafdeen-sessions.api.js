const DAILY_FIELDS = Object.freeze([
  'studentId', 'studentName', 'teacherUsername', 'dateISO', 'sessionType',
  'quranSessionTimeSeconds', 'quranSessionTimeByType',
  'newLessonTimeSeconds', 'oldRevisionTimeSeconds', 'recitationTimeSeconds'
]);
const USAGE_FIELDS = Object.freeze([
  'studentId', 'teacherUsername', 'dateISO', 'category', 'type', 'quranGradeType', 'seconds', 'sessionSeconds'
]);
const GRADE_TYPES = new Set(['new', 'old', 'recitation']);

function requireBridge(methodName) {
  const api = globalThis.window?.MajdLocalDataAPI;
  if (!api || typeof api.isAvailable !== 'function' || !api.isAvailable() || typeof api[methodName] !== 'function') {
    throw new Error('خدمة جلسات الوافدين غير متاحة؛ لم يتم تحميل أي سجلات.');
  }
  return api;
}

function keepFields(source, fields) {
  const result = {};
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(source || {}, field)) result[field] = source[field];
  }
  return result;
}

function asText(value) {
  return String(value ?? '').trim();
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function projectTimeMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const label of ['الجديد', 'الماضي', 'التلاوة']) {
    if (Object.prototype.hasOwnProperty.call(value, label)) result[label] = asNumber(value[label]);
  }
  return result;
}

function projectDailySession(row) {
  const source = keepFields(row, DAILY_FIELDS);
  return {
    studentId: asText(source.studentId),
    studentName: asText(source.studentName),
    teacherUsername: asText(source.teacherUsername),
    dateISO: asText(source.dateISO).slice(0, 10),
    sessionType: asText(source.sessionType),
    quranSessionTimeSeconds: asNumber(source.quranSessionTimeSeconds),
    quranSessionTimeByType: projectTimeMap(source.quranSessionTimeByType),
    newLessonTimeSeconds: asNumber(source.newLessonTimeSeconds),
    oldRevisionTimeSeconds: asNumber(source.oldRevisionTimeSeconds),
    recitationTimeSeconds: asNumber(source.recitationTimeSeconds)
  };
}

function projectUsageSession(row) {
  const source = keepFields(row, USAGE_FIELDS);
  return {
    studentId: asText(source.studentId),
    teacherUsername: asText(source.teacherUsername),
    dateISO: asText(source.dateISO).slice(0, 10),
    category: asText(source.category),
    type: asText(source.type),
    quranGradeType: asText(source.quranGradeType),
    seconds: asNumber(source.seconds),
    sessionSeconds: asNumber(source.sessionSeconds)
  };
}

export async function loadWafdeenSessionData(options = {}) {
  const api = requireBridge('listWafdeenSessionData');
  const purpose = options?.purpose === 'report' ? 'report' : 'daily';
  const month = String(options?.month || '');
  if (purpose === 'report' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('اختر شهرًا صالحًا للتقرير.');
  const response = await api.listWafdeenSessionData(purpose === 'report' ? { purpose, month } : { purpose });
  if (!response || !Array.isArray(response.students) || !Array.isArray(response.dailySessions) || !Array.isArray(response.usage)) {
    throw new Error('استجابة جلسات الوافدين غير صالحة.');
  }
  const dailySessions = response.dailySessions.map(projectDailySession).filter((row) => row.studentId && (purpose === 'report' || row.studentName));
  const studentsById = new Map();
  if (purpose === 'daily') {
    for (const student of response.students) {
      const studentId = asText(student?.studentId);
      const studentName = asText(student?.studentName);
      if (studentId && studentName && !studentsById.has(studentId)) studentsById.set(studentId, { id: studentId, name: studentName });
    }
    for (const session of dailySessions) {
      if (!studentsById.has(session.studentId)) studentsById.set(session.studentId, { id: session.studentId, name: session.studentName });
    }
  }
  return {
    students: [...studentsById.values()],
    dailyRecords: dailySessions,
    usage: response.usage.map(projectUsageSession)
  };
}

export async function createWafdeenSession(input) {
  const api = requireBridge('createWafdeenSession');
  const session = {
    studentId: asText(input?.studentId),
    studentName: asText(input?.studentName),
    dateISO: asText(input?.dateISO),
    gradeType: asText(input?.gradeType),
    pages: asText(input?.pages),
    topic: asText(input?.topic),
    errors: asNumber(input?.errors),
    tashkeel: asNumber(input?.tashkeel),
    repetition: asNumber(input?.repetition),
    sessionSeconds: asNumber(input?.sessionSeconds)
  };
  if (!session.studentId || !session.studentName || !/^\d{4}-\d{2}-\d{2}$/.test(session.dateISO) || !GRADE_TYPES.has(session.gradeType) || !session.pages || !session.topic || session.sessionSeconds < 1) {
    throw new Error('بيانات جلسة الوافدين غير مكتملة.');
  }
  const response = await api.createWafdeenSession(session);
  if (!response || response.ok !== true) throw new Error('لم يتم حفظ جلسة الوافدين كسجل جديد.');
  return { ok: true };
}
