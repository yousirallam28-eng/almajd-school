function validDate(value) {
  const date = String(value ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : '';
}

function newTotals(key, label) {
  return { key, label, quranSeconds: 0, educationSeconds: 0, totalSeconds: 0 };
}

function addUsage(totals, row, category, seconds) {
  if (category === 'quran') totals.quranSeconds += seconds;
  else if (category === 'educational') totals.educationSeconds += seconds;
  else return false;
  totals.totalSeconds += seconds;
  return true;
}

function saturdayWeekStart(day) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 1) % 7));
  return date.toISOString().slice(0, 10);
}

function saturdayWeekEnd(start) {
  const date = new Date(`${start}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 6);
  return date.toISOString().slice(0, 10);
}

export function summarizeWafdeenUsage(usage) {
  const byTeacher = new Map();
  const byDate = new Map();
  for (const row of Array.isArray(usage) ? usage : []) {
    const category = String(row?.category ?? '');
    if (category !== 'quran' && category !== 'educational') continue;
    const value = Number(row?.seconds ?? row?.sessionSeconds ?? 0);
    if (!Number.isFinite(value) || value < 0) continue;
    const seconds = Math.floor(value);
    const day = validDate(row?.dateISO);
    if (!day) continue;
    const teacher = String(row?.teacherUsername ?? '').trim() || 'غير محدد';
    const teacherKey = teacher;
    if (!byTeacher.has(teacherKey)) byTeacher.set(teacherKey, newTotals(teacherKey, teacher));
    addUsage(byTeacher.get(teacherKey), row, category, seconds);
    if (!byDate.has(day)) byDate.set(day, newTotals(day, day));
    addUsage(byDate.get(day), row, category, seconds);
  }

  const dates = [...byDate.values()].sort((a, b) => a.key.localeCompare(b.key));
  const weeks = new Map();
  for (const day of dates) {
    const start = saturdayWeekStart(day.key);
    if (!weeks.has(start)) weeks.set(start, newTotals(start, `${start} – ${saturdayWeekEnd(start)}`));
    const week = weeks.get(start);
    week.quranSeconds += day.quranSeconds;
    week.educationSeconds += day.educationSeconds;
    week.totalSeconds += day.totalSeconds;
  }

  return {
    byTeacher: [...byTeacher.values()].sort((a, b) => b.totalSeconds - a.totalSeconds || a.label.localeCompare(b.label, 'ar')),
    byDate: dates,
    byWeek: [...weeks.values()].sort((a, b) => a.key.localeCompare(b.key))
  };
}

export function reportPeriodKeyForDate(value) {
  const date = value instanceof Date ? new Date(value) : new Date(`${validDate(value)}T00:00:00`);
  if (!Number.isFinite(date.getTime())) return '';
  if (date.getDate() >= 15) return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  date.setDate(0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function reportPeriodBounds(month) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(String(month ?? ''));
  if (!match) return null;
  const year = Number(match[1]);
  const monthNumber = Number(match[2]);
  const start = `${match[1]}-${match[2]}-15`;
  const end = new Date(Date.UTC(year, monthNumber, 14)).toISOString().slice(0, 10);
  return { start, end };
}
