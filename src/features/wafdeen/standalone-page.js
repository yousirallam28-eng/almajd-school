import { createWafdeenSession, loadWafdeenSessionData } from '../../api/wafdeen-sessions.api.js';

const LABEL_TO_GRADE = Object.freeze({ الجديد: 'new', الماضي: 'old', التلاوة: 'recitation' });
const TYPE_FIELDS = Object.freeze({
  الجديد: { score: 'newLesson', pages: 'newPagesCount', topic: 'newTopicRecited', prefix: 'new' },
  الماضي: { score: 'oldRevision', pages: 'oldPagesCount', topic: 'oldTopicRecited', prefix: 'old' },
  التلاوة: { score: 'recitation', pages: 'recitationPagesCount', topic: 'recitationTopicRecited', prefix: 'recitation' }
});

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
  const disabledHandler = /wafdeenShowPanel\(['"](?:grades|educationTime|report|cloudReview)['"]\)|wafdeen(?:GuardedDailySave|DeleteGrade|DeleteDailyReport|DeleteWeeklyReport|DeleteMonthlyReport|DeleteSelectedCloudDuplicates|DeleteCloudStudent|DeleteUsageRecords|SaveExam|DeleteExam|EduStopTimer)|deleteWafdeen(?:Teacher|Student)|saveWafdeenMonthlyReportToGoogleSheets|markWafdeenAbsent|saveWafdeenDailyRecord/i;
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

function callRequest(body) {
  if (!window.MajdLocalDataAPI?.isAvailable?.()) throw new Error('يجب تسجيل الدخول أولاً.');
  return window.majdAuthenticatedRequest_(body);
}

export function wireWafdeenStandalonePage(bridge = window.MajdLocalDataAPI) {
  if (!bridge) throw new Error('واجهة Wafdeen المعتمدة غير متاحة.');

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
      window.wafdeenRenderGrades?.();
      setStatus('wafdeen-accounts-cloud-status', 'تم تحميل أسماء الطلاب ومعرّفات القائمة المصرح بها فقط؛ لم تُحمّل كلمات مرور أو حسابات طلاب.');
      setStatus('wafdeen-grades-cloud-status', 'الواجهة الحالية لا تعرض درجات الطلاب التاريخية؛ الحفظ المتاح يقتصر على جلسة جديدة من نوع واحد.');
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
      setStatus('wafdeen-grades-cloud-status', 'لم تُحمّل درجات؛ واجهة API لا تعيد الدرجات التاريخية لهذه الصفحة.');
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

  const originalShowPanel = window.wafdeenShowPanel;
  window.wafdeenShowPanel = function (name) {
    if (['grades', 'educationTime', 'report', 'cloudReview'].includes(String(name))) {
      showNotice('هذا القسم غير متاح هنا لأن واجهة API الحالية لا تسمح بقراءة هذه البيانات.');
      return false;
    }
    return originalShowPanel?.apply(this, arguments);
  };

  disableUnsupportedControls();
}
