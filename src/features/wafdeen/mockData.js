// Development-only fixtures. This store is in-memory, resets on reload, and never reads or writes site/cloud data.
const seed = {
  wafdeenRoster: [
    { id: 'demo-student-1', name: 'طالب تجريبي واحد', className: 'مجموعة تجريبية', createdAt: '2026-10-20T10:00:00.000Z' },
    { id: 'demo-student-2', name: 'طالبة تجريبية اثنتان', className: 'مجموعة تجريبية', createdAt: '2026-10-20T10:00:00.000Z' }
  ],
  wafdeenDailyRecords: [
    {
      id: 'wafdeen_demo-student-1_2026-10-20',
      recordId: 'wafdeen_demo-student-1_2026-10-20',
      teacherUsername: 'معلم تجريبي',
      studentId: 'demo-student-1',
      studentName: 'طالب تجريبي واحد',
      dateISO: '2026-10-20',
      attendanceStatus: 'present',
      isAbsent: false,
      status: 'present',
      dayName: 'الثلاثاء',
      newLesson: 9,
      newPagesCount: 'صفحة تجريبية',
      newTopicRecited: 'مقرر تجريبي',
      newErrors: 1,
      newTashkeel: 0,
      newRepetition: 0,
      newLessonTimeSeconds: 90,
      oldRevision: '',
      recitation: '',
      quranSessionTimeSeconds: 90,
      quranSessionTimeByType: { الجديد: 90, الماضي: 0, التلاوة: 0 },
      _dailyTypeSaved: { الجديد: true }
    }
  ],
  wafdeenUsage: [
    {
      id: 'demo-usage-1',
      teacherUsername: 'معلم تجريبي',
      studentId: 'demo-student-1',
      studentName: 'طالب تجريبي واحد',
      category: 'quran',
      subject: 'القرآن الكريم',
      type: 'الجديد',
      seconds: 90,
      sessionSeconds: 90,
      dateISO: '2026-10-20',
      month: '2026-10'
    }
  ],
  demoStaff: [
    { id: 'demo-teacher-1', username: 'معلم تجريبي', assignedClass: 'مجموعة تجريبية', center: 'رئيسي', canWafdeen: true },
    { id: 'demo-teacher-2', username: 'معلمة تجريبية', assignedClass: 'مجموعة تجريبية', center: 'رئيسي', canWafdeen: false }
  ]
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const collections = new Map(Object.entries(seed).map(([name, records]) => [name, new Map(records.map((record) => [String(record.id), clone(record)]))]));

export const wafdeenMockStore = Object.freeze({
  isMockOnly: true,
  list(collection) {
    return [...(collections.get(String(collection))?.values() || [])].map(clone);
  },
  get(collection, id) {
    const record = collections.get(String(collection))?.get(String(id));
    return record ? clone(record) : null;
  },
  upsert(collection, id, data, options = { merge: true }) {
    const name = String(collection);
    if (!collections.has(name)) collections.set(name, new Map());
    const rows = collections.get(name);
    const key = String(id);
    const next = options?.merge === false ? clone(data) : { ...(rows.get(key) || {}), ...clone(data) };
    next.id = key;
    rows.set(key, next);
    return clone(next);
  }
});
