import { wafdeenMockStore } from './mockData.js';
import { createWafdeenSession, loadWafdeenSessionData } from '../../api/wafdeen-sessions.api.js';
import { canOpenFeature, isAdmin, isSupervisor } from '../../app/permissions.js';
import { registerFeature } from '../register.js';
import { installWafdeenLoginEntry } from './login-entry.js';
import {
  WAFDEEN_GRADE_TYPES,
  aggregateMonthlyQuranUsage,
  formatDuration,
  localDateKey,
  monthKeyForDate,
  monthRange,
  scoreFromCounts
} from './model.js';

const state = { students: [], dailyRecords: [], usage: [], gradeType: 'new', loaded: false };
const timer = { elapsedMs: 0, startedAt: 0, intervalId: null, owner: '' };
const byId = (id) => document.getElementById(id);
const text = (id, value) => { const el = byId(id); if (el) el.textContent = String(value ?? ''); };
const currentTeacher = () => window.currentTeacher || null;
const isAllowed = () => canOpenFeature('wafdeen', currentTeacher());
const isManager = () => isAdmin(currentTeacher());
const liveSessionsEnabled = () => globalThis.window?.__MAJD_WAFDEEN_SESSIONS_ENABLED__ === true;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
const timestamp = () => new Date().toISOString();

function notice(message, type = 'info', target = 'wafdeen-message') {
  const box = byId(target);
  if (!box) return;
  box.textContent = String(message || '');
  box.dataset.type = type;
}

function updateDataModeLabels() {
  const live = liveSessionsEnabled();
  const dataMode = byId('wafdeen-data-mode');
  if (dataMode) {
    dataMode.textContent = live
      ? 'الاتصال الحي مفعل: تُقرأ حقول هوية الطالب ووقت جلسات القرآن الضرورية فقط؛ لا تُحمّل الدرجات القديمة ولا تُعدّل السجلات السابقة.'
      : 'وضع اختبار محلي: بيانات وهمية فقط، ولا يجري اتصال بالسحابة.';
    dataMode.style.borderColor = live ? 'var(--accent-gold)' : 'var(--danger-color)';
  }
  const reportMode = byId('wafdeen-report-mode');
  if (reportMode) reportMode.textContent = live
    ? 'التقرير الحي يقرأ حقول الجلسات للفترة المحددة من 15 إلى 14 فقط، دون أسماء الطلاب أو تعديل السجلات.'
    : 'تقرير تجريبي ببيانات وهمية فقط؛ لا تُقرأ أو تُعدّل سجلات الموقع.';
}

function selectedStudent() {
  const id = String(byId('wafdeen-student-select')?.value || '');
  return state.students.find((student) => String(student.id) === id) || null;
}

function currentTimerOwner() {
  return `${String(byId('wafdeen-student-select')?.value || '')}|${String(byId('wafdeen-date')?.value || '')}`;
}

function timerSeconds() {
  const active = timer.startedAt ? Date.now() - timer.startedAt : 0;
  return Math.min(7200, Math.floor((timer.elapsedMs + active) / 1000));
}

function renderTimer() {
  text('wafdeen-session-time', formatDuration(timerSeconds()));
  const button = byId('wafdeen-timer-toggle');
  if (button) button.textContent = timer.startedAt ? 'استراحة' : (timer.elapsedMs ? 'استكمال' : 'بدء جلسة التسميع');
}

function pauseTimer() {
  if (timer.startedAt) {
    timer.elapsedMs += Date.now() - timer.startedAt;
    timer.startedAt = 0;
  }
  if (timer.intervalId) clearInterval(timer.intervalId);
  timer.intervalId = null;
  renderTimer();
}

function resetTimer() {
  pauseTimer();
  timer.elapsedMs = 0;
  timer.owner = '';
  renderTimer();
}

function toggleTimer() {
  if (!isAllowed()) return notice('هذه الصفحة متاحة للمدير أو للمعلم المصرح له فقط.', 'error');
  if (timer.startedAt) return pauseTimer();
  if (!selectedStudent() || !byId('wafdeen-date')?.value) {
    return notice('اختر الطالب والتاريخ قبل بدء جلسة التسميع.', 'error');
  }
  const owner = currentTimerOwner();
  if (timer.owner && timer.owner !== owner && timer.elapsedMs) {
    return notice('أوقف الجلسة الحالية واحفظها قبل تغيير الطالب أو التاريخ.', 'error');
  }
  timer.owner = owner;
  timer.startedAt = Date.now();
  if (timer.intervalId) clearInterval(timer.intervalId);
  timer.intervalId = setInterval(() => {
    if (timerSeconds() >= 7200) {
      timer.elapsedMs = 7200000;
      timer.startedAt = 0;
      clearInterval(timer.intervalId);
      timer.intervalId = null;
      notice('وصلت جلسة التسميع إلى الحد الأقصى ساعتين.', 'info');
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function dateDayName(dateKey) {
  const [year, month, day] = String(dateKey).split('-').map(Number);
  return ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][new Date(year, month - 1, day).getDay()];
}

function getGradeType() {
  return WAFDEEN_GRADE_TYPES.find((item) => item.key === state.gradeType) || WAFDEEN_GRADE_TYPES[0];
}

function sessionTimeForType(record, typeInfo) {
  const legacyField = typeInfo.key === 'new' ? 'newLessonTimeSeconds' : typeInfo.key === 'old' ? 'oldRevisionTimeSeconds' : 'recitationTimeSeconds';
  const times = record?.quranSessionTimeByType && typeof record.quranSessionTimeByType === 'object' ? record.quranSessionTimeByType : {};
  return Number(times[typeInfo.label] || times[typeInfo.key] || record?.[legacyField] || 0);
}

function hasSavedSessionType(record, typeInfo) {
  return String(record?.sessionType || '') === typeInfo.key || String(record?.sessionType || '') === typeInfo.label || sessionTimeForType(record, typeInfo) > 0;
}

function renderScore() {
  const score = scoreFromCounts(byId('wafdeen-errors')?.value, byId('wafdeen-tashkeel')?.value, byId('wafdeen-repetition')?.value);
  text('wafdeen-score', `${score}/10`);
}

function selectGradeType(type) {
  if (!WAFDEEN_GRADE_TYPES.some((item) => item.key === type)) return;
  if (type !== state.gradeType && (timer.startedAt || timer.elapsedMs)) {
    return notice('احفظ الجلسة الحالية أو غيّر الطالب/التاريخ قبل تبديل نوع الرصد.', 'error');
  }
  state.gradeType = type;
  document.querySelectorAll('[data-wafdeen-grade-type]').forEach((button) => {
    const active = button.dataset.wafdeenGradeType === type;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const label = getGradeType().label;
  text('wafdeen-grade-type-label', label);
  const typeInfo = getGradeType();
  const matching = state.dailyRecords.filter((item) => String(item.studentId) === String(byId('wafdeen-student-select')?.value || '') && String(item.dateISO || '').slice(0, 10) === String(byId('wafdeen-date')?.value || ''));
  const record = liveSessionsEnabled()
    ? matching.find((item) => hasSavedSessionType(item, typeInfo))
    : matching.find((item) => String(item.id || item.recordId || '') === `wafdeen_${String(byId('wafdeen-student-select')?.value || '')}_${String(byId('wafdeen-date')?.value || '')}`);
  const prefix = typeInfo.counterPrefix;
  byId('wafdeen-errors').value = liveSessionsEnabled() ? 0 : Number(record?.[`${prefix}Errors`] || 0);
  byId('wafdeen-tashkeel').value = liveSessionsEnabled() ? 0 : Number(record?.[`${prefix}Tashkeel`] || 0);
  byId('wafdeen-repetition').value = liveSessionsEnabled() ? 0 : Number(record?.[`${prefix}Repetition`] || 0);
  byId('wafdeen-pages').value = liveSessionsEnabled() ? '' : String(record?.[typeInfo.pagesField] ?? '');
  byId('wafdeen-topic').value = liveSessionsEnabled() ? '' : String(record?.[typeInfo.topicField] ?? '');
  byId('wafdeen-save-grade').textContent = liveSessionsEnabled()
    ? (record ? `تم حفظ ${label} في هذا اليوم` : `حفظ ${label} كسجل جديد`)
    : (record?.[typeInfo.scoreField] !== undefined && record?.[typeInfo.scoreField] !== '' ? `حفظ / تحديث ${label}` : `حفظ ${label}`);
  byId('wafdeen-save-grade').disabled = Boolean(liveSessionsEnabled() && record);
  renderScore();
}

function renderStudentSelect() {
  const select = byId('wafdeen-student-select');
  if (!select) return;
  const current = String(select.value || '');
  const active = state.students.filter((student) => !student._deleted).slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
  select.innerHTML = '<option value="">اختر الطالب</option>' + active.map((student) => `<option value="${escapeHtml(student.id)}">${escapeHtml(student.name || 'طالب')}</option>`).join('');
  if (active.some((student) => String(student.id) === current)) select.value = current;
}

function renderStudentTable() {
  const body = document.querySelector('#wafdeen-students-table tbody');
  if (!body) return;
  const active = state.students.filter((student) => !student._deleted).slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
  body.innerHTML = active.map((student) => `<tr><td>${escapeHtml(student.name || '—')}</td><td>${escapeHtml(student.className || '—')}</td><td>${isManager() && !liveSessionsEnabled() ? `<button class="action-btn btn-danger" type="button" data-wafdeen-archive="${escapeHtml(student.id)}">أرشفة</button>` : '—'}</td></tr>`).join('') || '<tr><td colspan="3">لا يوجد طلاب مسجلون بعد.</td></tr>';
  const managerArea = byId('wafdeen-student-admin');
  if (managerArea) managerArea.classList.toggle('hidden', !isManager());
  byId('wafdeen-student-admin-actions')?.classList.toggle('hidden', liveSessionsEnabled());
  byId('wafdeen-student-admin-notice')?.classList.toggle('hidden', !liveSessionsEnabled());
}

function renderTeacherAccessTable() {
  const body = document.querySelector('#wafdeen-teachers-table tbody');
  if (!body) return;
  const note = byId('wafdeen-teacher-admin-note');
  if (!isManager()) { body.innerHTML = ''; return; }
  if (liveSessionsEnabled()) {
    if (note) note.textContent = 'حسابات المعلمين وصلاحياتهم لا تُعدّل من هذه الجلسة؛ تُعرض الصلاحية للقراءة فقط ويظل التحقق عبر النظام الحالي.';
    body.innerHTML = '<tr><td colspan="4">إدارة الحسابات غير متاحة أثناء الاتصال الحي.</td></tr>';
    return;
  }
  if (note) note.textContent = 'بيانات المعلمين هنا تجريبية فقط؛ تغيير الصلاحية يؤثر في ذاكرة الاختبار المحلية ولا يغيّر حسابات الموقع أو كلمات مروره.';
  const teachers = wafdeenMockStore.list('demoStaff');
  body.innerHTML = teachers.map((teacher) => {
    const id = escapeHtml(teacher.id);
    const isPrimaryAdmin = teacher.username === 'admin';
    const isRestricted = isSupervisor(teacher);
    const allowed = teacher.canWafdeen === true || teacher.canWafdeen === 1;
    const control = isPrimaryAdmin ? 'مدير النظام' : isRestricted ? 'صلاحية المشرف مقيدة' : `<input aria-label="السماح لـ ${escapeHtml(teacher.username)} بواجهة الوافدين" data-wafdeen-teacher-access="${id}" type="checkbox" ${allowed ? 'checked' : ''}>`;
    return `<tr><td>${escapeHtml(teacher.username || '—')}</td><td>${escapeHtml(teacher.assignedClass || '—')}</td><td>${escapeHtml(teacher.center || '—')}</td><td>${control}</td></tr>`;
  }).join('') || '<tr><td colspan="4">لا توجد حسابات معلمين محملة.</td></tr>';
}

async function updateTeacherAccess(checkbox) {
  if (liveSessionsEnabled()) return notice('إدارة صلاحيات المعلمين ليست ضمن مسار جلسات الوافدين الآمن.', 'error');
  if (!isManager()) return notice('إدارة صلاحيات المعلمين متاحة للمدير فقط.', 'error');
  const id = String(checkbox.dataset.wafdeenTeacherAccess || '');
  const teacher = wafdeenMockStore.get('demoStaff', id);
  if (!teacher || teacher.username === 'admin' || isSupervisor(teacher)) return renderTeacherAccessTable();
  const requested = checkbox.checked;
  const current = teacher.canWafdeen === true || teacher.canWafdeen === 1;
  if (typeof window.siteConfirm !== 'function') {
    checkbox.checked = current;
    return notice('تعذر فتح تأكيد تغيير صلاحية المعلم؛ لم يتم التغيير.', 'error');
  }
  const confirmed = await window.siteConfirm('تغيير صلاحية الوافدين', `هل تريد ${requested ? 'منح' : 'إيقاف'} صلاحية واجهة الوافدين للمعلم <strong>${escapeHtml(teacher.username)}</strong>؟`, requested ? 'منح الصلاحية' : 'إيقاف الصلاحية', !requested);
  if (!confirmed) { checkbox.checked = current; return; }
  checkbox.disabled = true;
  try {
    wafdeenMockStore.upsert('demoStaff', id, { id, canWafdeen: requested, updatedAt: timestamp() }, { merge: true });
    teacher.canWafdeen = requested;
    updateNavigation();
    notice(requested ? `تم منح صلاحية واجهة الوافدين لـ ${teacher.username}.` : `تم إيقاف صلاحية واجهة الوافدين لـ ${teacher.username}.`, 'success');
  } catch (error) {
    console.error('[wafdeen] teacher access update failed', error);
    checkbox.checked = teacher.canWafdeen === true || teacher.canWafdeen === 1;
    notice(error?.message || 'تعذر تحديث صلاحية المعلم.', 'error');
  } finally {
    checkbox.disabled = false;
  }
}

function renderHistory() {
  const body = document.querySelector('#wafdeen-history-table tbody');
  if (!body) return;
  const student = selectedStudent();
  const rows = state.dailyRecords.filter((record) => !record._deleted && String(record.studentId) === String(student?.id || ''))
    .slice().sort((a, b) => String(b.dateISO || '').localeCompare(String(a.dateISO || '')));
  if (liveSessionsEnabled()) {
    body.innerHTML = rows.map((record) => {
      const type = String(record.sessionType || Object.entries(record.quranSessionTimeByType || {}).find(([, seconds]) => Number(seconds) > 0)?.[0] || 'جلسة تسميع');
      const seconds = Number(record.quranSessionTimeSeconds || Object.values(record.quranSessionTimeByType || {}).reduce((sum, value) => sum + (Number(value) || 0), 0) || record.newLessonTimeSeconds || record.oldRevisionTimeSeconds || record.recitationTimeSeconds || 0);
      return `<tr><td>${escapeHtml(String(record.dateISO || '').slice(0, 10))}</td><td>${escapeHtml(type)}</td><td>${escapeHtml(formatDuration(seconds))}</td></tr>`;
    }).join('') || '<tr><td colspan="3">لا توجد جلسات مسجلة لهذا الطالب.</td></tr>';
    return;
  }
  body.innerHTML = rows.map((record) => {
    const status = record.isAbsent || record.attendanceStatus === 'absent' ? 'غياب' : 'حاضر';
    const grades = [
      record.newLesson !== '' && record.newLesson !== undefined ? `الجديد: ${escapeHtml(record.newLesson)}` : '',
      record.oldRevision !== '' && record.oldRevision !== undefined ? `الماضي: ${escapeHtml(record.oldRevision)}` : '',
      record.recitation !== '' && record.recitation !== undefined ? `التلاوة: ${escapeHtml(record.recitation)}` : ''
    ].filter(Boolean).join('، ') || '—';
    return `<tr><td>${escapeHtml(String(record.dateISO || '').slice(0, 10))}</td><td>${status}</td><td>${grades}</td></tr>`;
  }).join('') || '<tr><td colspan="3">لا توجد درجات مسجلة لهذا الطالب.</td></tr>';
}

async function loadData() {
  if (liveSessionsEnabled()) {
    const data = await loadWafdeenSessionData();
    state.students = data.students;
    state.dailyRecords = data.dailyRecords;
    state.usage = data.usage;
  } else {
    const [students, dailyRecords] = await Promise.all([
      wafdeenMockStore.list('wafdeenRoster'),
      wafdeenMockStore.list('wafdeenDailyRecords')
    ]);
    state.students = students.filter((student) => student && !student._deleted).map((student) => ({
      id: String(student.id || student.studentId || ''),
      name: String(student.name || student.studentName || student.fullName || ''),
      className: String(student.className || student.assignedClass || ''),
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      _deleted: Boolean(student._deleted)
    }));
    state.dailyRecords = dailyRecords.filter(Boolean);
    if (!isManager()) state.usage = [];
  }
  // Existing attendance records remain usable if the optional roster is empty.
  if (!state.students.length) {
    const seen = new Map();
    state.dailyRecords.filter((record) => !record._deleted && record.studentId && record.studentName).forEach((record) => {
      const id = String(record.studentId);
      if (!seen.has(id)) seen.set(id, { id, name: String(record.studentName) });
    });
    state.students = [...seen.values()];
  }
  state.loaded = true;
  renderStudentSelect();
  renderStudentTable();
  renderHistory();
}

export async function renderWafdeenView() {
  if (!isAllowed()) return notice('هذه الصفحة متاحة للمدير أو للمعلم المصرح له فقط.', 'error');
  updateDataModeLabels();
  const dateInput = byId('wafdeen-date');
  if (dateInput && !dateInput.value) dateInput.value = localDateKey();
  notice(liveSessionsEnabled() ? 'جارٍ تحميل حقول الجلسات اللازمة فقط…' : 'جارٍ تحميل بيانات اختبارية محلية فقط…', 'info');
  try {
    await loadData();
    const absenceButton = byId('wafdeen-mark-absent');
    if (absenceButton) absenceButton.disabled = liveSessionsEnabled();
    selectGradeType(state.gradeType);
    byId('wafdeen-view')?.classList.remove('hidden');
    notice(liveSessionsEnabled() ? `تم تحميل ${state.students.length} طالبًا وحقول الجلسات المصرح بها فقط.` : `تم تحميل ${state.students.length} سجلًا وهميًا محليًا.`, 'success');
    renderHistory();
  } catch (error) {
    console.error('[wafdeen] load failed', error);
    notice(error?.message || 'تعذر تحميل بيانات الاختبار المحلية.', 'error');
  }
}

async function saveStudent() {
  if (liveSessionsEnabled()) return notice('إدارة الطلاب غير متاحة ضمن مسار الجلسات الآمن؛ لم يتم تغيير قائمة الطلاب.', 'error');
  if (!isManager()) return notice('إدارة قائمة الطلاب متاحة للمدير فقط.', 'error');
  const name = String(byId('wafdeen-new-student-name')?.value || '').trim();
  if (!name) return notice('اكتب اسم الطالب أولًا.', 'error');
  if (state.students.some((student) => String(student.name || '').trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
    return notice('هذا الاسم موجود بالفعل في قائمة الطلاب.', 'error');
  }
  const id = `wf_${Date.now()}`;
  const record = { id, name, createdAt: timestamp(), updatedAt: timestamp() };
  try {
    wafdeenMockStore.upsert('wafdeenRoster', id, record, { merge: true });
    state.students.push(record);
    byId('wafdeen-new-student-name').value = '';
    renderStudentSelect();
    renderStudentTable();
    notice('تمت إضافة الطالب إلى بيانات الاختبار المحلية فقط.', 'success');
  } catch (error) {
    console.error('[wafdeen] student save failed', error);
    notice(error?.message || 'تعذر حفظ الطالب.', 'error');
  }
}

async function archiveStudent(id) {
  if (liveSessionsEnabled()) return notice('أرشفة الطلاب غير متاحة ضمن مسار الجلسات الآمن؛ لم يتم تغيير أي سجل.', 'error');
  if (!isManager()) return notice('إدارة قائمة الطلاب متاحة للمدير فقط.', 'error');
  const student = state.students.find((item) => String(item.id) === String(id));
  if (!student) return;
  const confirmed = await window.siteConfirm?.('أرشفة الطالب', `سيتم إخفاء <strong>${escapeHtml(student.name || '')}</strong> من قائمة الاختيار، مع الإبقاء على سجلاته كما هي.`, 'أرشفة', true);
  if (confirmed === false) return;
  try {
    const updated = { ...student, _deleted: true, updatedAt: timestamp() };
    wafdeenMockStore.upsert('wafdeenRoster', id, updated, { merge: true });
    state.students = state.students.map((item) => String(item.id) === String(id) ? updated : item);
    renderStudentSelect();
    renderStudentTable();
    renderHistory();
    notice('تمت أرشفة الطالب دون حذف سجلاته.', 'success');
  } catch (error) {
    console.error('[wafdeen] student archive failed', error);
    notice(error?.message || 'تعذر أرشفة الطالب.', 'error');
  }
}

async function saveGrade() {
  if (!isAllowed()) return notice('غير مصرح بحفظ رصد الوافدين.', 'error');
  const student = selectedStudent();
  const date = String(byId('wafdeen-date')?.value || '');
  const typeInfo = getGradeType();
  const live = liveSessionsEnabled();
  const pages = String(byId('wafdeen-pages')?.value || '').trim();
  const topic = String(byId('wafdeen-topic')?.value || '').trim();
  if (!student || !date) return notice('اختر الطالب والتاريخ أولًا.', 'error');
  if (timer.owner && timer.owner !== currentTimerOwner()) return notice('مؤقت الجلسة مرتبط بطالب أو تاريخ آخر؛ ابدأ جلسة جديدة.', 'error');
  if (!pages || !topic) return notice('أكمل عدد الصفحات والمقرر الذي تم تسميعه.', 'error');
  const seconds = timerSeconds();
  if (seconds < 1) return notice('ابدأ جلسة التسميع واحسب وقتًا فعليًا قبل حفظ الدرجة.', 'error');
  const sameDayRecords = state.dailyRecords.filter((record) => String(record.studentId) === String(student.id) && String(record.dateISO || '').slice(0, 10) === date);
  if (live && sameDayRecords.some((record) => hasSavedSessionType(record, typeInfo))) {
    return notice(`توجد جلسة ${typeInfo.label} محفوظة لهذا الطالب في هذا التاريخ. السجلات القديمة للقراءة فقط ولا يمكن تحديثها.`, 'error');
  }
  const id = `wafdeen_${String(student.id)}_${date}`;
  const existing = live ? {} : state.dailyRecords.find((record) => String(record.id || record.recordId) === id) || {};
  const alreadySaved = !live && (existing._dailyTypeSaved?.[typeInfo.label] || (existing[typeInfo.scoreField] !== undefined && existing[typeInfo.scoreField] !== ''));
  if (!live && alreadySaved) {
    if (typeof window.siteConfirm !== 'function') return notice('يوجد رصد محفوظ لهذا النوع. تعذر فتح تأكيد التحديث؛ لم يتم تغيير السجل.', 'error');
    const confirmed = await window.siteConfirm('تحديث رصد محفوظ', `يوجد رصد سابق لـ<strong>${escapeHtml(typeInfo.label)}</strong> في هذا التاريخ. هل تريد تحديثه؟`, 'تحديث الرصد', true);
    if (confirmed === false) return;
  }
  const errors = Math.max(0, Math.floor(Number(byId('wafdeen-errors')?.value) || 0));
  const tashkeel = Math.max(0, Math.floor(Number(byId('wafdeen-tashkeel')?.value) || 0));
  const repetition = Math.max(0, Math.floor(Number(byId('wafdeen-repetition')?.value) || 0));
  const score = scoreFromCounts(errors, tashkeel, repetition);
  if (live) {
    const studentId = String(student.id);
    const studentName = String(student.name || '');
    const encodedStudentId = encodeURIComponent(studentId);
    const recordId = `wafdeen_${encodedStudentId}_${date}_${typeInfo.key}`;
    const usageId = `wafdeen_usage_${encodedStudentId}_${date}_${typeInfo.key}`;
    const teacherUsername = String(currentTeacher()?.username || '');
    const timeByType = { الجديد: 0, الماضي: 0, التلاوة: 0, [typeInfo.label]: seconds };
    const savedAt = timestamp();
    try {
      await createWafdeenSession({
        studentId, studentName, dateISO: date, gradeType: typeInfo.key,
        pages, topic, errors, tashkeel, repetition, sessionSeconds: seconds
      });
      const daily = {
        id: recordId, recordId, className: 'الوافدين', studentId, studentName, teacherUsername, dateISO: date,
        sessionType: typeInfo.key, quranSessionTimeSeconds: seconds, quranSessionTimeByType: timeByType,
        [typeInfo.scoreField]: score, [typeInfo.pagesField]: pages, [typeInfo.topicField]: topic,
        [`${typeInfo.counterPrefix}Errors`]: errors, [`${typeInfo.counterPrefix}Tashkeel`]: tashkeel,
        [`${typeInfo.counterPrefix}Repetition`]: repetition,
        [typeInfo.key === 'new' ? 'newLessonTimeSeconds' : typeInfo.key === 'old' ? 'oldRevisionTimeSeconds' : 'recitationTimeSeconds']: seconds,
        total: score, savedAt, updatedAt: savedAt
      };
      const usage = {
        id: usageId, className: 'الوافدين', studentId, teacherUsername, dateISO: date, category: 'quran',
        type: typeInfo.label, quranGradeType: typeInfo.label, seconds, sessionSeconds: seconds
      };
      state.dailyRecords = [...state.dailyRecords, daily];
      state.usage = [...state.usage, usage];
      notice(`تم حفظ ${typeInfo.label} كجلسة جديدة للطالب ${studentName}، دون تعديل أي سجل سابق.`, 'success');
      resetTimer();
      selectGradeType(state.gradeType);
      renderHistory();
    } catch (error) {
      console.error('[wafdeen] insert-only session save failed', error);
      const message = error?.message === 'SESSION_ALREADY_EXISTS'
        ? `توجد جلسة ${typeInfo.label} محفوظة لهذا اليوم؛ لم يتم تعديل أي سجل قديم.`
        : (error?.message || 'تعذر حفظ الجلسة الجديدة. لم يتم تعديل أي سجل قديم.');
      notice(message, 'error');
    }
    return;
  }
  const savedAt = timestamp();
  const priorTimes = existing.quranSessionTimeByType || {};
  const timeByType = {
    الجديد: Number(priorTimes.الجديد || existing.newLessonTimeSeconds || 0),
    الماضي: Number(priorTimes.الماضي || existing.oldRevisionTimeSeconds || 0),
    التلاوة: Number(priorTimes.التلاوة || existing.recitationTimeSeconds || 0),
    ...priorTimes,
    [typeInfo.label]: seconds
  };
  const daily = {
    ...existing,
    id,
    recordId: id,
    teacherUsername: 'معلم تجريبي',
    studentId: String(student.id),
    studentName: String(student.name || student.username || ''),
    dateISO: date,
    attendanceStatus: 'present',
    isAbsent: false,
    status: 'present',
    dayName: dateDayName(date),
    quranSessionTimeSeconds: Math.max(Number(existing.quranSessionTimeSeconds) || 0, Object.values(timeByType).reduce((sum, value) => sum + (Number(value) || 0), 0)),
    quranSessionTimeByType: timeByType,
    [typeInfo.scoreField]: score,
    [typeInfo.pagesField]: pages,
    [typeInfo.topicField]: topic,
    [`${typeInfo.counterPrefix}Errors`]: errors,
    [`${typeInfo.counterPrefix}Tashkeel`]: tashkeel,
    [`${typeInfo.counterPrefix}Repetition`]: repetition,
    [`${typeInfo.counterPrefix === 'new' ? 'newLesson' : typeInfo.counterPrefix === 'old' ? 'oldRevision' : 'recitation'}TimeSeconds`]: seconds,
    _dailyTypeSaved: { ...(existing._dailyTypeSaved || {}), [typeInfo.label]: true },
    savedAt: existing.savedAt || savedAt,
    updatedAt: savedAt
  };
  daily.total = ['newLesson', 'oldRevision', 'recitation'].reduce((sum, field) => sum + (daily[field] === '' || daily[field] === undefined ? 0 : Number(daily[field]) || 0), 0);
  const usageId = `${String(student.id)}_${date}_${typeInfo.label}`;
  const usage = {
    id: usageId,
    teacherUsername: 'معلم تجريبي',
    studentId: String(student.id),
    studentName: String(student.name || student.username || ''),
    category: 'quran',
    subject: 'القرآن الكريم',
    type: typeInfo.label,
    seconds,
    sessionSeconds: seconds,
    dateISO: date,
    month: monthKeyForDate(date),
    sessionMaxSeconds: 7200,
    completedInTwoHours: seconds >= 7200,
    updatedAt: savedAt
  };
  try {
    const results = await Promise.allSettled([
      wafdeenMockStore.upsert('wafdeenDailyRecords', id, daily, { merge: true }),
      wafdeenMockStore.upsert('wafdeenUsage', usageId, usage, { merge: true })
    ]);
    if (results[0].status === 'rejected') throw results[0].reason;
    state.dailyRecords = [...state.dailyRecords.filter((item) => String(item.id || item.recordId) !== id), daily];
    if (results[1].status === 'fulfilled') {
      state.usage = [...state.usage.filter((item) => String(item.id) !== usageId), usage];
      notice(`تم حفظ ${typeInfo.label} للطالب ${student.name} داخل بيانات الاختبار المحلية فقط.`, 'success');
    } else {
      console.error('[wafdeen] usage save failed after daily record save', results[1].reason);
      notice('تم حفظ الدرجة محليًا؛ تعذر تحديث سجل الوقت الوهمي.', 'error');
    }
    resetTimer();
    selectGradeType(state.gradeType);
    renderHistory();
  } catch (error) {
    console.error('[wafdeen] grade save failed', error);
    notice(error?.message || 'تعذر حفظ الدرجة في بيانات الاختبار المحلية.', 'error');
  }
}

async function markAbsent() {
  if (liveSessionsEnabled()) return notice('تسجيل الغياب ليس ضمن مسار الجلسات المعتمد؛ لم يتم إنشاء سجل غياب أو تغيير أي سجل قديم.', 'error');
  if (!isAllowed()) return notice('غير مصرح بتسجيل غياب الوافدين.', 'error');
  const student = selectedStudent();
  const date = String(byId('wafdeen-date')?.value || '');
  if (!student || !date) return notice('اختر الطالب والتاريخ أولًا.', 'error');
  if (timer.startedAt || timer.elapsedMs) return notice('أوقف جلسة التسميع واحفظها أو صفّر المؤقت قبل تسجيل الغياب.', 'error');
  const id = `wafdeen_${String(student.id)}_${date}`;
  const existing = state.dailyRecords.find((record) => String(record.id || record.recordId) === id) || {};
  const record = {
    ...existing,
    id,
    recordId: id,
    teacherUsername: 'معلم تجريبي',
    studentId: String(student.id),
    studentName: String(student.name || student.username || ''),
    dateISO: date,
    attendanceStatus: 'absent',
    isAbsent: true,
    status: 'absent',
    dayName: dateDayName(date),
    updatedAt: timestamp()
  };
  try {
    wafdeenMockStore.upsert('wafdeenDailyRecords', id, record, { merge: true });
    state.dailyRecords = [...state.dailyRecords.filter((item) => String(item.id || item.recordId) !== id), record];
    renderHistory();
    notice(`تم تسجيل غياب ${student.name} مع الإبقاء على أي درجات سابقة.`, 'success');
  } catch (error) {
    console.error('[wafdeen] absence save failed', error);
    notice(error?.message || 'تعذر تسجيل الغياب.', 'error');
  }
}

function addDailyRecordUsageFallback() {
  const normalizedType = (value) => ({ new: 'الجديد', newLesson: 'الجديد', old: 'الماضي', oldRevision: 'الماضي', recitation: 'التلاوة' })[String(value || '')] || String(value || '');
  const output = new Map();
  const usageType = (record) => normalizedType(record.quranGradeType || record.type);
  const signatureFor = (record, type) => `${String(record.studentId || '')}|${String(record.dateISO || '').slice(0, 10)}|${type}`;
  const signatures = new Set();
  for (const record of state.usage || []) {
    const type = usageType(record);
    const signature = signatureFor(record, type);
    if (!signatures.has(signature)) output.set(signature, record);
    signatures.add(signature);
  }
  const month = String(byId('wafdeen-report-month')?.value || '');
  const { start, end } = monthRange(month);
  for (const record of state.dailyRecords) {
    if (!record || record._deleted) continue;
    const date = String(record.dateISO || '').slice(0, 10);
    if (date < start || date > end) continue;
    const times = record.quranSessionTimeByType && typeof record.quranSessionTimeByType === 'object' ? record.quranSessionTimeByType : {};
    let entries = Object.entries(times).filter(([, seconds]) => Number(seconds) > 0);
    if (!entries.length) {
      entries = [
        ['الجديد', record.newLessonTimeSeconds],
        ['الماضي', record.oldRevisionTimeSeconds],
        ['التلاوة', record.recitationTimeSeconds]
      ].filter(([, seconds]) => Number(seconds) > 0);
    }
    const totalSeconds = Number(record.quranSessionTimeSeconds) || (Number(record.newLessonTimeSeconds) || 0) + (Number(record.oldRevisionTimeSeconds) || 0) + (Number(record.recitationTimeSeconds) || 0);
    const typedTotal = entries.reduce((sum, [, seconds]) => sum + (Number(seconds) || 0), 0);
    const untypedRemainder = Math.max(0, totalSeconds - typedTotal);
    if (untypedRemainder > 0) entries.push(['جلسة', untypedRemainder]);
    for (const [sourceType, seconds] of entries) {
      const type = normalizedType(sourceType);
      const signature = `${String(record.studentId || '')}|${date}|${type}`;
      if (signatures.has(signature)) continue;
      output.set(signature, {
        category: 'quran',
        teacherUsername: record.teacherUsername || 'غير معروف',
        studentId: record.studentId,
        type,
        quranGradeType: type,
        seconds: Number(seconds),
        sessionSeconds: Number(seconds),
        dateISO: date
      });
      signatures.add(signature);
    }
  }
  return [...output.values()];
}

export async function renderWafdeenMonthlyReport() {
  if (!canOpenFeature('wafdeen-report', currentTeacher())) return notice('تقرير الوافدين الشهري متاح للمدير فقط.', 'error', 'wafdeen-report-message');
  updateDataModeLabels();
  const input = byId('wafdeen-report-month');
  if (input && !input.value) input.value = localDateKey().slice(0, 7);
  const month = String(input?.value || localDateKey().slice(0, 7));
  try {
    if (liveSessionsEnabled()) {
      const data = await loadWafdeenSessionData({ purpose: 'report', month });
      state.usage = data.usage;
      state.dailyRecords = data.dailyRecords;
    } else {
      const [usage, dailyRecords] = await Promise.all([
        wafdeenMockStore.list('wafdeenUsage'),
        wafdeenMockStore.list('wafdeenDailyRecords')
      ]);
      state.usage = usage.filter(Boolean);
      state.dailyRecords = dailyRecords.filter(Boolean);
    }
    const { start, end } = monthRange(month);
    const periodLabel = byId('wafdeen-report-period');
    if (periodLabel) periodLabel.textContent = `الفترة: ${start} إلى ${end}`;
    const rows = aggregateMonthlyQuranUsage(addDailyRecordUsageFallback(), month);
    const body = document.querySelector('#wafdeen-monthly-report-table tbody');
    if (body) body.innerHTML = rows.map((row) => `<tr><td>${escapeHtml(row.teacher)}</td><td>${row.sessions}</td><td>${escapeHtml(formatDuration(row.sessionSeconds))}</td><td>${(row.sessionSeconds / 3000).toFixed(2)}</td><td>${(row.sessionSeconds / 3600).toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="5">لا توجد جلسات تسميع مسجلة خلال هذه الفترة.</td></tr>';
    text('wafdeen-report-count', `${rows.length} شيخًا مسجلًا`);
    notice(liveSessionsEnabled() ? 'تم إنشاء التقرير من حقول الجلسات اللازمة فقط.' : 'هذا تقرير تجريبي من بيانات وهمية فقط؛ لا تُقرأ سجلات الموقع أو السحابة.', 'success', 'wafdeen-report-message');
  } catch (error) {
    console.error('[wafdeen] monthly report failed', error);
    notice(error?.message || 'تعذر تحميل التقرير الشهري.', 'error', 'wafdeen-report-message');
  }
}

function exportMonthlyReport() {
  const table = byId('wafdeen-monthly-report-table');
  const month = String(byId('wafdeen-report-month')?.value || localDateKey().slice(0, 7));
  if (!table || !table.querySelector('tbody tr')) return notice('لا توجد بيانات لتصديرها.', 'error', 'wafdeen-report-message');
  if (!window.XLSX?.utils?.table_to_book) return notice('ميزة تصدير Excel غير متاحة الآن.', 'error', 'wafdeen-report-message');
  const workbook = window.XLSX.utils.table_to_book(table, { sheet: 'التقرير الشهري الوقتي' });
  window.XLSX.writeFile(workbook, `تقرير_الوافدين_الشهري_الوقتي_${month}.xlsx`);
}

function showPanel(name) {
  if (['teachers', 'students'].includes(name) && !isManager()) return notice('إدارة المعلمين والطلاب متاحة للمدير فقط.', 'error');
  document.querySelectorAll('[data-wafdeen-panel]').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.wafdeenPanel !== name));
  document.querySelectorAll('[data-wafdeen-panel-button]').forEach((button) => {
    const active = button.dataset.wafdeenPanelButton === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (name === 'grades') renderHistory();
  if (name === 'students') renderStudentTable();
  if (name === 'teachers') renderTeacherAccessTable();
}

function setWafdeenMenuOpen(open) {
  const handle = byId('wafdeen-menu-handle');
  const drawer = byId('wafdeen-drawer');
  const overlay = byId('wafdeen-overlay');
  const isOpen = Boolean(open);
  drawer?.classList.toggle('open', isOpen);
  overlay?.classList.toggle('open', isOpen);
  drawer?.setAttribute('aria-hidden', String(!isOpen));
  overlay?.setAttribute('aria-hidden', String(!isOpen));
  handle?.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('wafdeen-menu-open', isOpen);
}

function openTab(tabId) {
  if (!isAllowed() && tabId === 'wafdeen-tab') return notice('هذه الصفحة متاحة للمدير أو للمعلم المصرح له فقط.', 'error');
  if (!canOpenFeature('wafdeen-report', currentTeacher()) && tabId === 'wafdeen-monthly-report-tab') return notice('تقرير الوافدين الشهري متاح للمدير فقط.', 'error');
  const button = byId(tabId === 'wafdeen-tab' ? 'wafdeen-tab-btn' : 'wafdeen-monthly-report-tab-btn');
  const event = { currentTarget: button, target: button };
  window.switchTab?.(tabId, event);
}
function installPageHandlers() {
  const view = byId('wafdeen-tab');
  if (view && view.dataset.wafdeenBound !== 'true') {
    view.dataset.wafdeenBound = 'true';
    view.addEventListener('click', (event) => {
      const panelButton = event.target.closest('[data-wafdeen-panel-button]');
      if (event.target.closest('#wafdeen-menu-handle')) return setWafdeenMenuOpen(!byId('wafdeen-drawer')?.classList.contains('open'));
      if (event.target.closest('#wafdeen-menu-close, #wafdeen-overlay')) return setWafdeenMenuOpen(false);
      if (panelButton) {
        showPanel(panelButton.dataset.wafdeenPanelButton);
        return setWafdeenMenuOpen(false);
      }
      const typeButton = event.target.closest('[data-wafdeen-grade-type]');
      if (typeButton) return selectGradeType(typeButton.dataset.wafdeenGradeType);
      const archiveButton = event.target.closest('[data-wafdeen-archive]');
      if (archiveButton) return archiveStudent(archiveButton.dataset.wafdeenArchive);
      if (event.target.closest('#wafdeen-timer-toggle')) return toggleTimer();
      if (event.target.closest('#wafdeen-timer-reset')) {
        resetTimer();
        return notice('تم تصفير مؤقت جلسة التسميع فقط؛ لم يتغير أي سجل محفوظ.', 'info');
      }
      if (event.target.closest('#wafdeen-save-grade')) return saveGrade();
      if (event.target.closest('#wafdeen-mark-absent')) return markAbsent();
      if (event.target.closest('#wafdeen-add-student')) return saveStudent();
      if (event.target.closest('#wafdeen-refresh')) return renderWafdeenView();
    });
    view.addEventListener('input', (event) => {
      if (['wafdeen-errors', 'wafdeen-tashkeel', 'wafdeen-repetition'].includes(event.target.id)) renderScore();
    });
    view.addEventListener('change', (event) => {
      if (event.target.matches('[data-wafdeen-teacher-access]')) return updateTeacherAccess(event.target);
      if (event.target.id === 'wafdeen-student-select' || event.target.id === 'wafdeen-date') {
        if (timer.elapsedMs || timer.startedAt) {
          resetTimer();
          notice('أُعيد ضبط مؤقت الجلسة عند تغيير الطالب أو التاريخ.', 'info');
        }
        selectGradeType(state.gradeType);
        renderHistory();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && byId('wafdeen-drawer')?.classList.contains('open')) setWafdeenMenuOpen(false);
    });
  }
  const report = byId('wafdeen-monthly-report-tab');
  if (report && report.dataset.wafdeenBound !== 'true') {
    report.dataset.wafdeenBound = 'true';
    report.addEventListener('change', (event) => {
      if (event.target.id === 'wafdeen-report-month') renderWafdeenMonthlyReport();
    });
    report.addEventListener('click', (event) => {
      if (event.target.closest('#wafdeen-report-refresh')) renderWafdeenMonthlyReport();
      if (event.target.closest('#wafdeen-report-export')) exportMonthlyReport();
    });
  }
}

function updateNavigation() {
  const featureButton = byId('wafdeen-tab-btn');
  const reportButton = byId('wafdeen-monthly-report-tab-btn');
  const menuHandle = byId('wafdeen-menu-handle');
  const absenceButton = byId('wafdeen-mark-absent');
  if (featureButton) featureButton.classList.toggle('hidden', !canOpenFeature('wafdeen', currentTeacher()));
  if (reportButton) reportButton.classList.toggle('hidden', !canOpenFeature('wafdeen-report', currentTeacher()));
  if (menuHandle) menuHandle.classList.toggle('hidden', !canOpenFeature('wafdeen', currentTeacher()));
  document.querySelectorAll('[data-wafdeen-admin-only]').forEach((button) => button.classList.toggle('hidden', !isManager()));
  if (absenceButton) absenceButton.disabled = liveSessionsEnabled();
  byId('wafdeen-tab')?.classList.toggle('hidden', !canOpenFeature('wafdeen', currentTeacher()));
  byId('wafdeen-monthly-report-tab')?.classList.toggle('hidden', !canOpenFeature('wafdeen-report', currentTeacher()));
}

function installNavigationGuards() {
  if (typeof window.showAppScreen === 'function' && !window.showAppScreen.__wafdeenWrapped) {
    const original = window.showAppScreen;
    const wrapped = function (...args) {
      const result = original.apply(this, args);
      if (byId('app-screen')?.classList.contains('hidden')) setWafdeenMenuOpen(false);
      updateNavigation();
      return result;
    };
    wrapped.__wafdeenWrapped = true;
    window.showAppScreen = wrapped;
  }
  if (typeof window.switchTab === 'function' && !window.switchTab.__wafdeenWrapped) {
    const original = window.switchTab;
    const wrapped = function (tabId, event) {
      if (tabId === 'wafdeen-tab' && !canOpenFeature('wafdeen', currentTeacher())) return notice('هذه الصفحة متاحة للمدير أو للمعلم المصرح له فقط.', 'error');
      if (tabId === 'wafdeen-monthly-report-tab' && !canOpenFeature('wafdeen-report', currentTeacher())) return notice('تقرير الوافدين الشهري متاح للمدير فقط.', 'error');
      if (tabId !== 'wafdeen-tab') setWafdeenMenuOpen(false);
      const result = original.apply(this, arguments);
      if (tabId === 'wafdeen-monthly-report-tab') {
        byId('sheikh-recordings-menu-wrap')?.classList.add('open');
        byId('sheikh-recordings-menu-btn')?.classList.add('active');
      }
      if (tabId === 'wafdeen-tab' || tabId === 'wafdeen-monthly-report-tab') {
        Promise.resolve(window.MajdApp?.loadFeature(tabId)).then(() => {
          if (tabId === 'wafdeen-tab') return renderWafdeenView();
          return renderWafdeenMonthlyReport();
        }).catch((error) => {
          console.error('[wafdeen] tab open failed', error);
          notice(error?.message || 'تعذر فتح صفحة الوافدين.', 'error', tabId === 'wafdeen-tab' ? 'wafdeen-message' : 'wafdeen-report-message');
        });
      }
      return result;
    };
    wrapped.__wafdeenWrapped = true;
    window.switchTab = wrapped;
  }
}

window.renderWafdeenView = renderWafdeenView;
window.renderWafdeenMonthlyReport = renderWafdeenMonthlyReport;
window.openWafdeenTab = () => openTab('wafdeen-tab');
window.openWafdeenMonthlyReport = () => openTab('wafdeen-monthly-report-tab');
window.refreshWafdeenNavigation = updateNavigation;
installPageHandlers();
installWafdeenLoginEntry(openTab);
installNavigationGuards();
updateNavigation();
registerFeature('wafdeen', ['renderWafdeenView', 'renderWafdeenMonthlyReport']);
