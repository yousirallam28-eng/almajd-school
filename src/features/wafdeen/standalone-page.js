import { createWafdeenSession, loadWafdeenSessionData } from '../../api/wafdeen-sessions.api.js';
import { loadWafdeenGrades } from '../../api/wafdeen-grades.api.js';
import { loadWafdeenReportData } from '../../api/wafdeen-report.api.js';
import { reportPeriodBounds, reportPeriodKeyForDate, summarizeWafdeenUsage } from './read-only-reports.js';

const LABEL_TO_GRADE = Object.freeze({ الجديد: 'new', الماضي: 'old', التلاوة: 'recitation' });
const TYPE_FIELDS = Object.freeze({
  الجديد: { score: 'newLesson', pages: 'newPagesCount', topic: 'newTopicRecited', prefix: 'new' },
  الماضي: { score: 'oldRevision', pages: 'oldPagesCount', topic: 'oldTopicRecited', prefix: 'old' },
  التلاوة: { score: 'recitation', pages: 'recitationPagesCount', topic: 'recitationTopicRecited', prefix: 'recitation' }
});
const reportCache = new Map();
let activeReportView = 'month';

function text(value) {
  return String(value ?? '').trim();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function showNotice(message, type = 'error') {
  if (typeof window.showMessage === 'function') {
    window.showMessage('wafdeen-save-msg', message, type);
  } else {
    const target = document.getElementById('wafdeen-save-msg');
    if (target) target.textContent = message;
  }
}

function disableUnsupportedControls() {
  const disabledHandler = /wafdeenShowPanel\(['"](?:cloudReview)['"]\)|wafdeen(?:GuardedDailySave|DeleteGrade|DeleteDailyReport|DeleteWeeklyReport|DeleteMonthlyReport|DeleteSelectedCloudDuplicates|DeleteCloudStudent|DeleteUsageRecords|SaveExam|DeleteExam|EduStopTimer)|deleteWafdeen(?:Teacher|Student)|saveWafdeenMonthlyReportToGoogleSheets|markWafdeenAbsent|saveWafdeenDailyRecord/i;
  const apply = (root = document) => {
    root.querySelectorAll?.('button[onclick],input[onclick],a[onclick]').forEach((element) => {
      const handler = element.getAttribute('onclick') || '';
      if (!disabledHandler.test(handler)) return;
      element.disabled = true;
      element.dataset.wafdeenDisabled = 'true';
      element.title = 'غير متاح في هذه الصفحة؛ لا توجد واجهة API معتمدة لهذه العملية.';
      element.setAttribute('aria-disabled', 'true');
    });
  };
  apply();
  if (typeof MutationObserver === 'function' && document.body) {
    const observer = new MutationObserver((entries) => entries.forEach((entry) => entry.addedNodes.forEach((node) => {
      if (node.nodeType === 1) apply(node);
    })));
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function setStatus(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function canReadWafdeenGrades(user = window.currentWafdeenTeacher) {
  return !!user && (user.isAdmin === true || (user.accountType === 'staff' && user.center !== 'مشرف' &&
    (user.canWafdeen === true || user.canWafdeen === 1)));
}

function renderHistoricalGrades() {
  const body = document.querySelector('#wafdeen-historical-grades-table tbody');
  if (!body) return;
  const filter = text(document.getElementById('wafdeen-grades-filter')?.value).toLocaleLowerCase('ar');
  const grades = (window.wafdeenHistoricalGrades_ || [])
    .filter((row) => !filter || String(row.studentName || '').toLocaleLowerCase('ar').includes(filter))
    .sort((a, b) => String(b.dateISO).localeCompare(String(a.dateISO)) || String(a.studentName).localeCompare(String(b.studentName), 'ar'));
  body.innerHTML = grades.map((row) => `<tr><td>${escapeHtml(row.studentName)}</td><td>${escapeHtml(row.dateISO)}</td><td>${escapeHtml(row.sessionType || '—')}</td><td>${escapeHtml(row.newLesson ?? '—')}</td><td>${escapeHtml(row.oldRevision ?? '—')}</td><td>${escapeHtml(row.recitation ?? '—')}</td><td>${escapeHtml(row.total ?? '—')}</td></tr>`).join('') || '<tr><td colspan="7">لا توجد درجات مطابقة في الحقول التاريخية المسموح بها.</td></tr>';
}

async function loadHistoricalGrades() {
  if (!canReadWafdeenGrades()) {
    setStatus('wafdeen-grades-status', 'هذه القراءة متاحة للمدير أو لموظف مخوّل للوافدين فقط.');
    return false;
  }
  setStatus('wafdeen-grades-status', 'جارٍ تحميل الدرجات التاريخية المسموح بها…');
  try {
    window.wafdeenHistoricalGrades_ = await loadWafdeenGrades();
    setStatus('wafdeen-grades-status', `تم تحميل ${window.wafdeenHistoricalGrades_.length} سجلًا للقراءة فقط؛ لا تتضمن الاستجابة معرفات سجلات أو بيانات تعديل.`);
    renderHistoricalGrades();
    return true;
  } catch (error) {
    window.wafdeenHistoricalGrades_ = [];
    setStatus('wafdeen-grades-status', window.majdApiErrorMessage_?.(error) || 'تعذر تحميل الدرجات التاريخية.');
    renderHistoricalGrades();
    return false;
  }
}

function formatReportDuration(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((part) => String(part).padStart(2, '0')).join(':');
}

function renderReportTable(target, headers, rows) {
  if (!target) return;
  if (!rows.length) {
    target.innerHTML = '<div class="wafdeen-note">لا توجد بيانات وقت مسجلة في الفترة المحددة.</div>';
    return;
  }
  target.innerHTML = `<div class="table-responsive"><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

async function loadReadOnlyReport(section) {
  const prefix = section === 'report' ? 'wafdeen-report' : 'wafdeen-education-time';
  const statusId = `${prefix}-status`;
  if (window.currentWafdeenTeacher?.isAdmin !== true) {
    setStatus(statusId, 'هذا التقرير للمدير فقط.');
    return false;
  }
  const monthInput = document.getElementById(`${prefix}-month`);
  const target = document.getElementById(`${prefix}-results`);
  if (!monthInput || !target) return false;
  if (!monthInput.value) monthInput.value = reportPeriodKeyForDate(new Date());
  const bounds = reportPeriodBounds(monthInput.value);
  if (!bounds) {
    setStatus(statusId, 'اختر فترة تقرير صالحة.');
    return false;
  }
  setStatus(statusId, 'جارٍ تحميل ملخص الاستخدام المصرح به…');
  target.innerHTML = '';
  try {
    let report = reportCache.get(monthInput.value);
    if (!report) {
      const loaded = await loadWafdeenReportData(monthInput.value);
      report = { usage: loaded.usage.map((row) => ({
        teacherUsername: row.teacherUsername,
        dateISO: row.dateISO,
        category: row.category,
        seconds: row.seconds
      })) };
      reportCache.set(monthInput.value, report);
    }
    const summary = summarizeWafdeenUsage(report.usage);
    if (section === 'report') {
      const view = ['day', 'week', 'month'].includes(activeReportView) ? activeReportView : 'month';
      const resultRows = view === 'day' ? summary.byDate : view === 'week' ? summary.byWeek : summary.byTeacher;
      const rows = resultRows.map((row) => [row.label, formatReportDuration(row.quranSeconds), formatReportDuration(row.educationSeconds), formatReportDuration(row.totalSeconds)]);
      const firstColumn = view === 'month' ? 'المعلم' : view === 'week' ? 'الأسبوع (السبت–الجمعة)' : 'التاريخ';
      renderReportTable(target, [firstColumn, 'وقت القرآن', 'وقت المواد التعليمية', 'الإجمالي'], rows);
    } else {
      const teachers = summary.byTeacher.filter((row) => row.educationSeconds > 0)
        .map((row) => [row.label, formatReportDuration(row.educationSeconds)]);
      const days = summary.byDate.filter((row) => row.educationSeconds > 0)
        .map((row) => [row.label, formatReportDuration(row.educationSeconds)]);
      target.innerHTML = '<h4>الإجمالي حسب المعلم</h4><div id="wafdeen-education-teachers"></div><h4>الإجمالي حسب اليوم</h4><div id="wafdeen-education-days"></div><div class="wafdeen-note">لا يتضمن مسار القراءة الحالي اسم المادة أو معرف الطالب؛ لذلك يُعرض الوقت التعليمي مجمعًا فقط.</div>';
      renderReportTable(target.querySelector('#wafdeen-education-teachers'), ['المعلم', 'وقت المواد'], teachers);
      renderReportTable(target.querySelector('#wafdeen-education-days'), ['اليوم', 'وقت المواد'], days);
    }
    setStatus(statusId, `فترة التقرير: ${bounds.start} إلى ${bounds.end}. القراءة للمدير فقط ولا تتيح التعديل أو الحذف.`);
    return true;
  } catch (error) {
    target.innerHTML = '';
    setStatus(statusId, window.majdApiErrorMessage_?.(error) || 'تعذر تحميل التقرير؛ لم يُعرض أي تقرير محلي قديم على أنه بيانات سحابية.');
    return false;
  }
}

function bindReadOnlyControls() {
  const filter = document.getElementById('wafdeen-grades-filter');
  if (filter && filter.dataset.bound !== 'true') {
    filter.dataset.bound = 'true';
    filter.addEventListener('input', renderHistoricalGrades);
  }
  for (const [section, prefix] of [['report', 'wafdeen-report'], ['educationTime', 'wafdeen-education-time']]) {
    const monthInput = document.getElementById(`${prefix}-month`);
    if (monthInput && monthInput.dataset.bound !== 'true') {
      monthInput.dataset.bound = 'true';
      monthInput.addEventListener('change', () => loadReadOnlyReport(section));
    }
    const refresh = document.getElementById(`${prefix}-refresh`);
    if (refresh && refresh.dataset.bound !== 'true') {
      refresh.dataset.bound = 'true';
      refresh.addEventListener('click', () => {
        if (monthInput?.value) reportCache.delete(monthInput.value);
        loadReadOnlyReport(section);
      });
    }
  }
  document.querySelectorAll('[data-wafdeen-report-view]').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      activeReportView = button.dataset.wafdeenReportView;
      document.querySelectorAll('[data-wafdeen-report-view]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      loadReadOnlyReport('report');
    });
  });
}

function callRequest(body) {
  if (!window.MajdLocalDataAPI?.isAvailable?.()) throw new Error('يجب تسجيل الدخول أولاً.');
  return window.majdAuthenticatedRequest_(body);
}

export function wireWafdeenStandalonePage(bridge = window.MajdLocalDataAPI) {
  if (!bridge) throw new Error('واجهة Wafdeen المعتمدة غير متاحة.');
  bindReadOnlyControls();
  window.wafdeenLoadHistoricalGrades = loadHistoricalGrades;

  window.wafdeenLoadCloud = async function () {
    if (typeof window.wafdeenLoadBooksFromGoogleDrive === 'function') {
      window.wafdeenLoadBooksFromGoogleDrive().then((books) => {
        if (!Array.isArray(books)) return;
        window.wafdeenBooksData = books;
        window.wafdeenPersistLocal?.();
        if (!document.getElementById('wafdeen-panel-materials')?.classList.contains('hidden')) {
          window.wafdeenRenderMaterials?.(window.wafdeenSelectedSubject);
        }
      }).catch((error) => console.warn('تعذر تحميل الكتب:', error));
    }

    if (!bridge.isAvailable()) return;
    window.wafdeenStudentsData = [];
    window.wafdeenTeachersData = [];
    window.wafdeenDailyRecords = [];
    window.wafdeenUsageData = [];
    window.wafdeenExamsData = [];

    try {
      const data = await loadWafdeenSessionData({ purpose: 'daily' });
      window.wafdeenStudentsData = data.students;
      // واجهة القراءة اليومية لا تُرجع درجات، لذلك لا نعرض سجلات قديمة على أنها درجات.
      window.wafdeenDailyRecords = [];
      window.wafdeenUsageData = [];
      window.wafdeenDailySessionMetadata = data.dailyRecords;

      if (window.currentWafdeenTeacher?.isAdmin) {
        const teacherResult = await bridge.listWafdeenTeachers();
        window.wafdeenTeachersData = (Array.isArray(teacherResult?.teachers) ? teacherResult.teachers : [])
          .map((teacher) => ({
            id: text(teacher?.id),
            username: text(teacher?.username),
            assignedClass: text(teacher?.assignedClass),
            center: text(teacher?.center)
          })).filter((teacher) => teacher.id && teacher.username);
        window.wafdeenRenderTeachersTable?.();
        setStatus('wafdeen-teachers-cloud-status', 'تم تحميل ملخصات الحسابات المصرح بها فقط؛ لا تُعرض بيانات الاعتماد.');
      } else {
        setStatus('wafdeen-teachers-cloud-status', 'قائمة حسابات المعلمين متاحة للمدير المخوّل فقط.');
      }

      window.wafdeenRenderStudentSelect?.();
      window.wafdeenRenderStudentsTable?.();
      setStatus('wafdeen-accounts-cloud-status', 'تم تحميل أسماء الطلاب ومعرّفات القائمة المصرح بها فقط؛ لم تُحمّل كلمات مرور أو حسابات طلاب.');
      setStatus('wafdeen-grades-cloud-status', 'الدرجات التاريخية تُعرض للقراءة فقط عبر قائمة الحقول المسموح بها.');
      return data;
    } catch (error) {
      window.wafdeenStudentsData = [];
      window.wafdeenTeachersData = [];
      window.wafdeenDailyRecords = [];
      window.wafdeenUsageData = [];
      window.wafdeenRenderStudentSelect?.();
      window.wafdeenRenderStudentsTable?.();
      window.wafdeenRenderTeachersTable?.();
      setStatus('wafdeen-accounts-cloud-status', window.majdApiErrorMessage_?.(error) || 'تعذر تحميل بيانات الوافدين المصرح بها.');
      setStatus('wafdeen-grades-cloud-status', 'تعذر تحميل بيانات الوافدين؛ لا يتم عرض نسخة محلية على أنها بيانات سحابية.');
      console.warn('تعذر تحميل بيانات الوافدين المصرح بها:', error);
      return null;
    }
  };

  window.wafdeenRenderStudentsTable = function () {
    const body = document.querySelector('#wafdeenStudentsTable tbody');
    if (!body) return;
    body.innerHTML = (window.wafdeenStudentsData || []).map((student) =>
      `<tr><td>${escapeHtml(student.name)}</td></tr>`
    ).join('') || '<tr><td>لا توجد أسماء طلاب متاحة.</td></tr>';
  };

  window.addWafdeenStudent = async function () {
    if (!window.currentWafdeenTeacher?.isAdmin) return showNotice('هذه العملية متاحة للمدير المخوّل فقط.');
    const nameField = document.getElementById('wafdeenNewStudentName');
    const name = text(nameField?.value);
    if (!name) return showNotice('اكتب اسم الطالب.');
    try {
      const result = await bridge.addWafdeenStudent(name);
      const record = result?.student;
      if (!record?.studentId || !record?.studentName) throw new Error('استجابة إضافة الطالب غير صالحة.');
      const student = { id: text(record.studentId), name: text(record.studentName) };
      window.wafdeenStudentsData = [...(window.wafdeenStudentsData || []).filter((row) => row.id !== student.id), student];
      if (nameField) nameField.value = '';
      window.wafdeenRenderStudentSelect?.();
      window.wafdeenRenderStudentsTable?.();
      showNotice('تمت إضافة اسم الطالب إلى قائمة الوافدين المعتمدة.', 'success');
    } catch (error) {
      showNotice(window.majdApiErrorMessage_?.(error) || 'تعذرت إضافة اسم الطالب.');
    }
  };

  window.addWafdeenTeacher = async function () {
    if (!window.currentWafdeenTeacher?.isAdmin) return showNotice('هذه العملية متاحة للمدير المخوّل فقط.');
    const username = text(document.getElementById('wafdeenNewTeacherUser')?.value);
    const password = String(document.getElementById('wafdeenNewTeacherPass')?.value || '');
    const assignedClass = text(document.getElementById('wafdeenNewTeacherClass')?.value);
    const center = text(document.getElementById('wafdeenNewTeacherCenter')?.value);
    if (!username || password.length < 12 || !assignedClass || !center) {
      return showNotice('أدخل اسم المستخدم وكلمة مرور من 12 حرفًا على الأقل، واختر الفصل والمركز.');
    }
    try {
      await bridge.createWafdeenTeacher({ username, password, assignedClass, center });
      const [teacherResult] = await Promise.all([bridge.listWafdeenTeachers()]);
      window.wafdeenTeachersData = (Array.isArray(teacherResult?.teachers) ? teacherResult.teachers : []).map((teacher) => ({
        id: text(teacher?.id), username: text(teacher?.username), assignedClass: text(teacher?.assignedClass), center: text(teacher?.center)
      })).filter((teacher) => teacher.id && teacher.username);
      document.getElementById('wafdeenNewTeacherUser').value = '';
      document.getElementById('wafdeenNewTeacherPass').value = '';
      window.wafdeenRenderTeachersTable?.();
      showNotice('تم إنشاء حساب المعلم عبر المسار المعتمد. سيُطلب منه تغيير كلمة المرور عند أول دخول.', 'success');
    } catch (error) {
      showNotice(window.majdApiErrorMessage_?.(error) || 'تعذر إنشاء حساب المعلم.');
    }
  };

  window.wafdeenSaveGradeType = async function (type) {
    if (window.currentWafdeenTeacher?.role === 'student') return showNotice('تسجيل الجلسات متاح للمعلم المخوّل فقط.');
    if (!Object.prototype.hasOwnProperty.call(LABEL_TO_GRADE, type)) type = 'الجديد';
    const studentId = text(document.getElementById('wafdeenStudentSelect')?.value);
    const student = (window.wafdeenStudentsData || []).find((row) => String(row.id) === studentId);
    if (!student) return showNotice('اختر طالبًا من القائمة المعتمدة أولًا.');

    if (window.wafdeenQuranTimerRunning) window.wafdeenQuranTick?.();
    const sessionSeconds = Math.floor(Number(window.wafdeenQuranElapsedSeconds || 0));
    if (sessionSeconds < 1 || sessionSeconds > 7200) return showNotice('ابدأ مؤقت جلسة التسميع واحتسب وقتًا بين ثانية وساعتين.');

    const fields = TYPE_FIELDS[type];
    const pagesId = type === 'الجديد' ? 'wafdeenNewPagesCount' : type === 'الماضي' ? 'wafdeenOldPagesCount' : 'wafdeenRecitationPagesCount';
    const topicId = type === 'الجديد' ? 'wafdeenNewTopicRecited' : type === 'الماضي' ? 'wafdeenOldTopicRecited' : 'wafdeenRecitationTopicRecited';
    const pages = text(document.getElementById(pagesId)?.value);
    const topic = text(document.getElementById(topicId)?.value);
    if (!pages || !topic) return showNotice(`أدخل عدد الصفحات والمقرر الخاصين بنوع ${type}.`);

    const counters = window.wafdeenQuranErrorCounters?.[type] || { errors: 0, tashkeel: 0, repetition: 0 };
    const dateISO = text(window.wafdeenSelectedDailyDateStr?.());
    const input = {
      studentId: student.id,
      studentName: student.name,
      dateISO,
      gradeType: LABEL_TO_GRADE[type],
      pages,
      topic,
      errors: Number(counters.errors) || 0,
      tashkeel: Number(counters.tashkeel) || 0,
      repetition: Number(counters.repetition) || 0,
      sessionSeconds
    };

    try {
      await createWafdeenSession(input);
      const score = Number(window.wafdeenCalculateQuranScore?.(counters) ?? 10);
      const day = new Date(`${dateISO}T00:00:00`).getDay();
      let record = (window.wafdeenDailyRecords || []).find((row) => String(row.studentId) === String(student.id) && String(row.dateISO).slice(0, 10) === dateISO);
      if (!record) {
        record = {
          id: `wafdeen_${student.id}_${dateISO}`,
          studentId: student.id,
          studentName: student.name,
          teacherUsername: window.currentWafdeenTeacher?.username || '',
          dateISO,
          attendanceStatus: 'present',
          isAbsent: false,
          status: 'present',
          dayName: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][day],
          quranSessionTimeSeconds: 0,
          quranSessionTimeByType: { الجديد: 0, الماضي: 0, التلاوة: 0 },
          _dailyTypeSaved: {}
        };
        window.wafdeenDailyRecords = [...(window.wafdeenDailyRecords || []), record];
      }
      record[fields.score] = score;
      record[fields.pages] = pages;
      record[fields.topic] = topic;
      record[`${fields.prefix}Errors`] = input.errors;
      record[`${fields.prefix}Tashkeel`] = input.tashkeel;
      record[`${fields.prefix}Repetition`] = input.repetition;
      record[`${fields.prefix === 'new' ? 'newLesson' : fields.prefix === 'old' ? 'oldRevision' : 'recitation'}TimeSeconds`] = sessionSeconds;
      record.quranSessionTimeSeconds = Math.max(Number(record.quranSessionTimeSeconds) || 0, sessionSeconds);
      record.quranSessionTimeByType = { ...record.quranSessionTimeByType, [type]: sessionSeconds };
      record.sessionType = type;
      record._dailyTypeSaved = { ...(record._dailyTypeSaved || {}), [type]: true };
      record.total = ['newLesson', 'oldRevision', 'recitation'].reduce((sum, key) => sum + (Number(record[key]) || 0), 0);
      record.updatedAt = new Date().toISOString();
      window.wafdeenQuranHeardTypes && (window.wafdeenQuranHeardTypes[type] = true);
      window.wafdeenQuranSessionSavedByType && (window.wafdeenQuranSessionSavedByType[type] = true);
      window.wafdeenQuranElapsedByType && (window.wafdeenQuranElapsedByType[type] = sessionSeconds);
      window.memoryStorage?.setItem('wafdeenDailyRecords', JSON.stringify(window.wafdeenDailyRecords));
      window.wafdeenRenderGrades?.();
      window.wafdeenUpdateDailySaveButton?.();
      showNotice(`تم حفظ جلسة ${type} عبر واجهة الوافدين المعتمدة. لا يمكن تعديلها أو حذفها من هذه الصفحة.`, 'success');

      const resetIds = type === 'الجديد' ? ['wafdeenNewLesson', 'wafdeenNewPagesCount', 'wafdeenNewTopicRecited']
        : type === 'الماضي' ? ['wafdeenOldRevision', 'wafdeenOldPagesCount', 'wafdeenOldTopicRecited']
          : ['wafdeenRecitation', 'wafdeenRecitationPagesCount', 'wafdeenRecitationTopicRecited'];
      resetIds.forEach((id) => { const element = document.getElementById(id); if (element) element.value = ['wafdeenNewLesson', 'wafdeenOldRevision', 'wafdeenRecitation'].includes(id) ? '10' : ''; });
      if (window.wafdeenQuranErrorCounters) window.wafdeenQuranErrorCounters[type] = { errors: 0, tashkeel: 0, repetition: 0 };
      if (window.wafdeenQuranTimerInterval) clearInterval(window.wafdeenQuranTimerInterval);
      window.wafdeenQuranTimerInterval = null;
      window.wafdeenQuranTimerRunning = false;
      window.wafdeenQuranTimerStartedAt = null;
      window.wafdeenQuranElapsedSeconds = 0;
      window.wafdeenQuranSessionSaved = true;
      window.wafdeenUpdateQuranTimer?.();
      const status = document.getElementById('wafdeen-quran-timer-status');
      if (status) status.textContent = 'تم حفظ الجلسة؛ المؤقت متوقف ومُعاد للصفر.';
      window.wafdeenRenderQuranCounters?.();
    } catch (error) {
      const code = String(error?.code || error?.message || '');
      showNotice(/SESSION_ALREADY_EXISTS/.test(code)
        ? 'سبق تسجيل هذا النوع من الجلسات في التاريخ المحدد؛ لا تدعم هذه الصفحة التعديل أو الحذف.'
        : (window.majdApiErrorMessage_?.(error) || 'تعذر حفظ الجلسة؛ لم يُعرض الحفظ على أنه ناجح.'));
    }
  };

  const unavailable = (label) => async () => {
    showNotice(`${label} غير متاحة في هذه الصفحة؛ لا يوجد مسار API معتمد لها.`);
    return false;
  };
  window.saveWafdeenDailyRecord = unavailable('حفظ الرصد المجمع والغياب');
  window.markWafdeenAbsent = unavailable('تسجيل الغياب');
  window.wafdeenGuardedDailySave = unavailable('حفظ الرصد المجمع والغياب');
  window.wafdeenEditGrade = unavailable('تعديل الدرجات');
  window.wafdeenDeleteGrade = unavailable('حذف الدرجات');
  window.deleteWafdeenTeacher = unavailable('حذف حسابات المعلمين');
  window.deleteWafdeenStudent = unavailable('حذف أسماء الطلاب');
  window.wafdeenDeleteDailyReport = unavailable('حذف التقارير');
  window.wafdeenDeleteWeeklyReport = unavailable('حذف التقارير');
  window.wafdeenDeleteMonthlyReport = unavailable('حذف التقارير');
  window.wafdeenDeleteSelectedCloudDuplicates = unavailable('مراجعة السجلات المتكررة أو حذفها');
  window.wafdeenDeleteCloudStudent = unavailable('حذف أسماء الطلاب من البيانات السحابية');
  window.wafdeenDeleteUsageRecords = unavailable('حذف بيانات الاستخدام');
  window.wafdeenSaveExam = unavailable('حفظ الاختبارات');
  window.wafdeenDeleteExam = unavailable('حذف الاختبارات');
  window.saveWafdeenMonthlyReportToGoogleSheets = unavailable('حفظ التقارير الشهرية');
  window.deleteAllResults = unavailable('حذف جميع النتائج');
  window.deleteSupabaseRecord = async function () { throw new Error('WAFDEEN_FEATURE_DISABLED'); };
  window.wafdeenEduStopTimer = unavailable('حفظ وقت المواد التعليمية');

  window.wafdeenShowPanel = function (name) {
    const panelName = String(name);
    const user = window.currentWafdeenTeacher;
    const isAdmin = user?.isAdmin === true;
    const canReadGrades = canReadWafdeenGrades(user);
    document.getElementById('wafdeen-open-grades')?.classList.toggle('hidden', !canReadGrades);
    document.getElementById('wafdeen-open-education-time')?.classList.toggle('hidden', !isAdmin);
    if (panelName === 'grades' && !canReadGrades) {
      showNotice('الدرجات التاريخية متاحة للمدير أو لموظف مخوّل للوافدين فقط.');
      return false;
    }
    if ((panelName === 'report' || panelName === 'educationTime') && !isAdmin) {
      showNotice('التقارير التاريخية متاحة للمدير المخوّل فقط.');
      return false;
    }
    if (['teachers', 'students'].includes(panelName) && !isAdmin) return false;
    const allowedPanels = new Set(['daily', 'materials', 'grades', 'educationTime', 'report', 'teachers', 'students']);
    if (!allowedPanels.has(panelName)) return false;
    for (const panel of allowedPanels) {
      document.getElementById(`wafdeen-panel-${panel}`)?.classList.toggle('hidden', panel !== panelName);
    }
    window.closeWafdeenMenu?.();
    if (panelName === 'grades') loadHistoricalGrades();
    if (panelName === 'report' || panelName === 'educationTime') loadReadOnlyReport(panelName);
    if (panelName === 'teachers') window.wafdeenRenderTeachersTable?.();
    if (panelName === 'students') window.wafdeenRenderStudentsTable?.();
    if (panelName === 'materials') window.wafdeenRenderMaterials?.(window.wafdeenSelectedSubject);
    return true;
  };

  disableUnsupportedControls();
}
