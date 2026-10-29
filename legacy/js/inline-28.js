/* Supabase bridge for Majd site. Publishable key only; privileged credentials stay in the Edge Function. */
(function (w) {
  'use strict';
  var PROJECT_URL = 'https://ixjfhkoozjuoswohqqcr.supabase.co';
  var PUBLISHABLE_KEY = 'sb_publishable_W5nl_C3m-kNip4eDNBpUKw_aGFuNPke';
  var EDGE_URL = PROJECT_URL + '/functions/v1/majd-api';
  var PUBLIC_EDGE_URL = PROJECT_URL + '/functions/v1/majd-public';
  var BOOKS_URL = PROJECT_URL + '/functions/v1/majd-books';
  var sessionToken = (function () { try { return sessionStorage.getItem('majdSessionToken') || ''; } catch (_) { return ''; } })();
  var loadGeneration = 0;
  var saveToastTimer = null;
  var REQUEST_TIMEOUT_MS = 20000;
  var lastConnectionError = null;
  var quota = { reads: 0, writes: 0, deletes: 0, date: new Date().toISOString().slice(0, 10) };
  var accountCollections = { teachers: true };

  async function request(op, fields, token) {
    if (fields && /^wafdeen/i.test(String(fields.collection || ''))) throw new Error('WAFDEEN_APP_ONLY');
    var isMutation = ['upsert', 'delete', 'bulkUpsert', 'importBatch', 'changePassword'].includes(String(op));
    var data = fields && fields.data ? fields.data : {};
    var deletedFlag = data && data._deleted;
    var isDelete = op === 'delete' || (op === 'upsert' && (deletedFlag === true || deletedFlag === 1 || ['true','1','yes'].includes(String(deletedFlag || '').trim().toLowerCase())));
    if (isMutation) beginLoadingOperation(isDelete ? 'جارٍ حذف البيانات...' : 'جارٍ حفظ البيانات...');
    try {
      var headers = { 'Content-Type': 'application/json', 'apikey': PUBLISHABLE_KEY };
      var t = token === undefined ? sessionToken : token;
      if (t) headers.Authorization = 'Bearer ' + t;
      var controller = typeof AbortController === 'function' ? new AbortController() : null;
      var timeout = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
      var response;
      try {
        response = await fetch(EDGE_URL, { method: 'POST', headers: headers, body: JSON.stringify(Object.assign({ op: op }, fields || {})), signal: controller ? controller.signal : undefined });
      } catch (networkError) {
        var networkMessage = networkError && networkError.name === 'AbortError' ? 'انتهت مهلة الاتصال بقاعدة البيانات.' : 'تعذر الاتصال بقاعدة البيانات. تحقق من الإنترنت وحاول مرة أخرى.';
        var connectionError = new Error(networkMessage);
        connectionError.code = networkError && networkError.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
        lastConnectionError = connectionError;
        throw connectionError;
      } finally { if (timeout) clearTimeout(timeout); }
      var payload = {};
      try { payload = await response.json(); } catch (_) {}
      if (!response.ok) {
        var err = new Error(payload.error || ('HTTP_' + response.status));
        err.status = response.status;
        if (response.status === 401 || response.status === 403) err.code = 'AUTH_EXPIRED';
        lastConnectionError = err;
        throw err;
      }
      lastConnectionError = null;
      if (op === 'upsert') {
        var saveAction = payload.saveAction;
        if (Object.prototype.hasOwnProperty.call(payload, 'saveAction')) delete payload.saveAction;
        showSavedToast(isDelete ? 'تم الحذف' : (saveAction === 'updated' ? 'تم التعديل' : 'تم الحفظ'));
      } else if (op === 'bulkUpsert' || op === 'importBatch') showSavedToast('تم الحفظ');
      else if (op === 'delete') showSavedToast('تم الحذف');
      return payload;
    } finally {
      if (isMutation) endLoadingOperation();
    }
  }
  async function publicRequest(op, fields) {
    var response;
    try {
      response = await fetch(PUBLIC_EDGE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': PUBLISHABLE_KEY }, body: JSON.stringify(Object.assign({ op: op }, fields || {})) });
    } catch (_) { throw new Error('تعذر الاتصال بخدمة النتائج العامة. تحقق من الإنترنت وحاول مرة أخرى.'); }
    var payload = {}; try { payload = await response.json(); } catch (_) {}
    if (!response.ok) { var e = new Error(payload.error || ('HTTP_' + response.status)); e.status = response.status; throw e; }
    return payload;
  }
  async function booksRequest(op, fields) {
    var isMutation = op === 'finalizeUpload' || op === 'delete';
    if (isMutation) beginLoadingOperation(op === 'delete' ? 'جارٍ حذف الكتاب...' : 'جارٍ حفظ الكتاب...');
    try {
      var response = await fetch(BOOKS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': PUBLISHABLE_KEY, 'Authorization': 'Bearer ' + sessionToken }, body: JSON.stringify(Object.assign({ op: op }, fields || {})) });
      var payload = {}; try { payload = await response.json(); } catch (_) {}
      if (!response.ok) { var e = new Error(payload.error || ('HTTP_' + response.status)); e.status = response.status; throw e; }
      if (op === 'finalizeUpload') showSavedToast('تم الحفظ');
      else if (op === 'delete') showSavedToast('تم الحذف');
      return payload;
    } finally {
      if (isMutation) endLoadingOperation();
    }
  }
  function showSavedToast(message) {
    if (!document || !document.body) return;
    var overlay = document.getElementById('majd-save-toast-overlay');
    var card = document.getElementById('majd-save-toast');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'majd-save-toast-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(16,28,25,.22);opacity:0;transition:opacity .22s ease;pointer-events:none;';
      card = document.createElement('div');
      card.id = 'majd-save-toast';
      card.style.cssText = 'min-width:230px;max-width:calc(100vw - 40px);padding:24px 32px;border-radius:18px;background:#fff;color:#075c4c;box-shadow:0 16px 48px rgba(0,0,0,.25);text-align:center;font-size:20px;font-weight:800;';
      var icon = document.createElement('div');
      icon.textContent = '✓';
      icon.style.cssText = 'display:flex;align-items:center;justify-content:center;width:46px;height:46px;margin:0 auto 12px;border-radius:50%;background:#087358;color:#fff;font-size:28px;line-height:1;';
      var label = document.createElement('div');
      label.id = 'majd-save-toast-text';
      card.appendChild(icon);
      card.appendChild(label);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    }
    var label = document.getElementById('majd-save-toast-text');
    if (label) label.textContent = message || 'تم الحفظ';
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    if (saveToastTimer) clearTimeout(saveToastTimer);
    saveToastTimer = setTimeout(function () {
      overlay.style.opacity = '0';
      setTimeout(function () { if (overlay && overlay.parentNode) overlay.style.display = 'none'; }, 260);
    }, 1800);
  }
  var loadingCardOverlay = null;
  var loadingCardPinned = false;
  var loadingOperationCount = 0;
  function renderLoadingCard(message) {
    if (!document || !document.body) return;
    if (!document.getElementById('majd-loading-card-style')) {
      var style = document.createElement('style');
      style.id = 'majd-loading-card-style';
      style.textContent = '@keyframes majdLoadingSpin{to{transform:rotate(360deg)}}';
      document.head.appendChild(style);
    }
    if (!loadingCardOverlay) {
      var overlay = document.createElement('div');
      overlay.id = 'majd-loading-card-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(16,28,25,.28);backdrop-filter:blur(3px);';
      var card = document.createElement('div');
      card.style.cssText = 'min-width:250px;max-width:calc(100vw - 40px);padding:26px 32px;border-radius:18px;background:#fff;color:#075c4c;box-shadow:0 16px 48px rgba(0,0,0,.25);text-align:center;font-size:19px;font-weight:800;border:1px solid rgba(27,138,107,.15);';
      var spinner = document.createElement('div');
      spinner.style.cssText = 'width:42px;height:42px;margin:0 auto 14px;border:4px solid #d9eee7;border-top-color:#087358;border-radius:50%;animation:majdLoadingSpin .8s linear infinite;';
      var label = document.createElement('div');
      label.id = 'majd-loading-card-text';
      card.appendChild(spinner);
      card.appendChild(label);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      loadingCardOverlay = overlay;
    }
    var label = document.getElementById('majd-loading-card-text');
    if (label) label.textContent = message || 'جارٍ التحميل...';
    loadingCardOverlay.style.display = 'flex';
  }
  function removeLoadingCard() {
    if (loadingCardOverlay) {
      loadingCardOverlay.style.display = 'none';
      if (loadingCardOverlay.parentNode) loadingCardOverlay.parentNode.removeChild(loadingCardOverlay);
      loadingCardOverlay = null;
    }
  }
  function showLoadingCard(message) {
    loadingCardPinned = true;
    renderLoadingCard(message);
  }
  function hideLoadingCard() {
    loadingCardPinned = false;
    if (loadingOperationCount > 0) {
      if (loadingCardOverlay) loadingCardOverlay.style.display = 'flex';
      return;
    }
    removeLoadingCard();
  }
  function beginLoadingOperation(message) {
    loadingOperationCount++;
    renderLoadingCard(message);
  }
  function endLoadingOperation() {
    if (loadingOperationCount > 0) loadingOperationCount--;
    if (loadingOperationCount === 0 && !loadingCardPinned) removeLoadingCard();
  }
  window.showLoadingCard = showLoadingCard;
  window.hideLoadingCard = hideLoadingCard;
  function localMatches(record, filters) {
    return (filters || []).every(function (f) {
      var value = String(f.field || '').split('.').reduce(function (v, k) { return v == null ? undefined : v[k]; }, record);
      if (f.op === '==') return String(value == null ? '' : value) === String(f.value == null ? '' : f.value);
      if (f.op === '!=') return String(value == null ? '' : value) !== String(f.value == null ? '' : f.value);
      if (f.op === 'in') return Array.isArray(f.value) && f.value.map(String).includes(String(value));
      if (f.op === 'array-contains') return Array.isArray(value) && value.map(String).includes(String(f.value));
      return true;
    });
  }
  function docSnapshot(row, ref) {
    var value = row ? Object.assign({}, row) : null;
    return { id: value && String(value.id), exists: !!value, data: function () { return value ? Object.assign({}, value) : null; }, ref: ref || null };
  }
  function collection(name) {
    var filters = [], max = 10000;
    var api = {
      where: function (field, op, value) { filters.push({ field: String(field), op: String(op), value: value }); return api; },
      limit: function (n) { max = Math.max(1, Math.min(Number(n) || 1, 10000)); return api; },
      orderBy: function () { return api; },
      doc: function (id) {
        id = String(id);
        var ref = {
          id: id,
          set: async function (data, options) {
            quota.writes++;
            var r = await request('upsert', { collection: name, id: id, data: data || {}, merge: !!(options && options.merge) });
            return r.record || r;
          },
          update: async function (data) {
            quota.writes++;
            var r = await request('upsert', { collection: name, id: id, data: data || {}, merge: true });
            return r.record || r;
          },
          get: async function () { quota.reads++; var r = await request('get', { collection: name, id: id }); return docSnapshot(r.record, ref); },
          delete: async function () { quota.deletes++; return request('delete', { collection: name, id: id }); }
        };
        return ref;
      },
      get: async function () {
        quota.reads++;
        var r = await request('list', { collection: name, filters: filters, limit: max });
        var rows = (r.records || []).filter(function (x) { return localMatches(x, filters); });
        return { empty: rows.length === 0, docs: rows.map(function (x) { var row = Object.assign({}, x); var ref = api.doc(String(row.id)); return { id: String(row.id), ref: ref, data: function () { return Object.assign({}, row); } }; }) };
      }
    };
    return api;
  }
  async function readAll(name) {
    var r = await request('list', { collection: name, limit: 10000 });
    return Array.isArray(r.records) ? r.records : [];
  }
  async function hydrateMain() {
    var names = ['students', 'dailyRecords', 'shariaGrades', 'notes', 'results', 'payments'];
    if (w.currentTeacher && (w.currentTeacher.role === 'admin' || w.currentTeacher.isAdmin || w.currentTeacher.username === 'admin')) names.push('teachers');
    var pairs = await Promise.all(names.map(async function (name) { return [name, await readAll(name)]; }));
    var map = Object.fromEntries(pairs);
    w.studentsData = (map.students || []).map(function (student) { return typeof w.applyDataMapping === 'function' ? w.applyDataMapping(student) : student; });
    w.dailyRecords = map.dailyRecords || [];
    w.shariaGradesData = map.shariaGrades || [];
    w.notesData = map.notes || [];
    w.resultsData = map.results || [];
    w.teachersData = map.teachers || (w.currentTeacher ? [Object.assign({}, w.currentTeacher)] : []);
    try { memoryStorage.setItem('studentsData', JSON.stringify(w.studentsData)); memoryStorage.setItem('dailyRecords', JSON.stringify(w.dailyRecords)); memoryStorage.setItem('shariaGradesData', JSON.stringify(w.shariaGradesData)); memoryStorage.setItem('notesData', JSON.stringify(w.notesData)); memoryStorage.setItem('resultsData', JSON.stringify(w.resultsData)); memoryStorage.setItem('teachersData', JSON.stringify(w.teachersData)); } catch (_) {}
  }
  function setLoadStatus(rootId, text, isError) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var id = 'majd-load-status-' + rootId;
    var box = document.getElementById(id);
    if (!text) { if (box && box.parentNode) box.parentNode.removeChild(box); return; }
    if (!box) {
      box = document.createElement('div'); box.id = id; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite');
      root.insertBefore(box, root.firstChild);
    }
    box.textContent = text;
    box.style.cssText = 'padding:10px 14px;margin:8px 12px;border-radius:10px;text-align:center;font-weight:700;position:relative;z-index:10;background:' + (isError ? '#fff1f0' : '#e9f7f2') + ';color:' + (isError ? '#a61b1b' : '#075c4c') + ';border:1px solid ' + (isError ? '#f3b8b3' : '#a9d9cc') + ';';
    if (isError) setTimeout(function () { if (box && box.parentNode) box.parentNode.removeChild(box); }, 12000);
  }
  function safelyRefresh(name) {
    try { if (typeof w[name] === 'function') w[name](); }
    catch (e) { console.warn('تعذر تحديث جزء من الواجهة بعد التحميل:', name, e); }
  }
  function refreshMainViews() {
    var user = w.currentTeacher;
    if (!user) return;
    var isManager = user.username === 'admin' || user.assignedClass === 'الكل';
    if (isManager) {
      try {
        if (typeof w.ensureStudentLoginCodes === 'function') {
          w.studentsData = w.ensureStudentLoginCodes(w.studentsData || []);
          memoryStorage.setItem('studentsData', JSON.stringify(w.studentsData));
        }
      } catch (e) { console.warn('تعذر تحديث أكواد الطلاب:', e); }
      ['renderTeachersTable', 'renderStudentsTable', 'renderClassCards', 'populateAnalysisStudents', 'populateAnalysisWeeks'].forEach(safelyRefresh);
    }
    ['ensureAllClassSelects_', 'populatePaymentsClasses', 'updatePaymentsStudentList', 'populatePaymentReportClasses', 'updatePaymentReportStudentList', 'populateNotesClasses', 'updateNotesStudentList', 'updateStudentListDropdown', 'populateWeeks', 'renderDailyTable', 'renderAttendanceTable', 'renderWeeklyTable', 'renderMonthlyReport', 'renderManagerView', 'renderClassStatusTable', 'renderNotesTable', 'renderPaymentReportTable', 'renderPaymentsTable', 'renderTopStudents', 'refreshDailyRecordsVerificationVisibility_'].forEach(safelyRefresh);
  }
  async function changeInitialPassword(currentPassword) {
    var first = w.prompt('هذه أول مرة تسجل فيها. أنشئ كلمة مرور جديدة (12 حرفًا على الأقل):');
    if (first === null) throw new Error('يلزم تغيير كلمة المرور الأولى قبل الدخول.');
    var second = w.prompt('أعد كتابة كلمة المرور الجديدة للتأكيد:');
    if (second === null || first !== second) throw new Error('كلمتا المرور غير متطابقتين. أعد تسجيل الدخول.');
    await request('changePassword', { currentPassword: currentPassword, newPassword: first });
  }
  async function doLogin(username, password, mode) {
    var result = await request('login', { username: username, password: password, mode: mode || 'staff' }, '');
    sessionToken = result.token;
    try { sessionStorage.setItem('majdSessionToken', sessionToken); } catch (_) {}
    if (result.mustChangePassword) await changeInitialPassword(password);
    return typeof w.applyDataMapping === 'function' ? w.applyDataMapping(result.user) : result.user;
  }

  w.__MAJD_SUPABASE__ = {
    projectUrl: PROJECT_URL,
    endpoint: EDGE_URL,
    request: request,
    getSession: function () { return !!sessionToken; },
    getLastError: function () { return lastConnectionError; },
    healthCheck: async function () { return request('health', {}, sessionToken); }
  };
  w.defaultTeachers = [];
  w.__MAJD_LOCAL_DISABLED__ = false;
  w.uselocaldata = true;
  w.localIsAvailable = function () { return true; };
  w.localDatabase = function () { return { collection: collection }; };
  w.MajdDailyLocalAdapter = {
    isAvailable: function () { return !!sessionToken; },
    save: async function (record) { var r = await request('upsert', { collection: 'dailyRecords', id: String(record.id || record.recordId), data: record, merge: true }); return r.record || record; },
    delete: async function (id) { await request('delete', { collection: 'dailyRecords', id: String(id) }); return true; }
  };
  w.MajdLocalDataAPI = {
    isAvailable: function () { return !!sessionToken; }, database: function () { return w.localDatabase(); }, collection: collection,
    writeRecord: async function (c, id, data, options) { quota.writes++; var r = await request('upsert', { collection: c, id: String(id), data: data || {}, merge: !!(options && options.merge) }); return r.record || r; },
    deleteRecord: async function (c, id) { quota.deletes++; return request('delete', { collection: c, id: String(id) }); },
    readRecord: async function (c, id) { quota.reads++; var r = await request('get', { collection: c, id: String(id) }); return r.record || null; },
    listWafdeenSessionData: async function (options) { if (!options || options.purpose !== 'report') throw new Error('REPORT_ONLY_IN_MAIN_SITE'); quota.reads++; var fields = { purpose: 'report', month: String(options.month || '') }; var r = await request('listWafdeenSessionData', fields); if (!Array.isArray(r.students) || !Array.isArray(r.dailySessions) || !Array.isArray(r.usage)) throw new Error('INVALID_WAFDEEN_SESSION_RESPONSE'); return r; },
    updateVerified: async function (c, id, patch) { var old = await w.MajdLocalDataAPI.readRecord(c, id) || {}; return w.MajdLocalDataAPI.writeRecord(c, id, Object.assign({}, old, patch || {}, { id: String(id) }), { merge: true }); },
    saveAndVerifySharia: async function (id, record) { return w.MajdLocalDataAPI.writeRecord('shariaGrades', id, record, { merge: true }); },
    migrateLegacyDailyRecords: async function () { return false; },
    getPayments: async function () { return readAll('payments'); },
    savePayment: async function (record) { return w.MajdLocalDataAPI.writeRecord('payments', record.id, record, { merge: true }); },
    deletePayment: async function (id) { await w.MajdLocalDataAPI.deleteRecord('payments', id); return { deleted: true }; },
    savePaymentAction: async function (action, id, record) { if (String(action).toLowerCase().includes('delete')) return w.MajdLocalDataAPI.deletePayment(id); return w.MajdLocalDataAPI.writeRecord('payments', id, record, { merge: true }); },
    dailyQuotaRead: function () { return Object.assign({}, quota); },
    findStudentByLoginCode: async function (code) { var r = await publicRequest('findStudentByLoginCode', { code: String(code || '') }); if (!r.student) return null; w.studentsData = [r.student]; w.dailyRecords = r.dailyRecords || []; return r.student; }, findResultByCode: async function (code) { var r = await publicRequest('findResultByCode', { code: String(code || '') }); return r.result || null; },
    flushLocalRenderQueue: async function () { return true; },
    loadBooks: async function () { var r = await booksRequest('list'); return r.books || []; }, uploadBook: async function (file, title, level, subject, onProgress) {
      if (!file || file.size > 25 * 1024 * 1024 || !/\.pdf$/i.test(file.name || '')) throw new Error('اختر ملف PDF حجمه 25 ميجابايت أو أقل.');
      if (!sessionToken) throw new Error('UNAUTHORIZED');
      beginLoadingOperation('جارٍ رفع الكتاب...');
      try {
        var meta = { title: title, level: Number(level), subject: subject, fileName: file.name };
        var p = await booksRequest('prepareUpload', meta);
        if (onProgress) onProgress(20);
        var up = await fetch(p.uploadUrl, { method: 'PUT', headers: { 'apikey': PUBLISHABLE_KEY, 'Content-Type': 'application/pdf', 'x-upsert': 'false' }, body: file });
        if (!up.ok) throw new Error('STORAGE_UPLOAD_FAILED_' + up.status);
        if (onProgress) onProgress(80);
        var done = await booksRequest('finalizeUpload', { id: p.id, storagePath: p.storagePath, title: meta.title, level: meta.level, subject: meta.subject, fileName: meta.fileName });
        if (onProgress) onProgress(100);
        return done.book;
      } finally { endLoadingOperation(); }
    }, deleteBookFromDrive: async function (id) { await booksRequest('delete', { id: String(id) }); return true; },
  };
  w.localdataWriteRecord_ = async function (c, id, data, options) { return w.MajdLocalDataAPI.writeRecord(c, id, data, options); };
  w.deletelocaldataRecord = async function (c, id) { return w.MajdLocalDataAPI.deleteRecord(c, id); };

  w.handleLogin = async function () {
    var username = (document.getElementById('username') || {}).value || '';
    var password = (document.getElementById('password') || {}).value || '';
    var btn = document.querySelector('#login-screen button[onclick*="handleLogin"]');
    if (!username.trim() || !password) return w.showMessage('login-msg', 'يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
    if (btn) { btn.disabled = true; btn.dataset.oldText = btn.innerText; btn.innerText = '⏳ جاري التحقق...'; }
    showLoadingCard('جارٍ التحقق من بيانات الدخول...');
    try {
      w.currentTeacher = await doLogin(username.trim(), password, 'staff');
      memoryStorage.setItem('currentTeacher', JSON.stringify(w.currentTeacher));
      var ticket = ++loadGeneration;
      w.showAppScreen();
      showLoadingCard('تم الدخول؛ جارٍ تحميل بيانات الطلاب...');
      setLoadStatus('app-screen', 'تم تسجيل الدخول؛ جارٍ تحميل البيانات في الخلفية.', false);
      hideLoadingCard();
      hydrateMain().then(function () {
        if (ticket !== loadGeneration || !w.currentTeacher) return;
        refreshMainViews();
        setLoadStatus('app-screen', '', false);
        hideLoadingCard();
      }).catch(function (e) {
        if (ticket !== loadGeneration || !w.currentTeacher) return;
        console.error('تحميل بيانات الموقع بعد الدخول:', e);
        hideLoadingCard();
        setLoadStatus('app-screen', 'تم الدخول، لكن تعذر تحميل البيانات الآن. تحقق من الاتصال ثم أعد المحاولة.', true);
      });
    } catch (e) {
      hideLoadingCard();
      sessionToken = '';
      w.showMessage('login-msg', e.status === 401 ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : (e.message || 'تعذر الاتصال بالخادم. حاول مرة أخرى.'), 'error');
    } finally { if (btn) { btn.disabled = false; btn.innerText = btn.dataset.oldText || 'تسجيل الدخول'; } }
  };
  w.handleLogout = async function () {
    var ok = await w.siteConfirm('تأكيد تسجيل الخروج', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟', 'تسجيل الخروج', true);
    if (!ok) return;
    loadGeneration++;
      sessionToken = ''; try { sessionStorage.removeItem('majdSessionToken'); } catch (_) {} w.currentTeacher = null;
    memoryStorage.removeItem('currentTeacher');
    w.showLoginScreen();
  };
  w.MajdLocalDataAPI.flushLocalRenderQueue = function () { return Promise.resolve(true); };
  w.MajdLocalDataAPI.isConnected = function () { return !!sessionToken; };
})(window);
