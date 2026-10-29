const DAILY_FIELDS = Object.freeze([
  'studentId', 'teacherUsername', 'dateISO', 'sessionType',
  'quranSessionTimeSeconds', 'quranSessionTimeByType',
  'newLessonTimeSeconds', 'oldRevisionTimeSeconds', 'recitationTimeSeconds'
]);
const USAGE_FIELDS = Object.freeze([
  'studentId', 'teacherUsername', 'dateISO', 'category', 'type',
  'quranGradeType', 'seconds', 'sessionSeconds'
]);

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

export async function loadWafdeenReportData(month) {
  const reportMonth = String(month || '');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(reportMonth)) throw new Error('اختر شهرًا صالحًا للتقرير.');
  const api = globalThis.window?.MajdLocalDataAPI;
  if (!api || typeof api.isAvailable !== 'function' || !api.isAvailable() || typeof api.listWafdeenSessionData !== 'function') {
    throw new Error('خدمة التقرير الشهري غير متاحة؛ لم يتم تحميل أي سجلات.');
  }
  const response = await api.listWafdeenSessionData({ purpose: 'report', month: reportMonth });
  if (!response || !Array.isArray(response.students) || !Array.isArray(response.dailySessions) || !Array.isArray(response.usage)) {
    throw new Error('استجابة التقرير الشهري غير صالحة.');
  }
  return {
    dailyRecords: response.dailySessions.map(projectDailySession).filter((row) => row.studentId),
    usage: response.usage.map(projectUsageSession)
  };
}
