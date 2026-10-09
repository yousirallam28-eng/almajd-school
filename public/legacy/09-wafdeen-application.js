var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/* ================= منطق جلسة الوافدين ================= */
var wafdeenTeachersData = [];
var wafdeenStudentsData = [];
var wafdeenUsageData = [];
var wafdeenDailyRecords = [];
var wafdeenBooksData = [];
var wafdeenExamsData = [];
var wafdeenMonthlyImportedReports = {};
var currentWafdeenTeacher = (function(){
    try { return JSON.parse(persistentAuthStorage.getItem('currentWafdeenTeacher') || 'null'); }
    catch (_) { return null; }
})();
var wafdeenSelectedType = '';
var wafdeenSelectedSubject = '';
var wafdeenElapsedSeconds = 0;
var wafdeenTimerStartedAt = null;
var wafdeenTimerInterval = null;
var wafdeenTimerRunning = false;
var wafdeenQuranSelectedType = '';
var wafdeenQuranElapsedSeconds = 0;
var wafdeenQuranTimerStartedAt = null;
var wafdeenQuranTimerInterval = null;
var wafdeenQuranTimerRunning = false;
var wafdeenQuranElapsedByType = { الجديد: 0, الماضي: 0, التلاوة: 0 };
var wafdeenQuranSessionSavedByType = { الجديد: false, الماضي: false, التلاوة: false };
var WAFDEEN_QURAN_SESSION_MAX_SECONDS = 2 * 60 * 60;
var wafdeenQuranSessionSaved = false;
var wafdeenQuranHeardTypes = { الجديد: false, الماضي: false, التلاوة: false };
var wafdeenQuranErrorCounters = {
    الجديد: { errors: 0, tashkeel: 0, repetition: 0 },
    الماضي: { errors: 0, tashkeel: 0, repetition: 0 },
    التلاوة: { errors: 0, tashkeel: 0, repetition: 0 }
};
var wafdeenEduSelectedSubject = '';
var wafdeenEduSelectedType = 'المواد التعليمية';
var wafdeenEduElapsedSeconds = 0;
var wafdeenEduTimerStartedAt = null;
var wafdeenEduTimerInterval = null;
var wafdeenEduTimerRunning = false;
var WAFDEEN_SUBJECTS = {
    fiqh: { name: 'فقه', icon: '⚖️' },
    hadith: { name: 'حديث', icon: '📜' },
    mantiq: { name: 'منطق', icon: '🧠' },
    arabic: { name: 'اللغة العربية', icon: '🔤' }
};
function getWafdeenAdminPassword() {
    var admin = teachersData.find(function (t) { return t.username === 'admin'; });
    return admin ? String(admin.password || '') : 'admin123';
}
function wafdeenLocalLoad() {
    // Cloud-only: لا نقرأ أي بيانات محفوظة على الجهاز.
    wafdeenTeachersData = []; wafdeenStudentsData = []; wafdeenUsageData = [];
    wafdeenDailyRecords = []; wafdeenBooksData = []; wafdeenExamsData = [];
    wafdeenMonthlyImportedReports = {};
}

var wafdeenLocalPersistTimer_ = null;
var wafdeenLocalPersistPending_ = false;
function wafdeenPersistLocalNow_() {
    try { memoryStorage.setItem('wafdeenTeachersData', JSON.stringify(wafdeenTeachersData)); } catch (_) {}
    try { memoryStorage.setItem('wafdeenStudentsData', JSON.stringify(wafdeenStudentsData)); } catch (_) {}
    try { memoryStorage.setItem('wafdeenUsageData', JSON.stringify(wafdeenUsageData)); } catch (_) {}
    try { memoryStorage.setItem('wafdeenDailyRecords', JSON.stringify(wafdeenDailyRecords)); } catch (_) {}
    try { memoryStorage.setItem('wafdeenBooksData', JSON.stringify(wafdeenBooksData)); } catch (_) {}
    try { memoryStorage.setItem('wafdeenExamsData', JSON.stringify(wafdeenExamsData)); } catch (_) {}
    try { memoryStorage.setItem('wafdeenMonthlyImportedReports', JSON.stringify(wafdeenMonthlyImportedReports)); } catch (_) {}
    wafdeenLocalPersistPending_ = false;
}
function wafdeenPersistLocal() {
    wafdeenLocalPersistPending_ = true;
    if (isRecitationPerformanceMode_()) return;
    if (wafdeenLocalPersistTimer_) clearTimeout(wafdeenLocalPersistTimer_);
    wafdeenLocalPersistTimer_ = setTimeout(function () {
        wafdeenLocalPersistTimer_ = null;
        if (!isRecitationPerformanceMode_() && wafdeenLocalPersistPending_) wafdeenPersistLocalNow_();
    }, 300);
}
function wafdeenFlushLocalPersist_() {
    if (isRecitationPerformanceMode_()) return;
    if (wafdeenLocalPersistTimer_) { clearTimeout(wafdeenLocalPersistTimer_); wafdeenLocalPersistTimer_ = null; }
    if (wafdeenLocalPersistPending_) wafdeenPersistLocalNow_();
}
/* الشهر عند الوافدين يبدأ يوم 15 من كل شهر وينتهي يوم 15 من الشهر التالي.
   المفتاح "YYYY-MM" يمثل الشهر الذي يبدأ فيه النطاق (مثال: 2026-09 يعني من 15 سبتمبر إلى 15 أكتوبر). */
function wafdeenPeriodKeyForDate(d) {
    var y = d.getFullYear(), m = d.getMonth();
    if (d.getDate() < 15) {
        m -= 1;
        if (m < 0) {
            m = 11;
            y -= 1;
        }
    }
    return "".concat(y, "-").concat(String(m + 1).padStart(2, '0'));
}
function wafdeenSelectedDailyDateStr() {
    var el = document.getElementById('wafdeenDailyDate');
    var v = String((el === null || el === void 0 ? void 0 : el.value) || '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : wafdeenTodayDateStr();
}
function wafdeenSelectedDailyDateObj() {
    var v = wafdeenSelectedDailyDateStr();
    var d = new Date(v + 'T00:00:00');
    return Number.isNaN(d.getTime()) ? new Date() : d;
}
function changeWafdeenDailyDate(delta) {
    var input = document.getElementById('wafdeenDailyDate');
    if (!input)
        return;
    if (delta === 0) {
        if (!input.value)
            input.value = wafdeenTodayDateStr();
    }
    else {
        var d = wafdeenSelectedDailyDateObj();
        d.setDate(d.getDate() + Number(delta));
        input.value = wafdeenDateKeyLocal(d);
    }
    wafdeenLoadSelectedStudentGradeData();
    wafdeenUpdateDailyScoresVisibility();
    var note = document.getElementById('wafdeen-daily-date-note');
    if (note)
        note.textContent = "\u0627\u0644\u0631\u0635\u062F \u0627\u0644\u0645\u062D\u062F\u062F: ".concat(input.value, " \u2014 \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u062A\u0627\u0631\u064A\u062E.");
}
function goWafdeenDailyToday() {
    var input = document.getElementById('wafdeenDailyDate');
    if (!input)
        return;
    input.value = wafdeenTodayDateStr();
    changeWafdeenDailyDate(0);
}
function wafdeenTodayMonth() { return wafdeenPeriodKeyForDate(new Date()); }
function wafdeenTodayDateStr() { var d = new Date(); return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0')); }
function wafdeenFormatDate(d) { return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0')); }
function wafdeenSameLocalDay(iso, dayStr) { if (!iso)
    return false; var d = new Date(iso); return wafdeenFormatDate(d) === dayStr; }
/* الأسبوع من السبت إلى الجمعة */
function wafdeenWeekRange(dayStr) {
    var parts = (dayStr || wafdeenTodayDateStr()).split('-').map(Number);
    var ref = new Date(parts[0], parts[1] - 1, parts[2]);
    var dow = ref.getDay(); // 0=أحد ... 6=سبت
    var diffFromSat = (dow - 6 + 7) % 7;
    var start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - diffFromSat);
    var end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6, 23, 59, 59, 999);
    return { start: start, end: end };
}
function wafdeenInWeek(iso, dayStr) {
    if (!iso)
        return false;
    var _a = wafdeenWeekRange(dayStr), start = _a.start, end = _a.end;
    var d = new Date(iso);
    return d >= start && d <= end;
}
/* نطاق أيام الشهر (15 إلى 15 الشهر التالي) من مفتاح الشهر */
function wafdeenPeriodRangeFromKey(key) {
    var parts = (key || wafdeenTodayMonth()).split('-').map(Number);
    var y = parts[0], m = parts[1]; // m رقم الشهر من 1 إلى 12
    var start = new Date(y, m - 1, 15);
    var end = new Date(y, m, 15);
    return { start: start, end: end };
}
/* زر جلسة الوافدين: معالجة موحّدة للضغط على الموبايل والكمبيوتر، مع منع التكرار */
(function setupWafdeenLoginButton() {
    var lastOpenAt = 0;
    window.__openWafdeenLogin = function (ev) {
        if (ev) {
            try {
                ev.preventDefault();
            }
            catch (_) { }
            try {
                ev.stopPropagation();
            }
            catch (_) { }
            try {
                ev.stopImmediatePropagation();
            }
            catch (_) { }
        }
        var now = Date.now();
        if (now - lastOpenAt < 500)
            return false;
        lastOpenAt = now;
        if (typeof window.showWafdeenLoginScreen === 'function') {
            window.showWafdeenLoginScreen();
            return false;
        }
        return false;
    };
    var bind = function () {
        var btn = document.getElementById('open-wafdeen-login-btn');
        if (!btn || btn.dataset.wafdeenBound === '1')
            return;
        btn.dataset.wafdeenBound = '1';
        btn.addEventListener('click', window.__openWafdeenLogin, true);
        if ('PointerEvent' in window) {
            btn.addEventListener('pointerup', function (e) {
                if (e.pointerType === 'touch' || e.pointerType === 'pen')
                    window.__openWafdeenLogin(e);
            }, true);
        }
    };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', bind, { once: true });
    else
        bind();
    setTimeout(bind, 250);
    setTimeout(bind, 1000);
})();
function showWafdeenLoginScreen() {
    closeMainMenu();
    document.body.classList.remove('wafdeen-mode');
    document.body.classList.add('login-screen-active');
    // تحميل النسخة المحلية أولاً حتى تفتح شاشة الدخول فوراً، ثم مزامنة السحابة في الخلفية.
    wafdeenLocalLoad();
    if (useFirebase)
        setTimeout(function () { return wafdeenLoadCloud(); }, 0);
    ['login-screen', 'results-screen', 'student-login-screen', 'app-screen'].forEach(function (id) { var _a; return (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.add('hidden'); });
    document.getElementById('wafdeen-app-screen').classList.add('hidden');
    document.getElementById('wafdeen-login-screen').classList.remove('hidden');
    document.getElementById('wafdeenUsername').value = '';
    document.getElementById('wafdeenPassword').value = '';
}
function wafdeenLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var u, p, account, teacher, student, _1, teacher, student;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    u = document.getElementById('wafdeenUsername').value.trim(), p = document.getElementById('wafdeenPassword').value.trim();
                    if (!u || !p)
                        return [2 /*return*/, showMessage('wafdeen-login-msg', 'يرجى إدخال اسم المستخدم أو اسم الطالب وكلمة المرور', 'error')];
                    account = null;
                    if (u === 'admin' && p === getWafdeenAdminPassword())
                        account = { username: 'admin', isAdmin: true, role: 'admin' };
                    else {
                        teacher = wafdeenTeachersData.find(function (t) { return !t._deleted && String(t.username || '').trim() === u && String(t.password || '') === p; });
                        student = wafdeenStudentsData.find(function (st) { return !st._deleted && (String(st.name || '').trim() === u || String(st.username || '').trim() === u) && String(st.password || '') === p; });
                        account = teacher ? __assign(__assign({}, teacher), { isAdmin: false, role: 'teacher' }) : (student ? __assign(__assign({}, student), { isAdmin: false, role: 'student' }) : null);
                    }
                    if (!(!account && useFirebase && db)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    wafdeenLoadCloud();
                    return [4 /*yield*/, Promise.race([wafdeenCloudReadyPromise, new Promise(function (r) { return setTimeout(r, 1800); })])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    teacher = wafdeenTeachersData.find(function (t) { return !t._deleted && String(t.username || '').trim() === u && String(t.password || '') === p; });
                    student = wafdeenStudentsData.find(function (st) { return !st._deleted && (String(st.name || '').trim() === u || String(st.username || '').trim() === u) && String(st.password || '') === p; });
                    account = teacher ? __assign(__assign({}, teacher), { isAdmin: false, role: 'teacher' }) : (student ? __assign(__assign({}, student), { isAdmin: false, role: 'student' }) : null);
                    _a.label = 5;
                case 5:
                    if (!account)
                        return [2 /*return*/, showMessage('wafdeen-login-msg', 'اسم المستخدم أو اسم الطالب أو كلمة المرور غير صحيحة', 'error')];
                    currentWafdeenTeacher = account;
                    persistentAuthStorage.setItem('currentWafdeenTeacher', JSON.stringify(account));
                    showWafdeenAppScreen();
                    wafdeenLoadCloud();
                    return [2 /*return*/];
            }
        });
    });
}
function showWafdeenAppScreen() {
    document.body.classList.remove('login-screen-active');
    document.body.classList.add('wafdeen-mode');
    ['login-screen', 'results-screen', 'student-login-screen', 'wafdeen-login-screen', 'app-screen'].forEach(function (id) { var _a; return (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.add('hidden'); });
    document.getElementById('wafdeen-app-screen').classList.remove('hidden');
    var roleLabel = (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin) ? 'المدير' : (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student' ? 'الطالب' : 'المعلم';
    document.getElementById('wafdeen-teacher-name').innerText = ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.username) || '') + ' — ' + roleLabel;
    document.getElementById('wafdeen-menu-handle').classList.remove('hidden');
    document.getElementById('wafdeen-admin-area').classList.toggle('show', !!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin));
    document.getElementById('wafdeen-admin-menu-items').style.display = (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin) ? 'block' : 'none';
    wafdeenShowPanel((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student' ? 'materials' : 'daily');
    wafdeenRenderStudentSelect();
    wafdeenResetTimer();
    wafdeenRenderQuranCounters();
    if (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin) {
        wafdeenRenderTeachersTable();
        wafdeenRenderStudentsTable();
        wafdeenReportPanelInit();
    }
}
async function wafdeenLogout() {
    var logoutMessage = (wafdeenTimerRunning || wafdeenElapsedSeconds > 0)
        ? 'يوجد وقت غير محفوظ. هل تريد تسجيل الخروج دون حفظه؟'
        : 'هل أنت متأكد من رغبتك في تسجيل الخروج؟';
    var ok = await siteConfirm('تأكيد تسجيل الخروج', logoutMessage, 'تسجيل الخروج', true);
    if (!ok)
        return;
    wafdeenStopInterval();
    currentWafdeenTeacher = null;
    persistentAuthStorage.removeItem('currentWafdeenTeacher');
    wafdeenResetTimer();
    document.body.classList.remove('wafdeen-mode');
    showLoginScreen();
}
function wafdeenLoadCloud() {
    /* Firebase هي السحابة الرئيسية لبيانات البرنامج. الكتب يمكن أن تبقى على Google Drive كملفات فقط. */
    wafdeenLoadBooksFromGoogleDrive().then(function (books) {
        if (Array.isArray(books)) {
            // عند نجاح القراءة، Google Drive هو المصدر الرسمي لقائمة الكتب؛
            // هذا يجعل حذف الكتاب ينعكس على كل الأجهزة بدل بقاء نسخة محلية قديمة.
            wafdeenBooksData = books;
            wafdeenPersistLocal();
        }
        if (document.getElementById('wafdeen-panel-materials') &&
            !document.getElementById('wafdeen-panel-materials').classList.contains('hidden')) {
            wafdeenRenderMaterials(wafdeenSelectedSubject);
        }
    }).catch(function (e) { return console.warn('تعذر تحميل كتب Google Drive:', e); });
    if (!useFirebase || !db)
        return;
    syncCollection_('wafdeenTeachers', function () { return wafdeenTeachersData; }, function (v) { wafdeenTeachersData = v; }, function () { if (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin)
        wafdeenRenderTeachersTable(); }, { storageKey: 'wafdeenTeachersData' });
    syncCollection_('wafdeenStudents', function () { return wafdeenStudentsData; }, function (v) { wafdeenStudentsData = v; }, function () { wafdeenPersistLocal(); wafdeenRenderStudentSelect(); if (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin)
        wafdeenRenderStudentsTable(); }, { storageKey: 'wafdeenStudentsData' });
    // أوقات التسميع جزء من الرصد؛ تُحفظ محلياً وتُرسل مع الدرجة إلى Supabase فقط.
    // درجات الوافدين والوقت والامتحانات تُحفظ في Supabase كمستندات مستقلة، والمزامنة لحظية بين الأجهزة.
}
function wafdeenRenderStudentSelect() {
    var sel = document.getElementById('wafdeenStudentSelect');
    if (!sel)
        return;
    var current = sel.value;
    sel.innerHTML = '';
    if (!wafdeenStudentsData.length) {
        sel.innerHTML = '<option value="">لا يوجد طلاب مسجلون من الإدارة</option>';
        return;
    }
    __spreadArray([], __read(wafdeenStudentsData), false).sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'ar'); }).forEach(function (s) { var o = document.createElement('option'); o.value = s.id; o.textContent = s.name; sel.appendChild(o); });
    if (__spreadArray([], __read(sel.options), false).some(function (o) { return o.value === current; }))
        sel.value = current;
}
function selectWafdeenType(type, btn) {
    wafdeenSelectedType = type;
    document.querySelectorAll('.wafdeen-type-btn').forEach(function (b) { return b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('wafdeen-timer-status').innerText = 'نوع التسميع: ' + type + ' — جاهز للبدء';
}
function wafdeenFormat(sec) { sec = Math.max(0, Math.floor(sec)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return [h, m, s].map(function (v) { return String(v).padStart(2, '0'); }).join(':'); }
function wafdeenFormatTimer(elapsed) { var sec = Math.max(0, Math.floor(elapsed || 0)); var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s2 = sec % 60; return [h, m, s2].map(function (v) { return String(v).padStart(2, '0'); }).join(':'); }
function wafdeenUpdateTimerDisplay() { var el = document.getElementById('wafdeen-timer'); if (el)
    el.innerText = wafdeenFormatTimer(wafdeenElapsedSeconds); }
function wafdeenStopInterval() { if (wafdeenTimerInterval) {
    clearInterval(wafdeenTimerInterval);
    wafdeenTimerInterval = null;
} wafdeenTimerRunning = false; wafdeenTimerStartedAt = null; }
function wafdeenTick() { if (!wafdeenTimerRunning || !wafdeenTimerStartedAt)
    return; wafdeenElapsedSeconds = Math.floor((Date.now() - wafdeenTimerStartedAt) / 1000); wafdeenUpdateTimerDisplay(); }
function wafdeenUpdateQuranTimer() { var el = document.getElementById('wafdeen-quran-timer'); if (el)
    el.innerText = wafdeenFormatTimer(wafdeenQuranElapsedSeconds); }
function wafdeenUpdateEduTimer() { var el = document.getElementById('wafdeen-edu-timer'); if (el)
    el.innerText = wafdeenFormatTimer(wafdeenEduElapsedSeconds); }
function wafdeenQuranTick() {
    if (!wafdeenQuranTimerRunning || !wafdeenQuranTimerStartedAt) return;
    // مؤقت واحد مستقل لجلسة التسميع بالكامل، ولا يرتبط بنوع الدرجة.
    var elapsed = Math.max(0, Math.floor((Date.now() - wafdeenQuranTimerStartedAt) / 1000));
    var maxSeconds = Number(WAFDEEN_QURAN_SESSION_MAX_SECONDS || 7200);
    if (elapsed >= maxSeconds) {
        wafdeenQuranElapsedSeconds = maxSeconds;
        clearInterval(wafdeenQuranTimerInterval);
        wafdeenQuranTimerInterval = null;
        wafdeenQuranTimerRunning = false;
        wafdeenQuranTimerStartedAt = null;
        try { flushCloudRenderQueue_(); } catch (_) {}
        wafdeenQuranUpdateQuranTimer();
        var maxSt = document.getElementById('wafdeen-quran-timer-status');
        if (maxSt) maxSt.innerText = '⏱️ اكتمل الحد الأقصى لجلسة التسميع: ساعتان';
        return;
    }
    wafdeenQuranElapsedSeconds = elapsed;
    wafdeenQuranUpdateQuranTimer();
}
function wafdeenEduTick() { if (!wafdeenEduTimerRunning || !wafdeenEduTimerStartedAt)
    return; wafdeenEduElapsedSeconds = Math.floor((Date.now() - wafdeenEduTimerStartedAt) / 1000); wafdeenUpdateEduTimer(); }
function selectWafdeenQuranType(type, btn) { wafdeenSelectGradeType(type, btn); }
function wafdeenCalculateQuranScore(c) { var deduction = (Number(c.errors) || 0) + (Number(c.tashkeel) || 0) * 0.5 + (Number(c.repetition) || 0) * 0.25; return Math.max(0, Math.min(10, 10 - deduction)); }
function wafdeenGetCounterSet() {
    if (!wafdeenQuranErrorCounters)
        wafdeenQuranErrorCounters = { الجديد: { errors: 0, tashkeel: 0, repetition: 0 }, الماضي: { errors: 0, tashkeel: 0, repetition: 0 }, التلاوة: { errors: 0, tashkeel: 0, repetition: 0 } };
    var type = wafdeenQuranSelectedType || 'الجديد';
    if (!wafdeenQuranErrorCounters[type])
        wafdeenQuranErrorCounters[type] = { errors: 0, tashkeel: 0, repetition: 0 };
    return wafdeenQuranErrorCounters[type];
}
function wafdeenRenderQuranCounters() {
    var box = document.querySelector('.wafdeen-error-counters');
    if (box)
        box.classList.toggle('is-visible', !!wafdeenQuranSelectedType);
    var c = wafdeenGetCounterSet();
    ['errors', 'tashkeel', 'repetition'].forEach(function (k) { var el = document.getElementById('wafdeen-counter-' + k); if (el)
        el.textContent = String(Math.max(0, parseInt(c[k], 10) || 0)); });
    var fieldMap = { الجديد: 'wafdeenNewLesson', الماضي: 'wafdeenOldRevision', التلاوة: 'wafdeenRecitation' };
    var type = wafdeenQuranSelectedType || 'الجديد';
    var field = document.getElementById(fieldMap[type]);
    if (field) {
        var score = wafdeenCalculateQuranScore(c);
        field.value = Number(score).toFixed(2).replace(/\.00$/, '');
        field.placeholder = '';
    }
}
function wafdeenSelectGradeType(type, btn) {
    if (!['الجديد', 'الماضي', 'التلاوة'].includes(type)) type = 'الجديد';
    // اختيار الجديد/الماضي/التلاوة يغيّر الخانات فقط، ولا يوقف ولا يعيد ولا يغيّر مؤقت جلسة التسميع.
    wafdeenQuranSelectedType = type;
    document.querySelectorAll('#wafdeen-daily-scores-panel .wafdeen-grade-type-btn').forEach(function (b) { return b.classList.toggle('active', b.dataset.gradeType === type); });
    var details = document.getElementById('wafdeen-grade-details');
    if (details) details.classList.add('is-visible');
    document.querySelectorAll('#wafdeen-daily-scores-panel .wafdeen-grade-type-fields').forEach(function (box) { return box.classList.toggle('is-visible', box.dataset.gradeFields === type); });
    var st = document.getElementById('wafdeen-quran-timer-status');
    if (st) st.innerText = wafdeenQuranTimerRunning ? '⏱️ جلسة التسميع — جارٍ احتساب الوقت' : '⏱️ جلسة التسميع — ' + wafdeenFormatTimer(wafdeenQuranElapsedSeconds || 0);
    wafdeenRenderQuranCounters();
    document.querySelectorAll('#wafdeen-daily-scores-panel .wafdeen-grade-type-fields').forEach(function (box) { var b = box.querySelector('.wafdeen-save-type-btn'); if (b) {
        var saved = !!wafdeenQuranHeardTypes[box.dataset.gradeFields];
        b.disabled = box.dataset.gradeFields === type && saved;
        b.textContent = box.dataset.gradeFields === type && saved ? "\u2705 تم حفظ ".concat(box.dataset.gradeFields) : '💾 حفظ الدرجات';
    }});
}
function wafdeenIncrementCounter(kind) { var c = wafdeenGetCounterSet(); if (!Object.prototype.hasOwnProperty.call(c, kind))
    return false; wafdeenQuranHeardTypes[wafdeenQuranSelectedType || 'الجديد'] = true; c[kind] = (parseInt(c[kind], 10) || 0) + 1; wafdeenRenderQuranCounters(); wafdeenAnimateCounterValue(kind); return false; }
function wafdeenDecrementCounter(kind) { var c = wafdeenGetCounterSet(); if (!Object.prototype.hasOwnProperty.call(c, kind))
    return false; c[kind] = Math.max(0, (parseInt(c[kind], 10) || 0) - 1); wafdeenRenderQuranCounters(); wafdeenAnimateCounterValue(kind); return false; }
function wafdeenAnimateCounterValue(kind) { var el = document.getElementById('wafdeen-counter-' + kind); if (!el)
    return; el.classList.remove('wafdeen-counter-value-pop'); void el.offsetWidth; el.classList.add('wafdeen-counter-value-pop'); }
function wafdeenResetQuranCounters() { wafdeenQuranHeardTypes = { الجديد: false, الماضي: false, التلاوة: false }; wafdeenQuranErrorCounters = { الجديد: { errors: 0, tashkeel: 0, repetition: 0 }, الماضي: { errors: 0, tashkeel: 0, repetition: 0 }, التلاوة: { errors: 0, tashkeel: 0, repetition: 0 } }; wafdeenQuranSelectedType = ''; var box = document.querySelector('.wafdeen-error-counters'); if (box)
    box.classList.remove('is-visible'); wafdeenRenderQuranCounters(); }
function firebaseSaveWafdeenUsage_(usage) {
    return __awaiter(this, void 0, void 0, function () { var id, e_1; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!useFirebase || !db)
                    return [2 /*return*/, false];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                id = String((usage === null || usage === void 0 ? void 0 : usage.id) || "usage_".concat(Date.now()));
                return [4 /*yield*/, db.collection('wafdeenUsage').doc(id).set(__assign(__assign({}, usage), { id: id, updatedAt: new Date().toISOString() }), { merge: true })];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    }); });
}
function __wafdeenSetQuranTimerIntervalSafe() {
    // نقطة واحدة لإدارة مؤقت جلسة التسميع؛ نفس clear/set السابق بدون تغيير في التوقيت أو السلوك.
    if (wafdeenQuranTimerInterval) clearInterval(wafdeenQuranTimerInterval);
    wafdeenQuranTimerInterval = setInterval(wafdeenQuranTick, 1000);
}
function __wafdeenStartSessionTimerSafe() {
    try {
        // مؤقت جلسة التسميع مستقل تمامًا عن اختيار النوع أو الطالب.
        if (wafdeenQuranTimerRunning) return;
        var maxSeconds = Number(WAFDEEN_QURAN_SESSION_MAX_SECONDS || 7200);
        var current = Math.max(0, Math.min(Number(wafdeenQuranElapsedSeconds || 0), maxSeconds));
        if (current >= maxSeconds) {
            wafdeenQuranElapsedSeconds = maxSeconds;
            wafdeenQuranUpdateQuranTimer();
            var maxEl = document.getElementById('wafdeen-quran-timer-status');
            if (maxEl) maxEl.innerText = '⏱️ اكتمل الحد الأقصى لجلسة التسميع: ساعتان';
            return false;
        }
        wafdeenQuranTimerStartedAt = Date.now() - (current * 1000);
        wafdeenQuranElapsedSeconds = current;
        wafdeenQuranTimerRunning = true;
        __wafdeenSetQuranTimerIntervalSafe();
        wafdeenQuranTick();
        var st = document.getElementById('wafdeen-quran-timer-status');
        if (st) st.innerText = '⏱️ جلسة التسميع — جارٍ احتساب الوقت';
        var startBtn = document.getElementById('wafdeen-quran-start-btn');
        var pauseBtn = document.getElementById('wafdeen-quran-pause-btn');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        return false;
    } catch (e) {
        console.error('Wafdeen session timer start error:', e);
        var err = document.getElementById('wafdeen-quran-timer-status');
        if (err) err.innerText = 'تعذر تشغيل العداد — حاول الضغط بدء مرة أخرى';
        return false;
    }
}
function __wafdeenPauseSessionTimerSafe() {
    try {
        if (!wafdeenQuranTimerRunning) return false;
        wafdeenQuranTick();
        clearInterval(wafdeenQuranTimerInterval);
        wafdeenQuranTimerInterval = null;
        wafdeenQuranTimerRunning = false;
        wafdeenQuranTimerStartedAt = null;
        wafdeenQuranUpdateQuranTimer();
        var st = document.getElementById('wafdeen-quran-timer-status');
        if (st) st.innerText = '⏸️ استراحة — جلسة التسميع متوقفة مؤقتًا عند ' + wafdeenFormatTimer(wafdeenQuranElapsedSeconds);
        var startBtn = document.getElementById('wafdeen-quran-start-btn');
        if (startBtn) startBtn.disabled = false;
        return false;
    } catch (e) {
        console.error('Wafdeen session timer pause error:', e);
        return false;
    }
}
window.__wafdeenStartSessionTimer = __wafdeenStartSessionTimerSafe;
window.__wafdeenPauseSessionTimer = __wafdeenPauseSessionTimerSafe;
function wafdeenQuranStartPause(forcePause) {
    if (forcePause === void 0) { forcePause = false; }
    if (forcePause) {
        if (!wafdeenQuranTimerRunning) return;
        wafdeenQuranTick();
        clearInterval(wafdeenQuranTimerInterval);
        wafdeenQuranTimerInterval = null;
        wafdeenQuranTimerRunning = false;
        wafdeenQuranTimerStartedAt = null;
        try { flushCloudRenderQueue_(); } catch (_) {}
        var st = document.getElementById('wafdeen-quran-timer-status');
        if (st) st.innerText = '⏸️ استراحة — جلسة التسميع متوقفة مؤقتًا عند ' + wafdeenFormatTimer(wafdeenQuranElapsedSeconds);
        return;
    }
    if (wafdeenQuranTimerRunning) return;
    var current = Math.min(Number(wafdeenQuranElapsedSeconds || 0), Number(WAFDEEN_QURAN_SESSION_MAX_SECONDS || 7200));
    if (current >= Number(WAFDEEN_QURAN_SESSION_MAX_SECONDS || 7200)) {
        var maxSt2 = document.getElementById('wafdeen-quran-timer-status');
        if (maxSt2) maxSt2.innerText = '⏱️ اكتمل الحد الأقصى لجلسة التسميع: ساعتان';
        return;
    }
    wafdeenQuranTimerStartedAt = Date.now() - current * 1000;
    wafdeenQuranElapsedSeconds = current;
    wafdeenQuranTimerRunning = true;
    wafdeenQuranSessionSaved = false;
    wafdeenQuranUpdateQuranTimer();
    __wafdeenSetQuranTimerIntervalSafe();
    wafdeenQuranTick();
    var st = document.getElementById('wafdeen-quran-timer-status');
    if (st) st.innerText = '⏱️ جلسة التسميع — جارٍ احتساب الوقت';
}
function wafdeenQuranStopTimer() {
    return __awaiter(this, arguments, void 0, function (auto) {
        var seconds;
        if (auto === void 0) { auto = false; }
        return __generator(this, function (_a) {
            if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student') return [2 /*return*/, false];
            if (wafdeenQuranTimerRunning) wafdeenQuranTick();
            if (wafdeenQuranTimerInterval) clearInterval(wafdeenQuranTimerInterval);
            wafdeenQuranTimerInterval = null;
            wafdeenQuranTimerRunning = false;
            wafdeenQuranTimerStartedAt = null;
            try { flushCloudRenderQueue_(); } catch (_) {}
            seconds = Math.floor(Number(wafdeenQuranElapsedSeconds || 0));
            wafdeenQuranElapsedSeconds = seconds;
            wafdeenUpdateQuranTimer();
            if (seconds <= 0) {
                if (!auto) showMessage('wafdeen-save-msg', 'اضغط «بدء» أولاً لاحتساب وقت جلسة التسميع.', 'error');
                return [2 /*return*/, false];
            }
            var st = document.getElementById('wafdeen-quran-timer-status');
            if (st) st.innerText = '⏸️ جلسة التسميع متوقفة عند ' + wafdeenFormatTimer(seconds);
            return [2 /*return*/, true];
        });
    });
}
function wafdeenQuranReset() {
    if (wafdeenQuranTimerRunning)
        return;
    wafdeenQuranElapsedByType = { الجديد: 0, الماضي: 0, التلاوة: 0 };
    wafdeenQuranElapsedSeconds = 0;
    wafdeenQuranSessionSaved = false;
    wafdeenQuranSessionSavedByType = { الجديد: false, الماضي: false, التلاوة: false };
    wafdeenQuranUpdateQuranTimer();
    var st = document.getElementById('wafdeen-quran-timer-status');
    if (st)
        st.innerText = 'اضغط بدء لبدء جلسة التسميع — الوقت يستمر في العد حتى تضغط استراحة';
}
function selectWafdeenEduSubject(subject, btn) { if (wafdeenEduTimerRunning)
    return showMessage('wafdeen-save-msg', 'أوقف مؤقت المواد التعليمية أولاً قبل تغيير المادة', 'error'); wafdeenEduSelectedSubject = subject; document.querySelectorAll('[data-edu-subject]').forEach(function (b) { return b.classList.remove('active'); }); btn.classList.add('active'); document.getElementById('wafdeen-edu-timer-status').innerText = subject + ' — جاهز للبدء'; }
function selectWafdeenEduType(type, btn) { if (wafdeenEduTimerRunning)
    return showMessage('wafdeen-save-msg', 'أوقف مؤقت المواد التعليمية أولاً قبل تغيير النوع', 'error'); if (!wafdeenEduSelectedSubject)
    return showMessage('wafdeen-save-msg', 'اختر المادة أولاً: فقه أو منطق أو حديث أو اللغة العربية', 'error'); wafdeenEduSelectedType = type; document.querySelectorAll('[data-edu-type]').forEach(function (b) { return b.classList.remove('active'); }); btn.classList.add('active'); document.getElementById('wafdeen-edu-timer-status').innerText = wafdeenEduSelectedSubject + ' — ' + type + ' — جاهز للبدء'; }
function wafdeenEduStartPause(forcePause) {
    if (forcePause === void 0) { forcePause = false; }
    if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student')
        return;
    if (!wafdeenEduSelectedSubject)
        return showMessage('wafdeen-save-msg', 'اختر المادة أولاً: فقه أو منطق أو حديث أو اللغة العربية', 'error');
    if (!document.getElementById('wafdeenStudentSelect').value)
        return showMessage('wafdeen-save-msg', 'اختر الطالب أولاً', 'error');
    if (forcePause) {
        if (!wafdeenEduTimerRunning)
            return;
        wafdeenEduTick();
        clearInterval(wafdeenEduTimerInterval);
        wafdeenEduTimerInterval = null;
        wafdeenEduTimerRunning = false;
        wafdeenEduTimerStartedAt = null;
        document.getElementById('wafdeen-edu-timer-status').innerText = 'استراحة — اضغط بدء لاستكمال الوقت';
        return;
    }
    if (wafdeenEduTimerRunning)
        return;
    wafdeenEduTimerStartedAt = Date.now() - wafdeenEduElapsedSeconds * 1000;
    wafdeenEduTimerRunning = true;
    wafdeenEduTimerInterval = setInterval(wafdeenEduTick, 1000);
    document.getElementById('wafdeen-edu-timer-status').innerText = 'جارٍ احتساب الوقت — ' + wafdeenEduSelectedSubject + ' — ' + wafdeenEduSelectedType;
}
function wafdeenEduStopTimer() {
    return __awaiter(this, void 0, void 0, function () { var seconds, student, rec, sheetOk, e_2; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student')
                    return [2 /*return*/];
                if (!wafdeenEduSelectedSubject)
                    return [2 /*return*/, showMessage('wafdeen-save-msg', 'اختر المادة أولاً', 'error')];
                if (!document.getElementById('wafdeenStudentSelect').value)
                    return [2 /*return*/, showMessage('wafdeen-save-msg', 'اختر الطالب أولاً', 'error')];
                if (wafdeenEduTimerRunning)
                    wafdeenEduTick();
                if (wafdeenEduTimerInterval)
                    clearInterval(wafdeenEduTimerInterval);
                wafdeenEduTimerInterval = null;
                wafdeenEduTimerRunning = false;
                wafdeenEduTimerStartedAt = null;
                seconds = Math.floor(wafdeenEduElapsedSeconds);
                if (seconds <= 0)
                    return [2 /*return*/, showMessage('wafdeen-save-msg', 'لم يتم احتساب وقت في مؤقت المواد التعليمية حتى الآن', 'error')];
                student = wafdeenStudentsData.find(function (s) { return String(s.id) === String(document.getElementById('wafdeenStudentSelect').value); });
                if (!student)
                    return [2 /*return*/, showMessage('wafdeen-save-msg', 'الطالب غير موجود', 'error')];
                rec = { id: (Date.now() + 1).toString(), teacherUsername: currentWafdeenTeacher.username, studentId: student.id, studentName: student.name, category: 'educational', subject: wafdeenEduSelectedSubject, seconds: seconds, dateISO: new Date().toISOString(), month: wafdeenTodayMonth() };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                wafdeenUsageData.push(rec);
                wafdeenPersistLocal();
                if (!(useFirebase && db)) return [3 /*break*/, 3];
                return [4 /*yield*/, db.collection('wafdeenUsage').doc(rec.id).set(rec, { merge: true })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, firebaseSaveWafdeenUsage_(rec)];
            case 4:
                sheetOk = _a.sent();
                showMessage('wafdeen-save-msg', sheetOk ? "\u062A\u0645 \u062D\u0641\u0638 ".concat(wafdeenFormat(seconds), " \u0644\u0644\u0637\u0627\u0644\u0628 ").concat(student.name, " \u0641\u064A ").concat(wafdeenEduSelectedSubject, " \u0648\u0645\u0632\u0627\u0645\u0646\u062A\u0647\u0627 \u0645\u0639 Firebase \u2705") : "\u062A\u0645 \u062D\u0641\u0638 ".concat(wafdeenFormat(seconds), " \u0644\u0644\u0637\u0627\u0644\u0628 ").concat(student.name, " \u0645\u062D\u0644\u064A\u064B\u0627/\u0641\u064A Firebase\u060C \u0648\u0633\u062A\u062A\u0645 \u0645\u0632\u0627\u0645\u0646\u062A\u0647\u0627 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0645\u0639 Supabase."), sheetOk ? 'success' : 'info');
                wafdeenEduReset();
                if (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin)
                    wafdeenRefreshAllReports();
                return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                console.error(e_2);
                showMessage('wafdeen-save-msg', 'تعذر حفظ وقت المواد التعليمية', 'error');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    }); });
}
function wafdeenEduReset() { if (wafdeenEduTimerRunning)
    return; wafdeenEduElapsedSeconds = 0; wafdeenUpdateEduTimer(); wafdeenEduSelectedSubject = ''; wafdeenEduSelectedType = ''; document.querySelectorAll('[data-edu-subject],[data-edu-type]').forEach(function (b) { return b.classList.remove('active'); }); var st = document.getElementById('wafdeen-edu-timer-status'); if (st)
    st.innerText = 'اختر المادة ثم اضغط بدء'; }
function wafdeenHasTodayRecordForSelectedStudent() {
    var sel = document.getElementById('wafdeenStudentSelect');
    var studentId = String((sel === null || sel === void 0 ? void 0 : sel.value) || '');
    if (!studentId)
        return false;
    var student = wafdeenStudentsData.find(function (x) { return String(x.id) === studentId; });
    var studentName = String((student === null || student === void 0 ? void 0 : student.name) || '').trim();
    var today = wafdeenSelectedDailyDateStr();
    return (wafdeenDailyRecords || []).some(function (r) {
        if (r._deleted || String(r.dateISO || '').slice(0, 10) !== today)
            return false;
        var sameId = studentId && String(r.studentId || '') === studentId;
        var sameName = studentName && String(r.studentName || '').trim() === studentName;
        return !!(sameId || sameName);
    });
}
function wafdeenUpdateDailySaveButton() {
    var btn = document.getElementById('wafdeen-daily-save-btn');
    var sel = document.getElementById('wafdeenStudentSelect');
    if (!btn)
        return;
    var exists = wafdeenHasTodayRecordForSelectedStudent();
    var hasStudent = !!String((sel === null || sel === void 0 ? void 0 : sel.value) || '');
    btn.classList.toggle('wafdeen-save-blocked', exists);
    btn.setAttribute('aria-disabled', exists ? 'true' : 'false');
    btn.title = exists ? 'تم تسجيل هذا الطالب اليوم — استخدم تعديل أو مسح أولاً.' : '';
    btn.textContent = exists ? '🔒 تم تسجيل الطالب اليوم' : '💾 حفظ الرصد اليومي';
    btn.disabled = false; // نترك الضغط يصل للحارس ليعرض الرسالة، لكن لا يسمح بأي حفظ.
    btn.style.opacity = exists ? '0.65' : '1';
    btn.style.cursor = exists ? 'not-allowed' : 'pointer';
    if (!hasStudent) {
        btn.classList.remove('wafdeen-save-blocked');
        btn.textContent = '💾 حفظ الرصد اليومي';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}
function wafdeenGetTodayGradeRecord(studentId) {
    var today = wafdeenSelectedDailyDateStr();
    return (wafdeenDailyRecords || []).find(function (r) { return !r._deleted && String(r.studentId || '') === String(studentId || '') && String(r.dateISO || '').slice(0, 10) === today; }) || null;
}
function wafdeenLoadSelectedStudentGradeData() {
    var _a;
    var studentId = (_a = document.getElementById('wafdeenStudentSelect')) === null || _a === void 0 ? void 0 : _a.value;
    var r = wafdeenGetTodayGradeRecord(studentId);
    var set = function (id, v) { var el = document.getElementById(id); if (el)
        el.value = (v === undefined || v === null || v === '') ? '' : String(v); };
    wafdeenQuranErrorCounters = { الجديد: { errors: 0, tashkeel: 0, repetition: 0 }, الماضي: { errors: 0, tashkeel: 0, repetition: 0 }, التلاوة: { errors: 0, tashkeel: 0, repetition: 0 } };
    wafdeenQuranHeardTypes = { الجديد: false, الماضي: false, التلاوة: false };
    wafdeenQuranElapsedByType = { الجديد: 0, الماضي: 0, التلاوة: 0 };
    if (r) {
        set('wafdeenNewLesson', r.newLesson);
        set('wafdeenNewPagesCount', r.newPagesCount);
        set('wafdeenNewTopicRecited', r.newTopicRecited);
        set('wafdeenOldRevision', r.oldRevision);
        set('wafdeenOldPagesCount', r.oldPagesCount);
        set('wafdeenOldTopicRecited', r.oldTopicRecited);
        set('wafdeenRecitation', r.recitation);
        set('wafdeenRecitationPagesCount', r.recitationPagesCount);
        set('wafdeenRecitationTopicRecited', r.recitationTopicRecited);
        wafdeenQuranErrorCounters = { الجديد: { errors: Number(r.newErrors) || 0, tashkeel: Number(r.newTashkeel) || 0, repetition: Number(r.newRepetition) || 0 }, الماضي: { errors: Number(r.oldErrors) || 0, tashkeel: Number(r.oldTashkeel) || 0, repetition: Number(r.oldRepetition) || 0 }, التلاوة: { errors: Number(r.recitationErrors) || 0, tashkeel: Number(r.recitationTashkeel) || 0, repetition: Number(r.recitationRepetition) || 0 } };
        var legacyTimes = [Number(r.newLessonTimeSeconds || 0), Number(r.oldRevisionTimeSeconds || 0), Number(r.recitationTimeSeconds || 0)];
        var commonSessionTime = Number(r.quranSessionTimeSeconds || 0);
        if (commonSessionTime <= 0) commonSessionTime = Math.max.apply(Math, legacyTimes);
        var savedTimesByType = Object.assign({ الجديد: 0, الماضي: 0, التلاوة: 0 }, r.quranSessionTimeByType || {});
        wafdeenQuranElapsedSeconds = Math.max(0, commonSessionTime);
        wafdeenQuranElapsedByType = {
            الجديد: Number(savedTimesByType.الجديد || r.newLessonTimeSeconds || 0),
            الماضي: Number(savedTimesByType.الماضي || r.oldRevisionTimeSeconds || 0),
            التلاوة: Number(savedTimesByType.التلاوة || r.recitationTimeSeconds || 0)
        };
        (wafdeenUsageData || []).filter(function (x) { return !x._deleted && String(x.studentId || '') === String(studentId || '') && x.category === 'quran' && String(x.dateISO || '').slice(0, 10) === wafdeenSelectedDailyDateStr(); }).forEach(function (x) {
            if (wafdeenQuranElapsedSeconds <= 0) wafdeenQuranElapsedSeconds = Number(x.sessionSeconds || x.seconds || 0);
        });
        ['الجديد', 'الماضي', 'التلاوة'].forEach(function (type) { var key = type === 'الجديد' ? 'newLesson' : type === 'الماضي' ? 'oldRevision' : 'recitation'; wafdeenQuranHeardTypes[type] = r[key] !== undefined && r[key] !== null && r[key] !== ''; });
    }
    else {
        ['wafdeenNewLesson', 'wafdeenOldRevision', 'wafdeenRecitation'].forEach(function (id) { return set(id, '10'); });
        ['wafdeenNewPagesCount', 'wafdeenNewTopicRecited', 'wafdeenOldPagesCount', 'wafdeenOldTopicRecited', 'wafdeenRecitationPagesCount', 'wafdeenRecitationTopicRecited'].forEach(function (id) { return set(id, ''); });
    }
    wafdeenQuranSelectedType = wafdeenQuranSelectedType || 'الجديد';
    wafdeenQuranSessionSavedByType = { الجديد: false, الماضي: false, التلاوة: false };
    wafdeenQuranElapsedSeconds = Number(wafdeenQuranElapsedSeconds || wafdeenQuranElapsedByType[wafdeenQuranSelectedType] || 0);
    wafdeenUpdateQuranTimer();
    wafdeenRenderQuranCounters();
    document.querySelectorAll('#wafdeen-daily-scores-panel .wafdeen-grade-type-fields').forEach(function (box) { var b = box.querySelector('.wafdeen-save-type-btn'); if (b) {
        var saved = !!wafdeenQuranHeardTypes[box.dataset.gradeFields];
        b.disabled = false;
        b.textContent = box.dataset.gradeFields === wafdeenQuranSelectedType && saved ? "\u2705 \u062A\u0645 \u062D\u0641\u0638 ".concat(box.dataset.gradeFields) : '💾 حفظ الدرجات';
    } });
}
function wafdeenQuranClearMissing_() { var _a; document.querySelectorAll('#wafdeen-daily-scores-panel .field-missing,#wafdeen-daily-scores-panel .field-missing-group').forEach(function (el) { return el.classList.remove('field-missing', 'field-missing-group'); }); (_a = document.getElementById('wafdeen-quran-timer')) === null || _a === void 0 ? void 0 : _a.classList.remove('field-missing'); }
function wafdeenQuranMarkMissing_(id, missing) { var el = document.getElementById(id); var group = el === null || el === void 0 ? void 0 : el.closest('.form-group'); if (el)
    el.classList.toggle('field-missing', !!missing); if (group)
    group.classList.toggle('field-missing-group', !!missing); }
function wafdeenSaveGradeType(type) {
    wafdeenKeepDailyScroll_();
    return __awaiter(this, void 0, void 0, function () {
        var studentId, seconds, pagesId, topicId, missing, student, dateISO, record, hadRecord, val, c, score, timeKey, idx, cloudCommon, cloudType, usage, e_3, resetMap;
        var _a, _b, _c, _d;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student')
                        return [2 /*return*/];
                    if (!['الجديد', 'الماضي', 'التلاوة'].includes(type))
                        type = 'الجديد';
                    studentId = (_e = document.getElementById('wafdeenStudentSelect')) === null || _e === void 0 ? void 0 : _e.value;
                    if (!studentId)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اختر الطالب أولاً', 'error')];
                    // السماح بالحفظ مرة أخرى لتحديث وقت جلسة التسميع مع الدرجة (بدون إنشاء سجل جديد).
                    wafdeenQuranSelectedType = type;
                    if (wafdeenQuranTimerRunning) wafdeenQuranTick();
                    seconds = Math.floor(Number(wafdeenQuranElapsedSeconds || 0));
                    pagesId = type === 'الجديد' ? 'wafdeenNewPagesCount' : type === 'الماضي' ? 'wafdeenOldPagesCount' : 'wafdeenRecitationPagesCount';
                    topicId = type === 'الجديد' ? 'wafdeenNewTopicRecited' : type === 'الماضي' ? 'wafdeenOldTopicRecited' : 'wafdeenRecitationTopicRecited';
                    wafdeenQuranClearMissing_();
                    missing = [];
                    if (seconds <= 0) {
                        (_f = document.getElementById('wafdeen-quran-timer')) === null || _f === void 0 ? void 0 : _f.classList.add('field-missing');
                        missing.push('وقت التسميع — اضغط بدء أولاً');
                    }
                    if (!String(((_g = document.getElementById(pagesId)) === null || _g === void 0 ? void 0 : _g.value) || '').trim()) {
                        wafdeenQuranMarkMissing_(pagesId, true);
                        missing.push('عدد الصفحات');
                    }
                    if (!String(((_h = document.getElementById(topicId)) === null || _h === void 0 ? void 0 : _h.value) || '').trim()) {
                        wafdeenQuranMarkMissing_(topicId, true);
                        missing.push('المقرر الذي تم تسميعه');
                    }
                    if (missing.length)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', "\u0623\u0643\u0645\u0644 \u0628\u064A\u0627\u0646\u0627\u062A ".concat(type, ": ").concat(missing.join('، ')), 'error')];
                    student = wafdeenStudentsData.find(function (s) { return String(s.id) === String(studentId); });
                    if (!student)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'الطالب غير موجود', 'error')];
                    dateISO = wafdeenSelectedDailyDateStr();
                    record = wafdeenGetTodayGradeRecord(studentId);
                    hadRecord = !!record;
                    if (!record) {
                        record = { id: "wafdeen_".concat(student.id, "_").concat(dateISO), teacherUsername: currentWafdeenTeacher.username, studentId: student.id, studentName: student.name, dateISO: dateISO, attendanceStatus: 'present', isAbsent: false, status: 'present', dayName: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][wafdeenSelectedDailyDateObj().getDay()], newLesson: '', newPagesCount: '', newTopicRecited: '', oldRevision: '', oldPagesCount: '', oldTopicRecited: '', recitation: '', recitationPagesCount: '', recitationTopicRecited: '', newLessonTimeSeconds: 0, oldRevisionTimeSeconds: 0, recitationTimeSeconds: 0, quranSessionTimeSeconds: 0, quranSessionTimeByType: { الجديد: 0, الماضي: 0, التلاوة: 0 }, savedAt: new Date().toISOString() };
                        wafdeenDailyRecords.push(record);
                    }
                    val = function (id) { var _a, _b; return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ''; };
                    c = wafdeenQuranErrorCounters[type] || { errors: 0, tashkeel: 0, repetition: 0 };
                    score = Number(wafdeenCalculateQuranScore(c).toFixed(2));
                    timeKey = type === 'الجديد' ? 'newLessonTimeSeconds' : type === 'الماضي' ? 'oldRevisionTimeSeconds' : 'recitationTimeSeconds';
                    record.quranSessionTimeSeconds = seconds;
                    record.quranSessionTimeByType = Object.assign({ الجديد: 0, الماضي: 0, التلاوة: 0 }, record.quranSessionTimeByType || {});
                    record.quranSessionTimeByType[type] = seconds;
                    if (type === 'الجديد')
                        Object.assign(record, (_a = { newLesson: score, newPagesCount: val(pagesId), newTopicRecited: val(topicId), newErrors: Number(c.errors) || 0, newTashkeel: Number(c.tashkeel) || 0, newRepetition: Number(c.repetition) || 0 }, _a[timeKey] = seconds, _a));
                    else if (type === 'الماضي')
                        Object.assign(record, (_b = { oldRevision: score, oldPagesCount: val(pagesId), oldTopicRecited: val(topicId), oldErrors: Number(c.errors) || 0, oldTashkeel: Number(c.tashkeel) || 0, oldRepetition: Number(c.repetition) || 0 }, _b[timeKey] = seconds, _b));
                    else
                        Object.assign(record, (_c = { recitation: score, recitationPagesCount: val(pagesId), recitationTopicRecited: val(topicId), recitationErrors: Number(c.errors) || 0, recitationTashkeel: Number(c.tashkeel) || 0, recitationRepetition: Number(c.repetition) || 0 }, _c[timeKey] = seconds, _c));
                    record.total = ['newLesson', 'oldRevision', 'recitation'].reduce(function (sum, k) { return sum + (record[k] === '' ? 0 : Number(record[k]) || 0); }, 0);
                    record.updatedAt = new Date().toISOString();
                    idx = wafdeenDailyRecords.findIndex(function (r) { return String(r.id) === String(record.id); });
                    if (idx > -1)
                        wafdeenDailyRecords[idx] = record;
                    else
                        wafdeenDailyRecords.push(record);
                    wafdeenQuranHeardTypes[type] = true;
                    wafdeenQuranSessionSavedByType[type] = true;
                    wafdeenPersistLocal();
                    refreshWafdeenMainLog_();
                    if (!useFirebase || !db)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'Supabase غير متصل — لم يتم اعتماد الحفظ.', 'error')];
                    cloudCommon = { id: String(record.id), recordId: String(record.id), teacherUsername: record.teacherUsername, studentId: record.studentId, studentName: record.studentName, dateISO: record.dateISO, attendanceStatus: record.attendanceStatus, isAbsent: record.isAbsent, status: record.status, dayName: record.dayName, quranSessionTimeSeconds: Number(record.quranSessionTimeSeconds || seconds || 0), quranSessionTimeByType: Object.assign({ الجديد: 0, الماضي: 0, التلاوة: 0 }, record.quranSessionTimeByType || {}), updatedAt: new Date().toISOString() };
                    cloudType = type === 'الجديد'
                        ? { newLesson: record.newLesson, newPagesCount: record.newPagesCount, newTopicRecited: record.newTopicRecited, newErrors: record.newErrors, newTashkeel: record.newTashkeel, newRepetition: record.newRepetition, newLessonTimeSeconds: record.newLessonTimeSeconds }
                        : type === 'الماضي'
                            ? { oldRevision: record.oldRevision, oldPagesCount: record.oldPagesCount, oldTopicRecited: record.oldTopicRecited, oldErrors: record.oldErrors, oldTashkeel: record.oldTashkeel, oldRepetition: record.oldRepetition, oldRevisionTimeSeconds: record.oldRevisionTimeSeconds }
                            : { recitation: record.recitation, recitationPagesCount: record.recitationPagesCount, recitationTopicRecited: record.recitationTopicRecited, recitationErrors: record.recitationErrors, recitationTashkeel: record.recitationTashkeel, recitationRepetition: record.recitationRepetition, recitationTimeSeconds: record.recitationTimeSeconds };
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 4, , 5]);
                    usage = { id: String(student.id) + '_' + String(dateISO) + '_' + String(type), teacherUsername: currentWafdeenTeacher.username, studentId: student.id, studentName: student.name, category: 'quran', subject: 'القرآن الكريم', type: type, seconds: seconds, sessionSeconds: seconds, dateISO: wafdeenSelectedDailyDateStr(), month: wafdeenPeriodKeyForDate(wafdeenSelectedDailyDateObj()), sessionMaxSeconds: Number(WAFDEEN_QURAN_SESSION_MAX_SECONDS || 7200), completedInTwoHours: seconds >= Number(WAFDEEN_QURAN_SESSION_MAX_SECONDS || 7200), updatedAt: new Date().toISOString() };
                    return [4 /*yield*/, Promise.all([
                            firebaseWriteRecord_('wafdeenDailyRecords', record.id, __assign(__assign(__assign({}, cloudCommon), cloudType), { total: record.total, _dailyTypeSaved: (_d = {}, _d[type] = true, _d) }), { merge: true }),
                            firebaseWriteRecord_('wafdeenUsage', usage.id, usage, { merge: true })
                        ])];
                case 2:
                    _j.sent();
                    wafdeenUsageData = wafdeenUsageData.filter(function (u) { return String(u.id) !== String(usage.id); });
                    wafdeenUsageData.push(usage);
                    wafdeenPersistLocal();
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _j.sent();
                    console.error('Wafdeen Supabase save error:', e_3);
                    return [2 /*return*/, showMessage('wafdeen-save-msg', 'تعذر حفظ ' + type + ' على Firebase — لم يتم اعتماد الحفظ.', 'error')];
                case 5:
                    resetMap = { 'الجديد': ['wafdeenNewLesson', 'wafdeenNewPagesCount', 'wafdeenNewTopicRecited'], 'الماضي': ['wafdeenOldRevision', 'wafdeenOldPagesCount', 'wafdeenOldTopicRecited'], 'التلاوة': ['wafdeenRecitation', 'wafdeenRecitationPagesCount', 'wafdeenRecitationTopicRecited'] };
                    (resetMap[type] || []).forEach(function (id) { var el = document.getElementById(id); if (el)
                        el.value = (id === 'wafdeenNewLesson' || id === 'wafdeenOldRevision' || id === 'wafdeenRecitation') ? '10' : ''; });
                    wafdeenQuranErrorCounters[type] = { errors: 0, tashkeel: 0, repetition: 0 };
                    // مؤقت جلسة التسميع مستقل: لا يُصفّر عند حفظ الجديد أو الماضي أو التلاوة.
                    wafdeenQuranElapsedByType[type] = wafdeenQuranElapsedSeconds;
                    wafdeenUpdateQuranTimer();
                    wafdeenRenderQuranCounters();
                    // تحديث زر النوع المحفوظ حتى يظهر «تم الحفظ» ويمنع التكرار.
                    document.querySelectorAll('#wafdeen-daily-scores-panel .wafdeen-grade-type-fields').forEach(function (box) { var b = box.querySelector('.wafdeen-save-type-btn'); if (b && box.dataset.gradeFields === type) {
                        b.disabled = true;
                        b.textContent = "\u2705 \u062A\u0645 \u062D\u0641\u0638 ".concat(type);
                        b.title = "\u062A\u0645 \u062D\u0641\u0638 ".concat(type, " \u0627\u0644\u064A\u0648\u0645 \u0628\u0627\u0644\u0641\u0639\u0644");
                    } });
                    showMessage('wafdeen-save-msg', "\u062A\u0645 \u062D\u0641\u0638 ".concat(type, " \u0644\u0644\u0637\u0627\u0644\u0628 ").concat(student.name, " \u0628\u062A\u0627\u0631\u064A\u062E ").concat(wafdeenSelectedDailyDateStr(), " \u0648\u0627\u0644\u0648\u0642\u062A ").concat(wafdeenFormatTimer(seconds), " \u0628\u0646\u062C\u0627\u062D \u2705"), 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function wafdeenSaveGradeAndTime() {
    return __awaiter(this, void 0, void 0, function () {
        var type;
        return __generator(this, function (_a) {
            if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student')
                return [2 /*return*/];
            type = wafdeenQuranSelectedType || 'الجديد';
            if (wafdeenQuranHeardTypes[type])
                return [2 /*return*/, showMessage('wafdeen-save-msg', "\u062A\u0645 \u062D\u0641\u0638 ".concat(type, " \u0628\u0627\u0644\u0641\u0639\u0644 \u0627\u0644\u064A\u0648\u0645."), 'error')];
            if (wafdeenQuranTimerRunning)
                wafdeenQuranTick();
            if (Number(wafdeenQuranElapsedSeconds || 0) <= 0)
                return [2 /*return*/, showMessage('wafdeen-save-msg', "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0641\u0638 ".concat(type, " \u0642\u0628\u0644 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u00AB\u0628\u062F\u0621\u00BB \u0648\u0627\u062D\u062A\u0633\u0627\u0628 \u0648\u0642\u062A \u0641\u0639\u0644\u064A."), 'error')];
            return [2 /*return*/, wafdeenSaveGradeType(type)];
        });
    });
}
function wafdeenGuardedDailySave() {
    return __awaiter(this, arguments, void 0, function (forceAbsent) {
        var err_1;
        if (forceAbsent === void 0) { forceAbsent = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    if (!(typeof addWafdeenDailyGrade === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, addWafdeenDailyGrade(forceAbsent)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(typeof saveWafdeenDailyGrade === 'function')) return [3 /*break*/, 4];
                    return [4 /*yield*/, saveWafdeenDailyGrade(forceAbsent)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!(typeof addWafdeenGrade === 'function')) return [3 /*break*/, 6];
                    return [4 /*yield*/, addWafdeenGrade(forceAbsent)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: throw new Error('دالة حفظ الوافدين اليومية غير موجودة');
                case 7:
                    err_1 = _a.sent();
                    console.error('wafdeenGuardedDailySave error:', err_1);
                    if (typeof showToast === 'function') {
                        showToast(err_1.message || 'تعذر حفظ بيانات الوافد', 'error');
                    }
                    else if (typeof alert === 'function') {
                        alert(err_1.message || 'تعذر حفظ بيانات الوافد');
                    }
                    return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function saveWafdeenDailyRecord() {
    return __awaiter(this, arguments, void 0, function (isAbsent) {
        var sel, student, val, num, dateISO, d, existingToday, id, record, e_4, existingIndex;
        if (isAbsent === void 0) { isAbsent = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student')
                        return [2 /*return*/];
                    sel = document.getElementById('wafdeenStudentSelect');
                    if (!(sel === null || sel === void 0 ? void 0 : sel.value))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اختر الطالب أولاً', 'error')];
                    student = wafdeenStudentsData.find(function (x) { return String(x.id) === String(sel.value); });
                    if (!student)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'الطالب غير موجود', 'error')];
                    val = function (id) { var _a, _b; return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ''; };
                    num = function (id) { var n = Number(val(id)); return Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 0; };
                    dateISO = wafdeenSelectedDailyDateStr(), d = wafdeenSelectedDailyDateObj();
                    existingToday = wafdeenDailyRecords.find(function (r) {
                        return !r._deleted &&
                            String(r.studentId || '') === String(student.id) &&
                            String(r.dateISO || '').slice(0, 10) === dateISO;
                    });
                    if (existingToday) {
                        showMessage('wafdeen-save-msg', "\u26A0\uFE0F \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 ".concat(student.name, " \u0628\u0627\u0644\u0641\u0639\u0644 \u0627\u0644\u064A\u0648\u0645. \u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u062F\u0631\u062C\u0629 \u0645\u0646 \u0632\u0631 \u0627\u0644\u062D\u0641\u0638. \u0627\u0633\u062A\u062E\u062F\u0645 \u00AB\u062A\u0639\u062F\u064A\u0644\u00BB \u0623\u0648 \u00AB\u0645\u0633\u062D\u00BB \u0623\u0648\u0644\u0627\u064B."), 'error');
                        wafdeenUpdateDailySaveButton();
                        return [2 /*return*/];
                    }
                    id = "wafdeen_".concat(student.id, "_").concat(dateISO);
                    record = {
                        id: id,
                        teacherUsername: currentWafdeenTeacher.username, studentId: student.id, studentName: student.name,
                        dateISO: dateISO,
                        attendanceStatus: isAbsent ? 'absent' : 'present', isAbsent: !!isAbsent, status: isAbsent ? 'absent' : 'present',
                        dayName: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][d.getDay()],
                        newLesson: isAbsent ? 0 : num('wafdeenNewLesson'), newPagesCount: isAbsent ? '' : val('wafdeenNewPagesCount'), newTopicRecited: isAbsent ? '' : val('wafdeenNewTopicRecited'),
                        oldRevision: isAbsent ? 0 : num('wafdeenOldRevision'), oldPagesCount: isAbsent ? '' : val('wafdeenOldPagesCount'), oldTopicRecited: isAbsent ? '' : val('wafdeenOldTopicRecited'),
                        recitation: isAbsent ? 0 : num('wafdeenRecitation'), recitationPagesCount: isAbsent ? '' : val('wafdeenRecitationPagesCount'), recitationTopicRecited: isAbsent ? '' : val('wafdeenRecitationTopicRecited'),
                        newErrors: isAbsent ? 0 : wafdeenQuranErrorCounters['الجديد'].errors, newTashkeel: isAbsent ? 0 : wafdeenQuranErrorCounters['الجديد'].tashkeel, newRepetition: isAbsent ? 0 : wafdeenQuranErrorCounters['الجديد'].repetition,
                        oldErrors: isAbsent ? 0 : wafdeenQuranErrorCounters['الماضي'].errors, oldTashkeel: isAbsent ? 0 : wafdeenQuranErrorCounters['الماضي'].tashkeel, oldRepetition: isAbsent ? 0 : wafdeenQuranErrorCounters['الماضي'].repetition,
                        recitationErrors: isAbsent ? 0 : wafdeenQuranErrorCounters['التلاوة'].errors, recitationTashkeel: isAbsent ? 0 : wafdeenQuranErrorCounters['التلاوة'].tashkeel, recitationRepetition: isAbsent ? 0 : wafdeenQuranErrorCounters['التلاوة'].repetition,
                        savedAt: new Date().toISOString()
                    };
                    if (!useFirebase || !db)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'Supabase غير متصل — لم يتم اعتماد الرصد.', 'error')];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebaseWriteRecord_('wafdeenDailyRecords', record.id, __assign(__assign({}, record), { recordId: String(record.id), updatedAt: new Date().toISOString() }), { merge: true })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    console.error('Wafdeen daily Supabase save error:', e_4);
                    return [2 /*return*/, showMessage('wafdeen-save-msg', 'تعذر حفظ الرصد على Firebase — لم يتم اعتماد الحفظ.', 'error')];
                case 4:
                    existingIndex = wafdeenDailyRecords.findIndex(function (r) { return String(r.id) === String(record.id); });
                    if (existingIndex >= 0)
                        wafdeenDailyRecords[existingIndex] = record;
                    else
                        wafdeenDailyRecords.push(record);
                    wafdeenPersistLocal();
                    refreshWafdeenMainLog_();
                    wafdeenRenderGrades();
                    wafdeenUpdateDailySaveButton();
                    showMessage('wafdeen-save-msg', isAbsent ? "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u063A\u064A\u0627\u0628 ".concat(student.name, " \u0628\u0635\u0641\u0631 \u0641\u064A \u0643\u0644 \u0627\u0644\u062E\u0627\u0646\u0627\u062A \uD83D\uDEAB") : "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0631\u0635\u062F \u0627\u0644\u064A\u0648\u0645\u064A \u0644\u0644\u0637\u0627\u0644\u0628 ".concat(student.name, " \u0639\u0644\u0649 Firebase \u2705"), 'success');
                    wafdeenResetQuranCounters();
                    return [2 /*return*/];
            }
        });
    });
}
function wafdeenUpdateDailyScoresVisibility() {
    var _a;
    // لا نخفي نموذج الدرجات بعد وجود رصد سابق؛ إخفاؤه كان سببًا في اعتقاد المستخدم
    // أن باقي الخانات اختفت. النموذج يظل ظاهرًا ويمكن مراجعة/تعديل البيانات.
    var panel = document.getElementById('wafdeen-daily-scores-panel');
    var sel = document.getElementById('wafdeenStudentSelect');
    if (!panel || !sel)
        return;
    panel.classList.remove('hidden');
    var studentId = String(sel.value || '');
    var today = wafdeenSelectedDailyDateStr();
    var hasTodayRecord = studentId && wafdeenDailyRecords.some(function (r) { return String(r.studentId) === studentId && String(r.dateISO || '').slice(0, 10) === today; });
    var note = document.getElementById('wafdeen-existing-today-note');
    if (!note) {
        note = document.createElement('div');
        note.id = 'wafdeen-existing-today-note';
        note.className = 'wafdeen-note';
        panel.insertBefore(note, ((_a = panel.firstChild) === null || _a === void 0 ? void 0 : _a.nextSibling) || panel.firstChild);
    }
    note.textContent = hasTodayRecord ? 'يوجد رصد محفوظ لهذا الطالب اليوم. يمكنك مراجعة الخانات وتعديلها ثم الحفظ مرة أخرى.' : 'يمكنك إدخال جميع بيانات الرصد للطالب ثم حفظها.';
    note.classList.toggle('hidden', !studentId);
    wafdeenUpdateDailySaveButton();
}
function initWafdeenDailyDate() {
    var el = document.getElementById('wafdeenDailyDate');
    if (el && !el.value)
        el.value = wafdeenTodayDateStr();
}
function wafdeenDateKeyLocal(date) {
    if (date === void 0) { date = new Date(); }
    var d = new Date(date);
    return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'));
}
function wafdeenStartOfWeek(date) {
    if (date === void 0) { date = new Date(); }
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    var day = d.getDay();
    var diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
}
function wafdeenSumRecords(records) { return records.reduce(function (a, r) { return a + Number(r.total || 0); }, 0); }
function wafdeenToggleGradesStudents() {
    var list = document.getElementById('wafdeen-grades-students-list');
    var icon = document.getElementById('wafdeen-grades-students-icon');
    if (!list)
        return;
    var willOpen = list.classList.toggle('hidden') === false;
    if (icon)
        icon.textContent = willOpen ? '▲' : '▼';
    if (willOpen)
        wafdeenRenderGrades();
}
function wafdeenRenderGrades() {
    var list = document.getElementById('wafdeen-grades-students-list');
    if (!list)
        return;
    var students = __spreadArray([], __read(wafdeenStudentsData), false).sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'ar'); });
    list.innerHTML = '';
    students.forEach(function (st) { var b = document.createElement('button'); b.type = 'button'; b.className = 'wafdeen-grade-student-btn'; b.dataset.studentId = st.id; b.textContent = st.name; b.onclick = function () { return wafdeenShowStudentGrades(st.id); }; list.appendChild(b); });
    if (!students.length)
        list.innerHTML = '<div class="wafdeen-note">لا يوجد طلاب مسجلون.</div>';
}
function wafdeenCanManageGrades() {
    return (!!currentWafdeenTeacher && currentWafdeenTeacher.role !== 'student') || !!(currentTeacher && (String(currentTeacher.username || '').trim() === 'admin' || String(currentTeacher.assignedClass || '').trim() === 'الوافدين'));
}
function wafdeenGradeTable(records, title, layout) {
    if (layout === void 0) { layout = 'vertical'; }
    var sorted = __spreadArray([], __read(records), false).sort(function (a, b) { return String(b.dateISO || '').localeCompare(String(a.dateISO || '')); });
    if (!sorted.length)
        return "<div class=\"wafdeen-note\">\u0644\u0627 \u062A\u0648\u062C\u062F \u062F\u0631\u062C\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0641\u064A ".concat(title, ".</div>");
    var esc = function (v) { return String(v !== null && v !== void 0 ? v : '').replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); }); };
    var canManage = wafdeenCanManageGrades();
    var valueCell = function (value) {
        var missing = wafdeenIsMissingValue_(value);
        return missing ? "<span class=\"grade-missing\">\u0644\u0645 \u062A\u064F\u0633\u062C\u0644</span>" : "<span class=\"grade-value\">".concat(esc(value), "</span>");
    };
    var totalCell = function (r) { return "<strong class=\"grade-total\">".concat(Math.max(0, Math.min(30, Number(r.total) || 0)), "</strong> / 30"); };
    if (layout === 'horizontal') {
        var hasFifth = sorted.some(function (r) { return isFifthClass(r.className); });
        var head = hasFifth
            ? "<th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u062A\u0644\u0627\u0648\u0629</th><th>\u0645\u0642\u0631\u0631 \u0627\u0644\u062A\u0644\u0627\u0648\u0629 \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647</th><th>\u0635\u0641\u062D\u0627\u062A/\u0623\u062C\u0632\u0627\u0621 \u0627\u0644\u062A\u0644\u0627\u0648\u0629</th><th>\u0627\u0644\u0645\u062C\u0645\u0648\u0639 / 30</th>".concat(canManage ? '<th>الإجراءات</th>' : '')
            : "<th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u062C\u062F\u064A\u062F</th><th>\u0645\u0642\u0631\u0631 \u0627\u0644\u062C\u062F\u064A\u062F \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647</th><th>\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F</th><th>\u0627\u0644\u0645\u0627\u0636\u064A</th><th>\u0645\u0642\u0631\u0631 \u0627\u0644\u0645\u0627\u0636\u064A \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647</th><th>\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0627\u0636\u064A</th><th>\u0627\u0644\u062A\u0644\u0627\u0648\u0629</th><th>\u0645\u0642\u0631\u0631 \u0627\u0644\u062A\u0644\u0627\u0648\u0629 \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647</th><th>\u0635\u0641\u062D\u0627\u062A/\u0623\u062C\u0632\u0627\u0621 \u0627\u0644\u062A\u0644\u0627\u0648\u0629</th><th>\u0627\u0644\u0645\u062C\u0645\u0648\u0639 / 30</th>".concat(canManage ? '<th>الإجراءات</th>' : '');
        var body = sorted.map(function (r, i) {
            var fifth = isFifthClass(r.className);
            var recIsGeneric_ = r._wafdeenSrc === 'generic';
            var recEditFn_ = recIsGeneric_ ? 'editRecord' : 'window.wafdeenEditGrade';
            var recDelFn_ = recIsGeneric_ ? 'deleteRecord' : 'window.wafdeenDeleteGrade';
            var actions = canManage ? "<td><div class=\"grade-card-actions\" style=\"justify-content:center;flex-direction:column\"><button type=\"button\" class=\"action-btn btn-save\" onclick='".concat(recEditFn_, "(").concat(JSON.stringify(String(r.id)), ")'>\u270F\uFE0F \u062A\u0639\u062F\u064A\u0644</button><button type=\"button\" class=\"action-btn btn-danger\" onclick='").concat(recDelFn_, "(").concat(JSON.stringify(String(r.id)), ")'>\uD83D\uDDD1\uFE0F \u0645\u0633\u062D</button></div></td>") : '';
            if (fifth)
                return "<tr><td>".concat(esc(String(r.dateISO || '').slice(0, 10)), "</td><td>").concat(valueCell(r.recitation), "</td><td>").concat(valueCell(r.recitationTopicRecited), "</td><td>").concat(valueCell(r.recitationPagesCount), "</td><td>").concat(totalCell(r), "</td>").concat(actions, "</tr>");
            return "<tr><td>".concat(esc(String(r.dateISO || '').slice(0, 10)), "</td><td>").concat(valueCell(r.newLesson), "</td><td>").concat(valueCell(r.newTopicRecited), "</td><td>").concat(valueCell(r.newPagesCount), "</td><td>").concat(valueCell(r.oldRevision), "</td><td>").concat(valueCell(r.oldTopicRecited), "</td><td>").concat(valueCell(r.oldPagesCount), "</td><td>").concat(valueCell(r.recitation), "</td><td>").concat(valueCell(r.recitationTopicRecited), "</td><td>").concat(valueCell(r.recitationPagesCount), "</td><td>").concat(totalCell(r), "</td>").concat(actions, "</tr>");
        }).join('');
        var exportTableId = title === 'الأسبوع' ? 'wafdeenGradeWeekTable' : (title === 'الشهر' ? 'wafdeenGradeMonthTable' : 'wafdeenGradeHorizontalTable');
        return "<div class=\"card-view wafdeen-horizontal-grades\"><h4 class=\"card-title\">\uD83D\uDCCA \u0631\u0635\u062F ".concat(esc(title), "</h4><div class=\"table-responsive wafdeen-horizontal-scroll\"><table id=\"").concat(exportTableId, "\" class=\"wafdeen-horizontal-grade-table\"><thead><tr>").concat(head, "</tr></thead><tbody>").concat(body, "</tbody></table></div></div>");
    }
    return sorted.map(function (r, i) {
        var fifth = isFifthClass(r.className);
        var rows = [];
        rows.push(['التاريخ', esc(String(r.dateISO || '').slice(0, 10))]);
        if (!fifth) {
            rows.push(['الجديد', valueCell(r.newLesson)]);
            rows.push(['مقرر الجديد الذي تم تسميعه', valueCell(r.newTopicRecited)]);
            rows.push(['صفحات الجديد', valueCell(r.newPagesCount)]);
            rows.push(['الماضي', valueCell(r.oldRevision)]);
            rows.push(['مقرر الماضي الذي تم تسميعه', valueCell(r.oldTopicRecited)]);
            rows.push(['صفحات الماضي', valueCell(r.oldPagesCount)]);
        }
        rows.push(['التلاوة', valueCell(r.recitation)]);
        rows.push(['مقرر التلاوة الذي تم تسميعه', valueCell(r.recitationTopicRecited)]);
        rows.push(['صفحات/أجزاء التلاوة', valueCell(r.recitationPagesCount)]);
        rows.push(['المجموع من 30', totalCell(r)]);
        var recIsGeneric_ = r._wafdeenSrc === 'generic';
        var recEditFn_ = recIsGeneric_ ? 'editRecord' : 'window.wafdeenEditGrade';
        var recDelFn_ = recIsGeneric_ ? 'deleteRecord' : 'window.wafdeenDeleteGrade';
        var actions = canManage ? "<div class=\"grade-card-actions\"><button type=\"button\" class=\"action-btn btn-save\" onclick='".concat(recEditFn_, "(").concat(JSON.stringify(String(r.id)), ")'>\u270F\uFE0F \u062A\u0639\u062F\u064A\u0644</button><button type=\"button\" class=\"action-btn btn-danger\" onclick='").concat(recDelFn_, "(").concat(JSON.stringify(String(r.id)), ")'>\uD83D\uDDD1\uFE0F \u0645\u0633\u062D</button></div>") : '';
        return "<article class=\"wafdeen-grade-record-card\"><div class=\"grade-record-head\"><strong>\u0631\u0635\u062F ".concat(i + 1, "</strong><span>").concat(esc(r.dayName || ''), " \u2014 ").concat(esc(String(r.dateISO || '').slice(0, 10)), "</span></div><div class=\"grade-record-fields\">").concat(rows.map(function (_a) {
            var _b = __read(_a, 2), label = _b[0], val = _b[1];
            return "<div class=\"grade-record-row\"><span class=\"grade-record-label\">".concat(label, "</span><span class=\"grade-record-value\">").concat(val, "</span></div>");
        }).join(''), "</div>").concat(actions, "</article>");
    }).join('');
}
function wafdeenExportGradePeriod(period) {
    var _a;
    var tableId = period === 'week' ? 'wafdeenGradeWeekTable' : 'wafdeenGradeMonthTable';
    var studentName = ((_a = document.getElementById('wafdeen-grades-student-name')) === null || _a === void 0 ? void 0 : _a.textContent) || 'الطالب';
    var title = period === 'week' ? 'درجات_الأسبوع' : 'درجات_الشهر';
    var table = document.getElementById(tableId);
    if (!table) {
        showMessage('wafdeen-save-msg', 'لا توجد درجات مسجلة للتصدير في ' + (period === 'week' ? 'الأسبوع' : 'الشهر'), 'error');
        return;
    }
    exportToExcel(tableId, "".concat(title, "_").concat(studentName));
}
function wafdeenImportGradePeriodExcel(event) {
    return __awaiter(this, void 0, void 0, function () {
        var file, studentId_1, student_1, rows, normalizeKey_1, get_1, num_1, cleanText_1, dateFromRow, imported, _loop_1, rows_1, rows_1_1, r, err_2;
        var e_5, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    file = (_b = event.target.files) === null || _b === void 0 ? void 0 : _b[0];
                    if (!file)
                        return [2 /*return*/];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, 6, 7]);
                    studentId_1 = wafdeenCurrentGradeStudentId || ((_c = document.getElementById('wafdeenStudentSelect')) === null || _c === void 0 ? void 0 : _c.value);
                    if (!studentId_1)
                        throw new Error('اختر الطالب أولاً من قائمة الدرجات');
                    student_1 = wafdeenStudentsData.find(function (s) { return String(s.id) === String(studentId_1); });
                    if (!student_1)
                        throw new Error('الطالب غير موجود');
                    return [4 /*yield*/, readExcelFile(file)];
                case 2:
                    rows = _d.sent();
                    if (!rows.length)
                        throw new Error('ملف الإكسل فارغ');
                    normalizeKey_1 = function (v) { return String(v !== null && v !== void 0 ? v : '').trim().replace(/\s+/g, ' ').replace(/ي/g, 'ى'); };
                    get_1 = function (row, names) {
                        var keys = Object.keys(row);
                        var wanted = names.map(normalizeKey_1);
                        var key = keys.find(function (k) { return wanted.includes(normalizeKey_1(k)); });
                        return key === undefined ? '' : row[key];
                    };
                    num_1 = function (v) {
                        if (v === null || v === undefined || v === '')
                            return '';
                        var n = Number(String(v).replace(',', '.').replace(/[^0-9.\-]/g, ''));
                        return Number.isFinite(n) ? n : '';
                    };
                    cleanText_1 = function (v) { return String(v !== null && v !== void 0 ? v : '').trim(); };
                    dateFromRow = function (r) {
                        var v = get_1(r, ['التاريخ', 'date']);
                        if (v instanceof Date)
                            return wafdeenDateKeyLocal(v);
                        if (typeof v === 'number' && v > 20000) {
                            var d = new Date(Math.round((v - 25569) * 86400 * 1000));
                            return wafdeenDateKeyLocal(d);
                        }
                        v = cleanText_1(v);
                        var m = v.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
                        return m ? "".concat(m[1], "-").concat(String(m[2]).padStart(2, '0'), "-").concat(String(m[3]).padStart(2, '0')) : '';
                    };
                    imported = [];
                    _loop_1 = function (r) {
                        var dateISO = dateFromRow(r);
                        if (!dateISO)
                            return "continue";
                        var existing = wafdeenDailyRecords.find(function (x) { return !x._deleted && String(x.studentId || '') === String(student_1.id) && String(x.dateISO || '').slice(0, 10) === dateISO; });
                        var rec = existing || {
                            id: "wafdeen_".concat(student_1.id, "_").concat(dateISO), teacherUsername: (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.username) || '', studentId: student_1.id, studentName: student_1.name,
                            dateISO: dateISO,
                            attendanceStatus: 'present', isAbsent: false, status: 'present', dayName: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][new Date(dateISO + 'T12:00:00').getDay()],
                            newLesson: '', newPagesCount: '', newTopicRecited: '', oldRevision: '', oldPagesCount: '', oldTopicRecited: '', recitation: '', recitationPagesCount: '', recitationTopicRecited: ''
                        };
                        var setIfPresent = function (prop, names, asNum) {
                            if (asNum === void 0) { asNum = false; }
                            var v = get_1(r, names);
                            if (v !== '' && v !== null && v !== undefined)
                                rec[prop] = asNum ? num_1(v) : cleanText_1(v);
                        };
                        setIfPresent('newLesson', ['الجديد']);
                        setIfPresent('newTopicRecited', ['مقرر الجديد الذي تم تسميعه', 'مقرر الجديد']);
                        setIfPresent('newPagesCount', ['صفحات الجديد', 'عدد صفحات الجديد']);
                        setIfPresent('oldRevision', ['الماضي']);
                        setIfPresent('oldTopicRecited', ['مقرر الماضي الذي تم تسميعه', 'مقرر الماضي']);
                        setIfPresent('oldPagesCount', ['صفحات الماضي', 'عدد صفحات الماضي']);
                        setIfPresent('recitation', ['التلاوة']);
                        setIfPresent('recitationTopicRecited', ['مقرر التلاوة الذي تم تسميعه', 'مقرر التلاوة']);
                        setIfPresent('recitationPagesCount', ['صفحات/أجزاء التلاوة', 'صفحات التلاوة', 'عدد صفحات التلاوة']);
                        var total = num_1(get_1(r, ['المجموع / 30', 'المجموع من 30', 'المجموع']));
                        if (total !== '')
                            rec.total = total;
                        if (rec.total == null || rec.total === '')
                            rec.total = ['newLesson', 'oldRevision', 'recitation'].reduce(function (a, k) { return a + (rec[k] === '' ? 0 : Number(rec[k]) || 0); }, 0);
                        rec.updatedAt = new Date().toISOString();
                        if (!existing)
                            wafdeenDailyRecords.push(rec);
                        imported.push(rec);
                    };
                    try {
                        for (rows_1 = __values(rows), rows_1_1 = rows_1.next(); !rows_1_1.done; rows_1_1 = rows_1.next()) {
                            r = rows_1_1.value;
                            _loop_1(r);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) _a.call(rows_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    if (!imported.length)
                        throw new Error('لم أجد صفوفًا صالحة. تأكد أن الملف صادر من درجات الأسبوع أو الشهر في الموقع.');
                    memoryStorage.setItem('wafdeenDailyRecords', JSON.stringify(wafdeenDailyRecords));
                    if (!(useFirebase && db)) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.all(imported.map(function (r) { return db.collection('wafdeenDailyRecords').doc(String(r.id)).set(__assign(__assign({}, r), { updatedAt: new Date().toISOString() }), { merge: true }).catch(function (e) { return console.error(e); }); }))];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    wafdeenShowStudentGrades(student_1.id);
                    showMessage('wafdeen-save-msg', "\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F ".concat(imported.length, " \u0631\u0635\u062F \u0644\u0644\u0637\u0627\u0644\u0628 ").concat(student_1.name, " \u0645\u0646 \u0645\u0644\u0641 Excel \u0648\u0638\u0647\u0631\u062A \u0641\u064A \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0646\u062C\u0627\u062D \u2705"), 'success');
                    return [3 /*break*/, 7];
                case 5:
                    err_2 = _d.sent();
                    console.error(err_2);
                    showMessage('wafdeen-save-msg', err_2.message || 'حدث خطأ أثناء استيراد ملف Excel', 'error');
                    return [3 /*break*/, 7];
                case 6:
                    event.target.value = '';
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function wafdeenShowGradePeriod(period, btn) {
    document.querySelectorAll('.wafdeen-grade-period-btn').forEach(function (b) { return b.classList.remove('active'); });
    if (btn)
        btn.classList.add('active');
    ['today', 'week', 'month'].forEach(function (p) { var _a; return (_a = document.getElementById('wafdeen-grade-' + p)) === null || _a === void 0 ? void 0 : _a.classList.toggle('hidden', p !== period); });
}
var wafdeenCurrentGradeStudentId = null;
function wafdeenShowStudentGrades(studentId) {
    var st = wafdeenStudentsData.find(function (x) { return String(x.id) === String(studentId); });
    if (!st)
        return;
    document.querySelectorAll('.wafdeen-grade-student-btn').forEach(function (b) { return b.classList.toggle('active', String(b.dataset.studentId) === String(studentId)); });
    wafdeenCurrentGradeStudentId = studentId;
    document.getElementById('wafdeen-grades-details').classList.remove('hidden');
    document.getElementById('wafdeen-grades-student-name').textContent = st.name;
    var now = new Date(), today = wafdeenDateKeyLocal(now), weekStart = wafdeenStartOfWeek(now), weekStartKey = wafdeenDateKeyLocal(weekStart), monthPrefix = "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'));
    var recs = (typeof wafdeenMainLogRecords_ === 'function' ? wafdeenMainLogRecords_() : wafdeenDailyRecords).filter(function (r) { return String(r.studentId || '') === String(studentId) || String(r.studentName || '') === String(st.name); });
    var todayRecs = recs.filter(function (r) { return String(r.dateISO || '').slice(0, 10) === today; });
    var weekRecs = recs.filter(function (r) { var k = String(r.dateISO || '').slice(0, 10); return k >= weekStartKey && k <= today; });
    var monthRecs = recs.filter(function (r) { return String(r.dateISO || '').slice(0, 7) === monthPrefix; });
    document.getElementById('wafdeen-grade-today').innerHTML = wafdeenGradeTable(todayRecs, 'اليوم');
    document.getElementById('wafdeen-grade-week').innerHTML = wafdeenGradeTable(weekRecs, 'الأسبوع', 'horizontal');
    document.getElementById('wafdeen-grade-month').innerHTML = wafdeenGradeTable(monthRecs, 'الشهر', 'horizontal');
    wafdeenShowGradePeriod('today', document.querySelector('.wafdeen-grade-period-btn'));
    document.getElementById('wafdeen-grades-details').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function wafdeenFindFirebaseRef_(id){
  if(typeof db==='undefined'||!db||!db.collection) throw new Error('Supabase غير متصل');
  var key=String(id||'').trim(), col=db.collection('wafdeenDailyRecords');
  var direct=await col.doc(key).get(); if(direct.exists) return direct.ref;
  try{var q=await col.where('id','==',key).get();if(!q.empty)return q.docs[0].ref;}catch(e){}
  try{var q2=await col.where('recordId','==',key).get();if(!q2.empty)return q2.docs[0].ref;}catch(e){}
  throw new Error('السجل غير موجود في Supabase');
}
async function wafdeenEditGrade(recordId){
  if(!wafdeenCanManageGrades()){showMessage('wafdeen-save-msg','التعديل غير متاح لهذا الحساب','error');return false;}
  var id=String(recordId||''), r=(wafdeenDailyRecords||[]).find(function(x){return String(x.id||x.recordId||String(x.studentId||'')+'_'+String(x.dateISO||''))===id;});
  if(!r){showMessage('wafdeen-save-msg','الرصد غير موجود','error');return false;}
  try{
    var n=prompt('درجة الجديد من 10:',String(r.newLesson==null?0:r.newLesson));if(n===null)return false;
    var o=prompt('درجة الماضي من 10:',String(r.oldRevision==null?0:r.oldRevision));if(o===null)return false;
    var q=prompt('درجة التلاوة من 10:',String(r.recitation==null?0:r.recitation));if(q===null)return false;
    var grade=function(v){return Math.max(0,Math.min(10,Number(v)||0));};
    var changes={newLesson:grade(n),oldRevision:grade(o),recitation:grade(q)};changes.total=changes.newLesson+changes.oldRevision+changes.recitation;changes.editedAt=new Date().toISOString();changes.editedBy=(currentWafdeenTeacher&&currentWafdeenTeacher.username)||((currentTeacher&&currentTeacher.username)||'');
    var ref=await wafdeenFindFirebaseRef_(id);await ref.update(Object.assign({},changes,{updatedAt:new Date().toISOString()}));
    var snap=await ref.get();if(!snap.exists)throw new Error('لم يتم العثور على السجل بعد التعديل');
    var saved=Object.assign({},snap.data()||{}, {id:String((snap.data()||{}).id||snap.id)});
    var ix=wafdeenDailyRecords.findIndex(function(x){return String(x.id)===id;});if(ix>-1)wafdeenDailyRecords[ix]=Object.assign({},wafdeenDailyRecords[ix],saved);else wafdeenDailyRecords.push(saved);
    try{wafdeenPersistLocal();}catch(e){};try{if(typeof refreshWafdeenLogAfterSave_==='function')refreshWafdeenLogAfterSave_();else if(typeof renderDailyTable==='function')renderDailyTable();}catch(e){}
    showMessage('wafdeen-save-msg','تم تعديل الرصد بنجاح ✅','success');return true;
  }catch(e){console.error('wafdeenEditGrade error:',e);showMessage('wafdeen-save-msg','تعذر تعديل الرصد: '+(e.message||e),'error');return false;}
}
window.wafdeenEditGrade=wafdeenEditGrade;
async function wafdeenDeleteGrade(recordId){
  if(!wafdeenCanManageGrades()){showMessage('wafdeen-save-msg','المسح غير متاح لهذا الحساب','error');return false;}
  var id=String(recordId||''), records=wafdeenDailyRecords||[], r=records.find(function(x){return String(x.id||x.recordId||String(x.studentId||'')+'_'+String(x.dateISO||''))===id;});
  if(!r){showMessage('wafdeen-save-msg','الرصد غير موجود','error');return false;}
  if(!confirm('هل تريد مسح هذا الرصد نهائياً؟'))return false;
  try{
    var ref=await wafdeenFindFirebaseRef_(id);await ref.delete();
    wafdeenDailyRecords=records.filter(function(x){return String(x.id)!==id;});
    try{wafdeenPersistLocal();}catch(e){};try{if(typeof refreshWafdeenLogAfterSave_==='function')refreshWafdeenLogAfterSave_();else if(typeof renderDailyTable==='function')renderDailyTable();}catch(e){}
    if(wafdeenCurrentGradeStudentId)try{wafdeenShowStudentGrades(wafdeenCurrentGradeStudentId);}catch(e){}
    showMessage('wafdeen-save-msg','تم حذف الرصد بنجاح ✅','success');return true;
  }catch(e){console.error('wafdeenDeleteGrade error:',e);showMessage('wafdeen-save-msg','تعذر حذف الرصد: '+(e.message||e),'error');return false;}
}
window.wafdeenDeleteGrade=wafdeenDeleteGrade;

function wafdeenToggleEducationTimeStudents() {
    var list = document.getElementById('wafdeen-education-time-students-list'), icon = document.getElementById('wafdeen-education-time-students-icon');
    if (!list)
        return;
    var open = list.classList.toggle('hidden') === false;
    if (icon)
        icon.textContent = open ? '▲' : '▼';
    if (open)
        wafdeenRenderEducationTime();
}
function wafdeenEducationTimeTable(records, title) {
    var sorted = __spreadArray([], __read(records), false).sort(function (a, b) { return String(b.dateISO || '').localeCompare(String(a.dateISO || '')); });
    if (!sorted.length)
        return "<div class=\"wafdeen-note\">\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0642\u062A \u062A\u0639\u0644\u064A\u0645 \u0645\u0633\u062C\u0644 \u0641\u064A ".concat(title, ".</div>");
    var esc = function (v) { return String(v !== null && v !== void 0 ? v : '').replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); }); };
    var total = sorted.reduce(function (a, r) { return a + Number(r.seconds || 0); }, 0);
    return "<div class=\"card-view\" style=\"margin-bottom:0\"><h4 class=\"card-title\">\u23F1\uFE0F \u0648\u0642\u062A \u0627\u0644\u062A\u0639\u0644\u064A\u0645 ".concat(title, " \u2014 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A ").concat(wafdeenFormat(total), "</h4><div class=\"table-responsive\"><table><thead><tr><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u0645\u0627\u062F\u0629</th><th>\u0648\u0642\u062A \u0627\u0644\u062A\u0639\u0644\u064A\u0645</th></tr></thead><tbody>").concat(sorted.map(function (r) { return "<tr><td>".concat(esc(String(r.dateISO || '').slice(0, 10)), "</td><td>").concat(esc(r.subject), "</td><td>").concat(wafdeenFormat(Number(r.seconds || 0)), "</td></tr>"); }).join(''), "</tbody></table></div></div>");
}
function wafdeenShowEducationTimePeriod(period, btn) {
    var root = document.getElementById('wafdeen-panel-educationTime');
    root === null || root === void 0 ? void 0 : root.querySelectorAll('.wafdeen-grade-period-btn').forEach(function (b) { return b.classList.remove('active'); });
    if (btn)
        btn.classList.add('active');
    ['today', 'week', 'month'].forEach(function (p) { var _a; return (_a = document.getElementById('wafdeen-education-time-' + p)) === null || _a === void 0 ? void 0 : _a.classList.toggle('hidden', p !== period); });
}
function wafdeenRenderEducationTime() {
    var list = document.getElementById('wafdeen-education-time-students-list');
    if (!list)
        return;
    var students = __spreadArray([], __read(wafdeenStudentsData), false).sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'ar'); });
    list.innerHTML = '';
    students.forEach(function (st) { var b = document.createElement('button'); b.type = 'button'; b.className = 'wafdeen-grade-student-btn'; b.dataset.studentId = st.id; b.textContent = st.name; b.onclick = function () { return wafdeenShowStudentEducationTime(st.id); }; list.appendChild(b); });
    if (!students.length)
        list.innerHTML = '<div class="wafdeen-note">لا يوجد طلاب مسجلون.</div>';
}
function wafdeenShowStudentEducationTime(studentId) {
    var st = wafdeenStudentsData.find(function (x) { return String(x.id) === String(studentId); });
    if (!st)
        return;
    document.getElementById('wafdeen-education-time-details').classList.remove('hidden');
    document.getElementById('wafdeen-education-time-student-name').textContent = st.name;
    var now = new Date(), today = wafdeenDateKeyLocal(now), weekStartKey = wafdeenDateKeyLocal(wafdeenStartOfWeek(now)), monthPrefix = "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'));
    var recs = wafdeenUsageData.filter(function (r) { return r.category === 'educational' && String(r.studentId) === String(studentId); });
    var todayRecs = recs.filter(function (r) { return String(r.dateISO || '').slice(0, 10) === today; }), weekRecs = recs.filter(function (r) { var k = String(r.dateISO || '').slice(0, 10); return k >= weekStartKey && k <= today; }), monthRecs = recs.filter(function (r) { return String(r.dateISO || '').slice(0, 7) === monthPrefix; });
    document.getElementById('wafdeen-education-time-today').innerHTML = wafdeenEducationTimeTable(todayRecs, 'اليوم');
    document.getElementById('wafdeen-education-time-week').innerHTML = wafdeenEducationTimeTable(weekRecs, 'الأسبوع');
    document.getElementById('wafdeen-education-time-month').innerHTML = wafdeenEducationTimeTable(monthRecs, 'الشهر');
    wafdeenShowEducationTimePeriod('today', document.querySelector('#wafdeen-panel-educationTime .wafdeen-grade-period-btn'));
}
function markWafdeenAbsent() {
    if (wafdeenHasTodayRecordForSelectedStudent()) {
        var sel_1 = document.getElementById('wafdeenStudentSelect');
        var student = wafdeenStudentsData.find(function (x) { return String(x.id) === String((sel_1 === null || sel_1 === void 0 ? void 0 : sel_1.value) || ''); });
        wafdeenUpdateDailySaveButton();
        return showMessage('wafdeen-save-msg', "\u26A0\uFE0F \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 ".concat((student === null || student === void 0 ? void 0 : student.name) || '', " \u0628\u0627\u0644\u0641\u0639\u0644 \u0627\u0644\u064A\u0648\u0645. \u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644\u0647 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649\u060C \u0648\u0627\u0644\u062F\u0631\u062C\u0629 \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0644\u0646 \u062A\u062A\u063A\u064A\u0631. \u0627\u0633\u062A\u062E\u062F\u0645 \u00AB\u062A\u0639\u062F\u064A\u0644\u00BB \u0623\u0648 \u00AB\u0645\u0633\u062D\u00BB \u0623\u0648\u0644\u0627\u064B."), 'error');
    }
    wafdeenResetQuranCounters();
    saveWafdeenDailyRecord(true);
}
// توافق مع أي استدعاءات قديمة
function wafdeenResetTimer() { wafdeenQuranReset(); wafdeenEduReset(); }
function toggleWafdeenMenu() { document.getElementById('wafdeen-drawer').classList.toggle('open'); document.getElementById('wafdeen-menu-overlay').classList.toggle('open'); }
function closeWafdeenMenu() { document.getElementById('wafdeen-drawer').classList.remove('open'); document.getElementById('wafdeen-menu-overlay').classList.remove('open'); }
function toggleWafdeenQuranMonitor() {
    var content = document.getElementById('wafdeen-quran-monitor-content');
    var icon = document.getElementById('wafdeen-quran-toggle-icon');
    if (!content)
        return;
    var open = content.classList.toggle('hidden') === false;
    var btn = content.previousElementSibling;
    if (btn)
        btn.setAttribute('aria-expanded', String(open));
    if (icon)
        icon.textContent = open ? '▲' : '▼';
}
function toggleWafdeenEducationalMonitor() {
    var content = document.getElementById('wafdeen-edu-monitor-content');
    var btn = document.querySelector('.wafdeen-edu-toggle');
    var icon = document.getElementById('wafdeen-edu-toggle-icon');
    if (!content)
        return;
    var open = content.classList.toggle('hidden') === false;
    if (btn)
        btn.setAttribute('aria-expanded', String(open));
    if (icon)
        icon.textContent = open ? '▲' : '▼';
}
function wafdeenRenderCloudReview() {
    return __awaiter(this, void 0, void 0, function () {
        var msg, body, snap, rows, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    msg = document.getElementById('wafdeen-cloud-review-msg');
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin)) {
                        showMessage('wafdeen-cloud-review-msg', 'هذه الصفحة متاحة للمدير فقط', 'error');
                        return [2 /*return*/];
                    }
                    if (!useFirebase || !db) {
                        showMessage('wafdeen-cloud-review-msg', 'Supabase غير متصل؛ لا يمكن مراجعة بيانات السحابة الآن', 'error');
                        return [2 /*return*/];
                    }
                    body = document.querySelector('#wafdeenCloudReviewTable tbody');
                    if (!body)
                        return [2 /*return*/];
                    body.innerHTML = '<tr><td colspan="5">جاري تحميل بيانات السحابة...</td></tr>';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.collection('wafdeenStudents').get()];
                case 2:
                    snap = _a.sent();
                    rows = snap.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); }).filter(function (x) { return !x._deleted; });
                    body.innerHTML = rows.length ? rows.map(function (x) { return "\n      <tr>\n        <td><input type=\"checkbox\" class=\"wafdeen-cloud-select\" data-id=\"".concat(String(x.id).replace(/"/g, '&quot;'), "\"></td>\n        <td>").concat(String(x.name || x.studentName || 'بدون اسم').replace(/</g, '&lt;'), "</td>\n        <td style=\"font-size:.75em\">").concat(String(x.id).replace(/</g, '&lt;'), "</td>\n        <td>").concat(x.updatedAt ? new Date(x.updatedAt).toLocaleString('ar-EG') : '—', "</td>\n        <td><button type=\"button\" class=\"action-btn btn-danger\" onclick=\"wafdeenDeleteCloudStudent('").concat(String(x.id).replace(/'/g, "\\'"), "')\">\u062D\u0630\u0641</button></td>\n      </tr>"); }).join('') : '<tr><td colspan="5">لا توجد أسماء في السحابة</td></tr>';
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _a.sent();
                    body.innerHTML = '<tr><td colspan="5">تعذر قراءة السحابة</td></tr>';
                    console.error(e_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function wafdeenDeleteCloudStudent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin) || !useFirebase || !db)
                        return [2 /*return*/];
                    if (!confirm('هل تريد حذف هذا الاسم من السحابة؟'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteFirebaseRecord('wafdeenStudents', String(id))];
                case 2:
                    _a.sent();
                    wafdeenStudentsData = (wafdeenStudentsData || []).filter(function (x) { return String(x.id) !== String(id); });
                    wafdeenPersistLocal();
                    wafdeenRenderCloudReview();
                    wafdeenRenderStudentsTable();
                    showMessage('wafdeen-cloud-review-msg', 'تم حذف الاسم من السحابة', 'success');
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _a.sent();
                    showMessage('wafdeen-cloud-review-msg', 'فشل الحذف: ' + (e_7.message || e_7), 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function wafdeenDeleteSelectedCloudDuplicates() {
    return __awaiter(this, void 0, void 0, function () {
        var ids, ids_1, ids_1_1, id, e_8_1;
        var e_8, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ids = __spreadArray([], __read(document.querySelectorAll('.wafdeen-cloud-select:checked')), false).map(function (x) { return x.dataset.id; });
                    if (!ids.length)
                        return [2 /*return*/, showMessage('wafdeen-cloud-review-msg', 'حدد الأسماء المراد حذفها أولًا', 'info')];
                    if (!confirm('سيتم حذف الأسماء المحددة نهائيًا من السحابة. هل تتابع؟'))
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    ids_1 = __values(ids), ids_1_1 = ids_1.next();
                    _b.label = 2;
                case 2:
                    if (!!ids_1_1.done) return [3 /*break*/, 5];
                    id = ids_1_1.value;
                    return [4 /*yield*/, wafdeenDeleteCloudStudent(id)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    ids_1_1 = ids_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_8_1 = _b.sent();
                    e_8 = { error: e_8_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function wafdeenShowPanel(name) {
    var allowed = ['daily', 'materials', 'grades', 'educationTime', 'cloudReview'];
    if (!allowed.includes(name) && !(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
        return;
    ['daily', 'materials', 'grades', 'educationTime', 'cloudReview', 'teachers', 'students', 'report'].forEach(function (n) { var el = document.getElementById('wafdeen-panel-' + n); if (el)
        el.classList.toggle('hidden', n !== name); });
    closeWafdeenMenu();
    if (name === 'grades') {
        wafdeenRenderGrades();
    }
    if (name === 'educationTime') {
        wafdeenRenderEducationTime();
    }
    if (name === 'report')
        wafdeenReportPanelInit();
    if (name === 'cloudReview')
        wafdeenRenderCloudReview();
    if (name === 'teachers')
        wafdeenRenderTeachersTable();
    if (name === 'students')
        wafdeenRenderStudentsTable();
    if (name === 'materials')
        wafdeenRenderMaterials();
}
/* -------- إدارة المعلمين والطلاب -------- */
function addWafdeenTeacher() {
    return __awaiter(this, void 0, void 0, function () {
        var u, p, t, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/];
                    u = document.getElementById('wafdeenNewTeacherUser').value.trim(), p = document.getElementById('wafdeenNewTeacherPass').value.trim();
                    if (!u || !p)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اكتب اسم المستخدم وكلمة المرور', 'error')];
                    if (u === 'admin')
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اسم admin محجوز للإدارة', 'error')];
                    if (wafdeenTeachersData.some(function (t) { return t.username === u; }) || wafdeenStudentsData.some(function (s) { return s.username === u; }))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اسم المستخدم موجود بالفعل', 'error')];
                    t = { id: Date.now().toString(), username: u, password: p };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!useFirebase) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.collection('wafdeenTeachers').doc(t.id).set(t)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    wafdeenTeachersData.push(t);
                    wafdeenPersistLocal();
                    _a.label = 4;
                case 4:
                    document.getElementById('wafdeenNewTeacherUser').value = '';
                    document.getElementById('wafdeenNewTeacherPass').value = '';
                    wafdeenRenderTeachersTable();
                    showMessage('wafdeen-save-msg', 'تم إضافة المعلم بنجاح', 'success');
                    return [3 /*break*/, 6];
                case 5:
                    e_9 = _a.sent();
                    showMessage('wafdeen-save-msg', 'تعذر حفظ المعلم على السحابة', 'error');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteWafdeenTeacher(id) {
    return __awaiter(this, void 0, void 0, function () { var e_10; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!useFirebase || !db) throw new Error('Supabase غير متصل');
                return [4 /*yield*/, deleteFirebaseRecord('wafdeenTeachers', String(id))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                wafdeenTeachersData = wafdeenTeachersData.filter(function (t) { return String(t.id) !== String(id); });
                wafdeenPersistLocal();
                _a.label = 4;
            case 4:
                wafdeenRenderTeachersTable();
                return [3 /*break*/, 6];
            case 5:
                e_10 = _a.sent();
                showMessage('wafdeen-save-msg', 'تعذر حذف المعلم', 'error');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    }); });
}
function wafdeenRenderTeachersTable() { var tb = document.querySelector('#wafdeenTeachersTable tbody'); if (!tb)
    return; tb.innerHTML = wafdeenTeachersData.map(function (t) { return "<tr><td>".concat(t.username, "</td><td><button type=\"button\" class=\"action-btn\" onclick=\"deleteWafdeenTeacher('").concat(t.id, "')\">\u062D\u0630\u0641</button></td></tr>"); }).join('') || '<tr><td colspan="2">لا يوجد معلمون إضافيون</td></tr>'; }
function addWafdeenStudent() {
    return __awaiter(this, void 0, void 0, function () {
        var nameEl, passEl, n, p, norm, nn, s, e_11, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'هذه العملية متاحة للمدير فقط', 'error')];
                    nameEl = document.getElementById('wafdeenNewStudentName');
                    passEl = document.getElementById('wafdeenNewStudentPass');
                    n = ((nameEl === null || nameEl === void 0 ? void 0 : nameEl.value) || '').trim(), p = ((passEl === null || passEl === void 0 ? void 0 : passEl.value) || '').trim();
                    if (!n || !p)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اكتب اسم الطالب وكلمة المرور', 'error')];
                    norm = function (x) { return String(x || '').trim().toLowerCase(); }, nn = norm(n);
                    if (wafdeenStudentsData.some(function (s) { return norm(s.name) === nn; }))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اسم الطالب موجود بالفعل', 'error')];
                    s = { id: 'wf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8), name: n, password: p, createdAt: new Date().toISOString() };
                    wafdeenStudentsData = __spreadArray(__spreadArray([], __read(wafdeenStudentsData), false), [s], false);
                    wafdeenPersistLocal();
                    wafdeenRenderStudentSelect();
                    wafdeenRenderStudentsTable();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!(useFirebase && db)) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.collection('wafdeenStudents').doc(String(s.id)).set(s, { merge: true })];
                case 2:
                    _a.sent();
                    showMessage('wafdeen-save-msg', 'تم إضافة الطالب وحفظه في السحابة بنجاح ✅', 'success');
                    return [3 /*break*/, 4];
                case 3:
                    showMessage('wafdeen-save-msg', 'تم إضافة الطالب وحفظه على هذا الجهاز ✅', 'success');
                    _a.label = 4;
                case 4:
                    if (nameEl)
                        nameEl.value = '';
                    if (passEl)
                        passEl.value = '';
                    return [3 /*break*/, 6];
                case 5:
                    e_11 = _a.sent();
                    console.error('Wafdeen student save error:', e_11);
                    msg = String((e_11 === null || e_11 === void 0 ? void 0 : e_11.message) || e_11 || '');
                    showMessage('wafdeen-save-msg', /permission|denied|insufficient/i.test(msg) ? 'تمت إضافة الطالب على هذا الجهاز، لكن Firebase رفض الحفظ. راجع صلاحيات Firestore.' : 'تمت إضافة الطالب محليًا، لكن تعذر الحفظ السحابي. جرّب مرة أخرى.', 'error');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteWafdeenStudent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var student, ok, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/];
                    student = wafdeenStudentsData.find(function (s) { return String(s.id) === String(id); });
                    if (!student)
                        return [2 /*return*/];
                    ok = confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628/\u0627\u0644\u0637\u0627\u0644\u0628\u0629 \"".concat(student.name, "\"\u061F"));
                    if (!ok)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!(useFirebase && db)) throw new Error('Supabase غير متصل');
                    return [4 /*yield*/, deleteFirebaseRecord('wafdeenStudents', String(id))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    wafdeenStudentsData = wafdeenStudentsData.filter(function (s) { return String(s.id) !== String(id); });
                    wafdeenPersistLocal();
                    wafdeenRenderStudentSelect();
                    wafdeenRenderStudentsTable();
                    showMessage('wafdeen-save-msg', 'تم حذف الطالب بنجاح ✅', 'success');
                    return [3 /*break*/, 5];
                case 4:
                    e_12 = _a.sent();
                    console.error('Wafdeen student delete error:', e_12);
                    showMessage('wafdeen-save-msg', 'تعذر حذف الطالب من السحابة', 'error');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function wafdeenRenderStudentsTable() {
    var tb = document.querySelector('#wafdeenStudentsTable tbody');
    if (!tb)
        return;
    tb.innerHTML = wafdeenStudentsData.map(function (s) { return "<tr><td>".concat(s.name, "</td><td><button type=\"button\" class=\"action-btn btn-danger\" onclick=\"deleteWafdeenStudent('").concat(s.id, "')\">\u062D\u0630\u0641</button></td></tr>"); }).join('') || '<tr><td colspan="2">لا يوجد طلاب مسجلون</td></tr>';
}
/* -------- المواد والمستويات والكتب -------- */
function wafdeenBookLevels(subject) {
    var nums = new Set(wafdeenBooksData.filter(function (b) { return b.subject === subject; }).map(function (b) { return Number(b.level); }).filter(function (n) { return n > 0; }));
    return __spreadArray([], __read(nums), false).sort(function (a, b) { return a - b; });
}
function wafdeenGetScore(studentId, subject, level) {
    var found = wafdeenExamsData.find(function (e) { return String(e.studentId) === String(studentId) && e.subject === subject && Number(e.level) === Number(level); });
    return found ? Number(found.score) : null;
}
function wafdeenIsLevelUnlocked(studentId, subject, level) {
    level = Number(level);
    if (level <= 1)
        return true;
    var prev = wafdeenGetScore(studentId, subject, level - 1);
    return prev !== null && prev >= 70;
}
function wafdeenSubjectProgress(studentId, subject) {
    var e_13, _a;
    var levels = wafdeenBookLevels(subject);
    if (!levels.length)
        return { passed: 0, next: 1 };
    var passed = 0;
    try {
        for (var levels_1 = __values(levels), levels_1_1 = levels_1.next(); !levels_1_1.done; levels_1_1 = levels_1.next()) {
            var lv = levels_1_1.value;
            var sc = wafdeenGetScore(studentId, subject, lv);
            if (sc !== null && sc >= 70)
                passed = lv;
            else
                break;
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (levels_1_1 && !levels_1_1.done && (_a = levels_1.return)) _a.call(levels_1);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return { passed: passed, next: passed + 1 };
}
function wafdeenOpenSubject(subject) {
    wafdeenSelectedSubject = subject;
    wafdeenShowPanel('materials');
    wafdeenRenderMaterials(subject);
    // تحديث الكتب من Google Drive بعد ظهور واجهة المادة، بدون إخفاء المحتوى الحالي.
    wafdeenLoadBooksFromGoogleDrive().then(function (books) {
        if (Array.isArray(books) && books.length) {
            var byId_1 = new Map((wafdeenBooksData || []).map(function (b) { return [String(b.id), b]; }));
            books.forEach(function (b) { return byId_1.set(String(b.id), b); });
            wafdeenBooksData = Array.from(byId_1.values());
            wafdeenPersistLocal();
            wafdeenRenderMaterials(subject);
        }
    }).catch(function (e) { return console.warn('تعذر تحديث كتب المادة من Google Drive:', e); });
}
function wafdeenRenderMaterials(subject) {
    var _a, _b;
    if (subject === void 0) { subject = wafdeenSelectedSubject; }
    var wrap = document.getElementById('wafdeen-materials-content');
    if (!wrap)
        return;
    var isStudent = (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student';
    var studentId = isStudent ? currentWafdeenTeacher.id : (_a = document.getElementById('wafdeenStudentSelect')) === null || _a === void 0 ? void 0 : _a.value;
    (_b = document.getElementById('wafdeen-student-material-note')) === null || _b === void 0 ? void 0 : _b.classList.toggle('hidden', !isStudent);
    if (isStudent)
        document.getElementById('wafdeen-student-material-note').innerText = 'أنت تبدأ من المستوى الأول. المستوى التالي يُفتح تلقائيًا بعد أن يسجل المعلم درجة لا تقل عن 70/100 في امتحان المستوى السابق.';
    var s = WAFDEEN_SUBJECTS[subject] || WAFDEEN_SUBJECTS.fiqh;
    var levels = wafdeenBookLevels(subject);
    if (!levels.length) {
        wrap.innerHTML = "<div class=\"wafdeen-empty\">".concat(s.icon, " \u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0623\u0648 \u0643\u062A\u0628 \u0645\u0636\u0627\u0641\u0629 \u0641\u064A ").concat(s.name, " \u062D\u062A\u0649 \u0627\u0644\u0622\u0646.</div>").concat((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin) ? wafdeenAdminBookForm(subject) : '');
        return;
    }
    var maxLevel = levels.length ? Math.max.apply(Math, __spreadArray([], __read(levels), false)) : 0;
    var passedCount = isStudent && maxLevel ? levels.filter(function (l) { return wafdeenGetScore(studentId, subject, l) !== null && wafdeenGetScore(studentId, subject, l) >= 70; }).length : 0;
    var progressPercent = isStudent && maxLevel ? Math.round((passedCount / maxLevel) * 100) : 0;
    var html = "<div class=\"wafdeen-panel\"><h3>".concat(s.icon, " ").concat(s.name, " \u2014 \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A</h3>").concat(isStudent ? "<div class=\"wafdeen-progress-wrap\"><div class=\"wafdeen-progress-label\"><span>\u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u0642\u062F\u0645 \u0641\u064A ".concat(s.name, "</span><span>").concat(progressPercent, "%</span></div><div class=\"wafdeen-progress-track\"><div class=\"wafdeen-progress-bar\" style=\"width:").concat(progressPercent, "%\"></div></div></div>") : '', "<div class=\"wafdeen-levels-grid\">");
    levels.forEach(function (level) {
        var unlocked = isStudent ? wafdeenIsLevelUnlocked(studentId, subject, level) : true;
        var score = isStudent ? wafdeenGetScore(studentId, subject, level) : null;
        var passed = score !== null && score >= 70;
        var books = wafdeenBooksData.filter(function (b) { return b.subject === subject && Number(b.level) === level; });
        html += "<div class=\"wafdeen-level-card ".concat(unlocked ? '' : 'locked', " ").concat(passed ? 'passed' : '', "\">\n      <div class=\"wafdeen-level-head\"><div class=\"wafdeen-level-title\">\u0627\u0644\u0645\u0633\u062A\u0648\u0649 ").concat(level, "</div><span class=\"wafdeen-status-pill ").concat(passed ? 'wafdeen-status-pass' : unlocked ? 'wafdeen-status-open' : 'wafdeen-status-lock', "\">").concat(passed ? 'ناجح ' + score + '/100' : unlocked ? 'متاح' : '🔒 مغلق', "</span></div>\n      <div class=\"wafdeen-book-list\">");
        if (!books.length)
            html += '<div class="wafdeen-note">لا توجد كتب.</div>';
        books.forEach(function (b) {
            var disabled = isStudent && !unlocked;
            html += "<div class=\"wafdeen-book-item\"><span>\uD83D\uDCD6 ".concat(escapeHtml(b.title), "</span><span style=\"display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end\"><button type=\"button\" class=\"action-btn btn-save\" ").concat(disabled ? 'disabled' : '', " onclick=\"wafdeenOpenBook('").concat(String(b.id), "')\">\u0641\u062A\u062D \u0627\u0644\u0643\u062A\u0627\u0628</button>").concat((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin) ? "<button type=\"button\" class=\"action-btn btn-danger\" onclick=\"wafdeenDeleteBook('".concat(String(b.id), "')\">\u062D\u0630\u0641</button>") : '', "</span></div>");
        });
        if (!isStudent && ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'teacher' || (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))) {
            html += "<div class=\"wafdeen-exam-box\"><strong>\u0627\u0645\u062A\u062D\u0627\u0646 \u0627\u0644\u0645\u0633\u062A\u0648\u0649</strong>\n        <div class=\"form-group\" style=\"margin-top:8px\"><label>\u0627\u0644\u0637\u0627\u0644\u0628:</label><select id=\"wafdeenExamStudent_".concat(subject, "_").concat(level, "\">").concat(wafdeenStudentsData.map(function (st) { return "<option value=\"".concat(st.id, "\">").concat(escapeHtml(st.name), "</option>"); }).join(''), "</select></div>\n        <div class=\"form-group\" style=\"margin-top:8px\"><label>\u0627\u0644\u062F\u0631\u062C\u0629 \u0645\u0646 100:</label><input id=\"wafdeenExamScore_").concat(subject, "_").concat(level, "\" type=\"number\" min=\"0\" max=\"100\" placeholder=\"\u0645\u062B\u0627\u0644: 85\"></div>\n        <button type=\"button\" class=\"action-btn btn-save\" style=\"margin-top:8px\" onclick=\"wafdeenSaveExam('").concat(subject, "',").concat(level, ")\">\u062D\u0641\u0638 \u0627\u0644\u062F\u0631\u062C\u0629</button>\n        <div class=\"wafdeen-note\" style=\"margin-top:7px\">70/100 \u0623\u0648 \u0623\u0643\u062B\u0631 \u064A\u0641\u062A\u062D \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062A\u0627\u0644\u064A \u0644\u0644\u0637\u0627\u0644\u0628.</div>\n      </div>");
        }
        if (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin)
            html += "<button type=\"button\" class=\"action-btn btn-danger\" style=\"margin-top:9px;width:100%\" onclick=\"wafdeenDeleteLevel('".concat(subject, "',").concat(level, ")\">\u062D\u0630\u0641 \u0643\u062A\u0628 \u0627\u0644\u0645\u0633\u062A\u0648\u0649</button>");
        html += '</div>';
    });
    html += '</div></div>';
    if (currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin)
        html += wafdeenAdminBookForm(subject);
    wrap.innerHTML = html;
}
function wafdeenAdminBookForm(subject) {
    var s = WAFDEEN_SUBJECTS[subject];
    return "<div class=\"wafdeen-admin-materials\">\n    <h3>\u2699\uFE0F \u0625\u062F\u0627\u0631\u0629 \u0643\u062A\u0628 ".concat(s.name, "</h3>\n    <div class=\"wafdeen-grid\">\n      <div class=\"form-group\"><label>\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0643\u062A\u0627\u0628:</label><input id=\"wafdeenBookTitle\" type=\"text\" placeholder=\"\u0627\u0633\u0645 \u0627\u0644\u0643\u062A\u0627\u0628\"></div>\n      <div class=\"form-group\"><label>\u0627\u0644\u0645\u0633\u062A\u0648\u0649:</label><input id=\"wafdeenBookLevel\" type=\"number\" min=\"1\" step=\"1\" placeholder=\"\u0645\u062B\u0627\u0644: 1\"></div>\n      <div class=\"form-group\"><label>\u0645\u0644\u0641 \u0627\u0644\u0643\u062A\u0627\u0628 (PDF):</label><input id=\"wafdeenBookFile\" type=\"file\" accept=\"application/pdf,.pdf\"></div>\n    </div>\n    <button type=\"button\" class=\"action-btn btn-save\" style=\"margin-top:10px;width:100%\" onclick=\"wafdeenAddBook('").concat(subject, "')\">+ \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0643\u062A\u0627\u0628 \u0648\u062A\u062D\u0645\u064A\u0644\u0647</button>\n    <div id=\"wafdeen-book-upload-msg\" class=\"toast-msg\" style=\"margin-top:10px\"></div><div id=\"wafdeen-book-upload-progress\" class=\"wafdeen-progress-wrap hidden\"><div class=\"wafdeen-progress-label\"><span>\u062C\u0627\u0631\u064A \u0631\u0641\u0639 \u0627\u0644\u0643\u062A\u0627\u0628 \u0639\u0644\u0649 \u0627\u0644\u0633\u062D\u0627\u0628\u0629</span><span id=\"wafdeen-book-upload-percent\" class=\"wafdeen-upload-percent\">0%</span></div><div class=\"wafdeen-progress-track\"><div id=\"wafdeen-book-upload-bar\" class=\"wafdeen-progress-bar\"></div></div></div>\n  </div>");
}
function wafdeenStorageErrorMessage(e) {
    var code = String((e === null || e === void 0 ? void 0 : e.code) || '');
    if (code === 'storage/unauthorized')
        return 'Supabase Storage رفض الرفع. تأكد من تشغيل مخطط Storage ونشر smart-worker.';
    if (code === 'storage/unauthenticated')
        return 'يجب تسجيل الدخول إلى Supabase قبل رفع الكتاب.';
    if (code === 'storage/no-default-bucket')
        return 'لم يتم إنشاء حاوية wafdeen-books في Supabase Storage.';
    if (code === 'storage/bucket-not-found')
        return 'حاوية Supabase Storage غير موجودة أو اسمها غير صحيح.';
    if (code === 'storage/quota-exceeded')
        return 'تم تجاوز مساحة التخزين أو الحصة المسموح بها في Supabase.';
    if (code === 'storage/retry-limit-exceeded')
        return 'انتهت مهلة الاتصال أثناء الرفع. حاول مرة أخرى.';
    if (code === 'storage/canceled')
        return 'تم إلغاء رفع الكتاب.';
    return "\u062A\u0639\u0630\u0631 \u0631\u0641\u0639 \u0627\u0644\u0643\u062A\u0627\u0628 \u0625\u0644\u0649 \u0627\u0644\u0633\u062D\u0627\u0628\u0629".concat(code ? ' (' + code + ')' : '', ". ").concat((e === null || e === void 0 ? void 0 : e.message) || 'تحقق من إعداد Supabase Storage ونشر smart-worker.');
}
async function wafdeenUploadToStorage(file,id,onProgress){
  if(!window.__MAJD_SUPABASE_APP__||!window.__MAJD_SUPABASE_APP__.token())throw Object.assign(new Error('يجب تسجيل الدخول قبل رفع الكتاب.'),{code:'storage/unauthenticated'});
  const safeName=String(file.name||'book.pdf').replace(/[^\w\u0600-\u06FF.\- ]/g,'_');
  const storagePath='wafdeenBooks/'+String(id)+'_'+safeName;
  const bytes=new Uint8Array(await file.arrayBuffer());
  let binary='';
  for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,Math.min(i+0x8000,bytes.length)));
  onProgress?.(25);
  const result=await window.__MAJD_SUPABASE_APP__.call('storage_upload',{path:storagePath,data:btoa(binary),contentType:file.type||'application/pdf'});
  onProgress?.(100);
  return {url:result.url,storagePath:result.storagePath};
}
function wafdeenAddBook(subject) {
    return __awaiter(this, void 0, void 0, function () {
        var title, level, file, progressBox, progressBar, progressText, books, found, refreshError_1, e_15;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/];
                    title = (_a = document.getElementById('wafdeenBookTitle')) === null || _a === void 0 ? void 0 : _a.value.trim();
                    level = Number((_b = document.getElementById('wafdeenBookLevel')) === null || _b === void 0 ? void 0 : _b.value);
                    file = (_d = (_c = document.getElementById('wafdeenBookFile')) === null || _c === void 0 ? void 0 : _c.files) === null || _d === void 0 ? void 0 : _d[0];
                    if (!title || !Number.isInteger(level) || level < 1 || !file)
                        return [2 /*return*/, showMessage('wafdeen-book-upload-msg', 'اكتب اسم الكتاب والمستوى واختر ملف PDF', 'error')];
                    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name))
                        return [2 /*return*/, showMessage('wafdeen-book-upload-msg', 'الرجاء اختيار ملف PDF', 'error')];
                    if (file.size > 25 * 1024 * 1024)
                        return [2 /*return*/, showMessage('wafdeen-book-upload-msg', 'حجم الكتاب يجب أن يكون 25 ميجابايت أو أقل.', 'error')];
                    progressBox = document.getElementById('wafdeen-book-upload-progress');
                    progressBar = document.getElementById('wafdeen-book-upload-bar');
                    progressText = document.getElementById('wafdeen-book-upload-percent');
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 8, , 9]);
                    showMessage('wafdeen-book-upload-msg', '⏳ جاري رفع الكتاب إلى Google Drive...', 'info');
                    progressBox === null || progressBox === void 0 ? void 0 : progressBox.classList.remove('hidden');
                    if (progressBar)
                        progressBar.style.width = '10%';
                    if (progressText)
                        progressText.innerText = 'جاري الرفع...';
                    return [4 /*yield*/, wafdeenGoogleDriveUpload(file, title, level, subject, function (pct) {
                            if (progressBar)
                                progressBar.style.width = Math.max(10, pct) + '%';
                            if (progressText)
                                progressText.innerText = pct + '%';
                        })];
                case 2:
                    _e.sent();
                    showMessage('wafdeen-book-upload-msg', '✅ تم إرسال الكتاب إلى Google Drive. جاري تحديث قائمة الكتب...', 'success');
                    // إعادة قراءة القائمة من Apps Script عبر JSONP.
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1500); })];
                case 3:
                    // إعادة قراءة القائمة من Apps Script عبر JSONP.
                    _e.sent();
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, wafdeenLoadBooksFromGoogleDrive()];
                case 5:
                    books = _e.sent();
                    if (Array.isArray(books)) {
                        wafdeenBooksData = books;
                        wafdeenPersistLocal();
                        wafdeenRenderMaterials(subject);
                        found = books.some(function (b) {
                            return String(b.fileName || '') === String(file.name) ||
                                String(b.title || '') === String(title);
                        });
                        showMessage('wafdeen-book-upload-msg', found ? '🎉 تم رفع الكتاب وظهر في Google Drive والموقع.' :
                            '✅ تم إرسال الكتاب. لو لم يظهر فورًا اضغط تحديث الكتب بعد ثوانٍ.', 'success');
                    }
                    return [3 /*break*/, 7];
                case 6:
                    refreshError_1 = _e.sent();
                    console.warn('تعذر تحديث القائمة بعد الرفع:', refreshError_1);
                    showMessage('wafdeen-book-upload-msg', '✅ تم إرسال الكتاب إلى Google Drive. افتح Google Drive للتأكد ثم اضغط تحديث الكتب.', 'success');
                    return [3 /*break*/, 7];
                case 7:
                    setTimeout(function () { return progressBox === null || progressBox === void 0 ? void 0 : progressBox.classList.add('hidden'); }, 1200);
                    if (document.getElementById('wafdeenBookTitle'))
                        document.getElementById('wafdeenBookTitle').value = '';
                    if (document.getElementById('wafdeenBookLevel'))
                        document.getElementById('wafdeenBookLevel').value = '';
                    if (document.getElementById('wafdeenBookFile'))
                        document.getElementById('wafdeenBookFile').value = '';
                    return [3 /*break*/, 9];
                case 8:
                    e_15 = _e.sent();
                    console.error('Google Drive book upload error:', e_15);
                    if (progressText)
                        progressText.innerText = 'فشل';
                    if (progressBar)
                        progressBar.style.width = '0%';
                    showMessage('wafdeen-book-upload-msg', '❌ فشل إرسال الكتاب. ' + ((e_15 === null || e_15 === void 0 ? void 0 : e_15.message) || 'تأكد من إعداد Apps Script كما في التعليمات.'), 'error');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function wafdeenOpenBook(id) {
    var b = wafdeenBooksData.find(function (x) { return String(x.id) === String(id); });
    if (!b)
        return;
    var wrap = document.getElementById('wafdeen-materials-content');
    if (!wrap)
        return;
    // عرض الكتاب داخل الموقع باستخدام عارض Google Drive المباشر.
    // هذا أفضل من /view لأنه يمنع ظهور صفحة PDF فارغة أو أيقونة الملف المكسور.
    var fileId = String(b.id || '').trim();
    var previewUrl = fileId
        ? 'https://drive.google.com/file/d/' + encodeURIComponent(fileId) + '/preview'
        : String(b.url || '');
    var reader = document.createElement('div');
    reader.className = 'wafdeen-book-reader';
    reader.innerHTML = "\n    <div class=\"reader-head\">\n      <strong>\uD83D\uDCD6 ".concat(escapeHtml(b.title), "</strong>\n      <span style=\"display:flex;gap:7px;align-items:center;flex-wrap:wrap\">\n        ").concat(fileId ? "<a class=\"action-btn btn-save\" href=\"https://drive.google.com/file/d/".concat(encodeURIComponent(fileId), "/preview\" target=\"_blank\" rel=\"noopener\">\u0641\u062A\u062D \u0641\u064A \u0646\u0627\u0641\u0630\u0629 \u062C\u062F\u064A\u062F\u0629</a>") : '', "\n        <button type=\"button\" class=\"action-btn\" onclick=\"this.closest('.wafdeen-book-reader').remove()\">\u0625\u063A\u0644\u0627\u0642</button>\n      </span>\n    </div>\n    <div style=\"background:#fff;min-height:650px\">\n      <iframe\n        title=\"").concat(escapeHtml(b.title), "\"\n        src=\"").concat(previewUrl, "\"\n        loading=\"lazy\"\n        allow=\"autoplay\"\n        style=\"width:100%;height:78vh;min-height:650px;border:0;background:#fff\"\n      ></iframe>\n    </div>");
    wrap.appendChild(reader);
    reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function wafdeenDeleteBook(id) {
    return __awaiter(this, void 0, void 0, function () {
        var b, ok, e_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/];
                    b = wafdeenBooksData.find(function (x) { return String(x.id) === String(id); });
                    if (!b)
                        return [2 /*return*/];
                    ok = confirm('سيتم حذف الكتاب من الموقع ومن مجلد "كتب" في Google Drive. هل تريد المتابعة؟');
                    if (!ok)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(GOOGLE_DRIVE_BOOKS_WEB_APP_URL, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                            body: JSON.stringify({ action: 'delete', id: String(id) })
                        })];
                case 2:
                    _a.sent();
                    wafdeenBooksData = wafdeenBooksData.filter(function (x) { return String(x.id) !== String(id); });
                    wafdeenPersistLocal();
                    wafdeenRenderMaterials(b.subject);
                    showMessage('wafdeen-book-upload-msg', 'تم حذف الكتاب من الموقع وGoogle Drive ✅', 'success');
                    return [3 /*break*/, 4];
                case 3:
                    e_16 = _a.sent();
                    showMessage('wafdeen-book-upload-msg', 'تعذر حذف الكتاب من Google Drive', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function wafdeenDeleteLevel(subject, level) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, ids_2, ids_2_1, id, e_17_1;
        var e_17, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/];
                    ids = wafdeenBooksData.filter(function (b) { return b.subject === subject && Number(b.level) === Number(level); }).map(function (b) { return b.id; });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    ids_2 = __values(ids), ids_2_1 = ids_2.next();
                    _b.label = 2;
                case 2:
                    if (!!ids_2_1.done) return [3 /*break*/, 5];
                    id = ids_2_1.value;
                    return [4 /*yield*/, wafdeenDeleteBook(id)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    ids_2_1 = ids_2.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_17_1 = _b.sent();
                    e_17 = { error: e_17_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (ids_2_1 && !ids_2_1.done && (_a = ids_2.return)) _a.call(ids_2);
                    }
                    finally { if (e_17) throw e_17.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function wafdeenSaveExam(subject, level) {
    return __awaiter(this, void 0, void 0, function () {
        var studentId, score, id, rec, e_18;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if ((currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.role) === 'student')
                        return [2 /*return*/];
                    studentId = (_a = document.getElementById("wafdeenExamStudent_".concat(subject, "_").concat(level))) === null || _a === void 0 ? void 0 : _a.value;
                    score = Number((_b = document.getElementById("wafdeenExamScore_".concat(subject, "_").concat(level))) === null || _b === void 0 ? void 0 : _b.value);
                    if (!studentId || !Number.isFinite(score) || score < 0 || score > 100)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'اختر الطالب واكتب درجة صحيحة من 0 إلى 100', 'error')];
                    id = "".concat(studentId, "_").concat(subject, "_").concat(level);
                    rec = { id: id, studentId: studentId, subject: subject, level: Number(level), score: score, teacherUsername: currentWafdeenTeacher.username, updatedAt: new Date().toISOString() };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    wafdeenExamsData = wafdeenExamsData.filter(function (e) { return String(e.id) !== String(id); });
                    wafdeenExamsData.push(rec);
                    wafdeenPersistLocal();
                    if (!(useFirebase && db)) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.collection('wafdeenExams').doc(id).set(rec, { merge: true })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [4 /*yield*/, firebaseSaveByAction_('saveWafdeenExam', rec)];
                case 4:
                    _c.sent();
                    showMessage('wafdeen-save-msg', score >= 70 ? 'تم حفظ الدرجة — المستوى التالي أصبح متاحًا للطالب ✅' : 'تم حفظ الدرجة — الطالب يحتاج 70/100 على الأقل لفتح المستوى التالي', 'success');
                    wafdeenRenderMaterials(subject);
                    return [3 /*break*/, 6];
                case 5:
                    e_18 = _c.sent();
                    console.error(e_18);
                    showMessage('wafdeen-save-msg', 'تعذر حفظ درجة الامتحان', 'error');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/* حذف الكتب/المستويات مع أدوات مساعدة */
function escapeHtml(v) { return String(v !== null && v !== void 0 ? v : '').replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); }); }
/* -------- التقرير الشهري -------- */
function exportWafdeenMonthlyReportExcel() {
    var _a;
    try {
        var table = document.getElementById('wafdeenReportTable');
        if (!table) {
            showMessage('wafdeen-save-msg', 'جدول التقرير الشهري غير موجود', 'error');
            return;
        }
        var month = ((_a = document.getElementById('wafdeenReportMonth')) === null || _a === void 0 ? void 0 : _a.value) || wafdeenTodayMonth();
        var wb = XLSX.utils.table_to_book(table, { sheet: "التقرير الشهري" });
        XLSX.writeFile(wb, "\u062A\u0642\u0631\u064A\u0631_\u0627\u0644\u0648\u0627\u0641\u062F\u064A\u0646_\u0634\u0647\u0631\u064A_".concat(month, ".xlsx"));
        showMessage('wafdeen-save-msg', 'تم تصدير التقرير الشهري Excel بنجاح ✅', 'success');
    }
    catch (e) {
        console.error(e);
        showMessage('wafdeen-save-msg', 'تعذر تصدير التقرير الشهري', 'error');
    }
}
function saveWafdeenMonthlyReportToFirebase() {
    return __awaiter(this, void 0, void 0, function () {
        var month, imported, rows, trs, ok, e_19;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    month = ((_a = document.getElementById('wafdeenReportMonth')) === null || _a === void 0 ? void 0 : _a.value) || wafdeenTodayMonth();
                    imported = (_b = wafdeenMonthlyImportedReports === null || wafdeenMonthlyImportedReports === void 0 ? void 0 : wafdeenMonthlyImportedReports[month]) === null || _b === void 0 ? void 0 : _b.rows;
                    rows = [];
                    if (Array.isArray(imported) && imported.length) {
                        rows = imported.map(function (x) { return ({ teacher: String(x.teacher || ''), session: Math.max(0, Number(x.session) || 0), educational: Math.max(0, Number(x.educational) || 0), total: Math.max(0, Number(x.total) || 0) }); });
                    }
                    else {
                        trs = __spreadArray([], __read(document.querySelectorAll('#wafdeenReportTable tbody tr')), false);
                        rows = trs.map(function (tr) { var c = __spreadArray([], __read(tr.querySelectorAll('td')), false).map(function (x) { return x.textContent.trim(); }); return { teacher: c[0] || '', sessionText: c[1] || '', educationalText: c[2] || '', totalText: c[3] || '', hours50: c[4] || '', hours60: c[5] || '' }; }).filter(function (x) { return x.teacher; });
                    }
                    if (!rows.length) {
                        showMessage('wafdeen-save-msg', 'لا يوجد تقرير لحفظه', 'error');
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, firebaseSaveByAction_('saveWafdeenMonthlyReport', { id: 'wafdeen_monthly_' + month, month: month, rows: rows, sourceFile: ((_c = wafdeenMonthlyImportedReports === null || wafdeenMonthlyImportedReports === void 0 ? void 0 : wafdeenMonthlyImportedReports[month]) === null || _c === void 0 ? void 0 : _c.fileName) || '', savedAt: new Date().toISOString() })];
                case 1:
                    ok = _d.sent();
                    if (ok)
                        showMessage('wafdeen-save-msg', "\u062A\u0645 \u062D\u0641\u0638 \u062A\u0642\u0631\u064A\u0631 ".concat(month, " \u0641\u064A Firebase \u0628\u0646\u062C\u0627\u062D \u2601\uFE0F\u2705"), 'success');
                    else
                        showMessage('wafdeen-save-msg', 'تم تجهيز التقرير للمزامنة مع Supabase، وسيُرسل تلقائيًا عند توفر الاتصال.', 'success');
                    return [2 /*return*/, ok];
                case 2:
                    e_19 = _d.sent();
                    console.error(e_19);
                    showMessage('wafdeen-save-msg', 'تعذر حفظ التقرير في Supabase', 'error');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function importWafdeenMonthlyReportExcel(input) {
    return __awaiter(this, void 0, void 0, function () {
        var file, data, wb, ws, rows, month, norm_1, findVal_1, parseTime_1, imported_1, e_20;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    file = (_a = input === null || input === void 0 ? void 0 : input.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    if (typeof XLSX === 'undefined')
                        throw new Error('XLSX library unavailable');
                    return [4 /*yield*/, file.arrayBuffer()];
                case 1:
                    data = _c.sent();
                    wb = XLSX.read(data, { type: 'array', cellDates: true });
                    ws = wb.Sheets[wb.SheetNames[0]];
                    rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
                    if (!rows.length) {
                        showMessage('wafdeen-save-msg', 'ملف Excel فارغ', 'error');
                        return [2 /*return*/];
                    }
                    month = ((_b = document.getElementById('wafdeenReportMonth')) === null || _b === void 0 ? void 0 : _b.value) || wafdeenTodayMonth();
                    norm_1 = function (s) { return String(s !== null && s !== void 0 ? s : '').trim().replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); }).replace(/\s+/g, ' '); };
                    findVal_1 = function (row, names) {
                        var e_21, _a, e_22, _b;
                        try {
                            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                                var n = names_1_1.value;
                                if (Object.prototype.hasOwnProperty.call(row, n))
                                    return row[n];
                            }
                        }
                        catch (e_21_1) { e_21 = { error: e_21_1 }; }
                        finally {
                            try {
                                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
                            }
                            finally { if (e_21) throw e_21.error; }
                        }
                        var keys = Object.keys(row);
                        var _loop_2 = function (n) {
                            var k = keys.find(function (x) { return norm_1(x) === norm_1(n); });
                            if (k)
                                return { value: row[k] };
                        };
                        try {
                            for (var names_2 = __values(names), names_2_1 = names_2.next(); !names_2_1.done; names_2_1 = names_2.next()) {
                                var n = names_2_1.value;
                                var state_1 = _loop_2(n);
                                if (typeof state_1 === "object")
                                    return state_1.value;
                            }
                        }
                        catch (e_22_1) { e_22 = { error: e_22_1 }; }
                        finally {
                            try {
                                if (names_2_1 && !names_2_1.done && (_b = names_2.return)) _b.call(names_2);
                            }
                            finally { if (e_22) throw e_22.error; }
                        }
                        return '';
                    };
                    parseTime_1 = function (v) {
                        if (v === null || v === undefined || v === '')
                            return 0;
                        if (typeof v === 'number')
                            return Math.max(0, Math.round(v * 86400));
                        var s = norm_1(v);
                        var m = s.match(/(\d+(?:\.\d+)?)\s*س(?:اعة)?\s*(\d+(?:\.\d+)?)\s*د(?:قيقة)?\s*(\d+(?:\.\d+)?)\s*ث(?:انية)?/i);
                        if (m)
                            return Math.max(0, Math.round(+m[1] * 3600 + +m[2] * 60 + +m[3]));
                        m = s.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
                        if (m)
                            return m[3] !== undefined ? (+m[1] * 3600 + +m[2] * 60 + +m[3]) : (+m[1] * 60 + +m[2]);
                        var n = Number(s.replace(',', '.'));
                        return Number.isFinite(n) ? Math.max(0, Math.round(n * 60)) : 0;
                    };
                    imported_1 = [];
                    rows.forEach(function (row) {
                        var teacher = String(findVal_1(row, ['المعلم', 'اسم المعلم', 'المدرس', 'Teacher']) || '').trim();
                        if (!teacher)
                            return;
                        var session = parseTime_1(findVal_1(row, ['جلسات التسميع', 'وقت جلسات التسميع', 'وقت التسميع']));
                        var educational = parseTime_1(findVal_1(row, ['وقت المواد التعليمية', 'المواد التعليمية', 'وقت التعليم']));
                        var total = parseTime_1(findVal_1(row, ['إجمالي الوقت', 'اجمالي الوقت', 'إجمالي وقت']));
                        if (!total)
                            total = session + educational;
                        imported_1.push({ teacher: teacher, session: session, educational: educational, total: total });
                    });
                    if (!imported_1.length)
                        throw new Error('لا توجد صفوف صالحة');
                    wafdeenMonthlyImportedReports[month] = { month: month, rows: imported_1, importedAt: new Date().toISOString(), fileName: file.name };
                    wafdeenPersistLocal();
                    renderWafdeenMonthlyReport();
                    showMessage('wafdeen-save-msg', "\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F ".concat(imported_1.length, " \u0635\u0641 \u0645\u0646 Excel \u0648\u0648\u0636\u0639 \u0627\u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0648\u0628\u0629 \u0643\u0645\u0627 \u0647\u064A \u0641\u064A \u062A\u0642\u0631\u064A\u0631 ").concat(month, " \u2705"), 'success');
                    return [4 /*yield*/, saveWafdeenMonthlyReportToFirebase()];
                case 2:
                    _c.sent();
                    input.value = '';
                    return [3 /*break*/, 4];
                case 3:
                    e_20 = _c.sent();
                    console.error(e_20);
                    showMessage('wafdeen-save-msg', 'تعذر قراءة Excel. استخدم ملف التقرير الشهري الصادر من الموقع بنفس عناوين الأعمدة.', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderWafdeenMonthlyReport() {
    return __awaiter(this, void 0, void 0, function () {
        var tb, month, label, _a, start, end, inclusiveEnd, imported, map, cloud, cloudMap_1, e_23;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tb = document.querySelector('#wafdeenReportTable tbody');
                    if (!tb)
                        return [2 /*return*/];
                    month = ((_b = document.getElementById('wafdeenReportMonth')) === null || _b === void 0 ? void 0 : _b.value) || wafdeenTodayMonth();
                    label = document.getElementById('wafdeenMonthRangeLabel');
                    if (label) {
                        _a = wafdeenPeriodRangeFromKey(month), start = _a.start, end = _a.end;
                        inclusiveEnd = new Date(end);
                        inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
                        label.innerText = "\u0627\u0644\u0641\u062A\u0631\u0629: \u0645\u0646 ".concat(wafdeenFormatDate(start), " \u0625\u0644\u0649 ").concat(wafdeenFormatDate(inclusiveEnd)) + (month === wafdeenTodayMonth() ? " \u2014 \u0627\u0644\u064A\u0648\u0645: ".concat(wafdeenFormatDate(new Date()), " \u2705") : " (\u0627\u0644\u064A\u0648\u0645: ".concat(wafdeenFormatDate(new Date()), ")"));
                    }
                    imported = (_c = wafdeenMonthlyImportedReports === null || wafdeenMonthlyImportedReports === void 0 ? void 0 : wafdeenMonthlyImportedReports[month]) === null || _c === void 0 ? void 0 : _c.rows;
                    map = {};
                    if (Array.isArray(imported) && imported.length) {
                        imported.forEach(function (x) { var u = x.teacher || 'غير معروف'; map[u] = { session: Math.max(0, Number(x.session) || 0), educational: Math.max(0, Number(x.educational) || 0), total: Math.max(0, Number(x.total) || 0) }; });
                    }
                    else {
                        wafdeenUsageData.filter(function (r) { return String(r.month || '') === month; }).forEach(function (r) { var u = r.teacherUsername || 'غير معروف'; if (!map[u])
                            map[u] = { session: 0, educational: 0, total: 0 }; var secs = Math.max(0, Number(r.seconds) || 0); if (r.category === 'quran' && r.type === 'جلسة التسميع')
                            map[u].session += secs;
                        else if (r.category === 'educational')
                            map[u].educational += secs; map[u].total += secs; });
                    }
                    tb.innerHTML = wafdeenBuildReportRows(map) || '<tr><td colspan="6">لا توجد جلسات محفوظة لهذا الشهر</td></tr>';
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebaseGetWafdeenMonthlyReports_({ type: 'month', month: month })];
                case 2:
                    cloud = _d.sent();
                    if ((cloud === null || cloud === void 0 ? void 0 : cloud.ok) && Array.isArray(cloud.rows)) {
                        cloudMap_1 = {};
                        cloud.rows.forEach(function (x) { var u = x.teacher || 'غير معروف'; cloudMap_1[u] = { session: Number(x.session) || 0, educational: Number(x.educational) || 0, total: Number(x.total) || 0 }; });
                        tb.innerHTML = wafdeenBuildReportRows(cloudMap_1) || '<tr><td colspan="6">لا توجد جلسات محفوظة لهذا الشهر</td></tr>';
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_23 = _d.sent();
                    console.warn('تعذر تحديث التقرير الشهري من Supabase:', e_23);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* -------- عناصر مشتركة بين تقارير اليوم/الأسبوع/الشهر -------- */
function wafdeenFormatMonthlyTime(secs) { secs = Math.max(0, Math.floor(Number(secs) || 0)); var hours50 = Math.floor(secs / 3000), remAfterHours = secs % 3000, minutes = Math.floor(remAfterHours / 60), seconds = remAfterHours % 60; return "".concat(hours50, " \u0633 ").concat(minutes, " \u062F ").concat(seconds, " \u062B"); }
function wafdeenFormatHours(secs, base) { return (Math.max(0, secs) / 60 / base).toFixed(2); }
function wafdeenBuildReportRows(map) {
    return Object.entries(map).sort(function (a, b) { return b[1].total - a[1].total; }).map(function (_a) {
        var _b = __read(_a, 2), u = _b[0], x = _b[1];
        return "<tr><td>".concat(escapeHtml(u), "</td><td>").concat(wafdeenFormatMonthlyTime(x.session), "</td><td>").concat(wafdeenFormatMonthlyTime(x.educational), "</td><td><strong>").concat(wafdeenFormatMonthlyTime(x.total), "</strong></td><td>").concat(wafdeenFormatHours(x.total, 50), "</td><td>").concat(wafdeenFormatHours(x.total, 60), "</td></tr>");
    }).join('');
}
function wafdeenAggregateUsage(records) {
    var map = {};
    records.forEach(function (r) {
        var u = r.teacherUsername || 'غير معروف';
        if (!map[u])
            map[u] = { session: 0, educational: 0, total: 0 };
        var secs = Math.max(0, Number(r.seconds || 0));
        if (r.category === 'quran' && r.type === 'جلسة التسميع')
            map[u].session += secs;
        else if (r.category === 'educational')
            map[u].educational += secs;
        map[u].total += secs;
    });
    return map;
}
/* -------- التقرير اليومي -------- */
function renderWafdeenDailyReport() {
    var tb = document.querySelector('#wafdeenDailyReportTable tbody');
    if (!tb)
        return;
    var dayInput = document.getElementById('wafdeenReportDay');
    var day = (dayInput === null || dayInput === void 0 ? void 0 : dayInput.value) || wafdeenTodayDateStr();
    if (dayInput && !dayInput.value)
        dayInput.value = day;
    var records = wafdeenUsageData.filter(function (r) { return wafdeenSameLocalDay(r.dateISO, day); });
    var map = wafdeenAggregateUsage(records);
    tb.innerHTML = wafdeenBuildReportRows(map) || '<tr><td colspan="6">لا توجد جلسات محفوظة في هذا اليوم</td></tr>';
}
function exportWafdeenDailyReportExcel() {
    var _a;
    try {
        var table = document.getElementById('wafdeenDailyReportTable');
        if (!table) {
            showMessage('wafdeen-save-msg', 'جدول تقرير اليوم غير موجود', 'error');
            return;
        }
        var day = ((_a = document.getElementById('wafdeenReportDay')) === null || _a === void 0 ? void 0 : _a.value) || wafdeenTodayDateStr();
        var wb = XLSX.utils.table_to_book(table, { sheet: "تقرير اليوم" });
        XLSX.writeFile(wb, "\u062A\u0642\u0631\u064A\u0631_\u0627\u0644\u0648\u0627\u0641\u062F\u064A\u0646_\u064A\u0648\u0645\u064A_".concat(day, ".xlsx"));
        showMessage('wafdeen-save-msg', 'تم تصدير تقرير اليوم Excel بنجاح ✅', 'success');
    }
    catch (e) {
        console.error(e);
        showMessage('wafdeen-save-msg', 'تعذر تصدير تقرير اليوم', 'error');
    }
}
/* -------- التقرير الأسبوعي (من السبت إلى الجمعة) -------- */
function renderWafdeenWeeklyReport() {
    var tb = document.querySelector('#wafdeenWeeklyReportTable tbody');
    if (!tb)
        return;
    var weekInput = document.getElementById('wafdeenReportWeek');
    var day = (weekInput === null || weekInput === void 0 ? void 0 : weekInput.value) || wafdeenTodayDateStr();
    if (weekInput && !weekInput.value)
        weekInput.value = day;
    var _a = wafdeenWeekRange(day), start = _a.start, end = _a.end;
    var label = document.getElementById('wafdeenWeekRangeLabel');
    if (label)
        label.innerText = "\u0645\u0646 ".concat(wafdeenFormatDate(start), " \u0625\u0644\u0649 ").concat(wafdeenFormatDate(end));
    var records = wafdeenUsageData.filter(function (r) { return wafdeenInWeek(r.dateISO, day); });
    var map = wafdeenAggregateUsage(records);
    tb.innerHTML = wafdeenBuildReportRows(map) || '<tr><td colspan="6">لا توجد جلسات محفوظة في هذا الأسبوع</td></tr>';
}
function exportWafdeenWeeklyReportExcel() {
    var _a;
    try {
        var table = document.getElementById('wafdeenWeeklyReportTable');
        if (!table) {
            showMessage('wafdeen-save-msg', 'جدول تقرير الأسبوع غير موجود', 'error');
            return;
        }
        var day = ((_a = document.getElementById('wafdeenReportWeek')) === null || _a === void 0 ? void 0 : _a.value) || wafdeenTodayDateStr();
        var _b = wafdeenWeekRange(day), start = _b.start, end = _b.end;
        var wb = XLSX.utils.table_to_book(table, { sheet: "تقرير الأسبوع" });
        XLSX.writeFile(wb, "\u062A\u0642\u0631\u064A\u0631_\u0627\u0644\u0648\u0627\u0641\u062F\u064A\u0646_\u0627\u0633\u0628\u0648\u0639\u064A_".concat(wafdeenFormatDate(start), "_\u0627\u0644\u0649_").concat(wafdeenFormatDate(end), ".xlsx"));
        showMessage('wafdeen-save-msg', 'تم تصدير تقرير الأسبوع Excel بنجاح ✅', 'success');
    }
    catch (e) {
        console.error(e);
        showMessage('wafdeen-save-msg', 'تعذر تصدير تقرير الأسبوع', 'error');
    }
}
/* -------- التنقل بين تبويبات تقارير اليوم/الأسبوع/الشهر -------- */
function wafdeenReportSwitchSub(name) {
    ['day', 'week', 'month'].forEach(function (n) {
        var el = document.getElementById('wafdeen-report-sub-' + n);
        if (el)
            el.classList.toggle('hidden', n !== name);
        var btn = document.getElementById('wafdeenReportSubBtn-' + n);
        if (btn)
            btn.classList.toggle('btn-secondary', n !== name);
    });
    if (name === 'day') {
        var el = document.getElementById('wafdeenReportDay');
        if (el && !el.value)
            el.value = wafdeenTodayDateStr();
        renderWafdeenDailyReport();
    }
    if (name === 'week') {
        var el = document.getElementById('wafdeenReportWeek');
        if (el && !el.value)
            el.value = wafdeenTodayDateStr();
        renderWafdeenWeeklyReport();
    }
    if (name === 'month') {
        var el = document.getElementById('wafdeenReportMonth');
        if (el && !el.value)
            el.value = wafdeenTodayMonth();
        renderWafdeenMonthlyReport();
    }
}
function wafdeenRefreshAllReports() {
    renderWafdeenDailyReport();
    renderWafdeenWeeklyReport();
    renderWafdeenMonthlyReport();
}
function wafdeenReportPanelInit() {
    var dayEl = document.getElementById('wafdeenReportDay');
    if (dayEl && !dayEl.value)
        dayEl.value = wafdeenTodayDateStr();
    var weekEl = document.getElementById('wafdeenReportWeek');
    if (weekEl && !weekEl.value)
        weekEl.value = wafdeenTodayDateStr();
    var monthEl = document.getElementById('wafdeenReportMonth');
    if (monthEl && !monthEl.value)
        monthEl.value = wafdeenTodayMonth();
    wafdeenReportSwitchSub('month');
}
/* -------- مسح بيانات التقارير (للإدارة فقط) -------- */
function wafdeenDeleteUsageRecords(records) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, ids_3, ids_3_1, id, e_24_1;
        var e_24, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!records.length)
                        return [2 /*return*/];
                    ids = records.map(function (r) { return String(r.id); });
                    wafdeenUsageData = wafdeenUsageData.filter(function (r) { return !ids.includes(String(r.id)); });
                    wafdeenPersistLocal();
                    if (!(useFirebase && db)) throw new Error('Supabase غير متصل');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    ids_3 = __values(ids), ids_3_1 = ids_3.next();
                    _b.label = 2;
                case 2:
                    if (!!ids_3_1.done) return [3 /*break*/, 5];
                    id = ids_3_1.value;
                    return [4 /*yield*/, deleteFirebaseRecord('wafdeenUsage', id)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    ids_3_1 = ids_3.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_24_1 = _b.sent();
                    e_24 = { error: e_24_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (ids_3_1 && !ids_3_1.done && (_a = ids_3.return)) _a.call(ids_3);
                    }
                    finally { if (e_24) throw e_24.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function wafdeenDeleteDailyReport() {
    return __awaiter(this, void 0, void 0, function () {
        var day, records;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'هذه العملية متاحة للمدير فقط', 'error')];
                    day = ((_a = document.getElementById('wafdeenReportDay')) === null || _a === void 0 ? void 0 : _a.value) || wafdeenTodayDateStr();
                    records = wafdeenUsageData.filter(function (r) { return wafdeenSameLocalDay(r.dateISO, day); });
                    if (!records.length)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'لا توجد بيانات في تقرير هذا اليوم لحذفها', 'info')];
                    if (!confirm("\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0643\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u0642\u0631\u064A\u0631 \u064A\u0648\u0645 ".concat(day, " \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 \u0643\u0644 \u0627\u0644\u0623\u062C\u0647\u0632\u0629. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F")))
                        return [2 /*return*/];
                    return [4 /*yield*/, wafdeenDeleteUsageRecords(records)];
                case 1:
                    _b.sent();
                    renderWafdeenDailyReport();
                    showMessage('wafdeen-save-msg', 'تم حذف تقرير اليوم بنجاح ✅', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function wafdeenDeleteWeeklyReport() {
    return __awaiter(this, void 0, void 0, function () {
        var day, records, _a, start, end;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'هذه العملية متاحة للمدير فقط', 'error')];
                    day = ((_b = document.getElementById('wafdeenReportWeek')) === null || _b === void 0 ? void 0 : _b.value) || wafdeenTodayDateStr();
                    records = wafdeenUsageData.filter(function (r) { return wafdeenInWeek(r.dateISO, day); });
                    if (!records.length)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'لا توجد بيانات في تقرير هذا الأسبوع لحذفها', 'info')];
                    _a = wafdeenWeekRange(day), start = _a.start, end = _a.end;
                    if (!confirm("\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0643\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0645\u0646 ".concat(wafdeenFormatDate(start), " \u0625\u0644\u0649 ").concat(wafdeenFormatDate(end), " \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 \u0643\u0644 \u0627\u0644\u0623\u062C\u0647\u0632\u0629. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F")))
                        return [2 /*return*/];
                    return [4 /*yield*/, wafdeenDeleteUsageRecords(records)];
                case 1:
                    _c.sent();
                    renderWafdeenWeeklyReport();
                    showMessage('wafdeen-save-msg', 'تم حذف تقرير الأسبوع بنجاح ✅', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function wafdeenDeleteMonthlyReport() {
    return __awaiter(this, void 0, void 0, function () {
        var month, records, hasImported;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(currentWafdeenTeacher === null || currentWafdeenTeacher === void 0 ? void 0 : currentWafdeenTeacher.isAdmin))
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'هذه العملية متاحة للمدير فقط', 'error')];
                    month = ((_a = document.getElementById('wafdeenReportMonth')) === null || _a === void 0 ? void 0 : _a.value) || wafdeenTodayMonth();
                    records = wafdeenUsageData.filter(function (r) { return String(r.month || '') === month; });
                    hasImported = !!(wafdeenMonthlyImportedReports && wafdeenMonthlyImportedReports[month]);
                    if (!records.length && !hasImported)
                        return [2 /*return*/, showMessage('wafdeen-save-msg', 'لا توجد بيانات في تقرير هذا الشهر لحذفها', 'info')];
                    if (!confirm("\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0643\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0634\u0647\u0631\u064A \u0644\u0641\u062A\u0631\u0629 ".concat(month, " \u0646\u0647\u0627\u0626\u064A\u064B\u0627 (\u0628\u0645\u0627 \u0641\u064A\u0647\u0627 \u0623\u064A \u0645\u0644\u0641 \u0645\u0633\u062A\u0648\u0631\u062F) \u0645\u0646 \u0643\u0644 \u0627\u0644\u0623\u062C\u0647\u0632\u0629. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F")))
                        return [2 /*return*/];
                    return [4 /*yield*/, wafdeenDeleteUsageRecords(records)];
                case 1:
                    _b.sent();
                    if (hasImported) {
                        delete wafdeenMonthlyImportedReports[month];
                        wafdeenPersistLocal();
                    }
                    renderWafdeenMonthlyReport();
                    showMessage('wafdeen-save-msg', 'تم حذف التقرير الشهري بنجاح ✅', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
