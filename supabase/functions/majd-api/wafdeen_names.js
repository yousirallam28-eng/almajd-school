export const WAFDEEN_STUDENT_NAMES_SELECT = 'data->>studentName';
const MAX_NAME_ROWS = 10000;
const PAGE_SIZE = 1000;

export function canListWafdeenStudentNames(user, isAdmin) {
  if (typeof isAdmin === 'function' && isAdmin(user)) return true;
  const hasGrant = user?.profile?.canWafdeen === true || user?.profile?.canWafdeen === 1;
  const isSupervisor = user?.profile?.center === 'مشرف';
  return user?.account_type === 'staff' && hasGrant && !isSupervisor;
}

export async function listWafdeenStudentNames(db, user, isAdmin) {
  if (!canListWafdeenStudentNames(user, isAdmin)) {
    return { status: 403, error: 'FORBIDDEN' };
  }

  const names = new Set();
  for (let from = 0; from < MAX_NAME_ROWS; from += PAGE_SIZE) {
    const { data, error } = await db
      .from('majd_records')
      .select(WAFDEEN_STUDENT_NAMES_SELECT)
      .eq('collection', 'wafdeenDailyRecords')
      .order(WAFDEEN_STUDENT_NAMES_SELECT, { ascending: true })
      .range(from, Math.min(from + PAGE_SIZE - 1, MAX_NAME_ROWS - 1));

    if (error) throw error;
    const page = data || [];
    for (const row of page) {
      const name = String(row?.studentName ?? '').trim();
      if (name) names.add(name);
    }
    if (page.length < PAGE_SIZE) break;
  }

  return { status: 200, names: [...names].sort((a, b) => a.localeCompare(b, 'ar')) };
}
