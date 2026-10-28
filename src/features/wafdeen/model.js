export const WAFDEEN_GRADE_TYPES = Object.freeze([
  { key: 'new', label: 'الجديد', scoreField: 'newLesson', pagesField: 'newPagesCount', topicField: 'newTopicRecited', counterPrefix: 'new' },
  { key: 'old', label: 'الماضي', scoreField: 'oldRevision', pagesField: 'oldPagesCount', topicField: 'oldTopicRecited', counterPrefix: 'old' },
  { key: 'recitation', label: 'التلاوة', scoreField: 'recitation', pagesField: 'recitationPagesCount', topicField: 'recitationTopicRecited', counterPrefix: 'recitation' }
]);

const pad = (number) => String(number).padStart(2, '0');

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function monthKeyForDate(dateKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey || ''));
  if (!match) return '';
  let year = Number(match[1]);
  let month = Number(match[2]);
  if (Number(match[3]) < 15) month -= 1;
  if (month < 1) { month = 12; year -= 1; }
  return `${year}-${pad(month)}`;
}

export function monthRange(monthKey) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(String(monthKey || ''));
  if (!match) throw new Error('اختر شهرًا صالحًا للتقرير.');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const start = new Date(Date.UTC(year, month - 1, 15));
  const end = new Date(Date.UTC(year, month, 14));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export function scoreFromCounts(errors, tashkeel, repetition) {
  const safe = (value) => Math.max(0, Math.floor(Number(value) || 0));
  const score = 10 - safe(errors) - safe(tashkeel) * 0.5 - safe(repetition) * 0.25;
  return Math.max(0, Math.round(score * 100) / 100);
}

export function isQuranUsage(record) {
  if (!record || record._deleted) return false;
  const category = String(record.category || '').trim().toLowerCase();
  const subject = String(record.subject || '').trim();
  return ['quran', 'quran_session', 'quran-session'].includes(category) ||
    record.quranSession === true || /quran|القرآن/i.test(subject);
}

function secondsFor(record) {
  const session = Number(record?.sessionSeconds);
  if (Number.isFinite(session) && session > 0) return Math.floor(session);
  const seconds = Number(record?.seconds);
  return Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
}

export function aggregateMonthlyQuranUsage(records, monthKey) {
  const { start, end } = monthRange(monthKey);
  const totals = new Map();
  for (const record of Array.isArray(records) ? records : []) {
    if (!isQuranUsage(record)) continue;
    const date = String(record.dateISO || '').slice(0, 10);
    if (date < start || date > end) continue;
    const teacher = String(record.teacherUsername || record.teacherName || 'غير معروف').trim() || 'غير معروف';
    const totalSeconds = secondsFor(record);
    if (!totalSeconds) continue;
    const entry = totals.get(teacher) || { teacher, sessionSeconds: 0, sessions: 0 };
    entry.sessionSeconds += totalSeconds;
    entry.sessions += 1;
    totals.set(teacher, entry);
  }
  return [...totals.values()].sort((a, b) => b.sessionSeconds - a.sessionSeconds || a.teacher.localeCompare(b.teacher, 'ar'));
}

export function formatDuration(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remainder = safe % 60;
  return `${hours} س ${minutes} د ${remainder} ث`;
}
