import { canListWafdeenStudentNames } from './wafdeen_names.js';

const PAGE_SIZE = 1000;
const MAX_ROWS = 10000;
const STUDENT_SELECT = 'data->>studentName';
const ROSTER_SELECT = 'record_id,data->>studentId,data->>studentName';
const TEACHER_SELECT = 'id,username,profile->>assignedClass,profile->>center,profile->>canWafdeen';
const ALLOWED_CLASSES = new Set([
  'تمهيدي', 'أولى - أولاد', 'أولى - بنات', 'ثانية - أولاد', 'ثانية - بنات',
  'ثالثة - أولاد', 'ثالثة - بنات', 'رابعة - أولاد', 'رابعة - بنات',
  'خامسة - أولاد', 'خامسة - بنات', 'أولى شرعي'
]);
const ALLOWED_CENTERS = new Set(['رئيسي', 'مساعد']);

function normalizedName(value) {
  return String(value || '').trim().normalize('NFKC').replace(/\s+/g, ' ').toLocaleLowerCase('ar');
}
function canReadWafdeen(user, isAdmin) {
  return typeof isAdmin === 'function' && isAdmin(user) || canListWafdeenStudentNames(user, isAdmin);
}
function isDuplicateError(error) {
  return error?.code === '23505' || /duplicate key/i.test(String(error?.message || ''));
}
async function readStudentNames(db, collection) {
  const names = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await db.from('majd_records')
      .select(STUDENT_SELECT)
      .eq('collection', collection)
      .order(STUDENT_SELECT, { ascending: true })
      .range(from, Math.min(from + PAGE_SIZE - 1, MAX_ROWS - 1));
    if (error) throw error;
    const page = data || [];
    names.push(...page.map((row) => String(row?.studentName || '').trim()).filter(Boolean));
    if (page.length < PAGE_SIZE) break;
  }
  return names;
}
function teacherView(row) {
  return {
    id: String(row?.id || ''),
    username: String(row?.username || ''),
    assignedClass: String(row?.assignedClass || ''),
    center: String(row?.center || ''),
    canWafdeen: row?.canWafdeen === true || row?.canWafdeen === 1 || String(row?.canWafdeen || '').toLowerCase() === 'true' || String(row?.canWafdeen || '') === '1'
  };
}

export async function listWafdeenRoster(db, user, isAdmin) {
  if (!canReadWafdeen(user, isAdmin)) return { status: 403, error: 'FORBIDDEN' };
  const students = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await db.from('majd_records')
      .select(ROSTER_SELECT)
      .eq('collection', 'wafdeenRoster')
      .order('record_id', { ascending: true })
      .range(from, Math.min(from + PAGE_SIZE - 1, MAX_ROWS - 1));
    if (error) throw error;
    const page = data || [];
    for (const row of page) {
      const studentId = String(row?.studentId || row?.record_id || '').trim();
      const studentName = String(row?.studentName || '').trim();
      if (studentId && studentName) students.push({ studentId, studentName });
    }
    if (page.length < PAGE_SIZE) break;
  }
  return { status: 200, students };
}

export async function createWafdeenStudent(db, user, isAdmin, input) {
  if (typeof isAdmin !== 'function' || !isAdmin(user)) return { status: 403, error: 'FORBIDDEN' };
  const studentName = String(input?.studentName || '').trim().replace(/\s+/g, ' ');
  if (!studentName || studentName.length > 200 || /[\u0000-\u001f\u007f]/.test(studentName)) {
    return { status: 400, error: 'INVALID_STUDENT_NAME' };
  }
  const duplicateKey = normalizedName(studentName);
  const [rosterNames, sessionNames] = await Promise.all([
    readStudentNames(db, 'wafdeenRoster'),
    readStudentNames(db, 'wafdeenDailyRecords')
  ]);
  if ([...rosterNames, ...sessionNames].some((name) => normalizedName(name) === duplicateKey)) {
    return { status: 409, error: 'STUDENT_ALREADY_EXISTS' };
  }
  const studentId = `wafdeen_roster_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const record = {
    collection: 'wafdeenRoster',
    record_id: studentId,
    data: { studentId, studentName, className: 'الوافدين', createdAt: now, createdBy: String(user?.username || '') },
    updated_by: String(user?.username || ''),
    updated_at: now
  };
  const { error } = await db.from('majd_records').insert(record);
  if (error) {
    if (isDuplicateError(error)) return { status: 409, error: 'STUDENT_ALREADY_EXISTS' };
    throw error;
  }
  return { status: 201, student: { id: studentId, studentId, studentName, className: 'الوافدين' } };
}

export async function listWafdeenTeachers(db, user, isAdmin) {
  if (typeof isAdmin !== 'function' || !isAdmin(user)) return { status: 403, error: 'FORBIDDEN' };
  const { data, error } = await db.from('majd_accounts')
    .select(TEACHER_SELECT)
    .eq('account_type', 'staff')
    .eq('is_active', true)
    .order('username_norm', { ascending: true })
    .limit(1500);
  if (error) throw error;
  return { status: 200, teachers: (data || []).map(teacherView).filter((teacher) => teacher.id && teacher.username) };
}

export async function createWafdeenTeacher(db, user, isAdmin, input, hashPassword) {
  if (typeof isAdmin !== 'function' || !isAdmin(user)) return { status: 403, error: 'FORBIDDEN' };
  const username = String(input?.username || '').trim();
  const usernameNorm = username.toLocaleLowerCase();
  const password = String(input?.password || '');
  const assignedClass = String(input?.assignedClass || '').trim();
  const center = String(input?.center || '').trim();
  if (!username || username.length > 120 || /[\u0000-\u001f\u007f]/.test(username) || !password || password.length < 12 || password.length > 256 || !ALLOWED_CLASSES.has(assignedClass) || !ALLOWED_CENTERS.has(center)) {
    return { status: 400, error: 'INVALID_TEACHER_DETAILS' };
  }
  if (typeof hashPassword !== 'function') return { status: 500, error: 'SERVER_CONFIGURATION_MISSING' };
  const { data: matches, error: lookupError } = await db.from('majd_accounts')
    .select('id')
    .eq('username_norm', usernameNorm)
    .limit(1);
  if (lookupError) throw lookupError;
  if ((matches || []).length) return { status: 409, error: 'USERNAME_EXISTS' };
  const credentials = await hashPassword(password);
  const id = crypto.randomUUID();
  const profile = { username, assignedClass, center, canWafdeen: true };
  const row = {
    id,
    username,
    username_norm: usernameNorm,
    account_type: 'staff',
    profile,
    is_active: true,
    password_salt: credentials.salt,
    password_hash: credentials.hash,
    password_change_required: true,
    failed_attempts: 0,
    locked_until: null,
    updated_at: new Date().toISOString()
  };
  const { error } = await db.from('majd_accounts').insert(row);
  if (error) {
    if (isDuplicateError(error)) return { status: 409, error: 'USERNAME_EXISTS' };
    throw error;
  }
  return { status: 201, teacher: { id, username, assignedClass, center, canWafdeen: true } };
}
