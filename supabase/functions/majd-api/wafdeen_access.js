import { canListWafdeenStudentNames } from './wafdeen_names.js';

const PAGE_SIZE = 1000;
const MAX_ROWS = 10000;
const ACCOUNT_SELECT = [
  'username', 'account_type', 'is_active',
  'profile->>name', 'profile->>role', 'profile->>className',
  'profile->>assignedClass', 'profile->>center', 'profile->>canWafdeen'
].join(',');
const GRADE_SELECT = [
  'record_id', 'data->_deleted', 'data->>studentName', 'data->>dateISO',
  'data->>sessionType', 'data->>newLesson', 'data->>oldRevision',
  'data->>recitation', 'data->>total'
].join(',');
const GRADE_FIELDS = Object.freeze([
  'studentName', 'dateISO', 'sessionType', 'newLesson', 'oldRevision', 'recitation', 'total'
]);
const SCORE_FIELDS = Object.freeze(['newLesson', 'oldRevision', 'recitation', 'total']);
const WAFDEEN_ACCOUNT_TYPES = new Set(['wafdeen_student', 'wafdeen_teacher']);

function canViewWafdeenData(user, isAdmin) {
  return canListWafdeenStudentNames(user, isAdmin);
}

function truthyPermission(value) {
  return value === true || value === 1 || String(value ?? '').toLowerCase() === 'true' || String(value ?? '') === '1';
}

function accountView(row) {
  const accountType = String(row?.account_type || '');
  return {
    username: String(row?.username || ''),
    name: String(row?.name || row?.username || ''),
    accountType,
    role: String(row?.role || accountType),
    className: String(row?.className || ''),
    assignedClass: String(row?.assignedClass || ''),
    center: String(row?.center || ''),
    canWafdeen: truthyPermission(row?.canWafdeen),
    isActive: row?.is_active === true
  };
}

function isDeleted(row) {
  const value = row?._deleted;
  return value === true || value === 1 || ['true', '1', 'yes'].includes(String(value ?? '').trim().toLowerCase());
}

function gradeView(row) {
  const view = {};
  for (const field of GRADE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(row || {}, field)) continue;
    const value = row[field];
    if (SCORE_FIELDS.includes(field)) {
      if (value === null || value === undefined || value === '') continue;
      const score = Number(value);
      if (Number.isFinite(score)) view[field] = score;
    } else {
      view[field] = String(value ?? '');
    }
  }
  return view;
}

export async function listWafdeenAccounts(db, user, isAdmin) {
  if (!canViewWafdeenData(user, isAdmin)) return { status: 403, error: 'FORBIDDEN' };

  const base = () => db.from('majd_accounts')
    .select(ACCOUNT_SELECT)
    .eq('is_active', true)
    .order('username_norm', { ascending: true })
    .limit(1500);
  const [wafdeenAccounts, grantedTrue, grantedOne] = await Promise.all([
    base().in('account_type', [...WAFDEEN_ACCOUNT_TYPES]),
    base().eq('account_type', 'staff').eq('profile->>canWafdeen', 'true'),
    base().eq('account_type', 'staff').eq('profile->>canWafdeen', '1')
  ]);
  for (const result of [wafdeenAccounts, grantedTrue, grantedOne]) if (result.error) throw result.error;

  const seen = new Set();
  const accounts = [];
  for (const row of [...(wafdeenAccounts.data || []), ...(grantedTrue.data || []), ...(grantedOne.data || [])]) {
    if (row?.is_active !== true || String(row?.center || '') === 'مشرف') continue;
    const view = accountView(row);
    if (!view.username) continue;
    const key = `${view.accountType}\u0000${view.username}`;
    if (seen.has(key)) continue;
    seen.add(key);
    accounts.push(view);
  }
  return { status: 200, accounts };
}

export async function listWafdeenGrades(db, user, isAdmin) {
  if (!canViewWafdeenData(user, isAdmin)) return { status: 403, error: 'FORBIDDEN' };

  const seen = new Set();
  const grades = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await db.from('majd_records')
      .select(GRADE_SELECT)
      .eq('collection', 'wafdeenDailyRecords')
      .order('data->>dateISO', { ascending: false })
      .range(from, Math.min(from + PAGE_SIZE - 1, MAX_ROWS - 1));
    if (error) throw error;
    const page = data || [];
    for (const row of page) {
      if (isDeleted(row)) continue;
      const view = gradeView(row);
      if (!view.studentName || !view.dateISO || !SCORE_FIELDS.some((field) => Object.hasOwn(view, field))) continue;
      const key = String(row.record_id || JSON.stringify(view));
      if (seen.has(key)) continue;
      seen.add(key);
      grades.push(view);
    }
    if (page.length < PAGE_SIZE) break;
  }
  return { status: 200, grades };
}
