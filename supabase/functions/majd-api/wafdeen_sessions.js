import { canListWafdeenStudentNames } from './wafdeen_names.js';
import { listWafdeenRoster } from './wafdeen_admin.js';

export const DAILY_SESSION_SELECT = [
  'data->>studentId',
  'data->>studentName',
  'data->>teacherUsername',
  'data->>dateISO',
  'data->>sessionType',
  'data->>quranSessionTimeSeconds',
  'data->quranSessionTimeByType',
  'data->>newLessonTimeSeconds',
  'data->>oldRevisionTimeSeconds',
  'data->>recitationTimeSeconds'
].join(',');

export const REPORT_DAILY_SESSION_SELECT = [
  'data->>studentId',
  'data->>teacherUsername',
  'data->>dateISO',
  'data->>sessionType',
  'data->>quranSessionTimeSeconds',
  'data->quranSessionTimeByType',
  'data->>newLessonTimeSeconds',
  'data->>oldRevisionTimeSeconds',
  'data->>recitationTimeSeconds'
].join(',');

export const USAGE_SESSION_SELECT = [
  'data->>studentId',
  'data->>teacherUsername',
  'data->>dateISO',
  'data->>category',
  'data->>type',
  'data->>quranGradeType',
  'data->>seconds',
  'data->>sessionSeconds'
].join(',');

const STUDENT_SELECT = 'data->>studentId,data->>studentName';
const DAILY_SAFE_FIELDS = Object.freeze([
  'studentId', 'studentName', 'teacherUsername', 'dateISO', 'sessionType',
  'quranSessionTimeSeconds', 'quranSessionTimeByType',
  'newLessonTimeSeconds', 'oldRevisionTimeSeconds', 'recitationTimeSeconds'
]);
const REPORT_DAILY_SAFE_FIELDS = Object.freeze([
  'studentId', 'teacherUsername', 'dateISO', 'sessionType',
  'quranSessionTimeSeconds', 'quranSessionTimeByType',
  'newLessonTimeSeconds', 'oldRevisionTimeSeconds', 'recitationTimeSeconds'
]);
const USAGE_SAFE_FIELDS = Object.freeze([
  'studentId', 'teacherUsername', 'dateISO', 'category', 'type', 'quranGradeType', 'seconds', 'sessionSeconds'
]);
const DAILY_DUPLICATE_SELECT = [
  'data->>sessionType',
  'data->quranSessionTimeByType',
  'data->>newLessonTimeSeconds',
  'data->>oldRevisionTimeSeconds',
  'data->>recitationTimeSeconds'
].join(',');
const USAGE_DUPLICATE_SELECT = 'data->>type,data->>quranGradeType';
const PAGE_SIZE = 1000;
const MAX_ROWS = 10000;
const TYPES = Object.freeze({
  new: {
    label: 'الجديد',
    scoreField: 'newLesson',
    pagesField: 'newPagesCount',
    topicField: 'newTopicRecited',
    counterPrefix: 'new',
    timeField: 'newLessonTimeSeconds'
  },
  old: {
    label: 'الماضي',
    scoreField: 'oldRevision',
    pagesField: 'oldPagesCount',
    topicField: 'oldTopicRecited',
    counterPrefix: 'old',
    timeField: 'oldRevisionTimeSeconds'
  },
  recitation: {
    label: 'التلاوة',
    scoreField: 'recitation',
    pagesField: 'recitationPagesCount',
    topicField: 'recitationTopicRecited',
    counterPrefix: 'recitation',
    timeField: 'recitationTimeSeconds'
  }
});

function allowed(user, isAdmin) {
  return canListWafdeenStudentNames(user, isAdmin);
}

function scopes(user, isAdmin) {
  return isAdmin(user) ? ['all'] : ['owner', 'guestClass'];
}

function applyScope(query, scope, user) {
  if (scope === 'owner') return query.eq('data->>teacherUsername', String(user.username || ''));
  if (scope === 'guestClass') return query.eq('data->>className', 'الوافدين');
  return query;
}

function dedupeProjectedRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function keepOnly(row, fields) {
  const safe = {};
  for (const field of fields) if (Object.prototype.hasOwnProperty.call(row || {}, field)) safe[field] = row[field];
  return safe;
}

function keepOnlyQuranTimes(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const safe = {};
  for (const label of ['الجديد', 'الماضي', 'التلاوة']) {
    const seconds = Number(value[label]);
    if (Object.prototype.hasOwnProperty.call(value, label) && Number.isFinite(seconds) && seconds >= 0) safe[label] = seconds;
  }
  return safe;
}

async function readCollection(db, collection, projection, user, isAdmin, filters = []) {
  const output = [];
  for (const scope of scopes(user, isAdmin)) {
    for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
      let query = db.from('majd_records').select(projection).eq('collection', collection);
      for (const filter of filters) {
        const [field, operator, value] = filter.length === 3 ? filter : [filter[0], 'eq', filter[1]];
        if (!['eq', 'gte', 'lte'].includes(operator)) throw new Error('UNSUPPORTED_SESSION_FILTER');
        query = query[operator](field, value);
      }
      query = applyScope(query, scope, user)
        .order('data->>dateISO', { ascending: true })
        .range(from, Math.min(from + PAGE_SIZE - 1, MAX_ROWS - 1));
      const { data, error } = await query;
      if (error) throw error;
      const page = data || [];
      output.push(...page);
      if (page.length < PAGE_SIZE) break;
    }
  }
  return dedupeProjectedRows(output);
}

async function findKnownStudent(db, user, isAdmin, studentId, studentName) {
  for (const scope of scopes(user, isAdmin)) {
    let query = db.from('majd_records')
      .select(STUDENT_SELECT)
      .eq('collection', 'wafdeenDailyRecords')
      .eq('data->>studentId', studentId)
      .eq('data->>studentName', studentName);
    query = applyScope(query, scope, user).limit(1);
    const { data, error } = await query;
    if (error) throw error;
    if ((data || []).some((row) => String(row.studentId || '') === studentId && String(row.studentName || '') === studentName)) return true;
  }
  const { data, error } = await db.from('majd_records')
    .select(STUDENT_SELECT)
    .eq('collection', 'wafdeenRoster')
    .eq('data->>studentId', studentId)
    .eq('data->>studentName', studentName)
    .limit(1);
  if (error) throw error;
  if ((data || []).some((row) => String(row.studentId || '') === studentId && String(row.studentName || '') === studentName)) return true;
  return false;
}

function normalizeType(value) {
  const text = String(value || '').trim();
  return ({ new: 'الجديد', newLesson: 'الجديد', old: 'الماضي', oldRevision: 'الماضي', recitation: 'التلاوة' })[text] || text;
}

function hasSavedType(rows, type, studentId, dateISO, collection) {
  for (const row of rows) {
    if (collection === 'wafdeenDailyRecords') {
      const sessionType = normalizeType(row.sessionType);
      const times = row.quranSessionTimeByType && typeof row.quranSessionTimeByType === 'object' ? row.quranSessionTimeByType : {};
      const typeTimeField = TYPES[type].timeField;
      if (sessionType === TYPES[type].label || Number(times[TYPES[type].label] || times[type] || 0) > 0 || Number(row[typeTimeField] || 0) > 0) return true;
    } else if (normalizeType(row.quranGradeType || row.type) === TYPES[type].label) {
      return true;
    }
  }
  return false;
}

function dateIsValid(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function boundedInteger(value, max) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= max ? number : null;
}

function reportDateRange(month) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(String(month || ''));
  if (!match) return null;
  const year = Number(match[1]);
  const monthNumber = Number(match[2]);
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 15)).toISOString().slice(0, 10),
    end: new Date(Date.UTC(year, monthNumber, 14)).toISOString().slice(0, 10)
  };
}

export async function listWafdeenSessionData(db, user, isAdmin, options = {}) {
  if (!allowed(user, isAdmin)) return { status: 403, error: 'FORBIDDEN' };
  const purpose = String(options?.purpose || 'daily');
  if (!['daily', 'report'].includes(purpose)) return { status: 400, error: 'INVALID_SESSION_READ_PURPOSE' };
  if (purpose === 'report' && !isAdmin(user)) return { status: 403, error: 'FORBIDDEN' };
  const range = purpose === 'report' ? reportDateRange(options?.month) : null;
  if (purpose === 'report' && !range) return { status: 400, error: 'INVALID_REPORT_MONTH' };
  const filters = range ? [['data->>dateISO', 'gte', range.start], ['data->>dateISO', 'lte', range.end]] : [];
  const dailyProjection = purpose === 'report' ? REPORT_DAILY_SESSION_SELECT : DAILY_SESSION_SELECT;
  const dailySafeFields = purpose === 'report' ? REPORT_DAILY_SAFE_FIELDS : DAILY_SAFE_FIELDS;
  const dailyPromise = readCollection(db, 'wafdeenDailyRecords', dailyProjection, user, isAdmin, filters);
  const usagePromise = purpose === 'report'
    ? readCollection(db, 'wafdeenUsage', USAGE_SESSION_SELECT, user, isAdmin, filters)
    : Promise.resolve([]);
  const rosterPromise = purpose === 'daily'
    ? listWafdeenRoster(db, user, isAdmin)
    : Promise.resolve({ status: 200, students: [] });
  const [dailyRows, usageRows, rosterResult] = await Promise.all([dailyPromise, usagePromise, rosterPromise]);
  if (rosterResult.status !== 200) return { status: rosterResult.status, error: rosterResult.error };
  const dailySessions = dailyRows.map((row) => {
    const safe = keepOnly(row, dailySafeFields);
    if (Object.prototype.hasOwnProperty.call(safe, 'quranSessionTimeByType')) safe.quranSessionTimeByType = keepOnlyQuranTimes(safe.quranSessionTimeByType);
    return safe;
  });
  const usage = usageRows.map((row) => keepOnly(row, USAGE_SAFE_FIELDS));
  const studentsById = new Map();
  if (purpose === 'daily') {
    for (const row of rosterResult.students) {
      const studentId = String(row.studentId || '').trim();
      const studentName = String(row.studentName || '').trim();
      if (studentId && studentName && !studentsById.has(studentId)) studentsById.set(studentId, { studentId, studentName });
    }
    for (const row of dailySessions) {
      const studentId = String(row.studentId || '').trim();
      const studentName = String(row.studentName || '').trim();
      if (studentId && studentName && !studentsById.has(studentId)) studentsById.set(studentId, { studentId, studentName });
    }
  }
  return { status: 200, students: [...studentsById.values()], dailySessions, usage };
}

export async function createWafdeenSession(db, user, isAdmin, input) {
  if (!allowed(user, isAdmin)) return { status: 403, error: 'FORBIDDEN' };
  const session = input && typeof input === 'object' ? input : {};
  const studentId = String(session.studentId || '').trim();
  const studentName = String(session.studentName || '').trim();
  const dateISO = String(session.dateISO || '').trim();
  const gradeType = String(session.gradeType || '').trim();
  const type = TYPES[gradeType];
  const pages = String(session.pages || '').trim();
  const topic = String(session.topic || '').trim();
  const errors = boundedInteger(session.errors, 1000);
  const tashkeel = boundedInteger(session.tashkeel, 1000);
  const repetition = boundedInteger(session.repetition, 1000);
  const sessionSeconds = boundedInteger(session.sessionSeconds, 7200);
  if (!studentId || studentId.length > 128 || !studentName || studentName.length > 200 || !dateIsValid(dateISO) || !type || !pages || pages.length > 100 || !topic || topic.length > 300 || errors === null || tashkeel === null || repetition === null || sessionSeconds === null || sessionSeconds < 1) {
    return { status: 400, error: 'INVALID_SESSION' };
  }

  if (!await findKnownStudent(db, user, isAdmin, studentId, studentName)) {
    return { status: 404, error: 'STUDENT_NOT_AVAILABLE' };
  }

  const duplicateFilters = [['data->>studentId', studentId], ['data->>dateISO', dateISO]];
  const [dailyRows, usageRows] = await Promise.all([
    readCollection(db, 'wafdeenDailyRecords', DAILY_DUPLICATE_SELECT, user, isAdmin, duplicateFilters),
    readCollection(db, 'wafdeenUsage', USAGE_DUPLICATE_SELECT, user, isAdmin, duplicateFilters)
  ]);
  if (hasSavedType(dailyRows, gradeType, studentId, dateISO, 'wafdeenDailyRecords') || hasSavedType(usageRows, gradeType, studentId, dateISO, 'wafdeenUsage')) {
    return { status: 409, error: 'SESSION_ALREADY_EXISTS' };
  }

  const score = Math.max(0, Math.round((10 - errors - tashkeel * 0.5 - repetition * 0.25) * 100) / 100);
  const teacherUsername = String(user.username || '').trim();
  const encodedStudentId = encodeURIComponent(studentId);
  const recordId = `wafdeen_${encodedStudentId}_${dateISO}_${gradeType}`;
  const usageId = `wafdeen_usage_${encodedStudentId}_${dateISO}_${gradeType}`;
  const now = new Date().toISOString();
  const times = { الجديد: 0, الماضي: 0, التلاوة: 0, [type.label]: sessionSeconds };
  const dailyRecord = {
    id: recordId,
    recordId,
    className: 'الوافدين',
    teacherUsername,
    studentId,
    studentName,
    dateISO,
    sessionType: gradeType,
    attendanceStatus: 'present',
    isAbsent: false,
    status: 'present',
    quranSessionTimeSeconds: sessionSeconds,
    quranSessionTimeByType: times,
    [type.scoreField]: score,
    [type.pagesField]: pages,
    [type.topicField]: topic,
    [`${type.counterPrefix}Errors`]: errors,
    [`${type.counterPrefix}Tashkeel`]: tashkeel,
    [`${type.counterPrefix}Repetition`]: repetition,
    [type.timeField]: sessionSeconds,
    _dailyTypeSaved: { [type.label]: true },
    total: score,
    savedAt: now,
    updatedAt: now
  };
  const usageRecord = {
    id: usageId,
    className: 'الوافدين',
    teacherUsername,
    studentId,
    studentName,
    category: 'quran',
    subject: 'القرآن الكريم',
    type: type.label,
    quranSession: true,
    quranGradeType: type.label,
    seconds: sessionSeconds,
    sessionSeconds,
    dateISO,
    sessionMaxSeconds: 7200,
    completedInTwoHours: sessionSeconds >= 7200,
    updatedAt: now
  };

  const { error } = await db.from('majd_records').insert([
    { collection: 'wafdeenDailyRecords', record_id: recordId, data: dailyRecord, updated_by: teacherUsername, updated_at: now },
    { collection: 'wafdeenUsage', record_id: usageId, data: usageRecord, updated_by: teacherUsername, updated_at: now }
  ]);
  if (error?.code === '23505') return { status: 409, error: 'SESSION_ALREADY_EXISTS' };
  if (error) throw error;
  return { status: 201, ok: true };
}
