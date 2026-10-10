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
/* ================= قائمة الصفوف المعتمدة ================= */
var ALL_CLASSES = [
    "تمهيدي",
    "الوافدين",
    "أولى - أولاد", "أولى - بنات",
    "ثانية - أولاد", "ثانية - بنات",
    "ثالثة - أولاد", "ثالثة - بنات",
    "رابعة - أولاد", "رابعة - بنات",
    "خامسة - أولاد", "خامسة - بنات",
    "أولى شرعي"
];
var GENERAL_CLASSES = ALL_CLASSES;
// حماية قائمة الفصول: لا تسمح لأي مزامنة أو فلتر مؤقت بمسح الفصول من الواجهة.
function restoreCanonicalClasses_(){
  if(!Array.isArray(window.ALL_CLASSES)||window.ALL_CLASSES.length===0) window.ALL_CLASSES = ["تمهيدي","الوافدين","أولى - أولاد","أولى - بنات","ثانية - أولاد","ثانية - بنات","ثالثة - أولاد","ثالثة - بنات","رابعة - أولاد","رابعة - بنات","خامسة - أولاد","خامسة - بنات","أولى شرعي"];
  window.GENERAL_CLASSES = window.ALL_CLASSES;
  try{ if(typeof renderClassCards==='function') renderClassCards(); }catch(e){}
  try{ if(typeof ensureAllClassSelects_==='function') ensureAllClassSelects_(); }catch(e){}
}

/* ================= 1. تهيئة السحابة (Supabase Configuration) ================= */
var firebaseConfig = {
    apiKey: "AIzaSyDMusCd7XWnzwgDYlaAJJxi6-LCfHniu64",
    authDomain: "school-system-53654.firebaseapp.com",
    projectId: "school-system-53654",
    storageBucket: "school-system-53654.firebasestorage.app",
    messagingSenderId: "1070744883084",
    appId: "1:1070744883084:web:a92f8241e27f2aeeca10a9",
    measurementId: "G-1KNJ0D6PN3"
};
var useFirebase = false;
var db = null;
var wafdeenStorage = null;
/* ================= Google Drive: كتب الوافدين (ملفات فقط) =================
   الرفع يتم إلى مجلد "كتب" عبر Google Apps Script.
   ملاحظة: Apps Script الحالي يستقبل الرفع عبر POST.
*/
var GOOGLE_DRIVE_BOOKS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzyL5JOq5wmD_ok42TsNWKMfJ2BvjMcyfU08azHIpiq2vuW6O6z8WN1_q6ni_Hztomo/exec';
function wafdeenGoogleDriveUpload(file, title, level, subject, onProgress) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        if (!file)
            return reject(new Error("لم يتم اختيار ملف"));
        if (file.size > 25 * 1024 * 1024)
            return reject(new Error("حجم الملف أكبر من 25 ميجابايت. اختر ملف PDF أصغر."));
        var reader = new FileReader();
        reader.onerror = function () { return reject(new Error("تعذر قراءة ملف PDF")); };
        reader.onprogress = function (e) { if (e.lengthComputable)
            onProgress === null || onProgress === void 0 ? void 0 : onProgress(Math.round((e.loaded / e.total) * 100)); };
        reader.onload = function () { return __awaiter(_this, void 0, void 0, function () {
            var payload, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        payload = { action: "upload", name: file.name, title: title, level: Number(level), subject: subject, file: reader.result };
                        onProgress === null || onProgress === void 0 ? void 0 : onProgress(100);
                        return [4 /*yield*/, fetch(GOOGLE_DRIVE_BOOKS_WEB_APP_URL, {
                                method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                                body: JSON.stringify(payload), cache: 'no-store', keepalive: true
                            })];
                    case 1:
                        _a.sent();
                        resolve({ ok: true });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        reader.readAsDataURL(file);
    });
}
function wafdeenLoadBooksFromGoogleDrive(subject) {
    return new Promise(function (resolve, reject) {
        var callbackName = "__wafdeenDriveBooks_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
        var script = document.createElement("script");
        var done = false;
        var cleanup = function () {
            try {
                delete window[callbackName];
            }
            catch (_) {
                window[callbackName] = undefined;
            }
            script.remove();
            clearTimeout(timer);
        };
        var timer = setTimeout(function () {
            if (done)
                return;
            done = true;
            cleanup();
            reject(new Error("تعذر قراءة قائمة الكتب من Google Drive. تأكد من نشر Apps Script كـ Web App بصلاحية Anyone."));
        }, 15000);
        window[callbackName] = function (result) {
            if (done)
                return;
            done = true;
            cleanup();
            if (result === null || result === void 0 ? void 0 : result.success) {
                var books = (result.books || []).map(function (b) { return ({
                    id: b.id,
                    title: (b.title || b.name || "كتاب").replace(/\.pdf$/i, ""),
                    level: Number(b.level || 1),
                    subject: b.subject || "fiqh",
                    fileName: b.name || b.fileName || "",
                    url: b.url,
                    download: b.download || ""
                }); }).filter(function (b) { return !subject || b.subject === subject; });
                resolve(books);
            }
            else
                reject(new Error((result === null || result === void 0 ? void 0 : result.error) || "تعذر جلب الكتب"));
        };
        script.onerror = function () { if (!done) {
            done = true;
            cleanup();
            reject(new Error("تعذر الاتصال بـ Google Drive"));
        } };
        script.src = GOOGLE_DRIVE_BOOKS_WEB_APP_URL + "?callback=" + encodeURIComponent(callbackName) + "&t=" + Date.now();
        (document.head || document.documentElement).appendChild(script);
    });
}
function runSystemConnectionTest() {
    return __awaiter(this, void 0, void 0, function () {
        var box;
        return __generator(this, function (_a) {
            box = document.getElementById('connection-test-box');
            if (!box) return [2 /*return*/];
            box.style.display = 'block';
            box.className = 'toast-msg';
            box.innerHTML = '⏳ جاري اختبار اتصال Supabase...';
            (async function () {
                try {
                    if (!db) throw new Error('Supabase غير مهيأ');
                    await db.collection('students').limit(1).get();
                    box.innerHTML = '✅ اتصال Supabase يعمل بنجاح';
                    box.className = 'toast-msg toast-success';
                } catch (e) {
                    box.innerHTML = '❌ تعذر الاتصال بـ Supabase<br><small>' + String((e && e.message) || e) + '</small>';
                    box.className = 'toast-msg toast-error';
                }
            })();
            return [2 /*return*/];
        });
    });
}
function firebaseSaveByAction_(action, data) {
    return __awaiter(this, void 0, void 0, function () {
        var r, id, col, e_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = data || {}, id = String(r.id || r.recordId || "".concat(action, "_").concat(Date.now()));
                    col = 'dailyRecords';
                    if (/^saveWafdeen|^updateWafdeen|^deleteWafdeen/.test(action))
                        col = 'wafdeenDailyRecords';
                    else if (/WafdeenExam/.test(action))
                        col = 'wafdeenExams';
                    else if (/WafdeenMonthlyReport/.test(action))
                        col = 'wafdeenMonthlyReports';
                    else if (/^saveExam|^updateExam|^deleteExam/.test(action))
                        col = 'exams';
                    if (!useFirebase || !db)
                        return [2 /*return*/, false];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!/^delete/.test(action)) return [3 /*break*/, 3];
                    return [4 /*yield*/, deleteFirebaseRecord(col, id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, db.collection(col).doc(id).set(__assign(__assign({}, r), { id: id, recordId: String(r.recordId || id), updatedAt: new Date().toISOString() }), { merge: true })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, true];
                case 6:
                    e_15 = _a.sent();
                    console.error('Supabase save error:', e_15);
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function firebaseGetWafdeenMonthlyReports_(filters) {
    return __awaiter(this, void 0, void 0, function () { var snap, rows; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!useFirebase || !db)
                    return [2 /*return*/, { ok: true, rows: [], source: 'Firebase' }];
                return [4 /*yield*/, db.collection('wafdeenMonthlyReports').get()];
            case 1:
                snap = _a.sent();
                rows = [];
                snap.forEach(function (d) { var v = d.data() || {}; if (!v._deleted)
                    rows.push(__assign(__assign({}, v), { id: String(v.id || d.id) })); });
                return [2 /*return*/, { ok: true, rows: rows, source: 'Firebase' }];
        }
    }); });
}
/* ================= المصروفات: Supabase ================= */
/*
  المصروفات تُحفظ وتُقرأ وتُحذف من Supabase، مع نسخة محلية مساعدة عند انقطاع الاتصال.
*/
var PAYMENTS_LOCAL_KEY = 'wafdeenPaymentsLocal_v2';
function getLocalPayments_() { try {
    var a = JSON.parse(memoryStorage.getItem(PAYMENTS_LOCAL_KEY) || '[]');
    return Array.isArray(a) ? a : [];
}
catch (_) {
    return [];
} }
function setLocalPayments_(a) { try {
    memoryStorage.setItem(PAYMENTS_LOCAL_KEY, JSON.stringify((Array.isArray(a) ? a : []).slice(-2000)));
}
catch (_) { } }
function upsertLocalPayment_(record) { var rows = getLocalPayments_(); var rid = String(record.recordId || record.id || ''); var i = rows.findIndex(function (x) { return String(x.recordId || x.id) === rid; }); if (i >= 0)
    rows[i] = __assign(__assign({}, rows[i]), record);
else
    rows.push(record); setLocalPayments_(rows); }
function removeLocalPayment_(recordId) { setLocalPayments_(getLocalPayments_().filter(function (x) { return String(x.recordId || x.id) !== String(recordId); })); }
function mergePaymentRows_(cloudRows) {
    var e_16, _a;
    var cloud = Array.isArray(cloudRows) ? cloudRows : [], local = getLocalPayments_(), out = cloud.slice();
    var _loop_1 = function (row) {
        var rid = String(row.recordId || row.id || '');
        var i = out.findIndex(function (x) { return String(x.recordId || x.id || '') === rid; });
        if (i >= 0)
            out[i] = __assign(__assign({}, out[i]), row);
        else
            out.push(row);
    };
    try {
        for (var local_1 = __values(local), local_1_1 = local_1.next(); !local_1_1.done; local_1_1 = local_1.next()) {
            var row = local_1_1.value;
            _loop_1(row);
        }
    }
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (local_1_1 && !local_1_1.done && (_a = local_1.return)) _a.call(local_1);
        }
        finally { if (e_16) throw e_16.error; }
    }
    return out;
}
function getFirebasePayments_() {
    return __awaiter(this, void 0, void 0, function () {
        var snap, rows_2, e_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(useFirebase && db)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.collection('payments').get()];
                case 2:
                    snap = _a.sent();
                    rows_2 = [];
                    snap.forEach(function (d) { var v = d.data() || {}; if (!v._deleted)
                        rows_2.push(__assign(__assign({}, v), { recordId: String(v.recordId || d.id), id: String(v.id || v.recordId || d.id), _firebaseDocId: String(d.id) })); });
                    setLocalPayments_(rows_2);
                    return [2 /*return*/, rows_2];
                case 3:
                    e_17 = _a.sent();
                    console.warn('تعذر قراءة المصروفات من Supabase:', e_17);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, getLocalPayments_()];
            }
        });
    });
}
function savePaymentToFirebase_(recordId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var id, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = String(recordId || (data === null || data === void 0 ? void 0 : data.recordId) || (data === null || data === void 0 ? void 0 : data.id) || '');
                    if (!id)
                        throw new Error('معرف الدفعة مفقود');
                    record = __assign(__assign({}, (data || {})), { recordId: id, id: id, updatedAt: new Date().toISOString() });
                    if (!(useFirebase && db)) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.collection('payments').doc(id).set(record, { merge: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    upsertLocalPayment_(record);
                    return [2 /*return*/, true];
            }
        });
    });
}
function deletePaymentFromFirebase_(recordId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, deleteFirebaseRecord('payments', recordId)];
                case 1:
                    return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function firebaseSavePaymentAction_(action, recordId, data) {
    return __awaiter(this, void 0, void 0, function () { var _a, e_19; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                if (!(action === 'deletePayment')) return [3 /*break*/, 2];
                return [4 /*yield*/, deletePaymentFromFirebase_(recordId)];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, savePaymentToFirebase_(recordId, data)];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4: return [2 /*return*/, _a];
            case 5:
                e_19 = _b.sent();
                console.error('Firebase payment error:', e_19);
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    }); });
}
function flushPaymentsQueue_() { return Promise.resolve(true); }
function firebaseGetPayments_(filters) {
    return __awaiter(this, void 0, void 0, function () { var rows, rid, cls, stu; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getFirebasePayments_()];
            case 1:
                rows = _a.sent();
                filters = filters || {};
                rid = String(filters.recordId || '').trim(), cls = String(filters.className || '').trim(), stu = String(filters.studentName || '').trim();
                return [2 /*return*/, { ok: true, source: 'Firebase', rows: rows.filter(function (r) { return (!rid || String(r.recordId || r.id) === rid) && (!cls || String(r.className || '') === cls) && (!stu || String(r.studentName || '') === stu); }) }];
        }
    }); });
}
var PAYMENT_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
function normalizePaymentIdPart_(v) {
    return String(v || '').trim().replace(/[^\p{L}\p{N}_-]/gu, '_').slice(0, 60) || 'x';
}
function paymentRecordId_(studentId, studentName, month) {
    return 'payment_' + normalizePaymentIdPart_(studentId || studentName) + '_' + normalizePaymentIdPart_(month);
}
function teacherCanAccessWafdeen_(teacher) {
    if (!teacher) return false;
    if (teacher.username === 'admin' || teacher.assignedClass === 'الكل' || teacher.center === 'الكل') return true;
    return teacher.assignedClass === 'الوافدين' || !!teacher.canWafdeen;
}
/* ===== [إصلاح الرصد] مطابقة الفصل بشكل موحّد وآمن للمدرس ===== */
function teacherClassNormalize_(v) {
    var s = String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
    if (typeof nameMapping !== 'undefined' && nameMapping[s]) s = nameMapping[s];
    if (typeof ALL_CLASSES !== 'undefined') {
        if (ALL_CLASSES.indexOf(s) > -1) return s;
        var loose = function (x) { return String(x).replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s*-\s*/g, '-').replace(/\s+/g, ''); };
        var k = loose(s);
        for (var i = 0; i < ALL_CLASSES.length; i++) if (loose(ALL_CLASSES[i]) === k) return ALL_CLASSES[i];
    }
    return s;
}
function isDailyClassManager_() {
    return !!(currentTeacher && (String(currentTeacher.username || '').trim() === 'admin' || String(currentTeacher.assignedClass || '').trim() === 'الكل'));
}
function teacherOwnsClass_(className) {
    if (isDailyClassManager_()) return true;
    if (!currentTeacher) return false;
    var a = teacherClassNormalize_(currentTeacher.assignedClass), c = teacherClassNormalize_(className);
    return !!a && a === c;
}
function ensureAllClassSelects_() {
    try {
        var manager_1 = !!(currentTeacher && (currentTeacher.username === 'admin' || currentTeacher.assignedClass === 'الكل' || currentTeacher.center === 'الكل'));
        var allowed_1 = manager_1 ? ALL_CLASSES : (function () {
            var assigned = currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.assignedClass;
            /* [إصلاح] لا نعطي المدرس كل الفصول أبدًا: نطابق فصله بعد التطبيع، وإلا نقفله على فصله فقط. */
            if (!assigned) return [];
            var assignedNorm_ = teacherClassNormalize_(assigned);
            if (!ALL_CLASSES.includes(assigned)) assigned = ALL_CLASSES.includes(assignedNorm_) ? assignedNorm_ : assigned;
            var list = [assigned];
            if (assigned !== 'الوافدين' && currentTeacher && currentTeacher.canWafdeen) list.push('الوافدين');
            return list;
        })();
        var ids = ['classSelect', 'dailyClassSelect', 'weeklyClassSelect', 'monthlyClassSelect', 'attendanceClassSelect', 'paymentsClassSelect', 'paymentReportClassSelect', 'notesClassSelect'];
        ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            var current = el.value;
            var listForId = allowed_1;
            var values = Array.from(el.options || []).map(function (o) { return o.value; }).filter(Boolean);
            var needsFill = !values.length || values.length !== listForId.length || listForId.some(function (c) { return !values.includes(c); });
            if (needsFill) {
                el.innerHTML = listForId.map(function (c) { return "<option value=\"".concat(String(c).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'), "\">").concat(c, "</option>"); }).join('');
            }
            if (listForId.includes(current)) el.value = current;
            else if (listForId.length) el.value = listForId[0].valueOf();
            if (id === 'classSelect' || id === 'dailyClassSelect') {
                if (!manager_1 && (currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.assignedClass) && listForId.includes(currentTeacher.assignedClass)) el.value = currentTeacher.assignedClass;
            }
        });
        var monthSel = document.getElementById('paymentsMonthSelect');
        if (monthSel && typeof PAYMENT_MONTHS !== 'undefined' && !monthSel.options.length) {
            monthSel.innerHTML = PAYMENT_MONTHS.map(function (m) { return "<option value=\"".concat(m, "\">").concat(m, "</option>"); }).join('');
        }
    }
    catch (e) {
        console.warn('تعذر تهيئة قوائم الفصول:', e);
    }
}
function populatePaymentsClasses() {
    var sel = document.getElementById('paymentsClassSelect');
    if (!sel)
        return;
    var isManagerNow = currentTeacher && (currentTeacher.username === 'admin' || currentTeacher.assignedClass === 'الكل' || currentTeacher.center === 'مشرف');
    var classes = isManagerNow ? GENERAL_CLASSES : [currentTeacher.assignedClass];
    var current = sel.value;
    sel.innerHTML = classes.map(function (c) { return "<option value=\"".concat(c, "\">").concat(c, "</option>"); }).join('');
    if (classes.includes(current))
        sel.value = current;
    var monthSel = document.getElementById('paymentsMonthSelect');
    if (monthSel && !monthSel.options.length) {
        monthSel.innerHTML = PAYMENT_MONTHS.map(function (m) { return "<option value=\"".concat(m, "\">").concat(m, "</option>"); }).join('');
    }
}
function updatePaymentsStudentList() {
    var classSel = document.getElementById('paymentsClassSelect');
    var studentSel = document.getElementById('paymentsStudentSelect');
    if (!classSel || !studentSel)
        return;
    var className = classSel.value;
    var current = studentSel.value;
    var students = studentsData.filter(function (s) { return s.className === className; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    studentSel.innerHTML = students.length
        ? students.map(function (st) { return "<option value=\"".concat(st.name, "\" data-id=\"").concat(st.id, "\">").concat(st.name, "</option>"); }).join('')
        : '<option value="">لا توجد أسماء مسجلة في هذا الصف</option>';
    if (students.some(function (st) { return st.name === current; }))
        studentSel.value = current;
    updatePaymentsStudentPaidMonths();
}
function updatePaymentsStudentPaidMonths() {
    return __awaiter(this, void 0, void 0, function () {
        var box, classSel, studentSel, r, months, e_20, months;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    box = document.getElementById('payments-paid-months');
                    classSel = document.getElementById('paymentsClassSelect');
                    studentSel = document.getElementById('paymentsStudentSelect');
                    if (!box || !classSel || !studentSel || !studentSel.value) {
                        if (box)
                            box.innerText = '';
                        return [2 /*return*/];
                    }
                    box.innerText = 'جاري تحميل الأشهر المدفوعة سابقًا...';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = {};
                    return [4 /*yield*/, getFirebasePayments_()];
                case 2:
                    r = (_a.rows = _b.sent(), _a);
                    months = mergePaymentRows_(r.rows || []).filter(function (row) { return row.className === classSel.value && row.studentName === studentSel.value; }).map(function (row) { return row.month; }).filter(Boolean);
                    box.innerText = months.length ? ('✅ الأشهر المدفوعة سابقًا: ' + months.join('، ')) : 'لا توجد دفعات مسجلة لهذا الطالب بعد.';
                    return [3 /*break*/, 4];
                case 3:
                    e_20 = _b.sent();
                    months = getLocalPayments_()
                        .filter(function (row) { return row.className === classSel.value && row.studentName === studentSel.value; })
                        .map(function (row) { return row.month; }).filter(Boolean);
                    box.innerText = months.length ? ('✅ الأشهر المدفوعة سابقًا: ' + months.join('، ')) : 'لا توجد دفعات مسجلة لهذا الطالب بعد.';
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function savePaymentRecord() {
    return __awaiter(this, void 0, void 0, function () {
        var classSel, studentSel, monthSel, amountInput, className, studentName, studentId, month, amountRaw, id, localRows, existing, _a, data, ok;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    classSel = document.getElementById('paymentsClassSelect');
                    studentSel = document.getElementById('paymentsStudentSelect');
                    monthSel = document.getElementById('paymentsMonthSelect');
                    amountInput = document.getElementById('paymentsAmountInput');
                    className = (classSel === null || classSel === void 0 ? void 0 : classSel.value) || '';
                    studentName = (studentSel === null || studentSel === void 0 ? void 0 : studentSel.value) || '';
                    studentId = ((_d = (_c = (_b = studentSel === null || studentSel === void 0 ? void 0 : studentSel.selectedOptions) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.dataset) === null || _d === void 0 ? void 0 : _d.id) || '';
                    month = (monthSel === null || monthSel === void 0 ? void 0 : monthSel.value) || '';
                    amountRaw = String((amountInput === null || amountInput === void 0 ? void 0 : amountInput.value) || '').trim();
                    if (!className || !studentName)
                        return [2 /*return*/, showMessage('payments-msg', 'يرجى اختيار الصف والطالب.', 'error')];
                    if (!month)
                        return [2 /*return*/, showMessage('payments-msg', 'يرجى اختيار الشهر المدفوع.', 'error')];
                    if (!amountRaw || !/^\d+$/.test(amountRaw))
                        return [2 /*return*/, showMessage('payments-msg', 'يرجى كتابة المبلغ بالأرقام فقط.', 'error')];
                    id = paymentRecordId_(studentId, studentName, month);
                    localRows = getLocalPayments_();
                    _a = localRows.some(function (row) { return row.className === className && row.studentName === studentName && row.month === month; });
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, getFirebasePayments_()];
                case 1:
                    _a = (_e.sent()).some(function (row) { return row.className === className && row.studentName === studentName && row.month === month; });
                    _e.label = 2;
                case 2:
                    existing = _a;
                    data = {
                        studentName: studentName,
                        studentId: studentId,
                        className: className,
                        month: month,
                        amount: Number(amountRaw),
                        paidDate: new Date().toISOString().slice(0, 10),
                        recordedBy: (currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.username) || '',
                        recordId: id
                    };
                    upsertLocalPayment_(data);
                    return [4 /*yield*/, firebaseSavePaymentAction_(existing ? 'updatePayment' : 'savePayment', id, data)];
                case 3:
                    ok = _e.sent();
                    showMessage('payments-msg', ok ? 'تم حفظ الدفعة في Supabase بنجاح ✅' : 'تم حفظ الدفعة محليًا وفي Supabase.', ok ? 'success' : 'info');
                    amountInput.value = '';
                    updatePaymentsStudentPaidMonths();
                    return [2 /*return*/];
            }
        });
    });
}
function populatePaymentReportClasses() {
    var sel = document.getElementById('paymentReportClassSelect');
    if (!sel)
        return;
    var isManagerNow = currentTeacher && (currentTeacher.username === 'admin' || currentTeacher.assignedClass === 'الكل' || currentTeacher.center === 'مشرف');
    var classes = isManagerNow ? GENERAL_CLASSES : [currentTeacher.assignedClass];
    var current = sel.value;
    sel.innerHTML = classes.map(function (c) { return "<option value=\"".concat(c, "\">").concat(c, "</option>"); }).join('');
    if (classes.includes(current))
        sel.value = current;
}
function updatePaymentReportStudentList() {
    var classSel = document.getElementById('paymentReportClassSelect');
    var studentSel = document.getElementById('paymentReportStudentSelect');
    if (!classSel || !studentSel)
        return;
    var className = classSel.value;
    var current = studentSel.value;
    var students = studentsData.filter(function (s) { return s.className === className; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    studentSel.innerHTML = students.length
        ? students.map(function (st) { return "<option value=\"".concat(st.name, "\">").concat(st.name, "</option>"); }).join('')
        : '<option value="">لا توجد أسماء مسجلة في هذا الصف</option>';
    if (students.some(function (st) { return st.name === current; }))
        studentSel.value = current;
    renderPaymentReportTable();
}
function renderPaymentReportTable() {
    return __awaiter(this, void 0, void 0, function () {
        var tbody, classSel, studentSel, filterRows, rows, renderRows, r, e_21;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tbody = document.querySelector('#paymentReportTable tbody');
                    classSel = document.getElementById('paymentReportClassSelect');
                    studentSel = document.getElementById('paymentReportStudentSelect');
                    if (!tbody)
                        return [2 /*return*/];
                    if (!(classSel === null || classSel === void 0 ? void 0 : classSel.value) || !(studentSel === null || studentSel === void 0 ? void 0 : studentSel.value)) {
                        tbody.innerHTML = '<tr><td colspan="5" style="padding:25px;color:#777;">اختر الصف والطالب لعرض مقرر الدفع.</td></tr>';
                        return [2 /*return*/];
                    }
                    filterRows = function (rows) { return (Array.isArray(rows) ? rows : [])
                        .filter(function (row) { return row.className === classSel.value && row.studentName === studentSel.value; })
                        .slice()
                        .sort(function (a, b) {
                        var ai = PAYMENT_MONTHS.indexOf(a.month), bi = PAYMENT_MONTHS.indexOf(b.month);
                        return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
                    }); };
                    rows = filterRows(mergePaymentRows_(getLocalPayments_()));
                    renderRows = function (data) {
                        tbody.innerHTML = data.length ? data.map(function (row) {
                            var _a;
                            var rid = String(row.recordId || paymentRecordId_(row.studentId || '', row.studentName || '', row.month || ''));
                            var safeRid = rid.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                            return "<tr>\n        <td>".concat(row.month || '-', "</td>\n        <td>").concat((_a = row.amount) !== null && _a !== void 0 ? _a : '-', "</td>\n        <td>").concat(row.paidDate || '-', "</td>\n        <td>").concat(row.recordedBy || '-', "</td>\n        <td style=\"white-space:nowrap;\">\n          <button type=\"button\" class=\"action-btn btn-save\" style=\"padding:6px 10px;font-size:.82em;\" onclick=\"editPaymentRecord('").concat(safeRid, "')\">\u270F\uFE0F \u062A\u0639\u062F\u064A\u0644</button>\n          <button type=\"button\" class=\"action-btn btn-delete\" style=\"padding:6px 10px;font-size:.82em;margin-right:5px;\" onclick=\"deletePaymentRecord('").concat(safeRid, "')\">\uD83D\uDDD1\uFE0F \u0645\u0633\u062D</button>\n        </td>\n      </tr>");
                        }).join('') : '<tr><td colspan="5" style="padding:25px;color:#777;">لا توجد دفعات مسجلة لهذا الطالب.</td></tr>';
                    };
                    if (rows.length)
                        renderRows(rows);
                    else
                        tbody.innerHTML = '<tr><td colspan="5" style="padding:25px;color:#777;">⏳ جاري تحميل الدفعات...</td></tr>';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = {};
                    return [4 /*yield*/, getFirebasePayments_()];
                case 2:
                    r = (_a.rows = _b.sent(), _a);
                    rows = filterRows(mergePaymentRows_(r.rows || []));
                    renderRows(rows);
                    return [3 /*break*/, 4];
                case 3:
                    e_21 = _b.sent();
                    if (!rows.length)
                        renderRows([]);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getPaymentByRecordId_(recordId) {
    return __awaiter(this, void 0, void 0, function () {
        var rid, row, rows, _2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rid = String(recordId || '');
                    row = getLocalPayments_().find(function (x) { return String(x.recordId || '') === rid; });
                    if (row)
                        return [2 /*return*/, row];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getFirebasePayments_()];
                case 2:
                    rows = _a.sent();
                    row = rows.find(function (x) { return String(x.recordId || x.id || '') === rid; });
                    return [2 /*return*/, row || null];
                case 3:
                    _2 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function editPaymentRecord(recordId) {
    return __awaiter(this, void 0, void 0, function () {
        var row, amountRaw, dateRaw, paidDate, updated, ok;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPaymentByRecordId_(recordId)];
                case 1:
                    row = _b.sent();
                    if (!row)
                        return [2 /*return*/, showMessage('payment-report-msg', 'تعذر العثور على الدفعة.', 'error')];
                    amountRaw = prompt('اكتب المبلغ الجديد:', String((_a = row.amount) !== null && _a !== void 0 ? _a : ''));
                    if (amountRaw === null)
                        return [2 /*return*/];
                    if (!/^\\d+$/.test(String(amountRaw).trim())) {
                        return [2 /*return*/, showMessage('payment-report-msg', 'المبلغ يجب أن يكون أرقامًا فقط.', 'error')];
                    }
                    dateRaw = prompt('اكتب تاريخ الدفع (مثال: 2026-09-15):', String(row.paidDate || ''));
                    if (dateRaw === null)
                        return [2 /*return*/];
                    paidDate = String(dateRaw).trim();
                    if (paidDate && !/^\\d{4}-\\d{2}-\\d{2}$/.test(paidDate)) {
                        return [2 /*return*/, showMessage('payment-report-msg', 'صيغة التاريخ يجب أن تكون YYYY-MM-DD.', 'error')];
                    }
                    updated = __assign(__assign({}, row), { amount: Number(String(amountRaw).trim()), paidDate: paidDate || row.paidDate || '', recordId: String(recordId) });
                    upsertLocalPayment_(updated);
                    return [4 /*yield*/, firebaseSavePaymentAction_('updatePayment', String(recordId), updated)];
                case 2:
                    ok = _b.sent();
                    if (ok)
                        showMessage('payment-report-msg', 'تم تعديل الدفعة في Supabase بنجاح ✅', 'success');
                    else
                        showMessage('payment-report-msg', 'تم تعديل الدفعة وحفظها في Supabase.', 'info');
                    return [4 /*yield*/, renderPaymentReportTable()];
                case 3:
                    _b.sent();
                    updatePaymentsStudentPaidMonths();
                    return [2 /*return*/];
            }
        });
    });
}
function deletePaymentRecord(recordId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, row, result, e_22;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = String(recordId || '').trim();
                    if (!id)
                        return [2 /*return*/, showMessage('payment-report-msg', 'معرف الدفعة غير موجود.', 'error')];
                    return [4 /*yield*/, getPaymentByRecordId_(id)];
                case 1:
                    row = _b.sent();
                    if (!row)
                        return [2 /*return*/, showMessage('payment-report-msg', 'تعذر العثور على الدفعة.', 'error')];
                    if (!confirm("\u0647\u0644 \u062A\u0631\u064A\u062F \u0645\u0633\u062D \u062F\u0641\u0639\u0629 \u0634\u0647\u0631 ".concat(row.month || '', " \u0628\u0645\u0628\u0644\u063A ").concat((_a = row.amount) !== null && _a !== void 0 ? _a : '', "\u061F\n\u0633\u064A\u062A\u0645 \u062D\u0630\u0641\u0647\u0627 \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 Supabase.")))
                        return [2 /*return*/];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, deletePaymentFromFirebase_(id)];
                case 3:
                    result = _b.sent();
                    if (!(result === null || result === void 0 ? void 0 : result.deleted))
                        throw new Error('لم يتم تأكيد حذف الدفعة');
                    showMessage('payment-report-msg', 'تم مسح الدفعة نهائيًا من Supabase ✅', 'success');
                    return [3 /*break*/, 5];
                case 4:
                    e_22 = _b.sent();
                    console.error('Supabase payment delete error:', e_22);
                    showMessage('payment-report-msg', 'تعذر المسح من Supabase: ' + String((e_22 === null || e_22 === void 0 ? void 0 : e_22.message) || e_22), 'error');
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, renderPaymentReportTable()];
                case 6:
                    _b.sent();
                    updatePaymentsStudentPaidMonths();
                    return [2 /*return*/];
            }
        });
    });
}
/* Supabase هو مصدر البيانات الرئيسي. يحتفظ الموقع بأسماء useFirebase/db للتوافق الداخلي فقط. */
/* طبقة توافق تشغيلية: واجهة Supabase داخل الموقع، والتخزين الفعلي في Supabase. */
(function () {
  'use strict';
  const isLocalVite = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const APP_URL = isLocalVite ? '/__supabase/functions/v1/smart-worker' : 'https://kryihlhqsxauhnbaukqe.supabase.co/functions/v1/smart-worker';
  const TOKEN_KEY = 'majd_supabase_app_token';
  const token = () => { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (_) { return ''; } };
  async function call(action, body) {
    const headers = { 'Content-Type': 'application/json' };
    const t = token(); if (t) headers.Authorization = 'Bearer ' + t;
    const r = await fetch(APP_URL, { method: 'POST', headers, body: JSON.stringify({ action, ...(body || {}) }), cache: 'no-store' });
    const x = await r.json().catch(() => ({}));
    if (!r.ok || x.ok === false) throw new Error(x.error || ('Supabase HTTP ' + r.status));
    return x;
  }
  function snap(id, value, exists) {
    const data = value || {};
    return { id: String(id), exists: exists !== false, data: () => ({ ...data }), ref: null };
  }
  class Query {
    constructor(name, filters, order, max, after) { this.name=name; this.filters=filters||[]; this.order=order||null; this.max=max||null; this.after=after==null?null:String(after); }
    where(field, op, value) { return new Query(this.name, this.filters.concat([[field,op,value]]), this.order, this.max, this.after); }
    orderBy(field, direction) { return new Query(this.name, this.filters, [field,direction||'asc'], this.max, this.after); }
    limit(n) { return new Query(this.name, this.filters, this.order, Number(n), this.after); }
    startAfter(value) { return new Query(this.name, this.filters, this.order, this.max, value && value.id != null ? value.id : value); }
    async rows() {
      if (!token()) return [];
      const x = await call('list', { collection: this.name, limit: 10000 });
      let rows = (x.rows || []).map(v => ({ id:String(v.id), value:{...v} }));
      const get = (o, path) => String(path).split('.').reduce((a,k)=>a == null ? undefined : a[k], o);
      rows = rows.filter(r => this.filters.every(([f,op,v]) => { const a=get(r.value,f); if(op==='==') return String(a ?? '')===String(v ?? ''); if(op==='!=') return String(a ?? '')!==String(v ?? ''); return true; }));
      if (this.after != null) rows = rows.filter(r => r.id > String(this.after));
      if (this.order) { const [f,dir]=this.order; rows.sort((a,b)=>{const av=get(a.value,f),bv=get(b.value,f); return (av>bv?1:av<bv?-1:0)*(dir==='desc'?-1:1);}); }
      if (this.max != null) rows = rows.slice(0,this.max);
      return rows;
    }
    async get() { const rows=await this.rows(); const docs=rows.map(r=>snap(r.id,r.value,true)); docs.forEach(d=>{d.ref=new Doc(this.name,d.id);}); return { docs, size:docs.length, empty:!docs.length, forEach:fn=>docs.forEach(fn) }; }
    onSnapshot(next, error) { let stopped=false, last=''; const poll=async()=>{try{const s=await this.get();const sig=s.docs.map(d=>d.id+JSON.stringify(d.data())).join('|');if(sig!==last){last=sig;next(s);}}catch(e){if(error)error(e);}}; poll(); const timer=setInterval(()=>{if(!stopped)poll();},30000); return ()=>{stopped=true;clearInterval(timer);}; }
  }
  class Doc {
    constructor(name,id){this.name=name;this.id=String(id);}
    async get(){const q=new Query(this.name).where('id','==',this.id).limit(1);const s=await q.get();const d=s.docs[0]||snap(this.id,{},false);d.ref=this;return d;}
    async set(data, opts){const x=await call('save',{collection:this.name,id:this.id,record:{...(data||{}),id:this.id},merge:!(opts&&opts.merge===false)});return x;}
    async update(data){return this.set(data,{merge:true});}
    async delete(){return call('delete',{collection:this.name,id:this.id});}
  }
  class Collection extends Query {
    constructor(name){super(name,[],null,null,null);this.name=name;}
    doc(id){return new Doc(this.name,id);}
  }
  window.__MAJD_SUPABASE_APP__={call,token,TOKEN_KEY,db:{collection:name=>new Collection(name),batch(){const ops=[];return {set:(ref,data,opts)=>ops.push(()=>ref.set(data,opts)),delete:ref=>ops.push(()=>ref.delete()),commit:()=>Promise.all(ops.map(f=>f()))};}}};
})();

window.firebase = { firestore: { FieldPath: { documentId: function(){ return '__document_id__'; } } }, auth: function(){ return { currentUser:null, signInAnonymously:function(){ return Promise.reject(new Error('Firebase Auth disabled')); } }; }, storage: function(){ return null; } };
try {
    db = window.__MAJD_SUPABASE_APP__.db;
    useFirebase = true;
    wafdeenStorage = null;
}
catch (e) {
    console.warn("تعذر تهيئة طبقة Supabase", e);
}
// حماية الواجهة من أخطاء JavaScript غير المتوقعة: لا تمنع حفظ البيانات المحلية.
window.addEventListener('error', function (e) { return console.error('Global JS error:', e.error || e.message); });
window.addEventListener('unhandledrejection', function (e) { return console.error('Unhandled promise rejection:', e.reason); });
window.addEventListener('online', function () {
    try {
        syncDataFromCloud();
    }
    catch (_) { }
    try {
        wafdeenLoadCloud();
    }
    catch (_) { }
});
// تهيئة EmailJS
(function () {
    try {
        emailjs.init("YOUR_PUBLIC_KEY");
    }
    catch (e) { }
})();
var defaultStudents = [];
var defaultTeachers = [{ id: "1", username: "admin", password: "admin123", assignedClass: "الكل", center: "الكل" }];
var teachersData = [];
var studentsData = [];
var dailyRecords = [];
var shariaGradesData = [];
var notesData = [];
var resultsData = [];
var resultExcelTemplates = { normal: null, preparatory: null };
var currentTeacher = (function(){
    try { return JSON.parse(persistentAuthStorage.getItem('currentTeacher') || 'null'); }
    catch (_) { return null; }
})();

var isShowingAllDays = false;
var currentManagerClass = 'أولى - أولاد';
var nameMapping = {
    "اولي شارعي": "أولى شرعي", "الوافدين": "الوافدين", "الصف الأول الشرعي - أولاد": "أولى شرعي", "الصف الأول الشرعي - بنات": "أولى شرعي",
    "الصف الأول - أولاد": "أولى - أولاد", "الصف الأول - بنات": "أولى - بنات",
    "الصف الثاني - أولاد": "ثانية - أولاد", "الصف الثاني - بنات": "ثانية - بنات",
    "الصف الثالث - أولاد": "ثالثة - أولاد", "الصف الثالث - بنات": "ثالثة - بنات",
    "الصف الرابع - أولاد": "رابعة - أولاد", "الصف الرابع - بنات": "رابعة - بنات",
    "الصف الخامس - أولاد": "خامسة - أولاد", "الصف الخامس - بنات": "خامسة - بنات"
};
function applyDataMapping(item) {
    if (item.className && nameMapping[item.className])
        item.className = nameMapping[item.className];
    if (item.assignedClass && nameMapping[item.assignedClass])
        item.assignedClass = nameMapping[item.assignedClass];
    return item;
}
var STUDENT_LOGIN_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generateStudentLoginCode(existingCodes) {
    if (existingCodes === void 0) { existingCodes = new Set(); }
    var code = '';
    do {
        code = '';
        for (var i = 0; i < 6; i++) {
            code += STUDENT_LOGIN_CODE_CHARS.charAt(Math.floor(Math.random() * STUDENT_LOGIN_CODE_CHARS.length));
        }
    } while (existingCodes.has(code));
    existingCodes.add(code);
    return code;
}
// توافق مع النسخ السابقة: بعض مسارات النتائج القديمة كانت تستدعي generateResultCode.
function generateResultCode(existingCodes) {
    return generateStudentLoginCode(existingCodes || new Set());
}
// كود الطالب يتغير مرة واحدة فقط مع بداية كل شهر، ويظل ثابتاً طوال الشهر.
// نستخدم مفتاح الطالب + الشهر لتوليد نفس الكود على كل الأجهزة، حتى لا يتغير
// الكود بسبب فتح الموقع أو المزامنة أكثر من مرة.
function getCurrentLoginCodeMonth() {
    var d = new Date();
    return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'));
}
function deterministicStudentLoginCode(student, monthKey) {
    var seed = "".concat(student.id || '', "|").concat(student.name || '', "|").concat(student.className || '', "|").concat(monthKey);
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    var code = '';
    for (var i = 0; i < 6; i++) {
        h += 0x6D2B79F5;
        var t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        var rnd = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        code += STUDENT_LOGIN_CODE_CHARS.charAt(Math.floor(rnd * STUDENT_LOGIN_CODE_CHARS.length));
    }
    return code;
}
function ensureStudentLoginCodes(list) {
    var monthKey = getCurrentLoginCodeMonth();
    var used = new Set();
    return list.map(function (s) {
        var storedMonth = String(s.loginCodeMonth || '').trim();
        // الأكواد القديمة التي لا تحمل تاريخاً: نحافظ عليها لأول شهر فقط، ثم يبدأ النظام
        // نظام التغيير الشهري من الشهر التالي.
        if (!storedMonth) {
            s.loginCode = String(s.loginCode || '').trim().toUpperCase() || deterministicStudentLoginCode(s, monthKey);
            s.loginCodeMonth = monthKey;
        }
        else if (storedMonth !== monthKey) {
            s.loginCode = deterministicStudentLoginCode(s, monthKey);
            s.loginCodeMonth = monthKey;
        }
        else {
            s.loginCode = String(s.loginCode || '').trim().toUpperCase() || deterministicStudentLoginCode(s, monthKey);
        }
        // منع التكرار داخل نفس الشهر بشكل حتمي قدر الإمكان.
        var candidate = s.loginCode;
        var attempt = 0;
        while (used.has(candidate) && attempt < 20) {
            candidate = deterministicStudentLoginCode(__assign(__assign({}, s), { id: "".concat(s.id || s.name, "-").concat(attempt + 1) }), monthKey);
            attempt++;
        }
        s.loginCode = candidate;
        used.add(candidate);
        return s;
    });
}
function migrateOldData() {
    // Cloud-only: Firestore هو المصدر الوحيد للبيانات.
    teachersData = []; studentsData = []; dailyRecords = []; shariaGradesData = []; notesData = []; resultsData = [];
}

function initResultMonthField() {
    var el = document.getElementById('resultMonthKey');
    if (el && !el.value) {
        var d = new Date();
        el.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    }
}
window.onload = function () {
    initResultMonthField();
    // Cloud-only: لا توجد مرحلة تحميل من الجهاز.
    if (useFirebase)
        syncDataFromCloud();
    if (currentTeacher && window.__MAJD_SUPABASE_APP__ && !window.__MAJD_SUPABASE_APP__.token()) {
        // A locally persisted teacher is not a cloud session. Require a fresh
        // login so syncCollection_ does not silently skip every cloud read.
        currentTeacher = null;
        try { persistentAuthStorage.removeItem('currentTeacher'); } catch (_) { }
        showLoginScreen();
    }
    else if (currentTeacher) {
        currentTeacher = applyDataMapping(currentTeacher);
        var updatedTeacher = teachersData.find(function (t) { return t.username === currentTeacher.username; });
        if (updatedTeacher) {
            currentTeacher = updatedTeacher;
            persistentAuthStorage.setItem('currentTeacher', JSON.stringify(currentTeacher));
        }
        showAppScreen();
    }
    else if (currentWafdeenTeacher && typeof showWafdeenAppScreen === 'function') {
        showWafdeenAppScreen();
    }
    else {
        showLoginScreen();
    }
    document.getElementById('reportMonth').value = new Date().getMonth();
    document.getElementById('reportYear').value = new Date().getFullYear();
    if (document.getElementById('topStudentsMonth')) {
        var now = new Date();
        var todayISO = getISODateOnly(now);
        document.getElementById('topStudentsDayDate').value = todayISO;
        document.getElementById('topStudentsWeekDate').value = todayISO;
        document.getElementById('topStudentsMonth').value = now.getMonth();
        document.getElementById('topStudentsYear').value = now.getFullYear();
    }
    renderTopStudents();
    document.getElementById('mgrMonthSelect').value = new Date().getMonth();
    document.getElementById('mgrYearSelect').value = new Date().getFullYear();
    checkWeeklyAutoBackup();
    try {
        initWafdeenDailyDate();
    }
    catch (_) { }
};
function exportToExcel(tableId, filename) {
    var table = document.getElementById(tableId);
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, filename + ".xlsx");
}
function initCurrentDate() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    document.getElementById('recordDate').value = localISOTime;
    document.getElementById('attendanceEndDate').value = localISOTime;
    if (document.getElementById('statusDate'))
        document.getElementById('statusDate').value = localISOTime;
    if (!isShowingAllDays) {
        document.getElementById('filterDateDaily').value = localISOTime;
    }
    updateDayOfWeek();
}
function changeDailyRecordDate(delta) {
    if (!isDailyDateEditAllowedForClass_((document.getElementById('dailyClassSelect') || {}).value || (currentTeacher && currentTeacher.assignedClass)) && Number(delta) !== 0) {
        var inputToday = document.getElementById('recordDate');
        if (inputToday) inputToday.value = getISODateOnly(new Date());
        return;
    }
    var input = document.getElementById('recordDate');
    if (!input)
        return;
    if (delta === 0) {
        if (!isDailyDateEditAllowedForClass_((document.getElementById('dailyClassSelect') || {}).value || (currentTeacher && currentTeacher.assignedClass))) {
            input.value = getISODateOnly(new Date());
        } else if (!input.value) {
            var today = getISODateOnly(new Date());
            input.value = today;
        }
    }
    else {
        var base = input.value || getISODateOnly(new Date());
        var d = new Date(base + 'T00:00:00');
        if (Number.isNaN(d.getTime()))
            return;
        d.setDate(d.getDate() + Number(delta));
        input.value = getISODateOnly(d);
    }
    // تغيير التاريخ يغيّر سجل اليوم المستهدف فقط، ولا يغيّر طريقة التخزين.
    if (dailyTimerRunning) {
        try {
            pauseDailyTimer();
        }
        catch (_) { }
    }
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
    dailyTimerRunning = false;
    dailyTimerStartedAt = 0;
    dailyTimerBaseSeconds = 0;
    updateDayOfWeek();
    if (typeof showDailyStudentWorkspace === 'function')
        showDailyStudentWorkspace();
    if (typeof updateMainDailySaveButton_ === 'function')
        updateMainDailySaveButton_();
    var note = document.getElementById('daily-record-date-note');
    if (note)
        note.textContent = "\u0627\u0644\u0631\u0635\u062F \u0627\u0644\u0645\u062D\u062F\u062F: ".concat(input.value, " \u2014 \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0623\u0648 \u0627\u0633\u062A\u0643\u0645\u0627\u0644 \u0627\u0644\u0631\u0635\u062F \u0644\u0647\u0630\u0627 \u0627\u0644\u062A\u0627\u0631\u064A\u062E.");
}
function goDailyRecordToday() {
    var input = document.getElementById('recordDate');
    if (!input)
        return;
    input.value = getISODateOnly(new Date());
    changeDailyRecordDate(0);
}
function updateDayOfWeek() {
    var dateVal = document.getElementById('recordDate').value;
    if (!dateVal)
        return;
    var d = new Date(dateVal);
    var days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    var dayIdx = d.getDay();
    document.getElementById('daySelect').value = days[dayIdx];
    if (!isShowingAllDays) {
        document.getElementById('filterDateDaily').value = dateVal;
        renderDailyTable();
    }
}
function togglePreviousRecords() {
    if (!isDailyDateEditAllowedForClass_((document.getElementById('dailyClassSelect') || {}).value || (currentTeacher && currentTeacher.assignedClass))) {
        isShowingAllDays = false;
        var onlyToday = getISODateOnly(new Date());
        var onlyTodayInput = document.getElementById('filterDateDaily');
        if (onlyTodayInput) onlyTodayInput.value = onlyToday;
        renderDailyTable();
        return;
    }
    isShowingAllDays = !isShowingAllDays;
    var filterDateInput = document.getElementById('filterDateDaily');
    var todayDate = document.getElementById('recordDate').value;
    var btn = document.getElementById('togglePreviousBtn');
    if (isShowingAllDays) {
        filterDateInput.value = '';
        btn.innerText = 'إخفاء الأيام السابقة';
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-export');
        filterDateInput.focus();
        if (typeof filterDateInput.showPicker === 'function') {
            try {
                filterDateInput.showPicker();
            }
            catch (e) { }
        }
    }
    else {
        filterDateInput.value = todayDate;
        btn.innerText = 'عرض الأيام السابقة';
        btn.classList.remove('btn-export');
        btn.classList.add('btn-warning');
    }
    renderDailyTable();
}
function getWeekKey(dateStr) {
    var d = new Date(dateStr);
    var day = d.getDay();
    var diffToSunday = d.getDate() - day;
    var sunday = new Date(d);
    sunday.setDate(diffToSunday);
    var thursday = new Date(sunday);
    thursday.setDate(thursday.getDate() + 4);
    var sDate = sunday.toISOString().split('T')[0];
    var tDate = thursday.toISOString().split('T')[0];
    return "".concat(sDate, "_").concat(tDate);
}
function populateWeeks() {
    var weekSelect = document.getElementById('weekSelect');
    var weeks = new Set();
    var currentWeekKey = getWeekKey(document.getElementById('recordDate').value || new Date().toISOString());
    weeks.add(currentWeekKey);
    dailyRecords.forEach(function (r) { if (r.dateISO)
        weeks.add(getWeekKey(r.dateISO)); });
    weekSelect.innerHTML = '';
    Array.from(weeks).sort().reverse().forEach(function (wk) {
        var option = document.createElement('option');
        option.value = wk;
        option.text = 'الأسبوع: ' + wk.replace('_', ' إلى ');
        weekSelect.appendChild(option);
    });
    weekSelect.value = currentWeekKey;
    var mgrWeekSelect = document.getElementById('mgrWeekSelect');
    if (mgrWeekSelect) {
        mgrWeekSelect.innerHTML = weekSelect.innerHTML;
        mgrWeekSelect.value = weekSelect.value;
    }
}
function syncDailyClassAndStudents() {
    var visible = document.getElementById('dailyClassSelect');
    if (visible && currentTeacher && !teacherCanAccessWafdeen_(currentTeacher) && visible.value === 'الوافدين') {
        visible.value = currentTeacher.assignedClass || 'تمهيدي';
    }
    var hidden = document.getElementById('classSelect');
    if (!visible || !hidden)
        return;
    hidden.value = visible.value;
    applyDailyDateEditPermission_();
    updateStudentListDropdown();
    updateFifthGradeFields(visible.value);
}
function updateStudentListDropdown() {
    var hiddenClass = document.getElementById('classSelect');
    var visibleClass = document.getElementById('dailyClassSelect');
    if (visibleClass && hiddenClass && visibleClass.value !== hiddenClass.value)
        visibleClass.value = hiddenClass.value;
    var className = hiddenClass ? hiddenClass.value : (visibleClass ? visibleClass.value : '');
    var studentSelect = document.getElementById('studentNameSelect');
    var classInfo = document.getElementById('dailyStudentClass');
    if (classInfo)
        classInfo.textContent = '';
    studentSelect.innerHTML = '';
    var filteredStudents = studentsData
        .filter(function (s) { return s.className === className; })
        .sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    if (filteredStudents.length === 0) {
        studentSelect.innerHTML = '<option value="">لا توجد أسماء مسجلة في هذا الصف</option>';
        var ws_1 = document.getElementById('daily-workspace');
        if (ws_1)
            ws_1.classList.remove('visible');
        return;
    }
    studentSelect.innerHTML = '<option value="">اختر اسم الطالب/الطالبة</option>';
    filteredStudents.forEach(function (s) {
        studentSelect.innerHTML += "<option value=\"".concat(s.name, "\">").concat(s.name, " \u2014 \u0627\u0644\u0635\u0641: ").concat(s.className, "</option>");
    });
    studentSelect.value = '';
    var ws = document.getElementById('daily-workspace');
    if (ws)
        ws.classList.remove('visible');
}
// ================= مزامنة موحدة وآمنة بين كل الأجهزة =================
// Firestore هو المصدر الرئيسي الوحيد. لا يوجد تخزين محلي دائم؛ memoryStorage ذاكرة مؤقتة داخل الجلسة فقط.
// عند أول اتصال لا يتم مسح بيانات الجهاز إذا كانت السحابة فارغة؛
// بل تُدمج البيانات ثم تُرفع الناقص/الأحدث، وبعدها onSnapshot يزامن كل الأجهزة.
var cloudSyncReady = false;
var cloudSyncReadyResolve = null;
var cloudSyncReadyPromise = new Promise(function (resolve) { cloudSyncReadyResolve = resolve; });
var wafdeenCloudReady = false;
var wafdeenCloudReadyResolve = null;
var wafdeenCloudReadyPromise = new Promise(function (resolve) { wafdeenCloudReadyResolve = resolve; });
var cloudSyncListeners = {};
function syncStamp_(obj) {
    var e_24, _a;
    var candidates = [obj === null || obj === void 0 ? void 0 : obj.updatedAt, obj === null || obj === void 0 ? void 0 : obj.savedAt, obj === null || obj === void 0 ? void 0 : obj.editedAt, obj === null || obj === void 0 ? void 0 : obj.createdAt, obj === null || obj === void 0 ? void 0 : obj.timeRecordedAt, obj === null || obj === void 0 ? void 0 : obj.dateISO];
    try {
        for (var candidates_1 = __values(candidates), candidates_1_1 = candidates_1.next(); !candidates_1_1.done; candidates_1_1 = candidates_1.next()) {
            var v = candidates_1_1.value;
            if (!v)
                continue;
            var n = Date.parse(String(v));
            if (Number.isFinite(n))
                return n;
        }
    }
    catch (e_24_1) { e_24 = { error: e_24_1 }; }
    finally {
        try {
            if (candidates_1_1 && !candidates_1_1.done && (_a = candidates_1.return)) _a.call(candidates_1);
        }
        finally { if (e_24) throw e_24.error; }
    }
    return 0;
}
function syncMergeLocalWithCloud_(local, cloud) {
    // Cloud-only: تجاهل أي بيانات من ذاكرة الجهاز وإرجاع بيانات Firestore فقط.
    var cloudArr = Array.isArray(cloud) ? cloud : [];
    var byId = new Map();
    cloudArr.forEach(function(item){
        var id = String((item && item.id) || '').trim();
        if (!id || (item && (item._deleted || item._legacyMigrated))) return;
        byId.set(id, applyDataMapping(__assign({}, item)));
    });
    return Array.from(byId.values());
}

// حفظ موحد وفوري للسجلات، حتى لا تختفي الدرجات عند إعادة تحميل الصفحة.
function wafdeenSaveRecordDurably_(collectionName, record) {
    return __awaiter(this, void 0, void 0, function () {
        var item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!record || record.id == null)
                        return [2 /*return*/, false];
                    item = __assign(__assign({}, record), { updatedAt: record.updatedAt || new Date().toISOString() });
                    if (!(useFirebase && db)) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.collection(collectionName).doc(String(item.id)).set(item, { merge: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, true];
            }
        });
    });
}
// حالة وقت التسجيل لا تعتمد على الذاكرة المؤقتة للصفحة.
// تظل فعالة بعد Refresh إلى أن يضغط الشيخ إيقاف التسجيل.
function wafdeenPersistRegistrationState_(active_1) {
    return __awaiter(this, arguments, void 0, function (active, extra) {
        var state;
        if (extra === void 0) { extra = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = __assign({ active: !!active, updatedAt: new Date().toISOString() }, extra);
                    try {
                        memoryStorage.setItem("wafdeenRegistrationState", JSON.stringify(state));
                    }
                    catch (_) { }
                    if (!(useFirebase && db)) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.collection("wafdeenSettings").doc("registrationState")
                            .set(state, { merge: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, state];
            }
        });
    });
}
function wafdeenRestoreRegistrationState_() {
    return __awaiter(this, void 0, void 0, function () {
        var state, snap, _3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = null;
                    if (!(useFirebase && db)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.collection("wafdeenSettings").doc("registrationState").get()];
                case 2:
                    snap = _a.sent();
                    if (snap.exists)
                        state = __assign(__assign({}, state), snap.data());
                    return [3 /*break*/, 4];
                case 3:
                    _3 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (state && state.active) {
                        window.wafdeenRegistrationActive = true;
                        document.documentElement.dataset.registrationActive = "true";
                        return [2 /*return*/, true];
                    }
                    window.wafdeenRegistrationActive = false;
                    document.documentElement.dataset.registrationActive = "false";
                    return [2 /*return*/, false];
            }
        });
    });
}
var cloudSyncState_ = {};
// ================= Firebase Cloud-First Layer =================
// كل سجل يُحفظ كمستند مستقل في Firestore. memoryStorage مجرد ذاكرة مؤقتة داخل الصفحة ولا تُحفظ على الجهاز.
/* ===== نسخة احتياطية محلية للدرجات قبل Firebase ===== */
var DAILY_GRADES_BACKUP_KEY_ = 'majd_daily_grades_backup_v1';
function dailyGradesBackupRead_() {
    try {
        var raw = localStorage.getItem(DAILY_GRADES_BACKUP_KEY_);
        var parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (_) { return []; }
}
function dailyGradesBackupWrite_(items) {
    try { localStorage.setItem(DAILY_GRADES_BACKUP_KEY_, JSON.stringify(items || [])); } catch (_) {}
}
function dailyGradesBackupBeforeSend_(collectionName, record, operation) {
    if (!['dailyRecords', 'shariaGrades', 'wafdeenDailyRecords'].includes(String(collectionName || ''))) return;
    var id = String((record && (record.id || record.recordId)) || '').trim();
    if (!id) return;
    var items = dailyGradesBackupRead_().filter(function (x) {
        return String(x.collection || '') !== String(collectionName) || String(x.id || '') !== id;
    });
    var snapshot;
    try { snapshot = JSON.parse(JSON.stringify(record || {})); } catch (_) { snapshot = Object.assign({}, record || {}); }
    items.push({ collection: String(collectionName), id: id, operation: operation || 'save', backedAt: new Date().toISOString(), record: snapshot });
    dailyGradesBackupWrite_(items);
}
function dailyGradesBackupClear_(collectionName, id) {
    var key = String(id || '').trim();
    var items = dailyGradesBackupRead_().filter(function (x) {
        return String(x.collection || '') !== String(collectionName || '') || String(x.id || '') !== key;
    });
    dailyGradesBackupWrite_(items);
}
function dailyGradesBackupCount_() { return dailyGradesBackupRead_().length; }

/* ===== عداد تقريبي لعمليات Supabase اليومية من هذا المتصفح ===== */
var FIREBASE_DAILY_QUOTA_KEY_ = 'majd_firebase_daily_quota_v1';
function firebaseDailyQuotaToday_(){ return new Date().toISOString().slice(0,10); }
function firebaseDailyQuotaRead_(){
  try{ var x=JSON.parse(localStorage.getItem(FIREBASE_DAILY_QUOTA_KEY_)||'null'); if(x&&x.date===firebaseDailyQuotaToday_()) return x; }catch(_){ }
  return {date:firebaseDailyQuotaToday_(),reads:0,writes:0,deletes:0};
}
function firebaseDailyQuotaSave_(x){ try{localStorage.setItem(FIREBASE_DAILY_QUOTA_KEY_,JSON.stringify(x));}catch(_){ } }
function firebaseDailyQuotaInc_(kind,count){ var x=firebaseDailyQuotaRead_(); x[kind]=Math.max(0,Number(x[kind]||0)+Number(count||1)); firebaseDailyQuotaSave_(x); try{ if(typeof refreshFirebaseDailyQuotaPanel==='function') refreshFirebaseDailyQuotaPanel(); }catch(_){ } }
window.refreshFirebaseDailyQuotaPanel=function(){
  var x=firebaseDailyQuotaRead_(), limits={reads:50000,writes:20000,deletes:20000};
  [['reads','firebase-quota-reads','firebase-quota-reads-bar'],['writes','firebase-quota-writes','firebase-quota-writes-bar'],['deletes','firebase-quota-deletes','firebase-quota-deletes-bar']].forEach(function(a){
    var n=Number(x[a[0]]||0), lim=limits[a[0]], el=document.getElementById(a[1]), bar=document.getElementById(a[2]);
    if(el) el.textContent=n.toLocaleString('ar-EG')+' / '+lim.toLocaleString('ar-EG');
    if(bar){var i=bar.querySelector('i');if(i)i.style.width=Math.min(100,(n/lim)*100)+'%';}
  });
  var d=document.getElementById('firebase-quota-date'); if(d)d.textContent=x.date;
  var note=document.getElementById('firebase-quota-note'); if(note) note.textContent='العداد المحلي التقريبي لهذا الجهاز: '+Number(x.reads||0).toLocaleString('ar-EG')+' قراءة، '+Number(x.writes||0).toLocaleString('ar-EG')+' كتابة، '+Number(x.deletes||0).toLocaleString('ar-EG')+' حذف. لا يشمل العمليات التي تمت من أجهزة أخرى أو من Supabase Console.';
  return x;
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){refreshFirebaseDailyQuotaPanel();}); else setTimeout(function(){refreshFirebaseDailyQuotaPanel();},0);

function dailyQueueRead_(){try{return JSON.parse(localStorage.getItem('majd_daily_pending_queue_v2')||'[]')||[];}catch(_){return[];}}
function dailyQueueWrite_(q){try{localStorage.setItem('majd_daily_pending_queue_v2',JSON.stringify(q.slice(-200)));}catch(_) {}}
function dailyQueueAdd_(collectionName,id,payload){if(String(collectionName)!=='dailyRecords')return;var q=dailyQueueRead_().filter(function(x){return !(x.collection===collectionName&&String(x.id)===String(id));});q.push({collection:collectionName,id:String(id),payload:payload,queuedAt:new Date().toISOString(),status:'pending'});dailyQueueWrite_(q);}
async function dailyRetryQueue_(){if(!useFirebase||!db||!navigator.onLine)return;var q=dailyQueueRead_();var keep=[];for(var i=0;i<q.length;i++){var x=q[i];try{await firebaseWriteRecord_(x.collection,x.id,x.payload,{merge:true,skipQueue:true});}catch(_){x.status='failed';keep.push(x);}}dailyQueueWrite_(keep);}
window.addEventListener('online',function(){setTimeout(dailyRetryQueue_,500);});
async function firebaseWriteRecord_(collectionName, id, data, options) {
  options=options||{};
  var docId=String(id || (data&&data.id) || (data&&data.recordId) || '').trim();
  if(!useFirebase || !db) throw new Error('Supabase غير متصل');
  if(!docId) throw new Error('معرف السجل مفقود');
  var payload=Object.assign({},data||{},{id:String((data&&data.id)||docId),updatedAt:(data&&data.updatedAt)||new Date().toISOString()});
  try{
    var localNow=localSyncRead_(collectionName).filter(function(x){return String(x.id)!==docId;});
    localNow.push(payload); localSyncWrite_(collectionName,localNow);
  }catch(_){}
  var lastError;
  for(var attempt=0;attempt<3;attempt++){
    try{
      dailyGradesBackupBeforeSend_(collectionName,payload,'save');
      /* أرشيف سحابي دائم لسجلات الرصد: لا نحذفه عند حذف السجل الأساسي. */
      if(String(collectionName)==='dailyRecords'){
        try{
          var archivePayload=Object.assign({},payload,{archivedAt:(payload&&payload.archivedAt)||new Date().toISOString(),_archiveVersion:1});
          await db.collection('dailyRecordsArchive').doc(docId).set(archivePayload,{merge:true});
          firebaseDailyQuotaInc_('writes',1);
        }catch(archiveErr){
          console.warn('تعذر حفظ النسخة الآمنة لسجل dailyRecords:',archiveErr);
        }
      }
      firebaseDailyQuotaInc_('writes',1);
      var ref=db.collection(collectionName).doc(docId);
      await ref.set(payload,{merge:options.merge!==false});
      var snap=await ref.get(); firebaseDailyQuotaInc_('reads',1);
      if(!snap.exists) throw new Error('لم يتم التحقق من وجود المستند بعد الحفظ');
      var saved=snap.data()||{};
      var keys=String(collectionName)==='dailyRecords'?['id','studentId','studentName','className','dateISO']:['id'];
      for(var k=0;k<keys.length;k++){var key=keys[k];if(payload[key]!=null&&String(saved[key]??'')!==String(payload[key]??''))throw new Error('فشل التحقق من الحقل '+key);}
      dailyGradesBackupClear_(collectionName,docId);
      return Object.assign({},saved,{id:String(saved.id||docId)});
    }catch(e){lastError=e;if(attempt<2)await new Promise(function(resolve){setTimeout(resolve,350*(attempt+1));});}
  }
  if(!options.skipQueue)localSyncQueue_(collectionName,docId,payload,'save');
  if(String(collectionName)==='dailyRecords'&&!options.skipQueue)dailyQueueAdd_(collectionName,docId,payload);
  throw lastError||new Error('تعذر حفظ السجل');
}
function firebaseReadRecord_(collectionName, id) {
    return __awaiter(this, void 0, void 0, function () {
        var snap, v;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!useFirebase || !db)
                        return [2 /*return*/, null];
                    firebaseDailyQuotaInc_('reads',1);
                    return [4 /*yield*/, db.collection(collectionName).doc(String(id)).get()];
                case 1:
                    snap = _a.sent();
                    if (!snap.exists)
                        return [2 /*return*/, null];
                    v = snap.data() || {};
                    return [2 /*return*/, v._deleted ? null : __assign(__assign({}, v), { id: String(v.id || snap.id) })];
            }
        });
    });
}
function firebaseFindStudentByLoginCode_(code) {
    return __awaiter(this, void 0, void 0, function () {
        var snap, d, v, e_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!useFirebase || !db || !code)
                        return [2 /*return*/, null];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.collection('students').where('loginCode', '==', String(code).toUpperCase()).limit(1).get()];
                case 2:
                    snap = _a.sent();
                    if (!snap.empty) {
                        d = snap.docs[0];
                        v = d.data() || {};
                        return [2 /*return*/, v._deleted ? null : __assign(__assign({}, v), { id: String(v.id || d.id) })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_26 = _a.sent();
                    console.warn('تعذر البحث عن الطالب في Supabase:', e_26);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}

/* ================= حماية أداء الهاتف أثناء التسميع =================
   - المؤقتات تعتمد على Date.now لذلك لا تحتاج نبضًا كل 250ms.
   - أثناء التسميع لا نعيد رسم الجداول/القوائم ولا نكتب JSON كاملًا إلى التخزين مع كل لقطة Supabase.
   - تبقى البيانات محدثة في الذاكرة، وتُصرف تحديثات الواجهة والتخزين بعد الاستراحة/الإيقاف.
*/
var cloudSyncCloudCache_ = {};
var cloudRenderQueue_ = {};
var cloudRenderTimers_ = {};
var cloudSyncDeferredCollections_ = {};
function isRecitationPerformanceMode_() {
    return !!(typeof wafdeenQuranTimerRunning !== 'undefined' && wafdeenQuranTimerRunning) ||
           !!(typeof dailyTimerRunning !== 'undefined' && dailyTimerRunning);
}
function isElementVisible_(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (el.offsetParent !== null) return true;
    return !!(el.getClientRects && el.getClientRects().length);
}
function shouldDeferHeavyRender_(viewIds) {
    if (!isRecitationPerformanceMode_()) return false;
    for (var i = 0; i < viewIds.length; i++) if (isElementVisible_(viewIds[i])) return false;
    return true;
}
function queueCloudRender_(collectionName, renderFn, getter, storageKey) {
    cloudRenderQueue_[collectionName] = { renderFn: renderFn, getter: getter, storageKey: storageKey || collectionName };
    if (isRecitationPerformanceMode_()) return;
    if (cloudRenderTimers_[collectionName]) clearTimeout(cloudRenderTimers_[collectionName]);
    cloudRenderTimers_[collectionName] = setTimeout(function () {
        cloudRenderTimers_[collectionName] = null;
        var q = cloudRenderQueue_[collectionName];
        if (!q || isRecitationPerformanceMode_()) return;
        try {
            if (typeof q.getter === 'function') memoryStorage.setItem(q.storageKey, JSON.stringify(q.getter()));
        } catch (_) {}
        try { if (typeof q.renderFn === 'function') q.renderFn(); } catch (e) { console.warn('Cloud render skipped [' + collectionName + ']:', e); }
    }, 180);
}
function flushCloudRenderQueue_() {
    if (isRecitationPerformanceMode_()) return;
    Object.keys(cloudSyncDeferredCollections_).forEach(function (collectionName) {
        var d = cloudSyncDeferredCollections_[collectionName];
        if (!d) return;
        try {
            var localRaw = Array.isArray(d.localGetter()) ? d.localGetter() : [];
            var local = localRaw.filter(function (x) { return !(x === null || x === void 0 ? void 0 : x._deleted); });
            var merged = syncMergeLocalWithCloud_(local, d.cloudRaw || []);
            d.localSetter(merged);
            queueCloudRender_(collectionName, d.renderFn, d.localGetter, d.storageKey);
        } catch (e) { console.warn('Deferred cloud sync flush skipped [' + collectionName + ']:', e); }
        delete cloudSyncDeferredCollections_[collectionName];
    });
    wafdeenFlushLocalPersist_();
    Object.keys(cloudRenderQueue_).forEach(function (collectionName) {
        var q = cloudRenderQueue_[collectionName];
        if (!q) return;
        if (cloudRenderTimers_[collectionName]) clearTimeout(cloudRenderTimers_[collectionName]);
        cloudRenderTimers_[collectionName] = null;
        try { if (typeof q.getter === 'function') memoryStorage.setItem(q.storageKey, JSON.stringify(q.getter())); } catch (_) {}
        try { if (typeof q.renderFn === 'function') q.renderFn(); } catch (e) { console.warn('Cloud render flush skipped [' + collectionName + ']:', e); }
        delete cloudRenderQueue_[collectionName];
    });
}

function localSyncKey_(collectionName){ return 'majd_local_sync_v3_' + String(collectionName || ''); }
function localSyncRead_(collectionName){
  try{
    var raw=localStorage.getItem(localSyncKey_(collectionName));
    var arr=raw?JSON.parse(raw):[];
    return Array.isArray(arr)?arr:[];
  }catch(_){return [];}
}
function localSyncWrite_(collectionName, arr){
  try{localStorage.setItem(localSyncKey_(collectionName),JSON.stringify(Array.isArray(arr)?arr:[]));}catch(e){console.warn('Local sync storage error ['+collectionName+']',e);}
}
function localSyncMerge_(localArr, cloudArr){
  var map=new Map();
  (Array.isArray(localArr)?localArr:[]).forEach(function(x){
    if(!x||x.id==null||x._deleted||x._legacyMigrated)return;
    map.set(String(x.id),applyDataMapping(Object.assign({},x)));
  });
  (Array.isArray(cloudArr)?cloudArr:[]).forEach(function(x){
    if(!x||x.id==null||x._deleted||x._legacyMigrated)return;
    var id=String(x.id), old=map.get(id);
    if(!old || syncStamp_(x)>=syncStamp_(old)) map.set(id,applyDataMapping(Object.assign({},x)));
  });
  return Array.from(map.values());
}
function localSyncPendingRead_(){try{return JSON.parse(localStorage.getItem('majd_local_sync_pending_v3')||'[]')||[];}catch(_){return [];}}
function localSyncPendingWrite_(q){try{localStorage.setItem('majd_local_sync_pending_v3',JSON.stringify((q||[]).slice(-1000)));}catch(_) {}}
function localSyncQueue_(collectionName,id,payload,operation){
  var q=localSyncPendingRead_().filter(function(x){return !(String(x.collection)===String(collectionName)&&String(x.id)===String(id));});
  q.push({collection:String(collectionName),id:String(id),payload:payload,operation:operation||'save',queuedAt:new Date().toISOString()});
  localSyncPendingWrite_(q);
}
async function localSyncRetryQueue_(){
  if(!useFirebase||!db||!navigator.onLine)return;
  var q=localSyncPendingRead_(), keep=[];
  for(var i=0;i<q.length;i++){
    var x=q[i];
    try{
      if(x.operation==='delete') await db.collection(x.collection).doc(String(x.id)).delete();
      else await firebaseWriteRecord_(x.collection,x.id,x.payload,{merge:true,skipQueue:true});
    }catch(_){keep.push(x);}
  }
  localSyncPendingWrite_(keep);
}
window.addEventListener('online',function(){setTimeout(localSyncRetryQueue_,700);});

function syncCollection_(collectionName_1, localGetter_1, localSetter_1, renderFn_1) {
    if(window.__MAJD_SUPABASE_APP__&&!window.__MAJD_SUPABASE_APP__.token()) return;
    var collectionName=collectionName_1, localGetter=localGetter_1, localSetter=localSetter_1, renderFn=renderFn_1, options=arguments[4]||{};
    if (!useFirebase || !db || cloudSyncListeners[collectionName]) return;
    cloudSyncListeners[collectionName] = { mode:'local-first', startedAt:Date.now() };
    cloudSyncState_[collectionName] = { initialized:false, busy:false, mode:'local-first' };
    var storageKey=options.storageKey||collectionName;
    var localStored=localSyncRead_(collectionName);
    if(localStored.length){
      try{ localSetter(localStored); }catch(_){ }
      try{ if(typeof renderFn==='function') renderFn(); }catch(_){ }
    }
    async function pullOnce_(){
      if(!useFirebase||!db||!navigator.onLine||cloudSyncState_[collectionName].busy)return;
      cloudSyncState_[collectionName].busy=true;
      try{
        var snap=await db.collection(collectionName).get();
        firebaseDailyQuotaInc_('reads',Math.max(1,snap.size||0));
        var cloud=[];
        snap.docs.forEach(function(d){var v=d.data()||{};if(!v._deleted&&!v._legacyMigrated)cloud.push(applyDataMapping(Object.assign({id:String(d.id)},v)));});
        var before=Array.isArray(localGetter())?localGetter():[];
        var merged=localSyncMerge_(before,cloud);
        localSetter(merged);
        localSyncWrite_(collectionName,merged);
        try{memoryStorage.setItem(storageKey,JSON.stringify(merged));}catch(_){ }
        // أي سجل محلي أحدث من السحابة يتم رفعه، دون Snapshot.
        var cloudMap=new Map(); cloud.forEach(function(x){cloudMap.set(String(x.id),x);});
        for(var i=0;i<merged.length;i++){
          var item=merged[i], c=cloudMap.get(String(item.id));
          if(!c || syncStamp_(item)>syncStamp_(c)){
            try{await firebaseWriteRecord_(collectionName,String(item.id),item,{merge:true});}catch(_){localSyncQueue_(collectionName,String(item.id),item,'save');}
          }
        }
        cloudSyncState_[collectionName].initialized=true;
        cloudSyncState_[collectionName].lastSync=Date.now();
        if(collectionName.indexOf('wafdeen')===0&&!wafdeenCloudReady){wafdeenCloudReady=true;if(wafdeenCloudReadyResolve)wafdeenCloudReadyResolve(true);}
        if(!cloudSyncReady){cloudSyncReady=true;if(cloudSyncReadyResolve)cloudSyncReadyResolve(true);}
        if(typeof renderFn==='function'&&!isRecitationPerformanceMode_()) renderFn();
      }catch(e){
        cloudSyncState_[collectionName].error=e;
        if(collectionName==='students'){
          window.studentFastCloudReady_=true;
          window.studentFastCloudError_=e;
          try{if(typeof updateStudentListDropdown==='function')updateStudentListDropdown();}catch(_){}
        }
        if(!cloudSyncReady){cloudSyncReady=true;if(cloudSyncReadyResolve)cloudSyncReadyResolve(false);}
        if(collectionName.indexOf('wafdeen')===0&&!wafdeenCloudReady){wafdeenCloudReady=true;if(wafdeenCloudReadyResolve)wafdeenCloudReadyResolve(false);}
      }finally{cloudSyncState_[collectionName].busy=false;}
    }
    localSyncRetryQueue_().catch(function(){});
    pullOnce_().catch(function(){});
    if(!cloudSyncState_[collectionName].timer){
      cloudSyncState_[collectionName].timer=setInterval(function(){
        localSyncRetryQueue_().catch(function(){});
        pullOnce_().catch(function(){});
      },30000);
    }
}

function getFirebaseSyncStatus_() {
    return { connected: !!(useFirebase && db), online: navigator.onLine, collections: Object.keys(cloudSyncListeners) };
}
function syncDataFromCloud() {
    if (!useFirebase || !db)
        return;
    syncCollection_('teachers', function () { return teachersData; }, function (v) { teachersData = v; }, function () {
        if ((currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.username) === 'admin') {
            renderTeachersTable();
            renderClassCards();
            renderDailyDateEditPermissions_();
        }
        applyDailyDateEditPermission_();
    }, { storageKey: 'teachersData' });
    syncCollection_('students', function () { return studentsData; }, function (v) { studentsData = ensureStudentLoginCodes(v); try { studentFastCacheSave_(studentsData); } catch (_) {} window.studentFastCloudError_ = null; window.studentFastCloudReady_ = true; }, function () {
        if ((currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.username) === 'admin') {
            renderStudentsTable();
            renderClassCards();
        }
        populateNotesClasses();
        updateStudentListDropdown();
        updateNotesStudentList();
        renderNotesTable();
        renderManagerView();
        renderMonthlyReport();
        renderTopStudents();
        renderAttendanceTable();
        renderClassStatusTable();
    }, { storageKey: 'studentsData' });
    syncCollection_('notes', function () { return notesData; }, function (v) { notesData = v; }, function () { renderNotesTable(); updateNotesStudentList(); }, { storageKey: 'notesData' });
    // مزامنة الرصد اليومي لحظياً بين أجهزة المعلمين والمشرف.
    // Firebase هي المصدر الرئيسي للرصد، والمزامنة تتم بين جميع الأجهزة.
    syncCollection_('dailyRecords', function () { return dailyRecords; }, function (v) { dailyRecords = v; }, function () {
        try {
            memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
        }
        catch (_) { }
        renderClassStatusTable();
        if (typeof renderDailyTable === 'function')
            renderDailyTable();
        if (typeof renderManagerView === 'function')
            renderManagerView();
    }, { storageKey: 'dailyRecords' });
    syncCollection_('shariaGrades', function () { return shariaGradesData; }, function (v) { shariaGradesData = v; }, function () {
        try { memoryStorage.setItem('shariaGradesData', JSON.stringify(shariaGradesData)); } catch (_) { }
        if (typeof renderShariaGradesReport === 'function') renderShariaGradesReport();
    }, { storageKey: 'shariaGradesData' });
    syncCollection_('payments', function () { return getLocalPayments_(); }, function (v) { setLocalPayments_(v); }, function () { try {
        renderPaymentReportTable();
        updatePaymentsStudentPaidMonths();
    }
    catch (_) { } }, { storageKey: 'wafdeenPaymentsLocal_v2' });
    syncCollection_('wafdeenDailyRecords', function () { return wafdeenDailyRecords; }, function (v) { wafdeenDailyRecords = v; }, function () { try {
        wafdeenPersistLocal();
    }
    catch (_) { } }, { storageKey: 'wafdeenDailyRecords' });
    syncCollection_('wafdeenExams', function () { return wafdeenExamsData; }, function (v) { wafdeenExamsData = v; }, function () { try {
        wafdeenPersistLocal();
    }
    catch (_) { } }, { storageKey: 'wafdeenExamsData' });
    syncCollection_('wafdeenUsage', function () { return wafdeenUsageData; }, function (v) { wafdeenUsageData = v; }, function () { try {
        wafdeenPersistLocal();
    }
    catch (_) { } }, { storageKey: 'wafdeenUsageData' });
    syncCollection_('wafdeenMonthlyReports', function () { return wafdeenMonthlyImportedReports; }, function (v) { wafdeenMonthlyImportedReports = v; }, function () { try {
        wafdeenPersistLocal();
    }
    catch (_) { } }, { storageKey: 'wafdeenMonthlyImportedReports' });
    syncCollection_('results', function () { return resultsData; }, function (v) { resultsData = v; }, function () { try {
        memoryStorage.setItem('resultsData', JSON.stringify(resultsData));
    }
    catch (_) { } }, { storageKey: 'resultsData' });
    // Firebase هي السحابة الرئيسية لكل بيانات البرنامج.
}
function showMessage(elementId, msg, type) {
    var el = document.getElementById(elementId);
    el.innerText = msg;
    el.className = "toast-msg toast-".concat(type);
    el.style.display = 'block';
    setTimeout(function () { el.style.display = 'none'; }, 3500);
}
function handleLogin() {
    return __awaiter(this, void 0, void 0, function () {
        var u, p, btn, teacher, snap, found, _4, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    u = (_a = document.getElementById('username')) === null || _a === void 0 ? void 0 : _a.value.trim();
                    p = (_b = document.getElementById('password')) === null || _b === void 0 ? void 0 : _b.value.trim();
                    if (!u || !p) {
                        return [2 /*return*/, showMessage('login-msg', 'يرجى إدخال اسم المستخدم وكلمة المرور', 'error')];
                    }
                    btn = document.querySelector('#login-screen button[onclick*="handleLogin"]');
                    if (btn) {
                        btn.disabled = true;
                        btn.dataset.oldText = btn.innerText;
                        btn.innerText = '⏳ جاري التحقق...';
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    // المدير الافتراضي — مستقل عن Supabase.
                    if (u === 'admin' && p === 'admin123') {
                        currentTeacher = {
                            id: '1',
                            username: 'admin',
                            password: 'admin123',
                            assignedClass: 'الكل',
                            center: 'الكل'
                        };
                        try {
                            persistentAuthStorage.setItem('currentTeacher', JSON.stringify(currentTeacher));
                        }
                        catch (_) { }
                        showAppScreen();
                        return [2 /*return*/];
                    }
                    teacher = Array.isArray(teachersData)
                        ? teachersData.find(function (t) { return t && !t._deleted &&
                            String(t.username || '').trim() === u &&
                            String(t.password || '').trim() === p; })
                        : null;
                    if (!(!teacher && useFirebase && db)) return [3 /*break*/, 5];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    syncDataFromCloud();
                    return [4 /*yield*/, db.collection('teachers').where('username', '==', u).limit(5).get()];
                case 3:
                    snap = _c.sent();
                    found = snap.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); }).find(function (t) { return !t._deleted && String(t.password || '').trim() === p; });
                    if (found)
                        teacher = found;
                    return [3 /*break*/, 5];
                case 4:
                    _4 = _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!teacher)
                        return [2 /*return*/, showMessage('login-msg', 'اسم المستخدم أو كلمة المرور غير صحيحة', 'error')];
                    currentTeacher = applyDataMapping(__assign({}, teacher));
                    try {
                        persistentAuthStorage.setItem('currentTeacher', JSON.stringify(currentTeacher));
                    }
                    catch (_) { }
                    showAppScreen();
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _c.sent();
                    console.error('خطأ في تسجيل الدخول:', error_1);
                    showMessage('login-msg', 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.', 'error');
                    return [3 /*break*/, 8];
                case 7:
                    if (btn) {
                        btn.disabled = false;
                        btn.innerText = btn.dataset.oldText || 'تسجيل الدخول';
                    }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    ['username', 'password'].forEach(function (id) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    ['studentResultCodeInput','preparatoryResultCodeInput'].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.addEventListener('keydown', function(e){
            if (e.key === 'Enter') { e.preventDefault(); lookupResultByCode(id === 'preparatoryResultCodeInput'); }
        });
    });
});
async function handleLogout() {
    var ok = await siteConfirm('تأكيد تسجيل الخروج', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟', 'تسجيل الخروج', true);
    if (!ok)
        return;
    currentTeacher = null;
    persistentAuthStorage.removeItem('currentTeacher');
    showLoginScreen();
}
function showLoginScreen() {
    var _a, _b;
    closeMainMenu();
    document.body.classList.remove('wafdeen-mode');
    document.body.classList.add('login-screen-active');
    (_a = document.getElementById('wafdeen-login-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('wafdeen-app-screen')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('student-login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.add('hidden');
}
function showStudentLoginScreen() {
    var _a, _b;
    closeMainMenu();
    document.body.classList.remove('wafdeen-mode');
    document.body.classList.add('login-screen-active');
    (_a = document.getElementById('wafdeen-login-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('wafdeen-app-screen')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('student-login-screen').classList.remove('hidden');
    document.getElementById('studentLoginCode').value = '';
    document.getElementById('studentPortalArea').innerHTML = '';
    document.getElementById('student-login-msg').style.display = 'none';
    setTimeout(function () { return document.getElementById('studentLoginCode').focus(); }, 50);
}
function showResultsScreen() {
    var _a, _b;
    closeMainMenu();
    document.body.classList.remove('wafdeen-mode');
    document.body.classList.add('login-screen-active');
    (_a = document.getElementById('wafdeen-login-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('wafdeen-app-screen')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('student-login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    var studentCodeInput = document.getElementById('studentResultCodeInput');
    var prepCodeInput = document.getElementById('preparatoryResultCodeInput');
    var studentArea = document.getElementById('studentResultDisplayArea');
    var prepArea = document.getElementById('preparatoryResultDisplayArea');
    if (studentCodeInput) studentCodeInput.value = '';
    if (prepCodeInput) prepCodeInput.value = '';
    if (studentArea) studentArea.innerHTML = '';
    if (prepArea) prepArea.innerHTML = '';
    var resultMsg = document.getElementById('results-msg');
    if (resultMsg) resultMsg.style.display = 'none';
}

function applyShariaTeacherVisibility_(){
  var isShariaTeacher=!!currentTeacher && currentTeacher.username!=='admin' && currentTeacher.assignedClass==='أولى شرعي';
  document.body.classList.toggle('sharia-teacher',isShariaTeacher);
  var btn=document.getElementById('sharia-grades-tab-btn'); if(btn) btn.classList.remove('hidden');
}
function getDailyDateEditPermissions_() {
    var adminTeacher = (teachersData || []).find(function (t) { return t && String(t.username || '').trim() === 'admin' && !t._deleted; });
    var raw = adminTeacher && adminTeacher.dailyDateEditPermissions;
    var result = {};
    if (raw && typeof raw === 'object') {
        Object.keys(raw).forEach(function (k) { result[k] = raw[k] === true; });
    }
    return result;
}
function isDailyDateEditAllowedForClass_(className) {
    if (!className) return false;
    if (currentTeacher && (currentTeacher.username === 'admin' || currentTeacher.assignedClass === 'الكل')) return true;
    return getDailyDateEditPermissions_()[className] === true;
}
function applyDailyDateEditPermission_() {
    var classSelect = document.getElementById('dailyClassSelect');
    var className = classSelect ? classSelect.value : (currentTeacher && currentTeacher.assignedClass) || '';
    var allowed = isDailyDateEditAllowedForClass_(className);
    document.body.classList.toggle('record-date-nav-allowed', allowed);
    var recordDate = document.getElementById('recordDate');
    var today = getISODateOnly(new Date());
    if (!allowed) {
        if (recordDate) recordDate.value = today;
        var filterDate = document.getElementById('filterDateDaily');
        if (filterDate) filterDate.value = today;
        isShowingAllDays = false;
        var previousBtn = document.getElementById('togglePreviousBtn');
        if (previousBtn) previousBtn.innerText = 'عرض الأيام السابقة';
    }
    updateDayOfWeek();
    /* تحديث ظهور واجهة تاريخ الرصد الجديدة فور تغيير الفصل أو الصلاحية. */
    var v10Bar = document.getElementById('v10DailyDateBar');
    if (v10Bar) v10Bar.style.setProperty('display', allowed ? 'flex' : 'none', 'important');
}
function renderDailyDateEditPermissions_() {
    var container = document.getElementById('dailyDateEditPermissions');
    if (!container) return;
    var classes = (typeof GENERAL_CLASSES !== 'undefined' && Array.isArray(GENERAL_CLASSES)) ? GENERAL_CLASSES : [];
    var permissions = getDailyDateEditPermissions_();
    container.innerHTML = classes.map(function (className) {
        var allowed = permissions[className] === true;
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid var(--border-soft);border-radius:12px;background:#fff;">' +
            '<strong style="color:var(--primary-dark);">' + String(className) + '</strong>' +
            '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:.9em;">' +
            '<input type="checkbox" style="width:20px;height:20px;" ' + (allowed ? 'checked' : '') + ' onchange="setDailyDateEditPermission_(\'' + String(className).replace(/'/g, "\\'") + '\', this.checked)">' +
            '<span>' + (allowed ? 'مسموح' : 'مخفي') + '</span>' +
            '</label></div>';
    }).join('');
}
function setDailyDateEditPermission_(className, allowed) {
    if (!currentTeacher || currentTeacher.username !== 'admin') return;
    var adminTeacher = (teachersData || []).find(function (t) { return t && String(t.username || '').trim() === 'admin' && !t._deleted; });
    if (!adminTeacher) return showMessage('daily-date-permission-msg', 'تعذر العثور على حساب المدير.', 'error');
    var permissions = getDailyDateEditPermissions_();
    permissions[className] = !!allowed;
    adminTeacher.dailyDateEditPermissions = permissions;
    adminTeacher.updatedAt = new Date().toISOString();
    currentTeacher.dailyDateEditPermissions = permissions;
    try { memoryStorage.setItem('teachersData', JSON.stringify(teachersData)); } catch (_) {}
    try { persistentAuthStorage.setItem('currentTeacher', JSON.stringify(currentTeacher)); } catch (_) {}
    renderDailyDateEditPermissions_();
    if (useFirebase && db) {
        db.collection('teachers').doc(String(adminTeacher.id)).set({ dailyDateEditPermissions: permissions, updatedAt: adminTeacher.updatedAt }, { merge: true })
            .then(function () { showMessage('daily-date-permission-msg', 'تم حفظ صلاحية الفصل: ' + className, 'success'); })
            .catch(function (e) { console.error(e); showMessage('daily-date-permission-msg', 'تعذر حفظ الصلاحية.', 'error'); });
    } else {
        showMessage('daily-date-permission-msg', 'تم حفظ الصلاحية على الجهاز.', 'success');
    }
}

function showAppScreen() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    document.body.classList.remove('login-screen-active', 'wafdeen-mode');
    (_a = document.getElementById('wafdeen-login-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('wafdeen-app-screen')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('student-login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    ensureAllClassSelects_();
    document.getElementById('teacher-name-display').innerText = currentTeacher.username;
    document.getElementById('teacher-class-display').innerText = currentTeacher.assignedClass === 'الكل' ? 'جميع الصفوف (إدارة)' : currentTeacher.assignedClass;
    document.getElementById('teacher-center-display').innerText = currentTeacher.center || '-';
    var classSelect = document.getElementById('classSelect');
    var weeklyClassSelect = document.getElementById('weeklyClassSelect');
    var monthlyClassSelect = document.getElementById('monthlyClassSelect');
    var attendanceClassSelect = document.getElementById('attendanceClassSelect');
    var visibleDailyClass = document.getElementById('dailyClassSelect');
    var adminBtn = document.getElementById('admin-tab-btn');
    var supabaseUsageBtn = document.getElementById('supabase-usage-tab-btn');
    var backupBtn = document.getElementById('backup-tab-btn');
    var managerBtn = document.getElementById('manager-tab-btn');
    var weeklyBtn = document.getElementById('weekly-tab-btn');
    var reportsBtn = document.getElementById('reports-tab-btn');
    var attendanceBtn = document.getElementById('attendance-tab-btn');
    var statusBtn = document.getElementById('status-tab-btn');
    var dailyExportBtn = document.getElementById('dailyExportBtn');
    var notesExportBtn = document.getElementById('notesExportBtn');
    var notesClassSelect = document.getElementById('notesClassSelect');
    var reportsMenuWrap = document.getElementById('reports-menu-wrap');
    var isSupervisor = currentTeacher.center === 'مشرف';
    var isManager = !isSupervisor && (currentTeacher.username === 'admin' || (currentTeacher.assignedClass === 'الكل' && currentTeacher.center === 'الكل'));
    var isAdminUser = !isSupervisor && currentTeacher.username === 'admin';
    var sheikhRegBtn = document.getElementById('sheikh-registration-tab-btn');
    // المشرف: تظهر له للمشاهدة: حالة الإنجاز + الملاحظات + الأوائل + المصروفات + مقرر الدفع.
    if (isSupervisor) {
        document.body.classList.add('supervisor-mode');
        // إخفاء كل أزرار القائمة ثم إظهار الثلاثة المسموح بها فقط.
        document.querySelectorAll('.sidebar-nav .tab-btn').forEach(function (btn) { return btn.classList.add('hidden'); });
        statusBtn.classList.remove('hidden');
        (_c = document.getElementById('notes-tab-btn')) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
        (_d = document.getElementById('top-students-tab-btn')) === null || _d === void 0 ? void 0 : _d.classList.remove('hidden');
        (_e = document.getElementById('payments-tab-btn')) === null || _e === void 0 ? void 0 : _e.classList.remove('hidden');
        (_f = document.getElementById('payment-report-tab-btn')) === null || _f === void 0 ? void 0 : _f.classList.remove('hidden');
        reportsMenuWrap.classList.add('hidden');
        dailyExportBtn.classList.add('hidden');
        notesExportBtn.classList.add('hidden');
        classSelect.disabled = true;
        if (visibleDailyClass)
            visibleDailyClass.disabled = true;
        // لا يظهر الرصد اليومي للمشرف نهائياً.
        (_g = document.getElementById('daily-tab-btn')) === null || _g === void 0 ? void 0 : _g.classList.add('hidden');
        (_h = document.getElementById('daily-tab')) === null || _h === void 0 ? void 0 : _h.classList.remove('active');
        weeklyClassSelect.disabled = true;
        monthlyClassSelect.disabled = true;
        attendanceClassSelect.disabled = true;
        // إخفاء كل المحتويات الأخرى، وفتح حالة الإنجاز فقط.
        document.querySelectorAll('.tab-content').forEach(function (content) { return content.classList.remove('active'); });
        (_j = document.getElementById('daily-tab')) === null || _j === void 0 ? void 0 : _j.classList.remove('active');
        (_k = document.getElementById('status-tab')) === null || _k === void 0 ? void 0 : _k.classList.add('active');
        statusBtn.classList.add('active');
        renderClassStatusTable();
        return;
    }
    document.body.classList.remove('supervisor-mode');
    // عند تسجيل الدخول كمعلم عادي، نضمن إعادة إظهار أزرار القائمة التي أخفاها حساب مشرف سابق.
    document.querySelectorAll('.sidebar-nav .tab-btn').forEach(function (btn) { return btn.classList.remove('hidden'); });
    (_l = document.getElementById('daily-tab-btn')) === null || _l === void 0 ? void 0 : _l.classList.remove('hidden');
    statusBtn.classList.add('hidden');
    if (sheikhRegBtn)
        sheikhRegBtn.classList.toggle('hidden', !isAdminUser);
    if (supabaseUsageBtn)
        supabaseUsageBtn.classList.toggle('hidden', !isAdminUser);
    if (!isManager) {
        classSelect.value = currentTeacher.assignedClass;
        classSelect.disabled = true;
        weeklyClassSelect.value = currentTeacher.assignedClass;
        weeklyClassSelect.disabled = true;
        monthlyClassSelect.value = currentTeacher.assignedClass;
        monthlyClassSelect.disabled = true;
        attendanceClassSelect.value = currentTeacher.assignedClass;
        attendanceClassSelect.disabled = true;
    }
    initCurrentDate();
    if (document.getElementById('noteDate'))
        document.getElementById('noteDate').value = document.getElementById('recordDate').value;
    updateFifthGradeFields(classSelect.value);
    if (visibleDailyClass) {
        visibleDailyClass.value = classSelect.value;
    }
    applyDailyDateEditPermission_();
    if (isManager) {
        adminBtn.classList.remove('hidden');
        (_m = document.getElementById('payments-tab-btn')) === null || _m === void 0 ? void 0 : _m.classList.remove('hidden');
        (_o = document.getElementById('payment-report-tab-btn')) === null || _o === void 0 ? void 0 : _o.classList.remove('hidden');
        (_p = document.getElementById('analysis-tab-btn')) === null || _p === void 0 ? void 0 : _p.classList.remove('hidden');
        backupBtn.classList.remove('hidden');
        managerBtn.classList.remove('hidden');
        document.getElementById('top-students-tab-btn').classList.remove('hidden');
        weeklyBtn.classList.remove('hidden');
        reportsBtn.classList.remove('hidden');
        reportsMenuWrap.classList.remove('hidden');
        attendanceBtn.classList.remove('hidden');
        statusBtn.classList.remove('hidden');
        dailyExportBtn.classList.remove('hidden');
        notesExportBtn.classList.remove('hidden');
        classSelect.disabled = false;
        var visibleDailyClass_1 = document.getElementById('dailyClassSelect');
        if (visibleDailyClass_1)
            visibleDailyClass_1.disabled = false;
        weeklyClassSelect.disabled = false;
        monthlyClassSelect.disabled = false;
        attendanceClassSelect.disabled = false;
        renderTeachersTable();
        if (document.getElementById('analysisClassSelect')) {
            populateAnalysisStudents();
            populateAnalysisWeeks();
        }
        studentsData = ensureStudentLoginCodes(studentsData);
        memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
        renderStudentsTable();
        renderClassCards();
    }
    else {
        var visibleDailyClass_2 = document.getElementById('dailyClassSelect');
        if (visibleDailyClass_2)
            visibleDailyClass_2.disabled = !teacherCanAccessWafdeen_(currentTeacher);
        adminBtn.classList.add('hidden');
        (_q = document.getElementById('payments-tab-btn')) === null || _q === void 0 ? void 0 : _q.classList.add('hidden');
        (_r = document.getElementById('payment-report-tab-btn')) === null || _r === void 0 ? void 0 : _r.classList.add('hidden');
        backupBtn.classList.add('hidden');
        managerBtn.classList.add('hidden');
        weeklyBtn.classList.add('hidden');
        reportsBtn.classList.add('hidden');
        reportsMenuWrap.classList.add('hidden');
        attendanceBtn.classList.add('hidden');
        statusBtn.classList.add('hidden');
        dailyExportBtn.classList.add('hidden');
        notesExportBtn.classList.add('hidden');
    }
    ensureAllClassSelects_();
    populatePaymentsClasses();
    updatePaymentsStudentList();
    populatePaymentReportClasses();
    updatePaymentReportStudentList();
    populateNotesClasses();
    updateNotesStudentList();
    updateStudentListDropdown();
    var dailyWs = document.getElementById('daily-workspace');
    if (dailyWs)
        dailyWs.classList.remove('visible');
    populateWeeks();
    renderDailyTable();
    renderAttendanceTable();
    renderWeeklyTable();
    renderMonthlyReport();
    renderManagerView();
    renderClassStatusTable();
    if (document.getElementById('analysisClassSelect')) {
        var isManagerNow = currentTeacher && (currentTeacher.username === 'admin' || currentTeacher.assignedClass === 'الكل');
        var analysisClasses = isManagerNow ? GENERAL_CLASSES : [currentTeacher.assignedClass];
        document.getElementById('analysisClassSelect').innerHTML = analysisClasses.map(function (c) { return "<option value=\"".concat(c, "\">").concat(c, "</option>"); }).join('');
        if (analysisClasses.includes(currentTeacher.assignedClass))
            document.getElementById('analysisClassSelect').value = currentTeacher.assignedClass;
        populateAnalysisStudents();
        populateAnalysisWeeks();
    }
    if (window.refreshDailyRecordsVerificationVisibility_) window.refreshDailyRecordsVerificationVisibility_();
}
function toggleReportsMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    var wrap = document.getElementById('reports-menu-wrap');
    wrap.classList.toggle('open');
}
function relocateMainMenuToBody() {
    var ids = ['menu-overlay', 'main-menu-handle', 'main-menu-drawer'];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.parentElement !== document.body) {
            document.body.appendChild(el);
        }
    });
}
function openMainMenu() {
    relocateMainMenuToBody();
    var drawer = document.getElementById('main-menu-drawer'), handle = document.getElementById('main-menu-handle'), overlay = document.getElementById('menu-overlay');
    if (!drawer || !handle || !overlay)
        return;
    drawer.classList.add('open');
    handle.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    handle.setAttribute('aria-expanded', 'true');
    handle.setAttribute('aria-label', 'إغلاق قائمة القوائم');
    document.body.classList.add('menu-open');
}
function closeMainMenu() {
    var drawer = document.getElementById('main-menu-drawer'), handle = document.getElementById('main-menu-handle'), overlay = document.getElementById('menu-overlay');
    if (!drawer || !handle || !overlay)
        return;
    drawer.classList.remove('open');
    handle.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    handle.setAttribute('aria-expanded', 'false');
    handle.setAttribute('aria-label', 'فتح قائمة القوائم');
    document.body.classList.remove('menu-open');
}
document.addEventListener('DOMContentLoaded', function () {
    relocateMainMenuToBody();
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape')
    closeMainMenu(); });
function toggleMainMenu(event) { if (event) {
    event.preventDefault();
    event.stopPropagation();
} if (document.body.classList.contains('login-screen-active') || document.body.classList.contains('wafdeen-mode')) {
    closeMainMenu();
    return;
} var drawer = document.getElementById('main-menu-drawer'); if (drawer && drawer.classList.contains('open'))
    closeMainMenu();
else
    openMainMenu(); }
(function setupMenuSwipe() { var startX = null; var drawer = document.getElementById('main-menu-drawer'); if (!drawer)
    return; drawer.addEventListener('touchstart', function (e) { if (e.touches && e.touches[0])
    startX = e.touches[0].clientX; }, { passive: true }); drawer.addEventListener('touchend', function (e) { if (startX === null || !e.changedTouches || !e.changedTouches[0])
    return; var endX = e.changedTouches[0].clientX; if (endX - startX > 70)
    closeMainMenu(); startX = null; }, { passive: true }); })();
/* ================= تحليل بيانات الطالب: أسبوعي + درجات + وقت + سرعة الصفحة ================= */
var analysisChartInstances = {};
function openStudentDataAnalysis() {
    var adminTab = document.getElementById('admin-tab');
    document.body.classList.add('analysis-only-mode');
    if (adminTab)
        adminTab.classList.add('analysis-only');
    if (adminTab && !adminTab.classList.contains('active')) {
        try {
            switchTab('admin-tab', null);
        }
        catch (e) {
            document.querySelectorAll('.tab-content').forEach(function (el) { return el.classList.remove('active'); });
            adminTab.classList.add('active');
        }
    }
    var section = document.getElementById('student-analysis-section');
    if (!section)
        return;
    section.classList.remove('hidden');
    var classSelect = document.getElementById('analysisClassSelect');
    if (!classSelect)
        return;
    var isManager = currentTeacher && (currentTeacher.username === 'admin' || currentTeacher.assignedClass === 'الكل');
    var allowedClasses = isManager
        ? ALL_CLASSES
        : [currentTeacher.assignedClass];
    classSelect.innerHTML = allowedClasses.map(function (c) { return "<option value=\"".concat(c, "\">").concat(c, "</option>"); }).join('');
    if (currentTeacher && allowedClasses.includes(currentTeacher.assignedClass))
        classSelect.value = currentTeacher.assignedClass;
    populateAnalysisStudents();
    populateAnalysisWeeks();
    renderStudentDataAnalysis();
    setTimeout(function () { return section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
}
function closeStudentDataAnalysis() {
    document.body.classList.remove('analysis-only-mode');
    var adminTab = document.getElementById('admin-tab');
    if (adminTab)
        adminTab.classList.remove('analysis-only');
    var section = document.getElementById('student-analysis-section');
    if (section)
        section.classList.add('hidden');
    Object.values(analysisChartInstances).forEach(function (c) { try {
        c.destroy();
    }
    catch (e) { } });
    analysisChartInstances = {};
}
function populateAnalysisStudents() {
    var _a;
    var className = (_a = document.getElementById('analysisClassSelect')) === null || _a === void 0 ? void 0 : _a.value;
    var select = document.getElementById('analysisStudentSelect');
    if (!select)
        return;
    var names = studentsData
        .filter(function (s) { return s.className === className; })
        .map(function (s) { return s.name; })
        .sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    var old = select.value;
    select.innerHTML = names.length
        ? names.map(function (n) { return "<option value=\"".concat(String(n).replace(/"/g, '&quot;'), "\">").concat(n, "</option>"); }).join('')
        : '<option value="">لا يوجد طلاب في هذا الصف</option>';
    if (names.includes(old))
        select.value = old;
}
function getAnalysisWeekDates(weekKey) {
    if (!weekKey)
        return [];
    var parts = String(weekKey).split('_');
    if (parts.length !== 2)
        return [];
    var start = new Date(parts[0] + 'T00:00:00');
    if (Number.isNaN(start.getTime()))
        return [];
    return Array.from({ length: 5 }, function (_, i) {
        var d = new Date(start);
        d.setDate(start.getDate() + i);
        return getISODateOnly(d);
    });
}
function getPreviousAnalysisWeekKey(weekKey) {
    var dates = getAnalysisWeekDates(weekKey);
    if (!dates.length)
        return '';
    var start = new Date(dates[0] + 'T00:00:00');
    start.setDate(start.getDate() - 7);
    return getWeekKey(getISODateOnly(start));
}
function populateAnalysisWeeks() {
    var _a;
    var select = document.getElementById('analysisWeekSelect');
    if (!select)
        return;
    var weeks = new Set();
    dailyRecords.forEach(function (r) {
        if (r.dateISO)
            weeks.add(getWeekKey(r.dateISO));
    });
    var current = ((_a = document.getElementById('recordDate')) === null || _a === void 0 ? void 0 : _a.value) || getISODateOnly(new Date());
    weeks.add(getWeekKey(current));
    var old = select.value;
    var sorted = Array.from(weeks).sort().reverse();
    select.innerHTML = sorted.map(function (w) {
        var p = w.split('_');
        return "<option value=\"".concat(w, "\">\u0627\u0644\u0623\u0633\u0628\u0648\u0639: ").concat(p[0], " \u0625\u0644\u0649 ").concat(p[1], "</option>");
    }).join('');
    if (sorted.includes(old))
        select.value = old;
    else
        select.value = sorted[0] || '';
}
function getAnalysisRecords(studentName, className, weekKey) {
    var dates = new Set(getAnalysisWeekDates(weekKey));
    return dailyRecords.filter(function (r) {
        return r.studentName === studentName &&
            r.className === className &&
            dates.has(r.dateISO);
    });
}
function analysisAverage(records, field) {
    var values = records.map(function (r) { return Number(r[field]); }).filter(function (v) { return Number.isFinite(v); });
    return values.length ? values.reduce(function (a, b) { return a + b; }, 0) / values.length : 0;
}
function analysisSum(records, field) {
    return records.reduce(function (sum, r) { return sum + (Number(r[field]) || 0); }, 0);
}
function analysisPages(records, field) {
    return records.reduce(function (sum, r) {
        var _a;
        var v = String((_a = r[field]) !== null && _a !== void 0 ? _a : '').replace(',', '.');
        var n = parseFloat(v);
        return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
}
function analysisTimePerPage(records, timeField, pagesField) {
    var totalTime = analysisSum(records, timeField);
    var pages = analysisPages(records, pagesField);
    return pages > 0 ? totalTime / pages : 0;
}
function analysisFormatMinutes(seconds) {
    var s = Math.max(0, Math.round(Number(seconds) || 0));
    var min = Math.floor(s / 60);
    var sec = s % 60;
    return "".concat(min, " \u062F ").concat(String(sec).padStart(2, '0'), " \u062B");
}
function analysisGradeTrend(current, previous) {
    if (!previous || previous.recordsCount === 0 || current.recordsCount === 0)
        return { label: 'لا توجد مقارنة كافية', cls: 'analysis-status-neutral' };
    var diff = current.average - previous.average;
    if (diff > 0.25)
        return { label: "\u062A\u062D\u0633\u0646 +".concat(diff.toFixed(1)), cls: 'analysis-status-good' };
    if (diff < -0.25)
        return { label: "\u0636\u0639\u0641 ".concat(diff.toFixed(1)), cls: 'analysis-status-bad' };
    return { label: 'مستقر تقريباً', cls: 'analysis-status-neutral' };
}
function analysisSpeedTrend(currentSecondsPerPage, previousSecondsPerPage) {
    if (!(previousSecondsPerPage > 0) || !(currentSecondsPerPage > 0))
        return { label: 'لا توجد مقارنة كافية', cls: 'analysis-status-neutral' };
    var diff = currentSecondsPerPage - previousSecondsPerPage;
    var threshold = Math.max(3, previousSecondsPerPage * 0.08);
    if (diff < -threshold)
        return { label: 'أسرع من الأسبوع السابق', cls: 'analysis-status-fast' };
    if (diff > threshold)
        return { label: 'أبطأ من الأسبوع السابق', cls: 'analysis-status-slow' };
    return { label: 'سرعته مستقرة', cls: 'analysis-status-neutral' };
}
function getAnalysisGradeDefs(className) {
    var fifth = isFifthClass(className);
    var defs = [
        { key: 'attendance', label: 'الحضور', max: 10 },
        { key: 'behavior', label: 'السلوك', max: 10 },
    ];
    if (!fifth) {
        defs.push({ key: 'newLesson', label: 'الجديد', max: 10 });
        defs.push({ key: 'oldRevision', label: 'الماضي', max: 10 });
    }
    defs.push({ key: 'recitation', label: 'التلاوة', max: 10 });
    defs.push({ key: 'homework', label: 'الواجب', max: 10 });
    defs.push({ key: 'tajweed', label: 'التجويد', max: 10 });
    defs.push({ key: 'total', label: 'المجموع', max: getDailyMax(className) });
    return defs;
}
function renderAnalysisSummary(studentName, className, currentRecords, previousRecords) {
    var box = document.getElementById('analysis-summary-cards');
    var diagnosis = document.getElementById('analysis-diagnosis');
    if (!box || !diagnosis)
        return;
    var defs = getAnalysisGradeDefs(className);
    var gradeDefs = defs.filter(function (d) { return d.key !== 'total'; });
    var improved = 0, declined = 0, stable = 0;
    gradeDefs.forEach(function (d) {
        var cur = { average: analysisAverage(currentRecords, d.key), recordsCount: currentRecords.length };
        var prev = { average: analysisAverage(previousRecords, d.key), recordsCount: previousRecords.length };
        var tr = analysisGradeTrend(cur, prev);
        if (tr.cls === 'analysis-status-good')
            improved++;
        else if (tr.cls === 'analysis-status-bad')
            declined++;
        else
            stable++;
    });
    var currentTotal = currentRecords.length ? currentRecords.reduce(function (s, r) { return s + getDailyTotal(r); }, 0) / currentRecords.length : 0;
    var previousTotal = previousRecords.length ? previousRecords.reduce(function (s, r) { return s + getDailyTotal(r); }, 0) / previousRecords.length : 0;
    var totalDiff = currentTotal - previousTotal;
    var timeDefs = [
        { key: 'new', label: 'الجديد', time: 'newLessonTimeSeconds', pages: 'newPagesCount' },
        { key: 'old', label: 'الماضي', time: 'oldRevisionTimeSeconds', pages: 'oldPagesCount' },
        { key: 'recitation', label: 'التلاوة', time: 'recitationTimeSeconds', pages: 'recitationPagesCount' }
    ].filter(function (d) { return !(isFifthClass(className) && (d.key === 'new' || d.key === 'old')); });
    var currentTimes = timeDefs.map(function (d) { return analysisTimePerPage(currentRecords, d.time, d.pages); }).filter(function (v) { return v > 0; });
    var avgSecPerPage = currentTimes.length ? currentTimes.reduce(function (a, b) { return a + b; }, 0) / currentTimes.length : 0;
    box.innerHTML = "\n    <div class=\"analysis-summary-card\">\n      <div class=\"a-label\">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639</div>\n      <div class=\"a-value\">".concat(currentTotal.toFixed(1), " / ").concat(getDailyMax(className), "</div>\n      <div class=\"a-sub\">\u0627\u0644\u0641\u0631\u0642: ").concat(totalDiff >= 0 ? '+' : '').concat(totalDiff.toFixed(1), "</div>\n    </div>\n    <div class=\"analysis-summary-card\">\n      <div class=\"a-label\">\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062A\u062D\u0633\u0646</div>\n      <div class=\"a-value analysis-status-good\">").concat(improved, "</div>\n      <div class=\"a-sub\">\u0645\u0646 ").concat(gradeDefs.length, " \u062F\u0631\u062C\u0627\u062A</div>\n    </div>\n    <div class=\"analysis-summary-card\">\n      <div class=\"a-label\">\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0636\u0639\u0641</div>\n      <div class=\"a-value analysis-status-bad\">").concat(declined, "</div>\n      <div class=\"a-sub\">\u0645\u0646 ").concat(gradeDefs.length, " \u062F\u0631\u062C\u0627\u062A</div>\n    </div>\n    <div class=\"analysis-summary-card\">\n      <div class=\"a-label\">\u0645\u062A\u0648\u0633\u0637 \u0632\u0645\u0646 \u0627\u0644\u0635\u0641\u062D\u0629</div>\n      <div class=\"a-value\">").concat(avgSecPerPage ? analysisFormatMinutes(avgSecPerPage) : '-', "</div>\n      <div class=\"a-sub\">\u0643\u0644\u0645\u0627 \u0642\u0644 \u0627\u0644\u0648\u0642\u062A \u0632\u0627\u062F\u062A \u0627\u0644\u0633\u0631\u0639\u0629</div>\n    </div>\n  ");
    var weak = [];
    var strong = [];
    gradeDefs.forEach(function (d) {
        var cur = analysisAverage(currentRecords, d.key);
        var prev = analysisAverage(previousRecords, d.key);
        if (currentRecords.length && cur < 6)
            weak.push("".concat(d.label, " (").concat(cur.toFixed(1), "/10)"));
        if (previousRecords.length && cur - prev > 0.25)
            strong.push("".concat(d.label, " (+").concat((cur - prev).toFixed(1), ")"));
        if (previousRecords.length && cur - prev < -0.25)
            weak.push("".concat(d.label, " (\u0627\u0646\u062E\u0641\u0636 ").concat((prev - cur).toFixed(1), ")"));
    });
    var speedText = avgSecPerPage
        ? " \u0648\u0645\u062A\u0648\u0633\u0637 \u0633\u0631\u0639\u0629 \u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 ".concat(analysisFormatMinutes(avgSecPerPage))
        : '';
    diagnosis.innerHTML = "\n    <strong>\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 ".concat(studentName, ":</strong>\n    ").concat(!currentRecords.length
        ? 'لا توجد درجات مسجلة في الأسبوع المحدد.'
        : "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 ".concat(currentRecords.length, " \u064A\u0648\u0645/\u0623\u064A\u0627\u0645. ").concat(improved > declined
            ? '<span class="analysis-status-good">المستوى العام يميل إلى التحسن.</span>'
            : declined > improved
                ? '<span class="analysis-status-bad">المستوى العام يميل إلى التراجع ويحتاج متابعة.</span>'
                : '<span class="analysis-status-neutral">المستوى العام مستقر تقريباً.</span>'), "\n    ").concat(speedText, ".\n    ").concat(strong.length ? "<br><strong>\u0646\u0642\u0627\u0637 \u062A\u062D\u0633\u0646 \u0648\u0627\u0636\u062D\u0629:</strong> ".concat(strong.join('، '), ".") : '', "\n    ").concat(weak.length ? "<br><strong>\u0646\u0642\u0627\u0637 \u062A\u062D\u062A\u0627\u062C \u0645\u062A\u0627\u0628\u0639\u0629:</strong> ".concat(weak.join('، '), ".") : '', "\n  ");
}
function renderAnalysisTimeTable(className, currentRecords, previousRecords) {
    var body = document.getElementById('analysis-time-body');
    if (!body)
        return;
    var defs = [
        { key: 'new', label: 'الجديد', grade: 'newLesson', time: 'newLessonTimeSeconds', pages: 'newPagesCount' },
        { key: 'old', label: 'الماضي', grade: 'oldRevision', time: 'oldRevisionTimeSeconds', pages: 'oldPagesCount' },
        { key: 'recitation', label: 'التلاوة', grade: 'recitation', time: 'recitationTimeSeconds', pages: 'recitationPagesCount' }
    ].filter(function (d) { return !(isFifthClass(className) && (d.key === 'new' || d.key === 'old')); });
    body.innerHTML = '';
    defs.forEach(function (d) {
        var avgGrade = analysisAverage(currentRecords, d.grade);
        var totalTime = analysisSum(currentRecords, d.time);
        var pages = analysisPages(currentRecords, d.pages);
        var secPerPage = analysisTimePerPage(currentRecords, d.time, d.pages);
        var prevSecPerPage = analysisTimePerPage(previousRecords, d.time, d.pages);
        var speed = analysisSpeedTrend(secPerPage, prevSecPerPage);
        var gradeText = avgGrade ? "".concat(avgGrade.toFixed(1), " / 10") : '-';
        body.innerHTML += "\n      <tr>\n        <td><strong>".concat(d.label, "</strong></td>\n        <td>").concat(gradeText, "</td>\n        <td>").concat(totalTime ? analysisFormatMinutes(totalTime) : '-', "</td>\n        <td>").concat(pages ? pages.toFixed(1) : '-', "</td>\n        <td>").concat(secPerPage ? analysisFormatMinutes(secPerPage) : '-', "</td>\n        <td class=\"").concat(speed.cls, "\">").concat(speed.label, "</td>\n      </tr>\n    ");
    });
    if (!body.innerHTML)
        body.innerHTML = '<tr><td colspan="6">لا توجد بيانات وقت/صفحات متاحة.</td></tr>';
}
function renderAnalysisComparison(className, currentRecords, previousRecords) {
    var body = document.getElementById('analysis-comparison-body');
    if (!body)
        return;
    body.innerHTML = '';
    getAnalysisGradeDefs(className).forEach(function (d) {
        var cur = d.key === 'total'
            ? (currentRecords.length ? currentRecords.reduce(function (s, r) { return s + getDailyTotal(r); }, 0) / currentRecords.length : 0)
            : analysisAverage(currentRecords, d.key);
        var prev = d.key === 'total'
            ? (previousRecords.length ? previousRecords.reduce(function (s, r) { return s + getDailyTotal(r); }, 0) / previousRecords.length : 0)
            : analysisAverage(previousRecords, d.key);
        var diff = cur - prev;
        var trend = analysisGradeTrend({ average: cur, recordsCount: currentRecords.length }, { average: prev, recordsCount: previousRecords.length });
        var max = d.max;
        body.innerHTML += "\n      <tr>\n        <td><strong>".concat(d.label, "</strong></td>\n        <td>").concat(previousRecords.length ? prev.toFixed(1) : '-', "</td>\n        <td>").concat(currentRecords.length ? cur.toFixed(1) : '-', "</td>\n        <td>").concat(previousRecords.length && currentRecords.length ? "".concat(diff >= 0 ? '+' : '').concat(diff.toFixed(1)) : '-', "</td>\n        <td class=\"").concat(trend.cls, "\">").concat(trend.label, "</td>\n      </tr>\n    ");
    });
}
function renderAnalysisCharts(studentName, className, selectedWeekKey) {
    var grid = document.getElementById('analysis-charts-grid');
    if (!grid)
        return;
    Object.values(analysisChartInstances).forEach(function (c) { try {
        c.destroy();
    }
    catch (e) { } });
    analysisChartInstances = {};
    grid.innerHTML = '';
    var defs = getAnalysisGradeDefs(className).filter(function (d) { return d.key !== 'total'; });
    var weeks = [];
    var allWeekKeys = Array.from(new Set(dailyRecords
        .filter(function (r) { return r.studentName === studentName && r.className === className && r.dateISO; })
        .map(function (r) { return getWeekKey(r.dateISO); }))).sort();
    var selectedIndex = allWeekKeys.indexOf(selectedWeekKey);
    var endIndex = selectedIndex >= 0 ? selectedIndex : allWeekKeys.length - 1;
    var startIndex = Math.max(0, endIndex - 7);
    var chartWeeks = allWeekKeys.slice(startIndex, endIndex + 1);
    defs.forEach(function (d, index) {
        var id = "analysisChart_".concat(index, "_").concat(Date.now());
        grid.innerHTML += "\n      <div class=\"analysis-chart-card\">\n        <h4>".concat(d.label, "</h4>\n        <div class=\"analysis-chart-wrap\"><canvas id=\"").concat(id, "\"></canvas></div>\n      </div>\n    ");
        var labels = chartWeeks.map(function (w) {
            var p = w.split('_');
            return "".concat(p[0].slice(5), " \u2192 ").concat(p[1].slice(5));
        });
        var data = chartWeeks.map(function (w) {
            var recs = getAnalysisRecords(studentName, className, w);
            return Number(analysisAverage(recs, d.key).toFixed(2));
        });
        var canvas = document.getElementById(id);
        if (!canvas || typeof Chart === 'undefined')
            return;
        analysisChartInstances[d.key] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                        label: "".concat(d.label, " / 10"),
                        data: data,
                        fill: false,
                        tension: .28,
                        pointRadius: 4
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    tooltip: { rtl: true }
                },
                scales: {
                    y: { min: 0, max: 10, ticks: { stepSize: 1 } }
                }
            }
        });
    });
}
function renderStudentDataAnalysis() {
    var _a, _b, _c;
    var className = (_a = document.getElementById('analysisClassSelect')) === null || _a === void 0 ? void 0 : _a.value;
    var studentName = (_b = document.getElementById('analysisStudentSelect')) === null || _b === void 0 ? void 0 : _b.value;
    var weekKey = (_c = document.getElementById('analysisWeekSelect')) === null || _c === void 0 ? void 0 : _c.value;
    if (!className || !studentName || !weekKey) {
        var title_1 = document.getElementById('analysis-period-title');
        if (title_1)
            title_1.textContent = 'اختر الصف والطالب والأسبوع لعرض التحليل.';
        return;
    }
    var currentRecords = getAnalysisRecords(studentName, className, weekKey);
    var previousWeekKey = getPreviousAnalysisWeekKey(weekKey);
    var previousRecords = getAnalysisRecords(studentName, className, previousWeekKey);
    var p = weekKey.split('_');
    var title = document.getElementById('analysis-period-title');
    if (title)
        title.textContent = "\u0627\u0644\u0637\u0627\u0644\u0628: ".concat(studentName, " \u2014 ").concat(className, " \u2014 \u0645\u0646 ").concat(p[0], " \u0625\u0644\u0649 ").concat(p[1]);
    renderAnalysisSummary(studentName, className, currentRecords, previousRecords);
    renderAnalysisTimeTable(className, currentRecords, previousRecords);
    renderAnalysisComparison(className, currentRecords, previousRecords);
    renderAnalysisCharts(studentName, className, weekKey);
}

/* ================= تقرير وقت الوافدين ================= */
var wafdeenTimeReportPeriod = 'day';
var wafdeenTimeReportRows = [];
function wafdeenTimePad2_(n){ return String(n).padStart(2,'0'); }
function wafdeenTimeToday_(){ var d=new Date(); return d.getFullYear()+'-'+wafdeenTimePad2_(d.getMonth()+1)+'-'+wafdeenTimePad2_(d.getDate()); }
function wafdeenTimeMonth_(){ var d=new Date(); return d.getFullYear()+'-'+wafdeenTimePad2_(d.getMonth()+1); }
function wafdeenTimeFormatSeconds_(sec){ sec=Math.max(0,Math.floor(Number(sec)||0)); var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60; return [h,m,s].map(function(v){return String(v).padStart(2,'0');}).join(':'); }
function wafdeenTimeDateObj_(iso){ var p=String(iso||'').slice(0,10).split('-'); if(p.length!==3) return null; var d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2])); return isNaN(d.getTime())?null:d; }
function wafdeenTimeWeekRange_(iso){ var d=wafdeenTimeDateObj_(iso)||new Date(), day=d.getDay(); var diff=(day+6)%7; var start=new Date(d); start.setDate(d.getDate()-diff); var end=new Date(start); end.setDate(start.getDate()+6); var fmt=function(x){return x.getFullYear()+'-'+wafdeenTimePad2_(x.getMonth()+1)+'-'+wafdeenTimePad2_(x.getDate());}; return [fmt(start),fmt(end)]; }
function setWafdeenTimePeriod(period){
  wafdeenTimeReportPeriod=period;
  ['day','week','month'].forEach(function(k){var b=document.getElementById('wafdeen-time-'+k+'-btn'); if(b) b.classList.toggle('active',k===period); var f=document.getElementById('wafdeen-time-'+k+'-field'); if(f) f.classList.toggle('hidden',k!==period);});
  var day=document.getElementById('wafdeenTimeDay'), week=document.getElementById('wafdeenTimeWeekDate'), month=document.getElementById('wafdeenTimeMonth');
  if(day && !day.value) day.value=wafdeenTimeToday_();
  if(week && !week.value) week.value=wafdeenTimeToday_();
  if(month && !month.value) month.value=wafdeenTimeMonth_();
  renderWafdeenTimeReport();
}
function getWafdeenTimeReportRange_(){
  if(wafdeenTimeReportPeriod==='week') return wafdeenTimeWeekRange_(document.getElementById('wafdeenTimeWeekDate')?.value||wafdeenTimeToday_());
  if(wafdeenTimeReportPeriod==='month'){ var v=document.getElementById('wafdeenTimeMonth')?.value||wafdeenTimeMonth_(); return [v+'-01',v+'-31']; }
  var d=document.getElementById('wafdeenTimeDay')?.value||wafdeenTimeToday_(); return [d,d];
}
function renderWafdeenTimeReport(){
  var range=getWafdeenTimeReportRange_(), start=range[0], end=range[1];
  var label=document.getElementById('wafdeenTimePeriodLabel');
  if(label){ label.textContent=wafdeenTimeReportPeriod==='day'?'تقرير يوم '+start:wafdeenTimeReportPeriod==='week'?'تقرير الأسبوع من '+start+' إلى '+end:'تقرير شهر '+start.slice(0,7); }
  var map={};
  (Array.isArray(wafdeenDailyRecords)?wafdeenDailyRecords:[]).filter(function(r){
    if(r && r._deleted) return false; var d=String(r.dateISO||'').slice(0,10); return d>=start && d<=end && (Number(r.newLessonTimeSeconds)||0)+(Number(r.oldRevisionTimeSeconds)||0)+(Number(r.recitationTimeSeconds)||0)>0;
  }).forEach(function(r){
    // التقرير مجمّع على مستوى الشيخ: يجمع أوقات جميع الطلاب الذين سمعهم الشيخ خلال الفترة.
    var teacher=String(r.teacherName||r.teacherUsername||'غير محدد');
    var key=teacher;
    if(!map[key]) map[key]={teacherName:teacher,newTime:0,oldTime:0,recitationTime:0,studentCount:0};
    map[key].newTime+=Number(r.newLessonTimeSeconds)||0;
    map[key].oldTime+=Number(r.oldRevisionTimeSeconds)||0;
    map[key].recitationTime+=Number(r.recitationTimeSeconds)||0;
    map[key].studentCount+=1;
  });
  wafdeenTimeReportRows=Object.keys(map).map(function(k){var x=map[k]; x.total=x.newTime+x.oldTime+x.recitationTime; return x;}).sort(function(a,b){return a.teacherName.localeCompare(b.teacherName,'ar');});
  var body=document.getElementById('wafdeenTimeReportBody'), empty=document.getElementById('wafdeenTimeReportEmpty'); if(!body)return;
  body.innerHTML=wafdeenTimeReportRows.map(function(x){return '<tr><td><strong>'+escapeHtml(x.teacherName)+'</strong></td><td>'+wafdeenTimeFormatSeconds_(x.newTime)+'</td><td>'+wafdeenTimeFormatSeconds_(x.oldTime)+'</td><td>'+wafdeenTimeFormatSeconds_(x.recitationTime)+'</td><td>'+wafdeenTimeFormatSeconds_(x.total)+'</td></tr>';}).join('');
  if(empty) empty.style.display=wafdeenTimeReportRows.length?'none':'block';
}
function exportWafdeenTimeReportExcel(){
  if(!wafdeenTimeReportRows.length){renderWafdeenTimeReport();}
  if(!wafdeenTimeReportRows.length) return showMessage('wafdeen-save-msg','لا توجد بيانات وقت لتصديرها','error');
  var data=wafdeenTimeReportRows.map(function(x){return {'الشيخ':x.teacherName,'وقت الجديد الكامل':wafdeenTimeFormatSeconds_(x.newTime),'وقت الماضي الكامل':wafdeenTimeFormatSeconds_(x.oldTime),'وقت التلاوة الكامل':wafdeenTimeFormatSeconds_(x.recitationTime),'المجموع الكامل':wafdeenTimeFormatSeconds_(x.total)};});
  try{var ws=XLSX.utils.json_to_sheet(data),wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'وقت الوافدين'); var range=getWafdeenTimeReportRange_(); var suffix=wafdeenTimeReportPeriod==='day'?range[0]:wafdeenTimeReportPeriod==='week'?range[0]+'_الى_'+range[1]:range[0].slice(0,7); XLSX.writeFile(wb,'تقرير_وقت_الوافدين_'+suffix+'.xlsx');}catch(e){showMessage('wafdeen-save-msg','تعذر تصدير تقرير وقت الوافدين: '+(e.message||e),'error');}
}

function switchTab(tabId, event) {
    if (tabId === 'supabase-usage-tab' && (!currentTeacher || String(currentTeacher.username || '').trim() !== 'admin' || currentTeacher.center === 'مشرف')) return;
    // المشرف يستطيع فقط مشاهدة: حالة إنجاز الرصد، الملاحظات، الأوائل، المصروفات، ومقرر الدفع.
    if ((currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.center) === 'مشرف' && !['status-tab', 'notes-tab', 'top-students-tab', 'payments-tab', 'payment-report-tab', 'wafdeen-time-tab'].includes(tabId)) {
        tabId = 'status-tab';
    }
    if (tabId !== 'admin-tab') {
        document.body.classList.remove('analysis-only-mode');
        var analysisAdminTab = document.getElementById('admin-tab');
        if (analysisAdminTab)
            analysisAdminTab.classList.remove('analysis-only');
        var analysisSection = document.getElementById('student-analysis-section');
        if (analysisSection)
            analysisSection.classList.add('hidden');
    }
    document.querySelectorAll('.sidebar-nav .tab-btn').forEach(function (btn) { return btn.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function (content) { return content.classList.remove('active'); });
    var clicked = event && event.currentTarget ? event.currentTarget : event.target;
    if (clicked && clicked.classList.contains('tab-btn'))
        clicked.classList.add('active');
    document.getElementById(tabId).classList.add('active');
    if (tabId === 'weekly-tab' || tabId === 'reports-tab' || tabId === 'manager-tab') {
        document.getElementById('reports-menu-wrap').classList.add('open');
        document.getElementById('reports-main-btn').classList.add('active');
    }
    closeMainMenu();
    if (tabId === 'attendance-tab')
        renderAttendanceTable();
    else if (tabId === 'status-tab')
        renderClassStatusTable();
    else if (tabId === 'weekly-tab') {
        populateWeeks();
        renderWeeklyTable();
    }
    else if (tabId === 'reports-tab')
        renderMonthlyReport();
    else if (tabId === 'manager-tab')
        renderManagerView();
    else if (tabId === 'top-students-tab')
        renderTopStudents();
    else if (tabId === 'wafdeen-time-tab') { setWafdeenTimePeriod(wafdeenTimeReportPeriod || 'day'); }
    else if (tabId === 'sharia-grades-tab') { renderShariaGradesReport(); }
    else if (tabId === 'notes-tab') {
        populateNotesClasses();
        updateNotesStudentList();
        renderNotesTable();
    }
    else if (tabId === 'admin-tab') {
        renderClassCards();
        renderStudentsTable();
        renderTeachersTable();
        renderResultsAdminSummary();
        renderDailyDateEditPermissions_();
    }
    else if (tabId === 'supabase-usage-tab') {
        refreshSupabaseUsageStatus();
    }
    else if (tabId === 'payments-tab') {
        populatePaymentsClasses();
        updatePaymentsStudentList();
    }
    else if (tabId === 'payment-report-tab') {
        populatePaymentReportClasses();
        updatePaymentReportStudentList();
    }
    else if (tabId === 'sheikh-registration-tab') {
        renderSheikhRegistrationView();
    }
}
function renderSheikhRegistrationView() {
    var classSelect = document.getElementById('sheikhRegClassSelect');
    var dateInput = document.getElementById('sheikhRegDate');
    if (!classSelect || !dateInput)
        return;
    if (!dateInput.value) {
        var fallback = document.getElementById('recordDate');
        dateInput.value = (fallback && fallback.value) || new Date().toISOString().slice(0, 10);
    }
    var className = classSelect.value;
    var dateVal = dateInput.value;
    // تسجيل الشيوخ لا يشمل الوافدين أو التمهيدي.
    if (className === 'تمهيدي' || className === 'الوافدين') {
        var sheikhClasses = getSheikhRegistrationClassOrder_();
        classSelect.value = sheikhClasses[0] || '';
        className = classSelect.value;
    }
    var classStudents = (studentsData || [])
        .filter(function (s) { return s.className === className; })
        .slice()
        .sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'ar'); });
    var classRecords = (shariaIsClass_(className) ? (shariaGradesData || []).map(function(r){ return Object.assign({},r,{isAbsent:!!r.absent,attendanceStatus:r.absent?'absent':'present'}); }) : (dailyRecords || [])).filter(function (r) { return r.className === className && r.dateISO === dateVal && !r._deleted; });
    var recordByName = {};
    classRecords.forEach(function (r) {
        var name = String(r.studentName || '').trim();
        if (name)
            recordByName[name] = r;
    });
    var recordedTbody = document.querySelector('#sheikhRegRecordedTable tbody');
    var unrecordedTbody = document.querySelector('#sheikhRegUnrecordedTable tbody');
    if (recordedTbody)
        recordedTbody.innerHTML = '';
    if (unrecordedTbody)
        unrecordedTbody.innerHTML = '';
    var recordedCount = 0, unrecordedCount = 0;
    classStudents.forEach(function (s) {
        var name = String(s.name || '').trim();
        var rec = recordByName[name];
        if (rec) {
            recordedCount++;
            var isAbsentRow = !!rec.isAbsent || String(rec.attendanceStatus || '') === 'absent';
            var statusBadge = isAbsentRow
                ? '<span class="badge" style="background:var(--danger-color);color:#fff;padding:3px 10px;">🚫 غائب</span>'
                : '<span class="badge badge-green">✅ حاضر</span>';
            if (recordedTbody) {
                recordedTbody.innerHTML += "<tr><td style=\"font-weight:bold;\">" + name + "</td><td>" + (rec.teacherName || '-') + "</td><td>" + statusBadge + "</td></tr>";
            }
        }
        else {
            unrecordedCount++;
            if (unrecordedTbody) {
                unrecordedTbody.innerHTML += "<tr><td>" + name + "</td></tr>";
            }
        }
    });
    if (recordedTbody && recordedCount === 0)
        recordedTbody.innerHTML = '<tr><td colspan="3">لا يوجد طلاب مسجلون في هذا اليوم</td></tr>';
    if (unrecordedTbody && unrecordedCount === 0)
        unrecordedTbody.innerHTML = '<tr><td>لا يوجد — تم تسجيل جميع الطلاب 🎉</td></tr>';
    var summary = document.getElementById('sheikhRegSummary');
    if (summary) {
        summary.innerHTML =
            '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:150px;background:#eaf8f1;border:1px solid #8fd3ae;border-radius:12px;padding:12px;text-align:center;">' +
            '<div style="font-size:.85em;color:#48685a;font-weight:700;">تم تسجيلهم</div>' +
            '<div style="font-size:1.5em;color:#0f7a4a;font-weight:900;">' + recordedCount + '</div></div>' +
            '<div style="flex:1;min-width:150px;background:#fff7e5;border:1px solid #e4c56a;border-radius:12px;padding:12px;text-align:center;">' +
            '<div style="font-size:.85em;color:#806a2b;font-weight:700;">لم يسجلوا</div>' +
            '<div style="font-size:1.5em;color:#a56b00;font-weight:900;">' + unrecordedCount + '</div></div>' +
            '<div style="flex:1;min-width:150px;background:#f5f7f7;border:1px solid #d5dddd;border-radius:12px;padding:12px;text-align:center;">' +
            '<div style="font-size:.85em;color:#5b6666;font-weight:700;">إجمالي الطلاب</div>' +
            '<div style="font-size:1.5em;color:var(--primary-dark);font-weight:900;">' + classStudents.length + '</div></div>' +
            '</div>';
    }
}

/* ============================================================
   تصدير تسجيل الشيوخ إلى Excel
   - ورقة "المجمع": كل الفصول في ورقة واحدة.
   - ورقة مستقلة لكل فصل.
   - التاريخ قبل اسم الطالب.
   - تم التسجيل باللون الأخضر، ولم يتم التسجيل باللون الأحمر.
   ============================================================ */
function getSheikhRegistrationClassOrder_() {
    // تسجيل الشيوخ لا يشمل التمهيدي ولا الوافدين.
    return GENERAL_CLASSES.filter(function (className) {
        return className !== 'تمهيدي' && className !== 'الوافدين';
    });
}

function sheikhRegistrationRowsForClass_(className, dateVal) {
    var students = (studentsData || [])
        .filter(function (s) { return s.className === className; })
        .slice()
        .sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'ar'); });

    var records = (shariaIsClass_(className) ? (shariaGradesData || []) : (dailyRecords || [])).filter(function (r) {
        return r.className === className && r.dateISO === dateVal && !r._deleted;
    });
    var byName = {};
    records.forEach(function (r) {
        var name = String(r.studentName || '').trim();
        if (name) byName[name] = r;
    });

    return students.map(function (s) {
        var name = String(s.name || '').trim();
        var rec = byName[name];
        return {
            date: dateVal,
            studentName: name,
            className: className,
            status: rec ? 'تم التسجيل' : 'لم يتم التسجيل',
            teacherName: rec ? String(rec.teacherName || '').trim() : ''
        };
    });
}

function sheikhExcelSafeSheetName_(name, fallback) {
    var s = String(name || fallback || 'Sheet').replace(/[\\\/\?\*\[\]\:]/g, ' ').trim();
    if (!s) s = fallback || 'Sheet';
    return s.slice(0, 31);
}

function styleSheikhExcelSheet_(ws, rowsCount) {
    var headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '176B55' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
            top: { style: 'thin', color: { rgb: 'C7A24A' } },
            bottom: { style: 'thin', color: { rgb: 'C7A24A' } },
            left: { style: 'thin', color: { rgb: 'C7A24A' } },
            right: { style: 'thin', color: { rgb: 'C7A24A' } }
        }
    };
    var greenStyle = {
        fill: { fgColor: { rgb: 'D7ECDF' } },
        font: { color: { rgb: '0F5132' }, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' }
    };
    var redStyle = {
        fill: { fgColor: { rgb: 'FBDedB'.toUpperCase() } },
        font: { color: { rgb: '7A271F' }, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' }
    };

    var headerCells = ['A1','B1','C1','D1','E1'];
    headerCells.forEach(function (cell) {
        if (ws[cell]) ws[cell].s = headerStyle;
    });

    for (var r = 2; r <= rowsCount + 1; r++) {
        var statusCell = ws['D' + r];
        if (statusCell) statusCell.s = statusCell.v === 'تم التسجيل' ? greenStyle : redStyle;
        ['A','B','C','E'].forEach(function (col) {
            var c = ws[col + r];
            if (c) c.s = { alignment: { horizontal: 'center', vertical: 'center' } };
        });
    }
    ws['!cols'] = [
        { wch: 14 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 25 }
    ];
    ws['!autofilter'] = { ref: 'A1:E' + Math.max(1, rowsCount + 1) };
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
}

function makeSheikhExcelSheet_(rows) {
    var aoa = [['التاريخ', 'اسم الطالب', 'الفصل', 'حالة التسجيل', 'الشيخ']];
    rows.forEach(function (r) {
        aoa.push([r.date, r.studentName, r.className, r.status, r.teacherName]);
    });
    var ws = XLSX.utils.aoa_to_sheet(aoa);
    styleSheikhExcelSheet_(ws, rows.length);

    // تلوين الصف من خانة الفصل حتى خانة الشيخ حسب الفصل.
    var classColors = {
        'أولى - أولاد': 'FFF2CC', 'أولى - بنات': 'FCE4D6',
        'ثانية - أولاد': 'E2F0D9', 'ثانية - بنات': 'DDEBF7',
        'ثالثة - أولاد': 'E4DFEC', 'ثالثة - بنات': 'FFF2CC',
        'رابعة - أولاد': 'D9EAD3', 'رابعة - بنات': 'D9EAF7',
        'خامسة - أولاد': 'F4CCCC', 'خامسة - بنات': 'D9D2E9'
    };
    if (ws && ws['!ref']) {
        var range = XLSX.utils.decode_range(ws['!ref']);
        for (var rr = 1; rr <= range.e.r; rr++) {
            var classCell = ws[XLSX.utils.encode_cell({r: rr, c: 0})];
            var className = classCell && classCell.v != null ? String(classCell.v) : '';
            var bg = classColors[className];
            if (!bg) continue;
            for (var cc = 0; cc <= range.e.c; cc++) {
                var cell = ws[XLSX.utils.encode_cell({r: rr, c: cc})];
                if (!cell) continue;
                cell.s = cell.s || {};
                cell.s.fill = { patternType: 'solid', fgColor: { rgb: bg } };
            }
        }
    }
    return ws;
}

function exportSheikhRegistrationExcel() {
    try {
        if (typeof XLSX === 'undefined' || !XLSX.utils || !XLSX.writeFile) {
            return showMessage('app-msg', 'مكتبة Excel غير محملة. تأكد من الاتصال بالإنترنت ثم أعد فتح الصفحة.', 'error');
        }
        var dateEl = document.getElementById('sheikhRegDate');
        var dateVal = (dateEl && dateEl.value) || new Date().toISOString().slice(0, 10);
        var classOrder = getSheikhRegistrationClassOrder_();
        var wb = XLSX.utils.book_new();
        var allRows = [];

        classOrder.forEach(function (className) {
            var rows = sheikhRegistrationRowsForClass_(className, dateVal);
            allRows = allRows.concat(rows);
            var ws = makeSheikhExcelSheet_(rows);
            XLSX.utils.book_append_sheet(wb, ws, sheikhExcelSafeSheetName_(className, 'فصل'));
        });

        var allWs = makeSheikhExcelSheet_(allRows);
        XLSX.utils.book_append_sheet(wb, allWs, 'المجمع');

        var fileDate = dateVal.replace(/-/g, '_');
        XLSX.writeFile(wb, 'تسجيل_الشيوخ_' + fileDate + '.xlsx');
        showMessage('app-msg', 'تم تصدير تسجيل الشيوخ للتاريخ ' + dateVal + ' في ملف Excel واحد، به ورقة مجمعة وورقة لكل فصل ✅', 'success');
    }
    catch (e) {
        console.error('Sheikh registration Excel export error:', e);
        showMessage('app-msg', 'تعذر تصدير تسجيل الشيوخ إلى Excel.', 'error');
    }
}

function getSheikhRegistrationAllDates_() {
    var dates = {};
    var minDate = '2026-09-13';
    (dailyRecords || []).forEach(function (r) {
        var d = r && r.dateISO ? String(r.dateISO).slice(0, 10) : '';
        if (d && d >= minDate && !r._deleted) dates[d] = true;
    });
    (shariaGradesData || []).forEach(function (r) {
        var d = r && r.dateISO ? String(r.dateISO).slice(0, 10) : '';
        if (d && d >= minDate && !r._deleted) dates[d] = true;
    });

    // لو كان هناك تاريخ محدد حاليًا، نضمن ظهوره أيضًا إذا كان من 13 سبتمبر أو بعده.
    var currentDateEl = document.getElementById('sheikhRegDate');
    if (currentDateEl && currentDateEl.value) {
        var currentDate = String(currentDateEl.value).slice(0, 10);
        if (currentDate >= minDate) dates[currentDate] = true;
    }

    return Object.keys(dates).sort(function (a, b) {
        return a.localeCompare(b);
    });
}

function getSheikhDetailedExcelRow_(className, dateVal, studentName) {
    var name = String(studentName || '').trim();
    var rec = (shariaIsClass_(className) ? (shariaGradesData || []) : (dailyRecords || [])).find(function (r) {
        return r && !r._deleted && r.className === className && r.dateISO === dateVal && String(r.studentName || '').trim() === name;
    });

    var status = !rec ? 'لم يسجل' : (rec.isAbsent || rec.absent || String(rec.attendanceStatus || '').toLowerCase() === 'absent' ? 'غائب' : 'حاضر');
    return {
        className: className,
        studentName: name,
        date: dateVal,
        attendance: rec ? (rec.attendance == null ? 0 : rec.attendance) : '',
        behavior: rec ? (rec.behavior == null ? 0 : rec.behavior) : '',
        newLesson: rec ? (rec.newLesson == null ? 0 : rec.newLesson) : '',
        newCount: rec ? (rec.newRecitationCount == null ? '' : rec.newRecitationCount) : '',
        newTopicToday: rec ? (rec.newTopicToday || rec.newTopicText || '') : '',
        newTopicRecited: rec ? (rec.newTopicRecited || '') : '',
        newPagesCount: rec ? (rec.newPagesCount == null ? '' : rec.newPagesCount) : '',
        oldRevision: rec ? (rec.oldRevision == null ? 0 : rec.oldRevision) : '',
        oldCount: rec ? (rec.oldRecitationCount == null ? '' : rec.oldRecitationCount) : '',
        oldTopicToday: rec ? (rec.oldTopicToday || rec.oldTopicText || '') : '',
        oldTopicRecited: rec ? (rec.oldTopicRecited || '') : '',
        oldPagesCount: rec ? (rec.oldPagesCount == null ? '' : rec.oldPagesCount) : '',
        recitation: rec ? (rec.recitation == null ? 0 : rec.recitation) : '',
        recitationCount: rec ? (rec.recitationRecitationCount == null ? '' : rec.recitationRecitationCount) : '',
        recitationTopicToday: rec ? (rec.recitationTopicToday || rec.recitationTopic || '') : '',
        recitationTopicRecited: rec ? (rec.recitationTopicRecited || '') : '',
        recitationPagesCount: rec ? (rec.recitationPagesCount == null ? '' : rec.recitationPagesCount) : '',
        homework: rec ? (rec.homework == null ? 0 : rec.homework) : '',
        tajweed: rec ? (rec.tajweed == null ? 0 : rec.tajweed) : '',
        total: rec ? (rec.total == null ? getDailyTotal(rec) : rec.total) : '',
        status: status,
        teacherName: rec ? String(rec.teacherName || '').trim() : ''
    };
}

function sheikhDetailedExcelRowsForDate_(dateVal) {
    var rows = [];
    getSheikhRegistrationClassOrder_().forEach(function (className) {
        var students = (studentsData || [])
            .filter(function (s) { return s.className === className; })
            .slice()
            .sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'ar'); });
        students.forEach(function (s) {
            rows.push(getSheikhDetailedExcelRow_(className, dateVal, s.name));
        });
    });
    return rows;
}

function makeSheikhDetailedExcelSheet_(rows) {
    var aoa = [[
        'التاريخ', 'الفصل', 'اسم الطالب', 'الحضور', 'السلوك',
        'الجديد', 'عدد مرات الجديد', 'مقرر الجديد', 'مقرر الجديد الذي تم تسميعه', 'عدد صفحات الجديد',
        'الماضي', 'عدد مرات الماضي', 'مقرر الماضي', 'مقرر الماضي الذي تم تسميعه', 'عدد صفحات الماضي',
        'التلاوة', 'عدد مرات التلاوة', 'مقرر التلاوة', 'مقرر التلاوة الذي تم تسميعه', 'عدد صفحات التلاوة',
        'الواجب', 'التجويد', 'المجموع', 'حالة التسجيل', 'الشيخ'
    ]];
    rows.forEach(function (r) {
        aoa.push([
            r.date, r.className, r.studentName, r.attendance, r.behavior,
            r.newLesson, r.newCount, r.newTopicToday, r.newTopicRecited, r.newPagesCount,
            r.oldRevision, r.oldCount, r.oldTopicToday, r.oldTopicRecited, r.oldPagesCount,
            r.recitation, r.recitationCount, r.recitationTopicToday, r.recitationTopicRecited, r.recitationPagesCount,
            r.homework, r.tajweed, r.total, r.status, r.teacherName
        ]);
    });

    var ws = XLSX.utils.aoa_to_sheet(aoa);
    var headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '176B55' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    };
    var centerStyle = { alignment: { horizontal: 'center', vertical: 'center', wrapText: true } };
    for (var c = 0; c < aoa[0].length; c++) {
        var cell = ws[XLSX.utils.encode_cell({ r: 0, c: c })];
        if (cell) cell.s = headerStyle;
    }
    for (var i = 0; i < rows.length; i++) {
        var excelRow = i + 2;
        for (var c2 = 0; c2 < aoa[0].length; c2++) {
            var dataCell = ws[XLSX.utils.encode_cell({ r: i + 1, c: c2 })];
            if (dataCell) dataCell.s = centerStyle;
        }
        var statusCell = ws['X' + excelRow];
        var rowStatusStyle;
        if (statusCell && statusCell.v === 'حاضر') {
            rowStatusStyle = { fill: { fgColor: { rgb: 'C6EFCE' } }, font: { color: { rgb: '006100' }, bold: true }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } };
        } else if (statusCell && statusCell.v === 'غائب') {
            rowStatusStyle = { fill: { fgColor: { rgb: 'FFF2CC' } }, font: { color: { rgb: '7F6000' }, bold: true }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } };
        } else {
            rowStatusStyle = { fill: { fgColor: { rgb: 'F4CCCC' } }, font: { color: { rgb: '9C0006' }, bold: true }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true } };
        }
        // تلوين الصف من الفصل حتى الشيخ: B:Y، بدون تلوين التاريخ.
        for (var colorCol = 1; colorCol <= 24; colorCol++) { // B:Y
            var rowCell = ws[XLSX.utils.encode_cell({ r: i + 1, c: colorCol })];
            if (rowCell) {
                rowCell.s = rowStatusStyle;
                rowCell.s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
            }
        }
    }
    ws['!cols'] = [
        { wch: 14 }, { wch: 20 }, { wch: 30 }, { wch: 12 }, { wch: 12 },
        { wch: 12 }, { wch: 16 }, { wch: 30 }, { wch: 35 }, { wch: 10 },
        { wch: 12 }, { wch: 16 }, { wch: 30 }, { wch: 35 }, { wch: 10 },
        { wch: 12 }, { wch: 16 }, { wch: 30 }, { wch: 35 }, { wch: 10 },
        { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 25 }
    ];
    ws['!autofilter'] = { ref: 'A1:Y' + Math.max(1, rows.length + 1) };
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    return ws;
}

function exportAllSheikhRegistrationDatesExcel() {
    try {
        if (typeof XLSX === 'undefined' || !XLSX.utils || !XLSX.writeFile) {
            return showMessage('app-msg', 'مكتبة Excel غير محملة. تأكد من الاتصال بالإنترنت ثم أعد فتح الصفحة.', 'error');
        }

        var dates = getSheikhRegistrationAllDates_();
        if (!dates.length) {
            return showMessage('app-msg', 'لا توجد تواريخ متاحة لتصدير تسجيل الشيوخ.', 'error');
        }

        var wb = XLSX.utils.book_new();
        var allDatesRows = [];

        dates.forEach(function (dateVal) {
            var rowsForDate = sheikhDetailedExcelRowsForDate_(dateVal);
            allDatesRows = allDatesRows.concat(rowsForDate);
            XLSX.utils.book_append_sheet(wb, makeSheikhDetailedExcelSheet_(rowsForDate), sheikhExcelSafeSheetName_(dateVal, 'تاريخ'));
        });

        var allDatesWs = makeSheikhDetailedExcelSheet_(allDatesRows);
        wb.SheetNames.unshift('المجمع');
        wb.Sheets['المجمع'] = allDatesWs;

        XLSX.writeFile(wb, 'تسجيل_الشيوخ_كل_الأيام_بالدرجات.xlsx');
        showMessage('app-msg', 'تم تصدير ملف Excel شامل لكل التواريخ بالدرجات والتفاصيل المطلوبة، مع تلوين الحاضر أخضر والغائب أصفر ومن لم يسجل أحمر ✅', 'success');
    }
    catch (e) {
        console.error('All sheikh registration dates Excel export error:', e);
        showMessage('app-msg', 'تعذر تصدير ملف Excel الشامل لكل الأيام.', 'error');
    }
}

function exportCurrentSheikhClassExcel() {
    try {
        if (typeof XLSX === 'undefined' || !XLSX.utils || !XLSX.writeFile) {
            return showMessage('app-msg', 'مكتبة Excel غير محملة. تأكد من الاتصال بالإنترنت ثم أعد فتح الصفحة.', 'error');
        }
        var classEl = document.getElementById('sheikhRegClassSelect');
        var dateEl = document.getElementById('sheikhRegDate');
        var className = (classEl && classEl.value) || '';
        var dateVal = (dateEl && dateEl.value) || new Date().toISOString().slice(0, 10);
        if (!className) return showMessage('app-msg', 'اختر الفصل أولاً.', 'error');

        var rows = sheikhRegistrationRowsForClass_(className, dateVal);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, makeSheikhExcelSheet_(rows), sheikhExcelSafeSheetName_(className, 'فصل'));
        XLSX.writeFile(wb, 'تسجيل_الشيوخ_' + className.replace(/\s+/g, '_') + '_' + dateVal.replace(/-/g, '_') + '.xlsx');
        showMessage('app-msg', 'تم تصدير الفصل الحالي إلى Excel ✅', 'success');
    }
    catch (e) {
        console.error('Current sheikh class Excel export error:', e);
        showMessage('app-msg', 'تعذر تصدير الفصل الحالي إلى Excel.', 'error');
    }
}
function isFifthClass(className) {
    return typeof className === 'string' && className.indexOf('خامسة') === 0;
}
function getDailyMax(className) {
    return isFifthClass(className) ? 50 : 70;
}
function updateFifthGradeFields(className) {
    var fifth = isFifthClass(className);
    var wafdeen = String(className || '').trim() === 'الوافدين';
    document.body.classList.toggle('fifth-selected', fifth);
    document.body.classList.toggle('wafdeen-selected', wafdeen);
    // في فصل الوافدين لا نعرض عدد مرات التسميع، وتُستخدم القيمة الافتراضية مرة واحدة داخليًا.
    if (wafdeen) {
        ['newRecitationCount','oldRecitationCount','recitationRecitationCount'].forEach(function(id){
            var el=document.getElementById(id);
            if(el) el.value='1';
        });
    }
    var saveBtn = document.querySelector('#daily-tab .daily-scores-card .btn-save');
    if (saveBtn)
        saveBtn.innerText = "\uD83D\uDCBE \u062D\u0641\u0638 \u0627\u0644\u062F\u0631\u062C\u0627\u062A \u0648\u0627\u0644\u0648\u0642\u062A (\u0645\u0646 ".concat(getDailyMax(className), ")");
}
function clampGrade(val) {
    var n = Number(val) || 0;
    if (n < 0)
        return 0;
    if (n > 10)
        return 10;
    return n;
}
function getDailyTotal(record) {
    return (record.attendance || 0) + (record.behavior || 0) + (record.newLesson || 0) +
        (record.oldRevision || 0) + (record.recitation || 0) + (record.homework || 0) + (record.tajweed || 0);
}
/* ================= أسباب خصم السلوك ================= */
var WAFDEEN_BEHAVIOR_REASONS = [
    { key: 'delay', label: 'التاخير', points: 1 },
    { key: 'makeup', label: 'المكياج', points: 2 },
    { key: 'hijab', label: 'الطرحه', points: 2 },
    { key: 'noreview', label: 'عدم المراجعه', points: 2 },
    { key: 'talkback', label: 'الرد علي الشيخ', points: 3 },
    { key: 'lying', label: 'الكذب', points: 3 },
    { key: 'laughing', label: 'الضحك والهزار', points: 2 },
    { key: 'loudvoice', label: 'رفع الصوت', points: 2 },
    { key: 'objecting', label: 'الاعتراض علي الشيخ', points: 2 },
    { key: 'focus', label: 'التركيز', points: 2 },
    { key: 'parentsobedience', label: 'طاعه الوالدين', points: 3 },
    { key: 'tongue', label: 'حفظ اللسان', points: 2 },
    { key: 'cleanliness', label: 'النظافه', points: 2 },
    { key: 'permission', label: 'الاستذان', points: 2 },
    { key: 'order', label: 'النظام', points: 1 },
    { key: 'harassment', label: 'التحرش', points: 9 },
    { key: 'cursing', label: 'السباب', points: 3 },
    { key: 'uniform', label: 'عدم الالتزام بالزي', points: 2 }
];
var wafdeenBehaviorState = { daily: {}, modal: {} };
function wafdeenBehaviorReasonsRowsHtml(prefix) {
    return WAFDEEN_BEHAVIOR_REASONS.map(function (r) { return "\n    <div class=\"behavior-reason-row\">\n      <span class=\"behavior-reason-label\">".concat(r.label, " <span class=\"behavior-reason-points\">(-").concat(r.points, ")</span></span>\n      <div class=\"behavior-reason-controls\">\n        <button type=\"button\" class=\"behavior-reason-btn\" onclick=\"event.preventDefault();wafdeenBehaviorChange('").concat(prefix, "','").concat(r.key, "',-1);return false;\">\u2212</button>\n        <span id=\"").concat(prefix, "-behavior-count-").concat(r.key, "\" class=\"behavior-reason-count\">0</span>\n        <button type=\"button\" class=\"behavior-reason-btn\" onclick=\"event.preventDefault();wafdeenBehaviorChange('").concat(prefix, "','").concat(r.key, "',1);return false;\">+</button>\n      </div>\n    </div>"); }).join('');
}
function wafdeenMountBehaviorPanel(containerId, prefix) {
    var el = document.getElementById(containerId);
    if (el)
        el.innerHTML = wafdeenBehaviorReasonsRowsHtml(prefix);
}
function wafdeenToggleBehaviorPanel(prefix) {
    var grid = document.getElementById("".concat(prefix, "-behavior-grid"));
    if (grid)
        grid.classList.toggle('is-visible');
}
function wafdeenBehaviorDeduction(prefix) {
    var state = wafdeenBehaviorState[prefix] || {};
    return WAFDEEN_BEHAVIOR_REASONS.reduce(function (sum, r) { return sum + (Math.max(0, parseInt(state[r.key], 10) || 0)) * r.points; }, 0);
}
function wafdeenBehaviorSummaryText(prefix) {
    var state = wafdeenBehaviorState[prefix] || {};
    return WAFDEEN_BEHAVIOR_REASONS
        .filter(function (r) { return (parseInt(state[r.key], 10) || 0) > 0; })
        .map(function (r) { var n = parseInt(state[r.key], 10) || 0; return "".concat(r.label, " \u00D7").concat(n, " (-").concat(n * r.points, ")"); })
        .join('، ');
}
function wafdeenRecalcBehavior(prefix) {
    var deduction = wafdeenBehaviorDeduction(prefix);
    var score = Math.max(0, Math.min(10, 10 - deduction));
    var input = document.getElementById(prefix === 'daily' ? 'behavior' : 'modalBehavior');
    if (input)
        input.value = score;
    var summaryEl = document.getElementById("".concat(prefix, "-behavior-summary"));
    var text = wafdeenBehaviorSummaryText(prefix);
    if (summaryEl)
        summaryEl.textContent = text ? "\u0633\u0628\u0628 \u0627\u0644\u062E\u0635\u0645: ".concat(text, " \u2014 \u0627\u0644\u062F\u0631\u062C\u0629: ").concat(score, "/10") : "\u0644\u0627 \u064A\u0648\u062C\u062F \u062E\u0635\u0645 \u2014 \u0627\u0644\u062F\u0631\u062C\u0629: 10/10";
    return score;
}
function wafdeenBehaviorChange(prefix, key, delta) {
    if (!wafdeenBehaviorState[prefix])
        wafdeenBehaviorState[prefix] = {};
    var cur = Math.max(0, (parseInt(wafdeenBehaviorState[prefix][key], 10) || 0) + delta);
    wafdeenBehaviorState[prefix][key] = cur;
    var el = document.getElementById("".concat(prefix, "-behavior-count-").concat(key));
    if (el)
        el.textContent = String(cur);
    wafdeenRecalcBehavior(prefix);
    if (prefix === 'daily') {
        try {
            wafdeenSaveDailyDraft_();
        }
        catch (_) { }
    }
}
function wafdeenResetBehaviorState(prefix, counts) {
    counts = counts || {};
    var state = {};
    WAFDEEN_BEHAVIOR_REASONS.forEach(function (r) { state[r.key] = Math.max(0, parseInt(counts[r.key], 10) || 0); });
    wafdeenBehaviorState[prefix] = state;
    WAFDEEN_BEHAVIOR_REASONS.forEach(function (r) {
        var el = document.getElementById("".concat(prefix, "-behavior-count-").concat(r.key));
        if (el)
            el.textContent = String(state[r.key]);
    });
    var grid = document.getElementById("".concat(prefix, "-behavior-grid"));
    if (grid)
        grid.classList.remove('is-visible');
    wafdeenRecalcBehavior(prefix);
}
function wafdeenShowBehaviorReasons(text) {
    showSiteModal('📋 سبب خصم السلوك', text ? "<div style=\"line-height:2;\">".concat(String(text).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); }), "</div>") : '<div>لا يوجد خصم — الطالب حاصل على الدرجة كاملة.</div>', "<button type=\"button\" class=\"action-btn modal-success\" onclick=\"closeSiteModal()\">\u062D\u0633\u0646\u0627\u064B</button>");
}
document.addEventListener('DOMContentLoaded', function () {
    wafdeenMountBehaviorPanel('daily-behavior-grid', 'daily');
    wafdeenResetBehaviorState('daily', {});
});
/* ================= تايمر الرصد اليومي ================= */
var dailyTimerType = 'new';
var dailyTimerRunning = false;
var dailyTimerStartedAt = 0;
var dailyTimerBaseSeconds = 0;
var dailyTimerInterval = null;
var dailyTimerSeconds = { new: 0, old: 0, recitation: 0 };
var dailyActiveStudentKey_ = '';
var dailyTimerDrafts_ = {};
var dailyErrorCounters = {
    new: { errors: 0, tashkeel: 0, repetition: 0 },
    old: { errors: 0, tashkeel: 0, repetition: 0 },
    recitation: { errors: 0, tashkeel: 0, repetition: 0 }
};
var dailyCounterType = '';
function getDailyTimerField(type) {
    return type === 'new' ? 'newLessonTimeSeconds' : (type === 'old' ? 'oldRevisionTimeSeconds' : 'recitationTimeSeconds');
}
function formatTimerSeconds(total) {
    total = Math.max(0, Math.floor(Number(total) || 0));
    var h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60;
    return [h, m, sec].map(function (v) { return String(v).padStart(2, '0'); }).join(':');
}
function formatTimerArabic(total) {
    return "".concat(formatTimerSeconds(total), " (\u0633 ").concat(Math.floor(total / 3000), ":\u062F ").concat(Math.floor((total % 3000) / 60), ":\u062B ").concat(total % 60, ")");
}
function getSelectedDailyRecord() {
    var _a, _b;
    var student = (_a = document.getElementById('studentNameSelect')) === null || _a === void 0 ? void 0 : _a.value;
    var date = (_b = document.getElementById('recordDate')) === null || _b === void 0 ? void 0 : _b.value;
    if (!student || !date)
        return null;
    return dailyRecords.find(function (r) { return r.studentName === student && r.dateISO === date && r.teacherName === currentTeacher.username; }) || null;
}
function getCurrentTimerElapsed() {
    return dailyTimerRunning ? dailyTimerBaseSeconds + Math.floor((Date.now() - dailyTimerStartedAt) / 1000) : dailyTimerBaseSeconds;
}
function renderDailyTimer() {
    var dailyTypeNames = { new: 'الجديد', old: 'الماضي', recitation: 'التلاوة' };
    var selectedName = dailyTypeNames[dailyTimerType] || 'الجديد';
    var now = getCurrentTimerElapsed();
    var display = document.getElementById('dailyTimerDisplay');
    if (display)
        display.textContent = formatTimerSeconds(now);
    var label = document.getElementById('dailySelectedTimerLabel');
    if (label)
        label.textContent = "\u23F1\uFE0F \u062A\u0627\u064A\u0645\u0631 ".concat(selectedName);
    var status = document.getElementById('dailyTimerStatus');
    if (status)
        status.textContent = dailyTimerRunning ? "\u23F1\uFE0F \u062C\u0627\u0631\u064D \u0627\u062D\u062A\u0633\u0627\u0628 \u0648\u0642\u062A ".concat(selectedName) : (now > 0 ? "\u23F8\uFE0F \u0648\u0642\u062A ".concat(selectedName, " \u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u064B\u0627") : "\u062C\u0627\u0647\u0632 \u0644\u062A\u0633\u0645\u064A\u0639 ".concat(selectedName));
}
function updateDailyTypeTimes() {
    Object.keys(dailyTimerSeconds).forEach(function (type) {
        var seconds = dailyTimerSeconds[type] || 0;
        var el = document.getElementById("dailyTypeTime-".concat(type));
        if (el)
            el.textContent = seconds ? "\u062A\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0641\u064A ".concat(formatTimerSeconds(seconds)) : 'لم يُسجل بعد';
        var labelId = type === 'new' ? 'newLessonTimeLabel' : type === 'old' ? 'oldRevisionTimeLabel' : 'recitationTimeLabel';
        var label = document.getElementById(labelId);
        if (label)
            label.textContent = seconds ? "\u062A\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0641\u064A ".concat(formatTimerSeconds(seconds)) : '';
    });
}
function selectDailyTimerType(type) {
    if (!['new', 'old', 'recitation'].includes(type))
        type = 'new';
    // السماح بالتنقل بين الجديد والماضي والتلاوة أثناء تشغيل التايمر.
    // عند التبديل نحفظ زمن النوع الحالي ونبدأ حساب الزمن من لحظة التبديل للنوع الجديد.
    if (dailyTimerRunning && dailyTimerType !== type) {
        var elapsedCurrent = getCurrentTimerElapsed();
        dailyTimerSeconds[dailyTimerType] = elapsedCurrent;
        dailyTimerBaseSeconds = elapsedCurrent;
        dailyTimerType = type;
        dailyTimerBaseSeconds = dailyTimerSeconds[type] || 0;
        dailyTimerStartedAt = Date.now();
    }
    dailyTimerType = type;
    dailyCounterType = type;
    dailySaveTimerDraft_();
    dailySelectedGradeType = type;
    document.querySelectorAll('.daily-type-btn').forEach(function (btn) { return btn.classList.toggle('active', btn.dataset.type === type); });
    dailyTimerBaseSeconds = dailyTimerSeconds[type] || 0;
    dailyRenderCounters();
    renderDailyTimer();
    selectDailyGradeType(type);
}
// حفظ مؤقت فوري لدرجات الجديد والماضي والتلاوة والعدادات أثناء التسجيل.
// المفتاح مرتبط بالطالب والتاريخ حتى لا تختلط درجات طالب بآخر.
function wafdeenDailyDraftKey_() {
    var _a, _b;
    var student = ((_a = document.getElementById('studentNameSelect')) === null || _a === void 0 ? void 0 : _a.value) || '';
    var date = ((_b = document.getElementById('recordDate')) === null || _b === void 0 ? void 0 : _b.value) || '';
    return 'wafdeenDailyDraft:' + student + ':' + date;
}
function wafdeenSaveDailyDraft_() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        var draft = {
            newLesson: ((_a = document.getElementById('newLesson')) === null || _a === void 0 ? void 0 : _a.value) || '',
            oldRevision: ((_b = document.getElementById('oldRevision')) === null || _b === void 0 ? void 0 : _b.value) || '',
            recitation: ((_c = document.getElementById('recitation')) === null || _c === void 0 ? void 0 : _c.value) || '',
            newErrors: Number(((_d = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.new) === null || _d === void 0 ? void 0 : _d.errors) || 0),
            newTashkeel: Number(((_e = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.new) === null || _e === void 0 ? void 0 : _e.tashkeel) || 0),
            newRepetition: Number(((_f = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.new) === null || _f === void 0 ? void 0 : _f.repetition) || 0),
            oldErrors: Number(((_g = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.old) === null || _g === void 0 ? void 0 : _g.errors) || 0),
            oldTashkeel: Number(((_h = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.old) === null || _h === void 0 ? void 0 : _h.tashkeel) || 0),
            oldRepetition: Number(((_j = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.old) === null || _j === void 0 ? void 0 : _j.repetition) || 0),
            recitationErrors: Number(((_k = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.recitation) === null || _k === void 0 ? void 0 : _k.errors) || 0),
            recitationTashkeel: Number(((_l = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.recitation) === null || _l === void 0 ? void 0 : _l.tashkeel) || 0),
            recitationRepetition: Number(((_m = dailyErrorCounters === null || dailyErrorCounters === void 0 ? void 0 : dailyErrorCounters.recitation) === null || _m === void 0 ? void 0 : _m.repetition) || 0),
            counterType: dailyCounterType || dailyTimerType || '',
            behaviorCounts: __assign({}, (wafdeenBehaviorState.daily || {}))
        };
        memoryStorage.setItem(wafdeenDailyDraftKey_(), JSON.stringify(draft));
    }
    catch (_) { }
}
function wafdeenRestoreDailyDraft_() {
    try {
        var draft_1 = JSON.parse(memoryStorage.getItem(wafdeenDailyDraftKey_()) || 'null');
        if (!draft_1)
            return;
        ['newLesson', 'oldRevision', 'recitation'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el && draft_1[id] !== undefined && draft_1[id] !== '')
                el.value = draft_1[id];
        });
        dailyErrorCounters = {
            new: { errors: Number(draft_1.newErrors || 0), tashkeel: Number(draft_1.newTashkeel || 0), repetition: Number(draft_1.newRepetition || 0) },
            old: { errors: Number(draft_1.oldErrors || 0), tashkeel: Number(draft_1.oldTashkeel || 0), repetition: Number(draft_1.oldRepetition || 0) },
            recitation: { errors: Number(draft_1.recitationErrors || 0), tashkeel: Number(draft_1.recitationTashkeel || 0), repetition: Number(draft_1.recitationRepetition || 0) }
        };
        if (draft_1.counterType)
            dailyCounterType = draft_1.counterType;
        dailyRenderCounters();
        wafdeenResetBehaviorState('daily', draft_1.behaviorCounts || {});
    }
    catch (_) { }
}
function dailyCounterSet() {
    var type = dailyCounterType || dailyTimerType;
    if (!type)
        return null;
    if (!dailyErrorCounters[type])
        dailyErrorCounters[type] = { errors: 0, tashkeel: 0, repetition: 0 };
    return dailyErrorCounters[type];
}
function dailyCalculateGrade(type) {
    var countId = { new: 'newRecitationCount', old: 'oldRecitationCount', recitation: 'recitationRecitationCount' }[type];
    var gradeId = { new: 'newLesson', old: 'oldRevision', recitation: 'recitation' }[type];
    var countEl = document.getElementById(countId);
    var gradeEl = document.getElementById(gradeId);
    if (!gradeEl)
        return '';
    var base = dailyGradeFromRecitationCount(countEl === null || countEl === void 0 ? void 0 : countEl.value);
    if (base === '') {
        gradeEl.value = '';
        return '';
    }
    var c = dailyErrorCounters[type] || { errors: 0, tashkeel: 0, repetition: 0 };
    var deduction = (Number(c.errors) || 0) + (Number(c.tashkeel) || 0) * 0.5 + (Number(c.repetition) || 0) * 0.25;
    var score = Math.max(0, Math.min(Number(base), Number(base) - deduction));
    gradeEl.value = Number(score).toFixed(2).replace(/\.00$/, '');
    gradeEl.disabled = false;
    gradeEl.readOnly = true;
    gradeEl.classList.add('daily-auto-grade');
    try {
        wafdeenSaveDailyDraft_();
    }
    catch (_) { }
    return score;
}
function dailyRenderCounters() {
    var box = document.getElementById('daily-error-counters');
    var visible = !!(dailyCounterType || dailyTimerType);
    if (box)
        box.classList.toggle('is-visible', visible);
    var c = dailyCounterSet() || { errors: 0, tashkeel: 0, repetition: 0 };
    ['errors', 'tashkeel', 'repetition'].forEach(function (k) {
        var el = document.getElementById('daily-counter-' + k);
        if (el)
            el.textContent = String(Math.max(0, parseInt(c[k], 10) || 0));
    });
    ['new', 'old', 'recitation'].forEach(function (type) { return dailyCalculateGrade(type); });
}
function dailyIncrementCounter(kind) {
    var c = dailyCounterSet();
    if (!c || !Object.prototype.hasOwnProperty.call(c, kind))
        return false;
    c[kind] = (parseInt(c[kind], 10) || 0) + 1;
    dailyRenderCounters();
    wafdeenSaveDailyDraft_();
    dailyAnimateCounter(kind);
    return false;
}
function dailyDecrementCounter(kind) {
    var c = dailyCounterSet();
    if (!c || !Object.prototype.hasOwnProperty.call(c, kind))
        return false;
    c[kind] = Math.max(0, (parseInt(c[kind], 10) || 0) - 1);
    dailyRenderCounters();
    wafdeenSaveDailyDraft_();
    dailyAnimateCounter(kind);
    return false;
}
function dailyAnimateCounter(kind) {
    var el = document.getElementById('daily-counter-' + kind);
    if (!el)
        return;
    el.classList.remove('daily-counter-value-pop');
    void el.offsetWidth;
    el.classList.add('daily-counter-value-pop');
}
function dailyResetCounters() {
    dailyErrorCounters = {
        new: { errors: 0, tashkeel: 0, repetition: 0 },
        old: { errors: 0, tashkeel: 0, repetition: 0 },
        recitation: { errors: 0, tashkeel: 0, repetition: 0 }
    };
    dailyCounterType = '';
    var box = document.getElementById('daily-error-counters');
    if (box)
        box.classList.remove('is-visible');
}
function dailyLoadCountersFromRecord(record) {
    dailyErrorCounters = {
        new: {
            errors: parseInt(record === null || record === void 0 ? void 0 : record.newErrors, 10) || 0,
            tashkeel: parseInt(record === null || record === void 0 ? void 0 : record.newTashkeel, 10) || 0,
            repetition: parseInt(record === null || record === void 0 ? void 0 : record.newRepetition, 10) || 0
        },
        old: {
            errors: parseInt(record === null || record === void 0 ? void 0 : record.oldErrors, 10) || 0,
            tashkeel: parseInt(record === null || record === void 0 ? void 0 : record.oldTashkeel, 10) || 0,
            repetition: parseInt(record === null || record === void 0 ? void 0 : record.oldRepetition, 10) || 0
        },
        recitation: {
            errors: parseInt(record === null || record === void 0 ? void 0 : record.recitationErrors, 10) || 0,
            tashkeel: parseInt(record === null || record === void 0 ? void 0 : record.recitationTashkeel, 10) || 0,
            repetition: parseInt(record === null || record === void 0 ? void 0 : record.recitationRepetition, 10) || 0
        }
    };
}
function dailyTimerStudentKey_() {
    var student = (document.getElementById('studentNameSelect') || {}).value || '';
    var date = (document.getElementById('recordDate') || {}).value || '';
    return String(student) + '|' + String(date);
}
function dailySaveTimerDraft_() {
    try {
        var key = dailyActiveStudentKey_ || dailyTimerStudentKey_();
        if (!key) return;
        var draftSeconds = {
            new: Number(dailyTimerSeconds.new || 0),
            old: Number(dailyTimerSeconds.old || 0),
            recitation: Number(dailyTimerSeconds.recitation || 0)
        };
        if (dailyTimerRunning)
            draftSeconds[dailyTimerType] = getCurrentTimerElapsed();
        dailyTimerDrafts_[key] = {
            new: draftSeconds.new,
            old: draftSeconds.old,
            recitation: draftSeconds.recitation,
            type: dailyTimerType || 'new',
            counterType: dailyCounterType || dailyTimerType || ''
        };
        memoryStorage.setItem('dailyTimerDrafts', JSON.stringify(dailyTimerDrafts_));
    } catch (_) {}
}
function dailyLoadTimerDraft_(key) {
    try {
        if (!dailyTimerDrafts_ || !Object.keys(dailyTimerDrafts_).length)
            dailyTimerDrafts_ = JSON.parse(memoryStorage.getItem('dailyTimerDrafts') || '{}') || {};
        return dailyTimerDrafts_[key] || null;
    } catch (_) { return null; }
}
function dailyPauseForStudentSwitch_() {
    if (!dailyActiveStudentKey_) return;
    if (dailyTimerRunning) {
        var elapsed = getCurrentTimerElapsed();
        dailyTimerSeconds[dailyTimerType] = elapsed;
        dailyTimerBaseSeconds = elapsed;
        dailyTimerRunning = false;
        dailyTimerStartedAt = 0;
        clearInterval(dailyTimerInterval);
        dailyTimerInterval = null;
    }
    dailySaveTimerDraft_();
}
function showDailyStudentWorkspace() {
    var _a;
    try {
        wafdeenRestoreDailyDraft_();
    }
    catch (_) { }
    var student = (_a = document.getElementById('studentNameSelect')) === null || _a === void 0 ? void 0 : _a.value;
    var nextKey = dailyTimerStudentKey_();
    // عند الانتقال لطالب آخر: أوقف المؤقت تلقائيًا كـ«استراحة» واحفظ زمن الطالب السابق.
    if (dailyActiveStudentKey_ && nextKey !== dailyActiveStudentKey_) {
        dailyPauseForStudentSwitch_();
    }
    var ws = document.getElementById('daily-workspace');
    if (!student) {
        if (ws)
            ws.classList.remove('visible');
        return;
    }
    if (ws)
        ws.classList.add('visible');
    document.getElementById('dailyTimerStudent').textContent = student;
    var selectedStudent = studentsData.find(function (s) { return s.name === student; });
    var classInfo = document.getElementById('dailyStudentClass');
    if (classInfo)
        classInfo.textContent = (selectedStudent === null || selectedStudent === void 0 ? void 0 : selectedStudent.className) ? "\u2014 \u0627\u0644\u0635\u0641: ".concat(selectedStudent.className) : '';
    var existing = getSelectedDailyRecord();
    var draft = dailyLoadTimerDraft_(nextKey);
    var savedTimes = {
        new: Number((existing === null || existing === void 0 ? void 0 : existing.newLessonTimeSeconds) || 0),
        old: Number((existing === null || existing === void 0 ? void 0 : existing.oldRevisionTimeSeconds) || 0),
        recitation: Number((existing === null || existing === void 0 ? void 0 : existing.recitationTimeSeconds) || 0)
    };
    // استرجاع أي وقت غير محفوظ سابقًا لهذا الطالب، مع الاحتفاظ بالأعلى بين المحفوظ والمسودة.
    dailyTimerSeconds = {
        new: Math.max(savedTimes.new, Number((draft === null || draft === void 0 ? void 0 : draft.new) || 0)),
        old: Math.max(savedTimes.old, Number((draft === null || draft === void 0 ? void 0 : draft.old) || 0)),
        recitation: Math.max(savedTimes.recitation, Number((draft === null || draft === void 0 ? void 0 : draft.recitation) || 0))
    };
    dailyTimerType = (draft && ['new','old','recitation'].includes(draft.type)) ? draft.type : 'new';
    dailyCounterType = draft && draft.counterType ? draft.counterType : '';
    dailyTimerRunning = false;
    dailyTimerStartedAt = 0;
    dailyTimerBaseSeconds = dailyTimerSeconds[dailyTimerType] || 0;
    dailyResetCounters();
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
    dailyActiveStudentKey_ = nextKey;
    resetDailyExtraFieldsFromRecord(existing || {});
    dailyLoadCountersFromRecord(existing || {});
    dailyRenderCounters();
    wafdeenResetBehaviorState('daily', (existing === null || existing === void 0 ? void 0 : existing.behaviorReasons) || {});
    updateDailyTypeTimes();
    renderDailyTimer();
}
function startDailyTimer() {
    var _a;
    if (!((_a = document.getElementById('studentNameSelect')) === null || _a === void 0 ? void 0 : _a.value))
        return showMessage('app-msg', 'اختر اسم الطالب أولاً.', 'error');
    if (dailyTimerRunning)
        return;
    dailyTimerBaseSeconds = dailyTimerSeconds[dailyTimerType] || dailyTimerBaseSeconds || 0;
    dailyTimerStartedAt = Date.now();
    dailyTimerRunning = true;
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = setInterval(renderDailyTimer, 1000);
    renderDailyTimer();
}
function wafdeenKeepDailyScroll_() {
    // الحفاظ على موضع الرصد اليومي عند الحفظ أو الاستراحة، حتى لا تقفز الصفحة إلى بدايتها.
    var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var activeId = document.activeElement && document.activeElement.id ? document.activeElement.id : '';
    var restore = function () {
        try { window.scrollTo(0, y); } catch (_) {}
        if (activeId) {
            var el = document.getElementById(activeId);
            if (el && document.activeElement !== el) { try { el.focus({ preventScroll: true }); } catch (_) { try { el.focus(); } catch (__){ } } }
        }
    };
    restore();
    [0, 50, 150, 350, 700, 1200].forEach(function (ms) { setTimeout(restore, ms); });
}
function pauseDailyTimer() {
    wafdeenKeepDailyScroll_();
    if (!dailyTimerRunning)
        return;
    dailyTimerBaseSeconds += Math.floor((Date.now() - dailyTimerStartedAt) / 1000);
    dailyTimerSeconds[dailyTimerType] = dailyTimerBaseSeconds;
    dailyTimerRunning = false;
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
    dailySaveTimerDraft_();
    try { flushCloudRenderQueue_(); } catch (_) {}
            try { wafdeenFlushLocalPersist_(); } catch (_) {}
    updateDailyTypeTimes();
    renderDailyTimer();
}
function stopDailyTimer() {
    if (dailyTimerRunning)
        pauseDailyTimer();
    var seconds = dailyTimerSeconds[dailyTimerType] || 0;
    if (!seconds)
        return showMessage('app-msg', 'لم يتم احتساب أي وقت بعد.', 'error');
    updateDailyTypeTimes();
    var names = { new: 'الجديد', old: 'الماضي', recitation: 'التلاوة' };
    document.getElementById('dailyTimerStatus').textContent = "\u2705 \u062A\u0645 \u062D\u0641\u0638 \u0648\u0642\u062A ".concat(names[dailyTimerType], ": ").concat(formatTimerSeconds(seconds));
    document.getElementById('daily-score-time-summary').textContent = "\u062A\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0641\u064A \u2014 \u0627\u0644\u062C\u062F\u064A\u062F: ".concat(formatTimerSeconds(dailyTimerSeconds.new), " | \u0627\u0644\u0645\u0627\u0636\u064A: ").concat(formatTimerSeconds(dailyTimerSeconds.old), " | \u0627\u0644\u062A\u0644\u0627\u0648\u0629: ").concat(formatTimerSeconds(dailyTimerSeconds.recitation));
}
async function markAbsent() {
    var studentNameEl = document.getElementById('studentNameSelect');
    var studentName = studentNameEl ? studentNameEl.value : '';
    if (!studentName)
        return showMessage('app-msg', 'يرجى اختيار الاسم بشكل صحيح', 'error');
    var existing = hasDailyRecordForSelectedStudent_();
    if (existing) {
        updateMainDailySaveButton_();
        return showMessage('app-msg', "\u26A0\uFE0F \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 ".concat(studentName, " \u0628\u0627\u0644\u0641\u0639\u0644 \u0627\u0644\u064A\u0648\u0645. \u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0633\u062C\u064A\u0644\u0647 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649. \u0627\u0633\u062A\u062E\u062F\u0645 \u00AB\u062A\u0639\u062F\u064A\u0644\u00BB \u0623\u0648 \u00AB\u0645\u0633\u062D\u00BB \u0623\u0648\u0644\u0627\u064B."), 'error');
    }
    var confirmed = await siteConfirm('🚫 تسجيل غياب', "\u0633\u064A\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 <strong>".concat(studentName, "</strong> \u063A\u0627\u0626\u0628\u064B\u0627 \u0627\u0644\u064A\u0648\u0645:<br>\u2022 \u0635\u0641\u0631 \u0641\u064A \u062C\u0645\u064A\u0639 \u0627\u0644\u062F\u0631\u062C\u0627\u062A<br>\u2022 \u0635\u0641\u0631 \u0641\u064A \u0643\u0644 \u0623\u0648\u0642\u0627\u062A \u0627\u0644\u062A\u0633\u0645\u064A\u0639<br>\u2022 \u0625\u0644\u063A\u0627\u0621 \u0639\u062F\u062F \u0627\u0644\u0645\u0631\u0627\u062A \u0648\u0639\u062F\u062F \u0627\u0644\u0635\u0641\u062D\u0627\u062A<br>\u2022 \u0633\u064A\u0638\u0647\u0631 \u0641\u064A \u0627\u0644\u0643\u0634\u0641 \u0643\u0640 \u00AB\u063A\u0627\u0626\u0628\u00BB"), 'نعم، سجّل غياب', true);
    if (!confirmed)
        return;
    var className = document.getElementById('classSelect') ? document.getElementById('classSelect').value : '';
    var dateISO = document.getElementById('recordDate') ? document.getElementById('recordDate').value : '';
    var dayName = document.getElementById('daySelect') ? document.getElementById('daySelect').value : '';
    if (!className)
        return showMessage('app-msg', 'يرجى اختيار الصف بشكل صحيح', 'error');
    if (!teacherOwnsClass_(className))
        return showMessage('app-msg', 'لا يمكنك تسجيل غياب خارج الفصل المسند إليك.', 'error');
    if (!dateISO)
        return showMessage('app-msg', 'يرجى اختيار التاريخ بشكل صحيح', 'error');
    var now = new Date();
    var record = {
        id: dailyStableRecordId_(dailyStudentId_(studentName, className), className, dateISO),
        studentId: dailyStudentId_(studentName, className),
        teacherName: (currentTeacher && currentTeacher.username) || '',
        className: className,
        dateISO: dateISO,
        dayName: dayName,
        studentName: studentName,
        attendance: 0, behavior: 0, tajweed: 0, homework: 0, attendanceStatus: 'absent', isAbsent: true,
        newLesson: 0, oldRevision: 0, recitation: 0,
        newPagesCount: '', oldPagesCount: '', recitationPagesCount: '',
        newTopicToday: '-', newTopicRecited: '-', oldTopicToday: '-', oldTopicRecited: '-', recitationTopicToday: '-', recitationTopicRecited: '-',
        newRecitationCount: '', oldRecitationCount: '', recitationRecitationCount: '',
        newLessonTimeSeconds: 0, oldRevisionTimeSeconds: 0, recitationTimeSeconds: 0,
        newErrors: 0, newTashkeel: 0, newRepetition: 0, oldErrors: 0, oldTashkeel: 0, oldRepetition: 0,
        recitationErrors: 0, recitationTashkeel: 0, recitationRepetition: 0,
        _dailyTypeSaved: { new: true, old: true, recitation: true },
        timeRecordedAt: now.toISOString()
    };
    record.total = getDailyTotal(record);
    if (!useFirebase || !db) {
        return showMessage('app-msg', 'Supabase غير متصل — لم يتم اعتماد تسجيل الغياب.', 'error');
    }
    try {
        await firebaseWriteRecord_('dailyRecords', record.id, record, { merge: true });
    }
    catch (e) {
        console.error('Firebase absence record save error:', e);
        return showMessage('app-msg', 'تعذر حفظ تسجيل الغياب على Firebase — تحقق من الاتصال.', 'error');
    }
    var idx = dailyRecords.findIndex(function (r) { return String(r.id) === String(record.id); });
    if (idx > -1)
        dailyRecords[idx] = record;
    else
        dailyRecords.push(record);
    try {
        memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
    }
    catch (_) { }
    ['attendance', 'behavior', 'tajweed', 'oldRevision', 'newLesson', 'recitation', 'homework'].forEach(function (id) { var el = document.getElementById(id); if (el)
        el.value = 0; });
    ['newRecitationCount', 'oldRecitationCount', 'recitationRecitationCount', 'newPagesCount', 'oldPagesCount', 'recitationPagesCount'].forEach(function (id) { var el = document.getElementById(id); if (el)
        el.value = ''; });
    ['newTopicToday', 'newTopicRecited', 'oldTopicToday', 'oldTopicRecited', 'recitationTopicToday', 'recitationTopicRecited'].forEach(function (id) { var el = document.getElementById(id); if (el)
        el.value = '-'; });
    dailyTimerSeconds = { new: 0, old: 0, recitation: 0 };
    dailyTimerRunning = false;
    dailyTimerStartedAt = 0;
    dailyTimerBaseSeconds = 0;
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
    updateDailyTypeTimes();
    renderDailyTimer();
    dailyResetCounters();
    dailyRenderCounters();
    renderDailyTable();
    renderAttendanceTable();
    renderWeeklyTable();
    renderMonthlyReport();
    renderManagerView();
    renderClassStatusTable();
    if (typeof renderSheikhRegistrationView === 'function' && document.getElementById('sheikh-registration-tab') && document.getElementById('sheikh-registration-tab').classList.contains('active')) {
        renderSheikhRegistrationView();
    }
    updateMainDailySaveButton_();
    showMessage('app-msg', "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0637\u0627\u0644\u0628 ".concat(studentName, " \u063A\u0627\u0626\u0628\u064B\u0627 \u0648\u0635\u0641\u0631 \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u0643\u0627\u0645\u0644 \uD83D\uDEAB"), 'success');
}
function dailyGradeFromRecitationCount(count) {
    var n = Number(count);
    if (n === 1)
        return 10;
    if (n === 2)
        return 8;
    if (n === 3)
        return 5;
    return '';
}
function updateDailyRecitationGrade(type) {
    var map = { new: 'newRecitationCount', old: 'oldRecitationCount', recitation: 'recitationRecitationCount' };
    var gradeMap = { new: 'newLesson', old: 'oldRevision', recitation: 'recitation' };
    var countEl = document.getElementById(map[type]);
    var gradeEl = document.getElementById(gradeMap[type]);
    if (!countEl || !gradeEl)
        return;
    var maxGrade = dailyGradeFromRecitationCount(countEl.value);
    var hasCount = maxGrade !== '';
    gradeEl.disabled = !hasCount;
    gradeEl.readOnly = true;
    gradeEl.max = hasCount ? String(maxGrade) : '10';
    gradeEl.placeholder = hasCount ? 'الدرجة تلقائيًا حسب الأخطاء والتشكيل والتردد' : 'الدرجة تلقائيًا حسب الأخطاء والتشكيل والتردد';
    gradeEl.classList.add('daily-auto-grade');
    dailyCalculateGrade(type);
}
function enforceDailyRecitationGrade(type) {
    var _a;
    var map = { new: 'newRecitationCount', old: 'oldRecitationCount', recitation: 'recitationRecitationCount' };
    var gradeMap = { new: 'newLesson', old: 'oldRevision', recitation: 'recitation' };
    var countEl = document.getElementById(map[type]);
    var gradeEl = document.getElementById(gradeMap[type]);
    if (!countEl || !gradeEl)
        return;
    var maxGrade = dailyGradeFromRecitationCount(countEl.value);
    if (maxGrade === '') {
        gradeEl.disabled = true;
        return;
    }
    if (gradeEl.value === '')
        return;
    var value = Number(gradeEl.value);
    if (value > maxGrade) {
        gradeEl.value = '';
        if (typeof showMessage === 'function')
            showMessage('app-msg', "\u0623\u0639\u0644\u0649 \u062F\u0631\u062C\u0629 \u0645\u0633\u0645\u0648\u062D \u0628\u0647\u0627 \u0639\u0646\u062F ".concat(((_a = countEl.options[countEl.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) || 'عدد مرات التسميع المحدد', " \u0647\u064A ").concat(maxGrade, " \u0645\u0646 10."), 'error');
    }
    if (value < 0)
        gradeEl.value = '';
}
function resetDailyExtraFieldsFromRecord(record) {
    var fields = [
        ['newPagesCount', (record === null || record === void 0 ? void 0 : record.newPagesCount) || ''],
        ['oldPagesCount', (record === null || record === void 0 ? void 0 : record.oldPagesCount) || ''],
        ['recitationPagesCount', (record === null || record === void 0 ? void 0 : record.recitationPagesCount) || ''],
        ['newRecitationCount', (record === null || record === void 0 ? void 0 : record.newRecitationCount) || '1'],
        ['oldRecitationCount', (record === null || record === void 0 ? void 0 : record.oldRecitationCount) || '1'],
        ['recitationRecitationCount', (record === null || record === void 0 ? void 0 : record.recitationRecitationCount) || '1']
    ];
    fields.forEach(function (_a) {
        var _b = __read(_a, 2), id = _b[0], val = _b[1];
        var el = document.getElementById(id);
        if (el)
            el.value = String(val);
    });
    ['new', 'old', 'recitation'].forEach(function (type) {
        updateDailyRecitationGrade(type);
        dailyCalculateGrade(type);
    });
}
var dailySelectedGradeType = 'new';
function dailyTypeLabel_(type) {
    return type === 'new' ? 'الجديد' : type === 'old' ? 'الماضي' : 'التلاوة';
}
function dailyTypeFieldIds_(type) {
    if (type === 'new')
        return ['newLesson', 'newTopicToday', 'newPagesCount', 'newTopicRecited', 'newRecitationCount'];
    if (type === 'old')
        return ['oldRevision', 'oldTopicToday', 'oldPagesCount', 'oldTopicRecited', 'oldRecitationCount'];
    return ['recitation', 'recitationTopicToday', 'recitationPagesCount', 'recitationTopicRecited', 'recitationRecitationCount'];
}
function markDailyTypeFieldGroups_() {
    var map = { new: dailyTypeFieldIds_('new'), old: dailyTypeFieldIds_('old'), recitation: dailyTypeFieldIds_('recitation') };
    Object.entries(map).forEach(function (_a) {
        var _b = __read(_a, 2), type = _b[0], ids = _b[1];
        return ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.parentElement)
                el.parentElement.classList.add('daily-type-field', "daily-type-field-".concat(type));
        });
    });
}
function isDailyTypeSaved_(record, type) {
    if (!record)
        return false;
    if (record._dailyTypeSaved && record._dailyTypeSaved[type] === true)
        return true;
    var key = type === 'new' ? 'newLesson' : type === 'old' ? 'oldRevision' : 'recitation';
    return record[key] !== undefined && record[key] !== null && record[key] !== '';
}
function selectDailyGradeType(type) {
    if (!['new', 'old', 'recitation'].includes(type))
        type = 'new';
    // يمكن فتح أي خانة أثناء تشغيل الوقت، مع فصل زمن كل نوع عن الآخر.
    if (dailyTimerRunning && dailyTimerType !== type) {
        var elapsedCurrent = getCurrentTimerElapsed();
        dailyTimerSeconds[dailyTimerType] = elapsedCurrent;
        dailyTimerBaseSeconds = dailyTimerSeconds[type] || 0;
        dailyTimerType = type;
        dailyTimerStartedAt = Date.now();
    }
    dailySelectedGradeType = type;
    dailyTimerType = type;
    dailyCounterType = type;
    dailyTimerBaseSeconds = dailyTimerSeconds[type] || 0;
    document.querySelectorAll('.daily-grade-type-btn').forEach(function (b) { return b.classList.toggle('active', b.dataset.gradeType === type); });
    document.querySelectorAll('.daily-type-field').forEach(function (el) { return el.classList.toggle('daily-type-field-hidden', !el.classList.contains("daily-type-field-".concat(type))); });
    var labels = { new: 'الجديد', old: 'الماضي', recitation: 'التلاوة' };
    var note = document.getElementById('daily-selected-grade-note');
    var record = hasDailyRecordForSelectedStudent_();
    var saved = isDailyTypeSaved_(record, type);
    if (note)
        note.textContent = saved ? "\u062A\u0645 \u062D\u0641\u0638 ".concat(labels[type], " \u0627\u0644\u064A\u0648\u0645 \u0628\u0627\u0644\u0641\u0639\u0644. \u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0641\u0638\u0647 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u064A\u0648\u0645.") : "\u0631\u0635\u062F ".concat(labels[type], ": \u0627\u0643\u062A\u0628 \u0628\u064A\u0627\u0646\u0627\u062A ").concat(labels[type], " \u062B\u0645 \u0627\u0636\u063A\u0637 \u0632\u0631 \u0627\u0644\u062D\u0641\u0638 \u0628\u0627\u0644\u0623\u0633\u0641\u0644.");
    updateDailyTypeTimes();
    dailyRenderCounters();
    renderDailyTimer();
    updateMainDailySaveButton_();
}
function updateMainDailySaveButton_() {
    var btn = document.querySelector('#daily-tab .daily-scores-card button[onclick="addGrade()"]');
    if (!btn)
        return;
    markDailyTypeFieldGroups_();
    var record = hasDailyRecordForSelectedStudent_();
    var saved = isDailyTypeSaved_(record, dailySelectedGradeType);
    var label = dailyTypeLabel_(dailySelectedGradeType);
    btn.disabled = saved;
    btn.classList.toggle('daily-type-save-done', saved);
    btn.setAttribute('aria-disabled', saved ? 'true' : 'false');
    btn.textContent = saved ? "\u2705 \u062A\u0645 \u062D\u0641\u0638 ".concat(label) : "\uD83D\uDCBE \u062D\u0641\u0638 ".concat(label, " \u0648\u0627\u0644\u0648\u0642\u062A");
    btn.title = saved ? "\u062A\u0645 \u062D\u0641\u0638 ".concat(label, " \u0627\u0644\u064A\u0648\u0645 \u2014 \u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0641\u0638\u0647 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.") : "\u062D\u0641\u0638 ".concat(label, " \u0645\u0639 \u0648\u0642\u062A \u0627\u0644\u062A\u0633\u0645\u064A\u0639");
    var note = document.getElementById('daily-selected-grade-note');
    if (note)
        note.textContent = saved ? "\u062A\u0645 \u062D\u0641\u0638 ".concat(label, " \u0627\u0644\u064A\u0648\u0645 \u0628\u0627\u0644\u0641\u0639\u0644. \u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0641\u0638\u0647 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u064A\u0648\u0645.") : "\u0631\u0635\u062F ".concat(label, ": \u0627\u0643\u062A\u0628 \u0628\u064A\u0627\u0646\u0627\u062A ").concat(label, " \u062B\u0645 \u0627\u0636\u063A\u0637 \u0632\u0631 \u0627\u0644\u062D\u0641\u0638 \u0628\u0627\u0644\u0623\u0633\u0641\u0644.");
}
function hasDailyRecordForSelectedStudent_() {
    var _a, _b, _c;
    var className = ((_a = document.getElementById('classSelect')) === null || _a === void 0 ? void 0 : _a.value) || '';
    var dateISO = ((_b = document.getElementById('recordDate')) === null || _b === void 0 ? void 0 : _b.value) || '';
    var studentName = String(((_c = document.getElementById('studentNameSelect')) === null || _c === void 0 ? void 0 : _c.value) || '').trim();
    if (!className || !dateISO || !studentName)
        return null;
    var sid = dailyStudentId_(studentName, className);
    var stableId = sid ? dailyStableRecordId_(sid, className, dateISO) : '';
    return (dailyRecords || []).find(function (r) { return !r._deleted && !r._legacyMigrated && ((stableId && String(r.id) === stableId) || (sid && String(r.studentId || '') === String(sid) && String(r.className || '') === String(className) && String(r.dateISO || '').slice(0, 10) === String(dateISO).slice(0, 10)) || (!sid && String(r.className || '') === String(className) && String(r.dateISO || '').slice(0, 10) === String(dateISO).slice(0, 10) && String(r.studentName || '').trim() === studentName)); }) || null;
}
function recordAbsenceTime() {
    var _a, _b, _c, _d;
    var studentId = ((_a = document.getElementById('studentSelect')) === null || _a === void 0 ? void 0 : _a.value) || ((_b = document.getElementById('wafdeenStudentSelect')) === null || _b === void 0 ? void 0 : _b.value);
    var date = ((_c = document.getElementById('gradeDate')) === null || _c === void 0 ? void 0 : _c.value) || ((_d = document.getElementById('wafdeenDate')) === null || _d === void 0 ? void 0 : _d.value) || new Date().toISOString().slice(0, 10);
    if (!studentId) {
        showMessage('app-msg', 'من فضلك اختر الطالب أولاً!', 'error');
        return;
    }
    var now = new Date();
    var timeText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    var zeroTime = 0;
    // Record a dedicated absence event with time = 0, without asking for grades.
    var rec = {
        id: 'absence-' + studentId + '-' + date + '-' + Date.now(),
        studentId: studentId,
        date: date,
        attendanceStatus: 'absent',
        isAbsent: true,
        absence: true,
        absenceTime: zeroTime,
        time: zeroTime,
        recordedAt: now.toISOString(),
        recordedTimeText: timeText,
    };
    if (Array.isArray(window.dailyRecords)) {
        window.dailyRecords.push(rec);
        try {
            memoryStorage.setItem('dailyRecords', JSON.stringify(window.dailyRecords));
        }
        catch (e) { }
    }
    // Also update any available Wafdeen collection.
    if (Array.isArray(window.wafdeenDailyRecords)) {
        window.wafdeenDailyRecords.push(rec);
        try {
            memoryStorage.setItem('wafdeenDailyRecords', JSON.stringify(window.wafdeenDailyRecords));
        }
        catch (e) { }
    }
    try {
        if (typeof window.syncCollection_ === 'function') {
            window.syncCollection_('dailyRecords', window.dailyRecords || []);
        }
    }
    catch (e) { }
    try {
        if (typeof window.renderDailyRecords === 'function')
            window.renderDailyRecords();
        if (typeof window.renderWafdeenDailyRecords === 'function')
            window.renderWafdeenDailyRecords();
    }
    catch (e) { }
    showMessage('app-msg', "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u063A\u064A\u0627\u0628 \u0627\u0644\u0637\u0627\u0644\u0628 \u2014 \u0627\u0644\u0648\u0642\u062A: ".concat(zeroTime), 'success');
}
function validateDailyRequiredFields_(type){
    var labels={
        attendance:'الحضور', behavior:'السلوك', homework:'الواجب', tajweed:'التجويد',
        newLesson:'درجة الجديد', newTopicToday:'مقرر الجديد اليوم', newPagesCount:'عدد صفحات الجديد',
        newTopicRecited:'مقرر الجديد الذي تم تسميعه', newRecitationCount:'عدد مرات تسميع الجديد',
        oldRevision:'درجة الماضي', oldTopicToday:'مقرر الماضي اليوم', oldPagesCount:'عدد صفحات الماضي',
        oldTopicRecited:'مقرر الماضي الذي تم تسميعه', oldRecitationCount:'عدد مرات تسميع الماضي',
        recitation:'درجة التلاوة', recitationTopicToday:'مقرر التلاوة اليوم', recitationPagesCount:'عدد صفحات/أجزاء التلاوة',
        recitationTopicRecited:'مقرر التلاوة الذي تم تسميعه', recitationRecitationCount:'عدد مرات تسميع التلاوة'
    };
    var ids=['attendance','behavior','homework','tajweed'].concat(dailyTypeFieldIds_(type));
    var missing=[];
    document.querySelectorAll('#daily-workspace .field-missing').forEach(function(el){el.classList.remove('field-missing');});
    document.querySelectorAll('#daily-workspace .daily-missing-group').forEach(function(el){el.classList.remove('daily-missing-group');});
    ids.forEach(function(id){
        var el=document.getElementById(id);
        if(!el || String(el.value==null?'':el.value).trim()!=='') return;
        el.classList.add('field-missing');
        if(el.parentElement) el.parentElement.classList.add('daily-missing-group');
        missing.push(labels[id]||id);
    });
    var timer=document.getElementById('dailySelectedTimerBox');
    if(timer) timer.classList.remove('daily-field-missing');
    if(Number(dailyTimerSeconds[type]||0)<=0){
        if(timer) timer.classList.add('daily-field-missing');
        missing.unshift('وقت التسميع (التايمر)');
    }
    if(missing.length){
        var first=document.querySelector('#daily-workspace .field-missing, #daily-workspace .daily-field-missing');
        if(first) setTimeout(function(){try{first.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}},0);
        var safeItems=missing.map(function(item){return String(item).replace(/[&<>"']/g,function(ch){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]);});});
        showSiteModal('⚠️ خانات مطلوبة قبل الحفظ',
            '<div style="color:var(--danger-color);font-weight:800;margin-bottom:10px;">يرجى كتابة البيانات التالية:</div>'+
            '<ul class="daily-missing-list" style="margin:0;padding:0 24px 0 0;text-align:right;line-height:2.1;">'+
            safeItems.map(function(item){return '<li>'+item+'</li>';}).join('')+'</ul>',
            '<button type="button" class="action-btn modal-success" onclick="closeSiteModal()">حسنًا</button>');
        return false;
    }
    return true;
}
function addGrade() {
    wafdeenKeepDailyScroll_();
    return __awaiter(this, arguments, void 0, function (forceAbsent) {
        var className, dateISO, dayName, studentName, type, label, record, timerBox, val, num, countId, gradeId, topicTodayId, pagesId, topicRecitedId, count, grade, limit, now, existing, seconds, timeKey, ec, prefix, commonPatch, typeFields, e_27, idx;
        var _a;
        var _b, _c, _d, _e;
        if (forceAbsent === void 0) { forceAbsent = false; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    className = ((_b = document.getElementById('classSelect')) === null || _b === void 0 ? void 0 : _b.value) || '';
                    dateISO = ((_c = document.getElementById('recordDate')) === null || _c === void 0 ? void 0 : _c.value) || '';
                    dayName = ((_d = document.getElementById('daySelect')) === null || _d === void 0 ? void 0 : _d.value) || '';
                    studentName = (((_e = document.getElementById('studentNameSelect')) === null || _e === void 0 ? void 0 : _e.value) || '').trim();
                    if (!studentName)
                        return [2 /*return*/, showMessage('app-msg', 'يرجى اختيار الاسم بشكل صحيح', 'error')];
                    if (!dateISO)
                        return [2 /*return*/, showMessage('app-msg', 'يرجى اختيار التاريخ بشكل صحيح', 'error')];
                    if (!teacherOwnsClass_(className))
                        return [2 /*return*/, showMessage('app-msg', 'لا يمكنك تسجيل رصد خارج الفصل المسند إليك.', 'error')];
                    type = dailySelectedGradeType || dailyTimerType || 'new';
                    label = dailyTypeLabel_(type);
                    record = hasDailyRecordForSelectedStudent_();
                    if (isDailyTypeSaved_(record, type)) {
                        updateMainDailySaveButton_();
                        return [2 /*return*/, showMessage('app-msg', "\u26A0\uFE0F \u062A\u0645 \u062D\u0641\u0638 ".concat(label, " \u0644\u0644\u0637\u0627\u0644\u0628 ").concat(studentName, " \u0628\u0627\u0644\u0641\u0639\u0644 \u0627\u0644\u064A\u0648\u0645. \u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0641\u0638\u0647 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649."), 'error')];
                    }
                    if (dailyTimerRunning)
                        pauseDailyTimer();
                    updateDailyRecitationGrade(type);
                    dailyCalculateGrade(type);
                    if (!validateDailyRequiredFields_(type))
                        return [2 /*return*/];
                    timerBox = document.getElementById('dailySelectedTimerBox');
                    timerBox === null || timerBox === void 0 ? void 0 : timerBox.classList.remove('daily-field-missing');
                    if (Number(dailyTimerSeconds[type] || 0) <= 0) {
                        timerBox === null || timerBox === void 0 ? void 0 : timerBox.classList.add('daily-field-missing');
                        return [2 /*return*/, showMessage('app-msg', "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0641\u0638 ".concat(label, " \u0642\u0628\u0644 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u00AB\u0628\u062F\u0621\u00BB \u0648\u0627\u062D\u062A\u0633\u0627\u0628 \u0648\u0642\u062A \u0641\u0639\u0644\u064A."), 'error')];
                    }
                    val = function (id) { var _a, _b; return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ''; };
                    num = function (id) { var n = Number(val(id)); return Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 0; };
                    countId = type === 'new' ? 'newRecitationCount' : type === 'old' ? 'oldRecitationCount' : 'recitationRecitationCount';
                    gradeId = type === 'new' ? 'newLesson' : type === 'old' ? 'oldRevision' : 'recitation';
                    topicTodayId = type === 'new' ? 'newTopicToday' : type === 'old' ? 'oldTopicToday' : 'recitationTopicToday';
                    pagesId = type === 'new' ? 'newPagesCount' : type === 'old' ? 'oldPagesCount' : 'recitationPagesCount';
                    topicRecitedId = type === 'new' ? 'newTopicRecited' : type === 'old' ? 'oldTopicRecited' : 'recitationTopicRecited';
                    count = val(countId);
                    if (!count)
                        return [2 /*return*/, showMessage('app-msg', "\u0639\u062F\u062F \u0645\u0631\u0627\u062A \u062A\u0633\u0645\u064A\u0639 ".concat(label, " \u0645\u0636\u0628\u0648\u0637 \u0627\u0641\u062A\u0631\u0627\u0636\u064A\u064B\u0627 \u0639\u0644\u0649 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629."), 'error')];
                    updateDailyRecitationGrade(type);
                    dailyCalculateGrade(type);
                    grade = num(gradeId);
                    if (grade < 0 || grade > 10)
                        return [2 /*return*/, showMessage('app-msg', "\u062F\u0631\u062C\u0629 ".concat(label, " \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0645\u0646 0 \u0625\u0644\u0649 10."), 'error')];
                    limit = dailyGradeFromRecitationCount(count);
                    if (limit !== '' && grade > Number(limit))
                        return [2 /*return*/, showMessage('app-msg', "\u062F\u0631\u062C\u0629 ".concat(label, " \u0644\u0627 \u064A\u0645\u0643\u0646 \u0623\u0646 \u062A\u062A\u062C\u0627\u0648\u0632 ").concat(limit, " \u0645\u0646 10 \u0639\u0646\u062F ").concat(count === '1' ? 'التسميع مرة واحدة' : count === '2' ? 'التسميع مرتين' : 'التسميع ثلاث مرات', "."), 'error')];
                    if (!val(topicTodayId).trim() || !val(topicRecitedId).trim())
                        return [2 /*return*/, showMessage('app-msg', "\u0623\u0643\u0645\u0644 \u0645\u0642\u0631\u0631 ".concat(label, " \u0627\u0644\u064A\u0648\u0645 \u0648\u0645\u0642\u0631\u0631 ").concat(label, " \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647."), 'error')];
                    if (!val(pagesId).trim())
                        return [2 /*return*/, showMessage('app-msg', "\u0627\u0643\u062A\u0628 \u0639\u062F\u062F \u0627\u0644\u0635\u0641\u062D\u0627\u062A \u0641\u064A ".concat(label, "."), 'error')];
                    now = new Date();
                    existing = record || {};
                    if (!record) {
                        record = {
                            id: dailyStableRecordId_(dailyStudentId_(studentName, className), className, dateISO),
                            studentId: dailyStudentId_(studentName, className),
                            teacherName: (currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.username) || '',
                            className: className,
                            dateISO: dateISO,
                            dayName: dayName,
                            studentName: studentName,
                            attendance: 0, behavior: 10, tajweed: 0, homework: 0, attendanceStatus: 'present', isAbsent: false,
                            newLesson: '', oldRevision: '', recitation: '', newPagesCount: '', oldPagesCount: '', recitationPagesCount: '',
                            newTopicToday: '', newTopicRecited: '', oldTopicToday: '', oldTopicRecited: '', recitationTopicToday: '', recitationTopicRecited: '',
                            newRecitationCount: '1', oldRecitationCount: '1', recitationRecitationCount: '1',
                            newLessonTimeSeconds: 0, oldRevisionTimeSeconds: 0, recitationTimeSeconds: 0,
                            newErrors: 0, newTashkeel: 0, newRepetition: 0, oldErrors: 0, oldTashkeel: 0, oldRepetition: 0,
                            recitationErrors: 0, recitationTashkeel: 0, recitationRepetition: 0,
                            _dailyTypeSaved: {}, timeRecordedAt: now.toISOString()
                        };
                    }
                    // حفظ الحقول العامة إن كانت مُدخلة، دون إجبار المعلم على حفظها مع كل نوع.
                    ['attendance', 'behavior', 'tajweed', 'homework'].forEach(function (id) { var v = val(id); if (v !== '')
                        record[id] = num(id); });
                    record.teacherName = (currentTeacher === null || currentTeacher === void 0 ? void 0 : currentTeacher.username) || record.teacherName || '';
                    record.className = className;
                    record.dateISO = dateISO;
                    record.dayName = dayName;
                    record.studentName = studentName;
                    record.behaviorReasons = __assign({}, (wafdeenBehaviorState.daily || {}));
                    record.behaviorReasonsText = wafdeenBehaviorSummaryText('daily');
                    record.attendanceStatus = Number(record.attendance) === 0 ? 'present' : 'present';
                    record.isAbsent = false;
                    record[gradeId] = grade;
                    record[topicTodayId] = val(topicTodayId).trim();
                    record[pagesId] = val(pagesId).trim();
                    record[topicRecitedId] = val(topicRecitedId).trim();
                    record[countId] = Number(count);
                    seconds = Number(dailyTimerSeconds[type] || 0);
                    timeKey = type === 'new' ? 'newLessonTimeSeconds' : type === 'old' ? 'oldRevisionTimeSeconds' : 'recitationTimeSeconds';
                    record[timeKey] = seconds;
                    ec = dailyErrorCounters[type] || { errors: 0, tashkeel: 0, repetition: 0 };
                    prefix = type === 'new' ? 'new' : type === 'old' ? 'old' : 'recitation';
                    record["".concat(prefix, "Errors")] = Number(ec.errors || 0);
                    record["".concat(prefix, "Tashkeel")] = Number(ec.tashkeel || 0);
                    record["".concat(prefix, "Repetition")] = Number(ec.repetition || 0);
                    record._dailyTypeSaved = __assign(__assign({}, (record._dailyTypeSaved || {})), (_a = {}, _a[type] = true, _a));
                    record.timeRecordedAt = now.toISOString();
                    record.total = getDailyTotal(record);
                    commonPatch = { id: String(record.id), recordId: String(record.id), studentId: String(record.studentId || dailyStudentId_(record.studentName, record.className)), studentName: record.studentName, className: record.className, dateISO: record.dateISO, dayName: record.dayName, teacherName: record.teacherName, attendance: record.attendance, behavior: record.behavior, behaviorReasons: record.behaviorReasons, behaviorReasonsText: record.behaviorReasonsText, tajweed: record.tajweed, homework: record.homework, attendanceStatus: record.attendanceStatus, isAbsent: record.isAbsent, total: record.total, updatedAt: now.toISOString() };
                    typeFields = {
                        new: { newLesson: record.newLesson, newPagesCount: record.newPagesCount, newTopicToday: record.newTopicToday, newTopicRecited: record.newTopicRecited, newRecitationCount: record.newRecitationCount, newLessonTimeSeconds: record.newLessonTimeSeconds, newErrors: record.newErrors, newTashkeel: record.newTashkeel, newRepetition: record.newRepetition, _dailyTypeSaved: { new: true } },
                        old: { oldRevision: record.oldRevision, oldPagesCount: record.oldPagesCount, oldTopicToday: record.oldTopicToday, oldTopicRecited: record.oldTopicRecited, oldRecitationCount: record.oldRecitationCount, oldRevisionTimeSeconds: record.oldRevisionTimeSeconds, oldErrors: record.oldErrors, oldTashkeel: record.oldTashkeel, oldRepetition: record.oldRepetition, _dailyTypeSaved: { old: true } },
                        recitation: { recitation: record.recitation, recitationPagesCount: record.recitationPagesCount, recitationTopicToday: record.recitationTopicToday, recitationTopicRecited: record.recitationTopicRecited, recitationRecitationCount: record.recitationRecitationCount, recitationTimeSeconds: record.recitationTimeSeconds, recitationErrors: record.recitationErrors, recitationTashkeel: record.recitationTashkeel, recitationRepetition: record.recitationRepetition, _dailyTypeSaved: { recitation: true } }
                    };
                    if (!useFirebase || !db)
                        return [2 /*return*/, showMessage('app-msg', 'Supabase غير متصل — لم يتم اعتماد الرصد.', 'error')];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebaseWriteRecord_('dailyRecords', record.id, __assign(__assign({}, commonPatch), typeFields[type]), { merge: true })];
                case 2:
                    _f.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_27 = _f.sent();
                    console.error('Firebase daily record save error:', e_27);
                    return [2 /*return*/, showMessage('app-msg', 'تعذر حفظ الرصد على Firebase — لم يتم اعتماد الحفظ. تحقق من الاتصال.', 'error')];
                case 4:
                    idx = dailyRecords.findIndex(function (r) { return String(r.id) === String(record.id); });
                    if (idx > -1)
                        dailyRecords[idx] = __assign(__assign({}, dailyRecords[idx]), record);
                    else
                        dailyRecords.push(record);
                    try {
                        memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
                    }
                    catch (_) { }
                    dailyTimerSeconds[type] = seconds;
                    dailyTimerBaseSeconds = seconds;
                    updateDailyTypeTimes();
                    renderDailyTimer();
                    dailyErrorCounters[type] = { errors: 0, tashkeel: 0, repetition: 0 };
                    dailyRenderCounters();
                    renderDailyTable();
                    renderAttendanceTable();
                    renderWeeklyTable();
                    renderMonthlyReport();
                    renderManagerView();
                    renderClassStatusTable();
                    updateMainDailySaveButton_();
                    showMessage('app-msg', "\u062A\u0645 \u062D\u0641\u0638 ".concat(label, " \u0648\u0648\u0642\u062A \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0628\u0646\u062C\u0627\u062D \u0644\u0644\u0637\u0627\u0644\u0628 ").concat(studentName, " \u2705 (").concat(formatTimerSeconds(seconds), ")"), 'success');
                    return [2 /*return*/];
            }
        });
    });
}
/* ================= أدوات واجهة الموقع الداخلية ================= */
function closeSiteModal() {
    var modal = document.getElementById('siteModal');
    if (!modal)
        return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('siteModalBody').innerHTML = '';
    document.getElementById('siteModalActions').innerHTML = '';
    document.body.classList.remove('site-modal-open');
}
function showSiteModal(title, bodyHtml, actionsHtml) {
    if (actionsHtml === void 0) { actionsHtml = ''; }
    document.getElementById('siteModalTitle').textContent = title;
    document.getElementById('siteModalBody').innerHTML = bodyHtml;
    document.getElementById('siteModalActions').innerHTML = actionsHtml;
    var modal = document.getElementById('siteModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('site-modal-open');
    var firstAction = document.querySelector('#siteModalActions button');
    if(firstAction) setTimeout(function(){try{firstAction.focus({preventScroll:true});}catch(e){try{firstAction.focus();}catch(_){}}},50);
}
function siteConfirm(title, message, confirmText, danger) {
    if (confirmText === void 0) { confirmText = 'تأكيد'; }
    if (danger === void 0) { danger = false; }
    return new Promise(function (resolve) {
        showSiteModal(title, "<div>".concat(message, "</div>"), "<button type=\"button\" class=\"action-btn ".concat(danger ? 'modal-danger' : 'modal-success', "\" id=\"siteConfirmBtn\">").concat(confirmText, "</button>\n       <button type=\"button\" class=\"action-btn modal-cancel\" id=\"siteCancelBtn\">\u0625\u0644\u063A\u0627\u0621</button>"));
        document.getElementById('siteConfirmBtn').onclick = function () {
            resolve(true);
            setTimeout(closeSiteModal, 0);
        };
        document.getElementById('siteCancelBtn').onclick = function () {
            closeSiteModal();
            resolve(false);
        };
    });
}
function showSiteError(message) {
    showSiteModal('تنبيه', "<div style=\"color:var(--danger-color);font-weight:700;\">".concat(message, "</div>"), "<button type=\"button\" class=\"action-btn modal-success\" onclick=\"closeSiteModal()\">\u062D\u0633\u0646\u0627\u064B</button>");
}
function openStudentEditModal(student) {
    return new Promise(function (resolve) {
        showSiteModal('✏️ تعديل بيانات الطالب', "<div class=\"modal-grid\">\n        <div class=\"form-group full\">\n          <label>\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628/\u0627\u0644\u0637\u0627\u0644\u0628\u0629:</label>\n          <input id=\"modalStudentName\" value=\"".concat(String(student.name || '').replace(/"/g, '&quot;'), "\">\n        </div>\n        <div class=\"form-group full\">\n          <label>\u0627\u0644\u0635\u0641 \u0627\u0644\u062F\u0631\u0627\u0633\u064A:</label>\n          <select id=\"modalStudentClass\">\n            ").concat(ALL_CLASSES.map(function (c) { return "<option value=\"".concat(c, "\" ").concat(c === student.className ? 'selected' : '', ">").concat(c, "</option>"); }).join(''), "\n          </select>\n        </div>\n      </div>"), "<button type=\"button\" class=\"action-btn modal-success\" id=\"saveStudentEditBtn\">\uD83D\uDCBE \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644</button>\n       <button type=\"button\" class=\"action-btn modal-cancel\" id=\"cancelStudentEditBtn\">\u0625\u0644\u063A\u0627\u0621</button>");
        document.getElementById('saveStudentEditBtn').onclick = function () {
            var name = document.getElementById('modalStudentName').value.trim();
            var className = document.getElementById('modalStudentClass').value;
            if (!name || !className)
                return showSiteError('يرجى إدخال اسم الطالب واختيار الصف.');
            closeSiteModal();
            resolve({ name: name, className: className });
        };
        document.getElementById('cancelStudentEditBtn').onclick = function () {
            closeSiteModal();
            resolve(null);
        };
    });
}
function openTeacherEditModal(teacher) {
    return new Promise(function (resolve) {
        showSiteModal('✏️ تعديل بيانات المعلم / المعلمة', "<div class=\"modal-grid\">\n        <div class=\"form-group\">\n          <label>\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645:</label>\n          <input id=\"modalTeacherUsername\" value=\"".concat(String(teacher.username || '').replace(/"/g, '&quot;'), "\">\n        </div>\n        <div class=\"form-group\">\n          <label>\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631:</label>\n          <input id=\"modalTeacherPassword\" value=\"").concat(String(teacher.password || '').replace(/"/g, '&quot;'), "\">\n        </div>\n        <div class=\"form-group\">\n          <label>\u0627\u0644\u0635\u0641 \u0627\u0644\u0645\u0633\u0646\u062F:</label>\n          <select id=\"modalTeacherClass\">\n            <option value=\"\u0627\u0644\u0643\u0644\">\u0645\u062F\u064A\u0631 (\u062C\u0645\u064A\u0639 \u0627\u0644\u0635\u0641\u0648\u0641)</option>\n            ").concat(ALL_CLASSES.map(function (c) { return "<option value=\"".concat(c, "\" ").concat(c === teacher.assignedClass ? 'selected' : '', ">").concat(c, "</option>"); }).join(''), "\n          </select>\n        </div>\n        <div class=\"form-group\" style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;\">\n          <label style=\"margin:0;display:flex;align-items:center;gap:8px;cursor:pointer;\">\n            <input id=\"modalTeacherWafdeen\" type=\"checkbox\" style=\"width:20px;height:20px;\" ").concat(teacher.canWafdeen ? 'checked' : '', ">\n            السماح للشيخ بفصل الوافدين\n          </label>\n        </div>\n        <div class=\"form-group\">\n          <label>\u0627\u0644\u062F\u0648\u0631 / \u0627\u0644\u0645\u0631\u0643\u0632:</label>\n          <select id=\"modalTeacherCenter\">\n            <option value=\"\u0631\u0626\u064A\u0633\u064A\" ").concat(teacher.center === 'رئيسي' ? 'selected' : '', ">\u0645\u0639\u0644\u0645 \u0631\u0626\u064A\u0633\u064A</option>\n            <option value=\"\u0645\u0633\u0627\u0639\u062F\" ").concat(teacher.center === 'مساعد' ? 'selected' : '', ">\u0645\u0639\u0644\u0645 \u0645\u0633\u0627\u0639\u062F</option>\n            <option value=\"\u0627\u0644\u0643\u0644\" ").concat(teacher.center === 'الكل' ? 'selected' : '', ">\u0645\u062F\u064A\u0631 \u0646\u0638\u0627\u0645</option>\n          </select>\n        </div>\n      </div>"), "<button type=\"button\" class=\"action-btn modal-success\" id=\"saveTeacherEditBtn\">\uD83D\uDCBE \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644</button>\n       <button type=\"button\" class=\"action-btn modal-cancel\" id=\"cancelTeacherEditBtn\">\u0625\u0644\u063A\u0627\u0621</button>");
        document.getElementById('saveTeacherEditBtn').onclick = function () {
            var username = document.getElementById('modalTeacherUsername').value.trim();
            var password = document.getElementById('modalTeacherPassword').value.trim();
            var assignedClass = document.getElementById('modalTeacherClass').value;
            var center = document.getElementById('modalTeacherCenter').value;
            var canWafdeen = !!document.getElementById('modalTeacherWafdeen') && document.getElementById('modalTeacherWafdeen').checked;
            if (!username || !password)
                return showSiteError('يرجى ملء اسم المستخدم وكلمة المرور.');
            closeSiteModal();
            resolve({ username: username, password: password, assignedClass: assignedClass, center: center, canWafdeen: canWafdeen });
        };
        document.getElementById('cancelTeacherEditBtn').onclick = function () {
            closeSiteModal();
            resolve(null);
        };
    });
}
function canManageDailyRecord_(record) {
    if (!currentTeacher || !record) return false;
    var username = String(currentTeacher.username || '').trim();
    var assigned = String(currentTeacher.assignedClass || '').trim();
    var recordClass = String(record.className || '').trim();
    return username === 'admin' || assigned === 'الكل' || (!!recordClass && teacherOwnsClass_(recordClass));
}
function deleteRecord(id) {
    return __awaiter(this, void 0, void 0, function () {
        var record, allowed, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    record = dailyRecords.find(function (r) { return r.id.toString() === id.toString(); });
                    if (!record)
                        return [2 /*return*/];
                    allowed = canManageDailyRecord_(record);
                    if (!allowed)
                        return [2 /*return*/, showMessage('app-msg', 'ليس لديك صلاحية حذف هذا السجل', 'error')];
                    return [4 /*yield*/, siteConfirm('🗑️ حذف سجل الدرجات', "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u062F\u0631\u062C\u0627\u062A <strong>".concat(record.studentName, "</strong> \u0644\u064A\u0648\u0645 <strong>").concat(record.dateISO, "</strong>.<br>\u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646\u0647."), 'حذف السجل', true)];
                case 1:
                    ok = _a.sent();
                    if (!ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, deleteFirebaseRecord('dailyRecords', id)];
                case 2:
                    _a.sent();
                    renderDailyTable();
                    renderAttendanceTable();
                    renderWeeklyTable();
                    renderMonthlyReport();
                    renderManagerView();
                    renderClassStatusTable();
                    return [3 /*break*/, 4];
                case 3:
                    dailyRecords = dailyRecords.filter(function (r) { return r.id.toString() !== id.toString(); });
                    memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
                    renderDailyTable();
                    renderAttendanceTable();
                    renderWeeklyTable();
                    renderMonthlyReport();
                    renderManagerView();
                    renderClassStatusTable();
                    if (document.getElementById('student-analysis-section') && !document.getElementById('student-analysis-section').classList.contains('hidden')) {
                        populateAnalysisWeeks();
                        renderStudentDataAnalysis();
                    }
                    _a.label = 4;
                case 4:
                    showMessage('app-msg', 'تم حذف السجل بنجاح', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function dailyMissingCell(value, label) {
    if (label === void 0) { label = 'لم تُسجل'; }
    var missing = value === null || value === undefined || String(value).trim() === '';
    return missing ? "<span class=\"missing-cell\" title=\"".concat(label, "\">").concat(label, "</span>") : String(value);
}
function dailyMissingTimeCell(seconds) {
    return Number(seconds || 0) > 0 ? "<span class=\"recorded-time\">".concat(formatTimerSeconds(seconds), "</span>") : '<span class="missing-cell" title="الوقت لم يُسجل">الوقت لم يُسجل</span>';
}
function wafdeenIsMissingValue_(value) {
    return value === null || value === undefined || String(value).trim() === '';
}
function wafdeenMarkMissingField_(id, missing) {
    var el = document.getElementById(id);
    var group = el === null || el === void 0 ? void 0 : el.closest('.form-group');
    if (el)
        el.classList.toggle('field-missing', !!missing);
    if (group)
        group.classList.toggle('field-missing-group', !!missing);
}
function wafdeenClearMissingMarks_() {
    document.querySelectorAll('#wafdeen-daily-scores-panel .field-missing,#wafdeen-daily-scores-panel .field-missing-group').forEach(function (el) { return el.classList.remove('field-missing', 'field-missing-group'); });
    var box = document.getElementById('wafdeen-missing-fields');
    var list = document.getElementById('wafdeen-missing-fields-list');
    if (list)
        list.textContent = 'أكمل البيانات المطلوبة قبل الحفظ.';
    if (box)
        box.classList.add('hidden');
}
function wafdeenShowMissingFields_(items) {
    var box = document.getElementById('wafdeen-missing-fields');
    var list = document.getElementById('wafdeen-missing-fields-list');
    if (!box || !list)
        return;
    if (items && items.length) {
        list.innerHTML = items.map(function (x) { return "<span style=\"display:inline-block;margin:2px 4px;padding:2px 8px;border-radius:8px;background:#ffd9d9;color:#b71c1c\">".concat(String(x).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); }), "</span>"); }).join(' ');
        box.classList.remove('hidden');
    }
    else
        box.classList.add('hidden');
}
function wafdeenValidateDailyRequiredFields_() {
    var _a, _b;
    wafdeenClearMissingMarks_();
    var selectedClass = (((_a = document.getElementById('classSelect')) === null || _a === void 0 ? void 0 : _a.value) || '');
    var fifth = isFifthClass(selectedClass);
    var wafdeen = String(selectedClass).trim() === 'الوافدين';
    var attendance = Number((_b = document.getElementById('attendance')) === null || _b === void 0 ? void 0 : _b.value);
    var isAbsent = attendance === 0;
    var required = ['attendance', 'behavior', 'tajweed', 'homework', 'recitationTopicToday', 'recitationTopicRecited'];
    // في حالة الغياب: الصفر ومقررات الغياب يكفيان، ولا نطلب صفحات/مرات/وقت تسميع.
    if (!isAbsent) {
        required.push('recitationPagesCount');
        if (!wafdeen)
            required.push('recitationRecitationCount');
        if (!fifth)
            required.push('newLesson', 'newTopicToday', 'newPagesCount', 'newTopicRecited', 'oldRevision', 'oldTopicToday', 'oldPagesCount', 'oldTopicRecited');
        if (!wafdeen && !fifth)
            required.push('newRecitationCount', 'oldRecitationCount');
    }
    var missing = required.filter(function (id) { var el = document.getElementById(id); return !el || wafdeenIsMissingValue_(el.value); });
    // الوقت جزء من الرصد، ويظهر باللون الأحمر إذا لم يسجل. لا يلزم للغائب.
    if (!isAbsent) {
        if (!fifth && Number(dailyTimerSeconds.new || 0) <= 0)
            missing.push('__newTime');
        if (!fifth && Number(dailyTimerSeconds.old || 0) <= 0)
            missing.push('__oldTime');
        if (Number(dailyTimerSeconds.recitation || 0) <= 0)
            missing.push('__recitationTime');
    }
    var timeMap = { __newTime: 'newLessonTimeLabel', __oldTime: 'oldRevisionTimeLabel', __recitationTime: 'recitationTimeLabel' };
    missing.forEach(function (id) { if (id.startsWith('__'))
        wafdeenMarkMissingField_(timeMap[id], true);
    else
        wafdeenMarkMissingField_(id, true); });
    return missing;
}
function wafdeenResetDailyEntryForm_() {
    ['attendance', 'tajweed', 'homework', 'newTopicToday', 'newTopicRecited', 'oldTopicToday', 'oldTopicRecited', 'recitationTopicToday', 'recitationTopicRecited', 'newPagesCount', 'oldPagesCount', 'recitationPagesCount'].forEach(function (id) { var el = document.getElementById(id); if (el)
        el.value = ''; });
    ['newRecitationCount', 'oldRecitationCount', 'recitationRecitationCount'].forEach(function (id) { var el = document.getElementById(id); if (el)
        el.value = '1'; });
    ['newLesson', 'oldRevision', 'recitation'].forEach(function (id) { var el = document.getElementById(id); if (el) {
        el.value = '';
        el.disabled = true;
        el.readOnly = true;
        el.classList.add('daily-auto-grade');
    } });
    dailyTimerSeconds = { new: 0, old: 0, recitation: 0 };
    dailyTimerType = 'new';
    dailyCounterType = '';
    dailyTimerRunning = false;
    dailyTimerStartedAt = 0;
    dailyTimerBaseSeconds = 0;
    clearInterval(dailyTimerInterval);
    dailyTimerInterval = null;
    dailyResetCounters();
    wafdeenResetBehaviorState('daily', {});
    updateDailyTypeTimes();
    renderDailyTimer();
    dailyRenderCounters();
    var summary = document.getElementById('daily-score-time-summary');
    if (summary)
        summary.textContent = 'تم الحفظ بنجاح. الخانات جاهزة لرصد طالب آخر أو رصد جديد.';
    try {
        memoryStorage.removeItem(wafdeenDailyDraftKey_());
    }
    catch (_) { }
    wafdeenClearMissingMarks_();
}
function renderDailyTable() {
    var _a;
    var tbody = document.querySelector('#gradesTable tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    var searchKeyword = (((_a = document.getElementById('searchDaily')) === null || _a === void 0 ? void 0 : _a.value) || '').toLowerCase();
    var filterDate = document.getElementById('filterDateDaily').value;
    var safeTeacher = currentTeacher || { username: '', assignedClass: 'الكل' };
    var filteredRecords = dailyRecords.filter(function (r) {
        var matchesClass = (safeTeacher.username === 'admin' || safeTeacher.assignedClass === 'الكل')
            ? true : teacherOwnsClass_(r.className);
        var matchesSearch = String(r.studentName || '').toLowerCase().includes(searchKeyword);
        var matchesDate = filterDate ? (r.dateISO === filterDate) : true;
        return matchesClass && matchesSearch && matchesDate;
    });
    filteredRecords.sort(function (a, b) {
        var dateDiff = new Date(b.dateISO) - new Date(a.dateISO);
        if (dateDiff !== 0)
            return dateDiff;
        return String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ar');
    });
    if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="22">لا توجد سجلات مطابقة</td></tr>';
        return;
    }
    filteredRecords.forEach(function (r) {
        var total = getDailyTotal(r);
        var isAbsentRow = !!r.isAbsent || String(r.attendanceStatus || '') === 'absent';
        var gradeCell = function (v) { return isAbsentRow ? '<span style="color:var(--danger-color);font-weight:900;">—</span>' : dailyMissingCell(v); };
        var timeCellFn = function (s) { return isAbsentRow ? '<span style="color:var(--danger-color);font-weight:900;">—</span>' : dailyMissingTimeCell(s); };
        var canManageRecord = canManageDailyRecord_(r);
        var actionBtns = "<div style=\"display:flex;gap:5px;justify-content:center;flex-wrap:wrap;\">"
            + "<button type=\"button\" class=\"action-btn btn-edit\" style=\"padding:3px 8px;font-size:0.8em;min-width:auto;\" onclick=\"editRecord('" + String(r.id).replace(/'/g, "\'") + "')\">✏️ تعديل</button>"
            + (canManageRecord
                ? " <button type=\"button\" class=\"action-btn btn-danger\" style=\"padding:3px 8px;font-size:0.8em;min-width:auto;\" onclick=\"deleteRecord('" + String(r.id).replace(/'/g, "\'") + "')\">🗑️ حذف</button>"
                : "")
            + "</div>";
        var behaviorReasonIcon = (!isAbsentRow && r.behaviorReasonsText)
            ? " <span class=\"behavior-reason-icon\" title=\"\u0639\u0631\u0636 \u0633\u0628\u0628 \u0627\u0644\u062E\u0635\u0645\" onclick=\"wafdeenShowBehaviorReasons('".concat(String(r.behaviorReasonsText).replace(/'/g, "\\'"), "')\">\u2139\uFE0F</span>")
            : '';
        tbody.innerHTML += "\n      <tr>\n        <td><strong>".concat(r.dayName || '-', "</strong><br><small style=\"color:#7f8c8d;\">").concat(r.dateISO, "</small></td>\n        <td>").concat(r.className, "</td>\n        <td>").concat(r.teacherName, "</td>\n        <td style=\"font-weight:bold;\">").concat(r.studentName, "</td>\n        <td>").concat(isAbsentRow ? '<span class="badge" style="background:var(--danger-color);color:#fff;padding:4px 10px;">🚫 غائب</span>' : dailyMissingCell(r.attendance), "</td>\n        <td>").concat(gradeCell(r.behavior)).concat(behaviorReasonIcon, "</td>\n        <td class=\"fifth-hide-on-class\">").concat(gradeCell(r.newLesson), "<span class=\"daily-score-time\">").concat(r.newLessonTimeSeconds ? "\u062A\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0641\u064A ".concat(formatTimerSeconds(r.newLessonTimeSeconds)) : '', "</span></td>\n        <td class=\"fifth-hide-on-class daily-score-time\">").concat(timeCellFn(r.newLessonTimeSeconds), "</td>\n        <td class=\"fifth-hide-on-class\" style=\"color:#e67e22;\">").concat(dailyMissingCell(r.newTopicToday || r.newTopicText), "</td>\n        <td class=\"fifth-hide-on-class\" style=\"color:#d35400;\">").concat(dailyMissingCell(r.newTopicRecited), "</td>\n        <td class=\"fifth-hide-on-class\">").concat(gradeCell(r.oldRevision), "<span class=\"daily-score-time\">").concat(r.oldRevisionTimeSeconds ? "\u062A\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0641\u064A ".concat(formatTimerSeconds(r.oldRevisionTimeSeconds)) : '', "</span></td>\n        <td class=\"fifth-hide-on-class daily-score-time\">").concat(timeCellFn(r.oldRevisionTimeSeconds), "</td>\n        <td class=\"fifth-hide-on-class\" style=\"color:#27ae60;\">").concat(dailyMissingCell(r.oldTopicToday || r.oldTopicText), "</td>\n        <td class=\"fifth-hide-on-class\" style=\"color:#229954;\">").concat(dailyMissingCell(r.oldTopicRecited), "</td>\n        <td>").concat(gradeCell(r.recitation), "<span class=\"daily-score-time\">").concat(r.recitationTimeSeconds ? "\u062A\u0645 \u0627\u0644\u062A\u0633\u0645\u064A\u0639 \u0641\u064A ".concat(formatTimerSeconds(r.recitationTimeSeconds)) : '', "</span></td>\n        <td class=\"daily-score-time\">").concat(timeCellFn(r.recitationTimeSeconds), "</td>\n        <td style=\"color:var(--primary-color); font-weight:bold;\">").concat(dailyMissingCell(r.recitationTopicToday || r.recitationTopic), "</td>\n        <td style=\"color:#7d3c98; font-weight:bold;\">").concat(dailyMissingCell(r.recitationTopicRecited), "</td>\n        <td>").concat(gradeCell(r.homework), "</td>\n        <td class=\"tajweed-cell\">").concat(gradeCell(r.tajweed)).concat(Number(r.tajweed || 0) >= 9 ? " <span class=\"tajweed-star\" title=\"\u062F\u0631\u062C\u0629 \u0639\u0627\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u062A\u062C\u0648\u064A\u062F\" onclick=\"showTajweedHigh('".concat(String(r.studentName).replace(/'/g, "\'"), "', ").concat(r.tajweed, ")\">\u2605</span>") : '', "</td>\n        <td><strong style=\"color:var(--primary-dark);\">").concat(total, "</strong> / ").concat(getDailyMax(r.className), "</td>\n        <td>").concat(actionBtns, "</td>\n      </tr>\n    ");
    });
}
function editRecord(id) {
    return __awaiter(this, void 0, void 0, function () {
        var record, allowed;
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            record = dailyRecords.find(function (r) { return r.id.toString() === id.toString(); });
            if (!record)
                return [2 /*return*/];
            // الشيخ يستطيع تعديل أي طالب مسجل في الفصل المسند إليه، وليس فقط الطلاب الذين سجّلهم هو.
            // المدير يظل قادرًا على تعديل أي سجل.
            allowed = canManageDailyRecord_(record);
            if (!allowed)
                return [2 /*return*/, showMessage('app-msg', 'يمكنك تعديل الطلاب المسجلين في فصلك فقط', 'error')];
            showSiteModal('✏️ تعديل درجات الطالب', "<div class=\"modal-grid\">\n      <div class=\"form-group\">\n        <label>\u0627\u0644\u062A\u0627\u0631\u064A\u062E:</label>\n        <input type=\"date\" id=\"modalRecordDate\" value=\"".concat(record.dateISO, "\">\n      </div>\n      <div class=\"form-group\">\n        <label>\u0627\u0644\u0637\u0627\u0644\u0628:</label>\n        <input value=\"").concat(String(record.studentName || '').replace(/"/g, '&quot;'), "\" readonly>\n      </div>\n      <div class=\"form-group\"><label>\u0627\u0644\u062D\u0636\u0648\u0631 (10):</label><input type=\"number\" id=\"modalAttendance\" min=\"0\" max=\"10\" value=\"").concat((_a = record.attendance) !== null && _a !== void 0 ? _a : 0, "\"></div>\n      <div class=\"form-group full\">\n        <label>\u0627\u0644\u0633\u0644\u0648\u0643 (10):</label>\n        <div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;\">\n          <input type=\"number\" id=\"modalBehavior\" min=\"0\" max=\"10\" value=\"").concat((_b = record.behavior) !== null && _b !== void 0 ? _b : 0, "\" readonly style=\"max-width:90px;\">\n          <button type=\"button\" class=\"action-btn btn-warning\" style=\"padding:6px 12px;font-size:.82em;min-width:auto;\" onclick=\"wafdeenToggleBehaviorPanel('modal')\">\uD83D\uDCCB \u0627\u062E\u062A\u064A\u0627\u0631 \u0633\u0628\u0628 \u0627\u0644\u062E\u0635\u0645 \u0625\u0646 \u0648\u064F\u062C\u062F</button>\n        </div>\n        <div id=\"modal-behavior-summary\" class=\"daily-score-note\">\u0644\u0627 \u064A\u0648\u062C\u062F \u062E\u0635\u0645 \u2014 \u0627\u0644\u062F\u0631\u062C\u0629: 10/10</div>\n        <div id=\"modal-behavior-grid\" class=\"behavior-reason-grid\">").concat(wafdeenBehaviorReasonsRowsHtml('modal'), "</div>\n      </div>\n      <div class=\"form-group fifth-hide-on-class\"><label>\u0627\u0644\u062C\u062F\u064A\u062F (10):</label><input type=\"number\" id=\"modalNewLesson\" min=\"0\" max=\"10\" value=\"").concat((_c = record.newLesson) !== null && _c !== void 0 ? _c : 0, "\"></div>\n      <div class=\"form-group fifth-hide-on-class\"><label>\u0645\u0642\u0631\u0631 \u0627\u0644\u062C\u062F\u064A\u062F \u0627\u0644\u064A\u0648\u0645 <span style=\"color:var(--danger-color);\">*</span>:</label><input id=\"modalNewTopicToday\" value=\"").concat(String(record.newTopicToday || record.newTopicText || '').replace(/"/g, '&quot;'), "\"></div>\n      <div class=\"form-group fifth-hide-on-class\"><label>\u0645\u0642\u0631\u0631 \u0627\u0644\u062C\u062F\u064A\u062F \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647 <span style=\"color:var(--danger-color);\">*</span>:</label><input id=\"modalNewTopicRecited\" value=\"").concat(String(record.newTopicRecited || '').replace(/"/g, '&quot;'), "\"></div>\n      <div class=\"form-group fifth-hide-on-class\"><label>\u0627\u0644\u0645\u0627\u0636\u064A (10):</label><input type=\"number\" id=\"modalOldRevision\" min=\"0\" max=\"10\" value=\"").concat((_d = record.oldRevision) !== null && _d !== void 0 ? _d : 0, "\"></div>\n      <div class=\"form-group fifth-hide-on-class\"><label>\u0645\u0642\u0631\u0631 \u0627\u0644\u0645\u0627\u0636\u064A \u0627\u0644\u064A\u0648\u0645 <span style=\"color:var(--danger-color);\">*</span>:</label><input id=\"modalOldTopicToday\" value=\"").concat(String(record.oldTopicToday || record.oldTopicText || '').replace(/"/g, '&quot;'), "\"></div>\n      <div class=\"form-group fifth-hide-on-class\"><label>\u0645\u0642\u0631\u0631 \u0627\u0644\u0645\u0627\u0636\u064A \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647 <span style=\"color:var(--danger-color);\">*</span>:</label><input id=\"modalOldTopicRecited\" value=\"").concat(String(record.oldTopicRecited || '').replace(/"/g, '&quot;'), "\"></div>\n      <div class=\"form-group\"><label>\u0627\u0644\u062A\u0644\u0627\u0648\u0629 (10):</label><input type=\"number\" id=\"modalRecitation\" min=\"0\" max=\"10\" value=\"").concat((_e = record.recitation) !== null && _e !== void 0 ? _e : 0, "\"></div>\n      <div class=\"form-group\"><label>\u0645\u0642\u0631\u0631 \u0627\u0644\u062A\u0644\u0627\u0648\u0629 \u0627\u0644\u064A\u0648\u0645 <span style=\"color:var(--danger-color);\">*</span>:</label><input id=\"modalRecitationTopicToday\" value=\"").concat(String(record.recitationTopicToday || record.recitationTopic || '').replace(/"/g, '&quot;'), "\"></div>\n      <div class=\"form-group\"><label>\u0645\u0642\u0631\u0631 \u0627\u0644\u062A\u0644\u0627\u0648\u0629 \u0627\u0644\u0630\u064A \u062A\u0645 \u062A\u0633\u0645\u064A\u0639\u0647 <span style=\"color:var(--danger-color);\">*</span>:</label><input id=\"modalRecitationTopicRecited\" value=\"").concat(String(record.recitationTopicRecited || '').replace(/"/g, '&quot;'), "\"></div>\n      <div class=\"form-group\"><label>\u0627\u0644\u0648\u0627\u062C\u0628 (10):</label><input type=\"number\" id=\"modalHomework\" min=\"0\" max=\"10\" value=\"").concat((_f = record.homework) !== null && _f !== void 0 ? _f : 0, "\"></div>\n      <div class=\"form-group\"><label>\uD83D\uDCD6 \u0627\u0644\u062A\u062C\u0648\u064A\u062F (10) \u2014 \u064A\u064F\u0636\u0627\u0641 \u0625\u0644\u0649 \u0627\u0644\u0645\u062C\u0645\u0648\u0639:</label><input type=\"number\" id=\"modalTajweed\" min=\"0\" max=\"10\" value=\"").concat((_g = record.tajweed) !== null && _g !== void 0 ? _g : 0, "\"></div>\n      <div class=\"form-group\"><label>\u0648\u0642\u062A \u0627\u0644\u062C\u062F\u064A\u062F:</label><input type=\"text\" id=\"modalNewTime\" value=\"").concat(formatTimerSeconds(record.newLessonTimeSeconds || 0), "\" readonly></div>\n      <div class=\"form-group\"><label>\u0648\u0642\u062A \u0627\u0644\u0645\u0627\u0636\u064A:</label><input type=\"text\" id=\"modalOldTime\" value=\"").concat(formatTimerSeconds(record.oldRevisionTimeSeconds || 0), "\" readonly></div>\n      <div class=\"form-group\"><label>\u0648\u0642\u062A \u0627\u0644\u062A\u0644\u0627\u0648\u0629:</label><input type=\"text\" id=\"modalRecitationTime\" value=\"").concat(formatTimerSeconds(record.recitationTimeSeconds || 0), "\" readonly></div>\n    </div>"), "<button type=\"button\" class=\"action-btn modal-success\" id=\"saveRecordEditBtn\">\uD83D\uDCBE \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644</button>\n     <button type=\"button\" class=\"action-btn modal-cancel\" id=\"cancelRecordEditBtn\">\u0625\u0644\u063A\u0627\u0621</button>");
            wafdeenResetBehaviorState('modal', record.behaviorReasons || {});
            document.getElementById('saveRecordEditBtn').onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                var dateISO, getVal, newTopicToday, newTopicRecited, oldTopicToday, oldTopicRecited, recitationTopicToday, recitationTopicRecited, fifth, values, dayNames, updatedRecord, newId, idx, e_28;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dateISO = document.getElementById('modalRecordDate').value;
                            getVal = function (id) { var _a, _b; return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ''; };
                            newTopicToday = getVal('modalNewTopicToday').trim();
                            newTopicRecited = getVal('modalNewTopicRecited').trim();
                            oldTopicToday = getVal('modalOldTopicToday').trim();
                            oldTopicRecited = getVal('modalOldTopicRecited').trim();
                            recitationTopicToday = getVal('modalRecitationTopicToday').trim();
                            recitationTopicRecited = getVal('modalRecitationTopicRecited').trim();
                            fifth = isFifthClass(record.className);
                            values = fifth
                                ? [getVal('modalAttendance'), getVal('modalBehavior'), getVal('modalRecitation'), getVal('modalHomework'), getVal('modalTajweed')]
                                : [getVal('modalAttendance'), getVal('modalBehavior'), getVal('modalNewLesson'), getVal('modalOldRevision'), getVal('modalRecitation'), getVal('modalHomework'), getVal('modalTajweed')];
                            if (!dateISO || values.some(function (v) { return v === ''; })) {
                                return [2 /*return*/, showSiteError('يرجى إدخال التاريخ وجميع الدرجات.')];
                            }
                            if (!recitationTopicToday || !recitationTopicRecited || (!fifth && (!newTopicToday || !newTopicRecited || !oldTopicToday || !oldTopicRecited))) {
                                return [2 /*return*/, showSiteError(fifth ? 'يرجى إدخال مقرري التلاوة: اليوم والتسميع.' : 'يرجى إدخال مقررات الجديد والماضي والتلاوة: اليوم والتسميع.')];
                            }
                            if (values.some(function (v) { return Number(v) < 0 || Number(v) > 10; })) {
                                return [2 /*return*/, showSiteError('كل درجة يجب أن تكون بين 0 و10.')];
                            }
                            dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
                            updatedRecord = __assign(__assign({}, record), { dateISO: dateISO, dayName: dayNames[new Date(dateISO + 'T00:00:00').getDay()], recitationTopicToday: recitationTopicToday, recitationTopicRecited: recitationTopicRecited, recitationTopic: recitationTopicToday, oldTopicToday: fifth ? '' : oldTopicToday, oldTopicRecited: fifth ? '' : oldTopicRecited, newTopicToday: fifth ? '' : newTopicToday, newTopicRecited: fifth ? '' : newTopicRecited, oldTopicText: fifth ? '' : oldTopicToday, newTopicText: fifth ? '' : newTopicToday, attendance: clampGrade(values[0]), behavior: clampGrade(values[1]), behaviorReasons: __assign({}, (wafdeenBehaviorState.modal || {})), behaviorReasonsText: wafdeenBehaviorSummaryText('modal'), newLesson: fifth ? 0 : clampGrade(values[2]), oldRevision: fifth ? 0 : clampGrade(values[3]), recitation: fifth ? clampGrade(values[2]) : clampGrade(values[4]), homework: fifth ? clampGrade(values[3]) : clampGrade(values[5]), tajweed: fifth ? clampGrade(values[4]) : clampGrade(values[6]), newLessonTimeSeconds: Number(record.newLessonTimeSeconds || 0), oldRevisionTimeSeconds: Number(record.oldRevisionTimeSeconds || 0), recitationTimeSeconds: Number(record.recitationTimeSeconds || 0), recitation1: 0, recitation2: 0, recitation3: 0, recitation4: 0 });
                            newId = dailyStableRecordId_(record.studentId || dailyStudentId_(record.studentName, record.className), record.className, dateISO);
                            updatedRecord.id = newId;
                            updatedRecord.studentId = String(record.studentId || dailyStudentId_(record.studentName, record.className));
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, , 8]);
                            if (!useFirebase || !db) return [3 /*break*/, 5];
                            if (!(newId !== record.id)) return [3 /*break*/, 3];
                            return [4 /*yield*/, Promise.resolve({ok:true, preservedLegacy:true})];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [4 /*yield*/, firebaseWriteRecord_('dailyRecords', newId, updatedRecord, { merge: true })];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            idx = dailyRecords.findIndex(function (r) { return r.id.toString() === record.id.toString(); });
                            if (idx > -1)
                                dailyRecords[idx] = updatedRecord;
                            memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
                            populateWeeks();
                            renderDailyTable();
                            renderAttendanceTable();
                            renderWeeklyTable();
                            renderMonthlyReport();
                            renderManagerView();
                            renderClassStatusTable();
                            _b.label = 6;
                        case 6:
                            closeSiteModal();
                            updateFifthGradeFields(((_a = document.getElementById('classSelect')) === null || _a === void 0 ? void 0 : _a.value) || record.className);
                            showMessage('app-msg', 'تم تعديل الدرجات بنجاح ✨', 'success');
                            return [3 /*break*/, 8];
                        case 7:
                            e_28 = _b.sent();
                            showSiteError('تعذر حفظ التعديل. حاول مرة أخرى.');
                            console.error(e_28);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); };
            document.getElementById('cancelRecordEditBtn').onclick = closeSiteModal;
            return [2 /*return*/];
        });
    });
}
function renderClassStatusTable() {
    if (shouldDeferHeavyRender_(['class-status-table', 'classStatusTable'])) return;
    var _a;
    var statusDateInput = document.getElementById('statusDate');
    var dateVal = statusDateInput ? statusDateInput.value : '';
    if (!dateVal) {
        dateVal = document.getElementById('recordDate').value || new Date().toISOString().slice(0, 10);
        if (statusDateInput)
            statusDateInput.value = dateVal;
    }
    var tbody = document.querySelector('#classStatusTable tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    var grandTotal = 0;
    var grandRecorded = 0;
    // الشرعي نظام مستقل ولا يدخل ضمن رصد الحالة.
    GENERAL_CLASSES.forEach(function (cName) {
        var classStudents = studentsData.filter(function (s) { return s.className === cName; });
        var totalCount = classStudents.length;
        var classRecords = dailyRecords.filter(function (r) { return r.className === cName && r.dateISO === dateVal && !r._deleted; });
        var recordedNames = new Set(classRecords.map(function (r) { return String(r.studentName || '').trim(); }).filter(Boolean));
        var unrecorded = classStudents.filter(function (s) { return !recordedNames.has(String(s.name || '').trim()); });
        var recordedCount = Math.min(recordedNames.size, totalCount);
        grandTotal += totalCount;
        grandRecorded += recordedCount;
        var statusBadge = '';
        if (totalCount === 0) {
            statusBadge = '<span class="badge" style="background-color:#7f8c8d;">لا يوجد طلاب</span>';
        }
        else if (unrecorded.length === 0) {
            statusBadge = '<span class="badge badge-green">✅ تم تسجيل جميع الطلاب</span>';
        }
        else if (recordedCount > 0) {
            statusBadge = "<span class=\"badge\" style=\"background:#eaf8f1;color:#0f7a4a;border:1px solid #8fd3ae;\">\uD83D\uDFE2 \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 ".concat(recordedCount, " \u0637\u0627\u0644\u0628</span>");
        }
        else {
            statusBadge = '<span class="badge" style="background-color:var(--danger-color);">لم يبدأ الرصد</span>';
        }
        var actionBtn = '';
        if (totalCount === 0) {
            actionBtn = '<span style="color:#7f8c8d;">-</span>';
        }
        else if (unrecorded.length === 0) {
            actionBtn = "<span style=\"color:var(--success-color);font-weight:bold;\">\uD83C\uDF89 ".concat(recordedCount, " / ").concat(totalCount, " \u2014 \u0627\u0643\u062A\u0645\u0644 \u0627\u0644\u0631\u0635\u062F \u0628\u0627\u0644\u0643\u0627\u0645\u0644</span>");
        }
        else {
            actionBtn = "<div style=\"display:flex;flex-direction:column;gap:5px;align-items:flex-start;\">\n        <strong style=\"color:var(--primary-color);\">\u062A\u0645 \u062A\u0633\u062C\u064A\u0644: ".concat(recordedCount, " \u0645\u0646 ").concat(totalCount, "</strong>\n        <span style=\"color:#a04000;font-weight:bold;\">\u0645\u062A\u0628\u0642\u064A: ").concat(unrecorded.length, "</span>\n        <button type=\"button\" class=\"action-btn btn-warning\" style=\"padding:4px 10px;font-size:.82em;min-width:auto;\" onclick=\"showUnrecordedStudents('").concat(cName, "', '").concat(dateVal, "')\">\u0639\u0631\u0636 \u063A\u064A\u0631 \u0627\u0644\u0645\u0633\u062C\u0644 (").concat(unrecorded.length, ") \uD83D\uDC41\uFE0F</button>\n      </div>");
        }
        tbody.innerHTML += "\n      <tr>\n        <td style=\"font-weight:bold;color:var(--primary-dark);\">".concat(cName, "</td>\n        <td><strong>").concat(totalCount, "</strong></td>\n        <td style=\"color:var(--primary-color);font-weight:900;font-size:1.08em;\">").concat(recordedCount, "</td>\n        <td>").concat(statusBadge, "</td>\n        <td>").concat(actionBtn, "</td>\n      </tr>\n    ");
    });
    // ملخص سريع أعلى الجدول: يتحدث فور وصول سجل جديد من أي جهاز.
    var summary = document.getElementById('classStatusLiveSummary');
    if (!summary) {
        summary = document.createElement('div');
        summary.id = 'classStatusLiveSummary';
        var tableWrap = (_a = document.querySelector('#classStatusTable')) === null || _a === void 0 ? void 0 : _a.closest('.table-responsive');
        if (tableWrap)
            tableWrap.parentNode.insertBefore(summary, tableWrap);
    }
    var remaining = Math.max(0, grandTotal - grandRecorded);
    summary.innerHTML = "\n    <div style=\"display:flex;gap:10px;flex-wrap:wrap;margin:12px 0;\">\n      <div style=\"flex:1;min-width:150px;background:#eaf8f1;border:1px solid #8fd3ae;border-radius:12px;padding:12px;text-align:center;\">\n        <div style=\"font-size:.85em;color:#48685a;font-weight:700;\">\u062A\u0645 \u062A\u0633\u062C\u064A\u0644\u0647\u0645</div>\n        <div style=\"font-size:1.65em;color:#0f7a4a;font-weight:900;\">".concat(grandRecorded, "</div>\n      </div>\n      <div style=\"flex:1;min-width:150px;background:#fff7e5;border:1px solid #e4c56a;border-radius:12px;padding:12px;text-align:center;\">\n        <div style=\"font-size:.85em;color:#806a2b;font-weight:700;\">\u0627\u0644\u0645\u062A\u0628\u0642\u064A</div>\n        <div style=\"font-size:1.65em;color:#a56b00;font-weight:900;\">").concat(remaining, "</div>\n      </div>\n      <div style=\"flex:1;min-width:150px;background:#f5f7f7;border:1px solid #d5dddd;border-radius:12px;padding:12px;text-align:center;\">\n        <div style=\"font-size:.85em;color:#5b6666;font-weight:700;\">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628</div>\n        <div style=\"font-size:1.65em;color:var(--primary-dark);font-weight:900;\">").concat(grandTotal, "</div>\n      </div>\n    </div>");
}
function showUnrecordedStudents(className, dateVal) {
    var classStudents = studentsData.filter(function (s) { return s.className === className; });
    var classRecords = dailyRecords.filter(function (r) { return r.className === className && r.dateISO === dateVal; });
    var recordedNames = classRecords.map(function (r) { return r.studentName; });
    var unrecorded = classStudents.filter(function (s) { return !recordedNames.includes(s.name); });
    var card = document.getElementById('unrecordedDetailsCard');
    var title = document.getElementById('unrecordedClassName');
    var listContainer = document.getElementById('unrecordedStudentsList');
    title.innerText = "".concat(className, " (\u0628\u062A\u0627\u0631\u064A\u062E: ").concat(dateVal, ")");
    if (unrecorded.length === 0) {
        listContainer.innerHTML = '<p style="color:var(--success-color); font-weight:bold;">جميع الطلاب مسجلون بالكامل!</p>';
    }
    else {
        var html_1 = '<p style="margin-top:0; font-weight:bold; color:#555;">الطلاب الذين لم تُسجَّل درجاتهم بعد في هذا اليوم:</p>';
        html_1 += '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">';
        unrecorded.forEach(function (s, i) {
            html_1 += "<div style=\"background:#fdf2e9; color:#a04000; padding:10px 14px; border-radius:8px; border:1px solid #f5cba7; font-weight:bold; display:flex; align-items:center; gap:8px;\">\n                 <span>\u274C ".concat(i + 1, ".</span> <span>").concat(s.name, "</span>\n               </div>");
        });
        html_1 += '</div>';
        listContainer.innerHTML = html_1;
    }
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth' });
}
function hideUnrecordedDetails() {
    var card = document.getElementById('unrecordedDetailsCard');
    if (card)
        card.classList.add('hidden');
}
function renderAttendanceTable() {
    if (shouldDeferHeavyRender_(['attendance-table', 'attendanceTable'])) return;
    var endDateVal = document.getElementById('attendanceEndDate').value;
    if (!endDateVal) {
        endDateVal = document.getElementById('recordDate').value || new Date().toISOString().slice(0, 10);
        document.getElementById('attendanceEndDate').value = endDateVal;
    }
    var selectedClass = document.getElementById('attendanceClassSelect').value;
    var dates = [];
    var endDate = new Date(endDateVal);
    // الـ20 يوم ثابتة: كل يوم له خانة مستقلة، والنسبة في النهاية من أصل 20.
    for (var i = 19; i >= 0; i--) {
        var d = new Date(endDate);
        d.setDate(d.getDate() - i);
        var tzoffset = d.getTimezoneOffset() * 60000;
        var iso = new Date(d.getTime() - tzoffset).toISOString().slice(0, 10);
        dates.push(iso);
    }
    var thead = document.querySelector('#attendanceTable thead');
    var tbody = document.querySelector('#attendanceTable tbody');
    if (!thead || !tbody)
        return;
    var dailyMax = getDailyMax(selectedClass);
    var headerHtml = '<tr><th style="min-width: 150px; position: sticky; right: 0; background: #f8f9fa; z-index: 2;">اسم الطالب/الطالبة</th>';
    dates.forEach(function (dStr) {
        var parts = dStr.split('-');
        var shortDate = "".concat(parts[2], "/").concat(parts[1]);
        headerHtml += "<th style=\"font-size:0.75em; padding:4px; min-width:38px;\">".concat(shortDate, "</th>");
    });
    headerHtml += '<th>أيام الحضور</th><th>نسبة الحضور من 20</th></tr>';
    thead.innerHTML = headerHtml;
    tbody.innerHTML = '';
    var classStudents = studentsData
        .filter(function (s) { return s.className === selectedClass; })
        .map(function (s) { return s.name; })
        .sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    if (classStudents.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"".concat(dates.length + 3, "\">\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0635\u0641</td></tr>");
        return;
    }
    classStudents.forEach(function (student) {
        var rowHtml = "<tr><td style=\"font-weight:bold; text-align:right; position: sticky; right: 0; background: white; z-index: 1;\"><button type=\"button\" onclick='showStudentReportChart(".concat(JSON.stringify(student), ", \"monthly\")' style=\"border:0;background:none;color:var(--primary-dark);font:inherit;font-weight:800;cursor:pointer;text-decoration:underline;text-decoration-color:var(--accent-gold);\">").concat(student, "</button></td>");
        var attendedDaysCount = 0;
        dates.forEach(function (dStr) {
            var rec = dailyRecords.find(function (r) {
                return r.className === selectedClass &&
                    r.studentName === student &&
                    r.dateISO === dStr;
            });
            if (rec) {
                if (Number(rec.attendance) > 0) {
                    attendedDaysCount++;
                    rowHtml += "<td title=\"\u062D\u0627\u0636\u0631\" style=\"color:var(--success-color); font-weight:bold; background:#e8f8f1;\">\u2713</td>";
                }
                else {
                    rowHtml += "<td title=\"\u063A\u0627\u0626\u0628\" style=\"color:var(--danger-color); font-weight:bold; background:#fadbd8;\">\u2717</td>";
                }
            }
            else {
                // اليوم لم يتم تسجيله بعد، وليس غياباً.
                rowHtml += "<td title=\"\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0628\u0639\u062F\" style=\"color:#bbb; background:#fafafa;\">-</td>";
            }
        });
        // مثال: يومان حضور من أصل 20 = 10%، حتى لو تم تسجيل يومين فقط.
        var attPerc = ((attendedDaysCount / 20) * 100).toFixed(0);
        var badgeClass = parseFloat(attPerc) >= 75
            ? 'badge-green'
            : (parseFloat(attPerc) >= 50 ? 'badge-yellow' : 'badge-yellow');
        rowHtml += "<td><strong>".concat(attendedDaysCount, "</strong> / 20</td>");
        rowHtml += "<td><span class=\"badge ".concat(badgeClass, "\">").concat(attPerc, "%</span></td></tr>");
        tbody.innerHTML += rowHtml;
    });
}
var weeklyReportChartInstance = null;
var monthlyReportChartInstance = null;
var studentWeekChartInstance = null;
var studentMonthChartInstance = null;
function renderBarChart(canvasId, instanceSetter, instanceGetter, labels, data, label, color) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined')
        return;
    var existing = instanceGetter();
    if (existing)
        existing.destroy();
    var lineColor = color || 'rgba(19, 104, 77, 1)';
    var chart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                    label: label,
                    data: data,
                    borderColor: lineColor, backgroundColor: lineColor, borderWidth: 3,
                    tension: 0.35, fill: false, pointRadius: 5, pointHoverRadius: 7,
                    pointBackgroundColor: lineColor, pointBorderWidth: 2
                }]
        },
        options: {
            responsive: true, interaction: { mode: 'index', intersect: false },
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: { x: { ticks: { font: { size: 10 } } }, y: { beginAtZero: true, min: 0, max: 60, ticks: { stepSize: 10 } } }
        }
    });
    instanceSetter(chart);
}
function showStudentReportChart(studentName, reportType) {
    var selectedClass = reportType === 'weekly'
        ? document.getElementById('weeklyClassSelect').value
        : document.getElementById('monthlyClassSelect').value;
    /* إصلاح رسم الوافدين: استخدم سجلات الوافدين الفعلية بدل dailyRecords العامة. */
    if (wafdeenIsClass_(selectedClass)) {
        var wafRecords = typeof wafdeenMainLogRecords_ === 'function' ? wafdeenMainLogRecords_() : (wafdeenDailyRecords || []);
        var labelsW = [], dataW = [], titleW = '';
        var totalW = function(r){ return Math.max(0, Math.min(30, Number(r && r.total) || Number(r && r.newLesson || 0) + Number(r && r.oldRevision || 0) + Number(r && r.recitation || 0))); };
        if (reportType === 'weekly') {
            var wk = (document.getElementById('weekSelect') || {}).value || '';
            var ord = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
            labelsW = ord;
            dataW = ord.map(function(day){
                var r = wafRecords.find(function(x){ return !x._deleted && String(x.studentName||'') === String(studentName) && x.dateISO && getWeekKey(String(x.dateISO).slice(0,10)) === wk && (String(x.dayName||'') === day || (!x.dayName && wafdeenReportDayName_(x.dateISO) === day)); });
                return r && !(r.isAbsent || String(r.attendanceStatus||'').toLowerCase()==='absent') ? totalW(r) : 0;
            });
            titleW = '📈 الرسم البياني الأسبوعي — ' + studentName;
        } else {
            var m = Number((document.getElementById('reportMonth') || {}).value || new Date().getMonth());
            var y = Number((document.getElementById('reportYear') || {}).value || new Date().getFullYear());
            var wd = getMonthWorkingDays(y, m);
            wd.forEach(function(d){
                labelsW.push(String(d.dayNum).padStart(2,'0') + '/' + String(m+1).padStart(2,'0'));
                var r = wafRecords.find(function(x){ return !x._deleted && String(x.studentName||'') === String(studentName) && wafdeenMainLogDate_(x.dateISO||x.date||'') === d.dateISO; });
                dataW.push(r && !(r.isAbsent || String(r.attendanceStatus||'').toLowerCase()==='absent') ? totalW(r) : 0);
            });
            titleW = '📈 الرسم البياني الشهري — ' + studentName;
        }
        showSiteModal(titleW, '<div style=\"background:#fff;border-radius:12px;padding:8px 4px;\"><canvas id=\"studentReportChartModal\" height=\"250\"></canvas></div>', '<button type=\"button\" class=\"action-btn modal-cancel\" onclick=\"closeSiteModal()\">إغلاق</button>');
        setTimeout(function(){
            renderBarChart('studentReportChartModal', function(c){window.studentReportModalChartInstance=c;}, function(){return window.studentReportModalChartInstance;}, labelsW, dataW, 'الدرجة اليومية للوافدين');
            var ch=window.studentReportModalChartInstance;
            if(ch){ch.options.scales=ch.options.scales||{};ch.options.scales.y=ch.options.scales.y||{};ch.options.scales.y.min=0;ch.options.scales.y.max=30;ch.update();}
        },0);
        return;
    }
    var labels = [], data = [], title = '';
    if (reportType === 'weekly') {
        var weekKey_1 = document.getElementById('weekSelect').value;
        var records_1 = dailyRecords.filter(function (r) { return r.className === selectedClass && r.studentName === studentName && r.dateISO && getWeekKey(r.dateISO) === weekKey_1; });
        var order = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
        labels = order;
        data = order.map(function (day) { var r = records_1.find(function (x) { return x.dayName === day; }); return r ? getDailyTotal(r) : 0; });
        title = "\uD83D\uDCC8 \u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A \u2014 ".concat(studentName);
    }
    else {
        var month = Number(document.getElementById('reportMonth').value);
        var year = Number(document.getElementById('reportYear').value);
        var workingDays_1 = getMonthWorkingDays(year, month);
        var records = dailyRecords.filter(function (r) { return r.className === selectedClass && r.studentName === studentName && workingDays_1.some(function (w) { return w.dateISO === r.dateISO; }); }).sort(function (a, b) { return a.dateISO.localeCompare(b.dateISO); });
        labels = records.map(function (r) { return formatStudentDate(r.dateISO).slice(0, 5); });
        data = records.map(function (r) { return getDailyTotal(r); });
        title = "\uD83D\uDCC8 \u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A \u0627\u0644\u0634\u0647\u0631\u064A \u2014 ".concat(studentName);
    }
    showSiteModal(title, "<div style=\"background:#fff;border-radius:12px;padding:8px 4px;\"><canvas id=\"studentReportChartModal\" height=\"250\"></canvas></div>", "<button type=\"button\" class=\"action-btn modal-cancel\" onclick=\"closeSiteModal()\">\u0625\u063A\u0644\u0627\u0642</button>");
    setTimeout(function () {
        renderBarChart('studentReportChartModal', function (c) { return window.studentReportModalChartInstance = c; }, function () { return window.studentReportModalChartInstance; }, labels, data, 'الدرجة اليومية');
        var chart = window.studentReportModalChartInstance;
        if (chart) {
            chart.options.scales = chart.options.scales || {};
            chart.options.scales.y = chart.options.scales.y || {};
            chart.options.scales.y.min = 0;
            chart.options.scales.y.max = 60;
            chart.update();
        }
    }, 0);
}
function renderWeeklyTable() {
    if (shouldDeferHeavyRender_(['weekly-table', 'weeklyTable'])) return;
    var tbody = document.querySelector('#weeklyTable tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    var selectedWeekKey = document.getElementById('weekSelect').value;
    var selectedClass = document.getElementById('weeklyClassSelect').value;
    if (!selectedWeekKey) {
        tbody.innerHTML = '<tr><td colspan="10">لا توجد بيانات متاحة</td></tr>';
        return;
    }
    var weekRecords = dailyRecords.filter(function (r) { return r.className === selectedClass && r.dateISO && getWeekKey(r.dateISO) === selectedWeekKey; });
    var classStudents = studentsData
        .filter(function (s) { return s.className === selectedClass; })
        .map(function (s) { return s.name; })
        .sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    if (classStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">لا يوجد طلاب مسجلين في هذا الصف</td></tr>';
        renderBarChart('weeklyReportChart', function (c) { return weeklyReportChartInstance = c; }, function () { return weeklyReportChartInstance; }, [], [], 'متوسط الأسبوع');
        return;
    }
    var chartLabels = [];
    var chartData = [];
    classStudents.forEach(function (student) {
        var sRecords = weekRecords.filter(function (r) { return r.studentName === student; });
        var weekDays = { "الأحد": "-", "الاثنين": "-", "الثلاثاء": "-", "الأربعاء": "-", "الخميس": "-" };
        var studentTotal = 0;
        var attTotal = 0;
        sRecords.forEach(function (r) {
            if (weekDays[r.dayName] !== undefined) {
                var totalDaily = getDailyTotal(r);
                weekDays[r.dayName] = totalDaily;
                studentTotal += totalDaily;
                attTotal += (r.attendance || 0);
            }
        });
        var dailyMax = getDailyMax(selectedClass);
        var weeklyAverage = (studentTotal / 5).toFixed(1);
        var attPerc = ((attTotal / 50) * 100).toFixed(1);
        var badgeClass = parseFloat(attPerc) >= 75 ? 'badge-blue' : 'badge-yellow';
        tbody.innerHTML += "\n      <tr>\n        <td style=\"font-weight:bold;\"><button type=\"button\" onclick='showStudentReportChart(".concat(JSON.stringify(student), ", \"weekly\")' style=\"border:0;background:none;color:var(--primary-dark);font:inherit;font-weight:800;cursor:pointer;text-decoration:underline;text-decoration-color:var(--accent-gold);\">").concat(student, "</button></td>\n        <td>").concat(weekDays["الأحد"], "</td>\n        <td>").concat(weekDays["الاثنين"], "</td>\n        <td>").concat(weekDays["الثلاثاء"], "</td>\n        <td>").concat(weekDays["الأربعاء"], "</td>\n        <td>").concat(weekDays["الخميس"], "</td>\n        <td><strong>").concat(studentTotal, "</strong> / ").concat(dailyMax * 5, "</td>\n        <td style=\"color:var(--primary-color); font-weight:bold;\">").concat(weeklyAverage, " / ").concat(dailyMax, "</td>\n        <td class=\"tajweed-cell\"><strong>").concat(sRecords.reduce(function (sum, r) { return sum + Number(r.tajweed || 0); }, 0), "</strong> / ").concat(10 * 5).concat(((sRecords.reduce(function (sum, r) { return sum + Number(r.tajweed || 0); }, 0) / (10 * 5)) * 100) > 70 ? ' ⭐' : '', "</td>\n        <td><span class=\"badge ").concat(badgeClass, "\">").concat(attPerc, "%</span></td>\n      </tr>\n    ");
        chartLabels.push(student);
        chartData.push(parseFloat(weeklyAverage));
    });
    renderBarChart('weeklyReportChart', function (c) { return weeklyReportChartInstance = c; }, function () { return weeklyReportChartInstance; }, chartLabels, chartData, 'متوسط الأسبوع (على 5 أيام)');
}
function getMonthWorkingDays(year, month) {
    var workingDays = [];
    var date = new Date(year, month, 1);
    var monthNum = Number(month);
    while (date.getMonth() === monthNum) {
        var dayOfWeek = date.getDay();
        if (dayOfWeek >= 0 && dayOfWeek <= 4) {
            var tzoffset = date.getTimezoneOffset() * 60000;
            var iso = new Date(date.getTime() - tzoffset).toISOString().slice(0, 10);
            var dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
            workingDays.push({
                dateISO: iso,
                dayName: dayNames[dayOfWeek],
                dayNum: date.getDate()
            });
        }
        date.setDate(date.getDate() + 1);
    }
    return workingDays;
}
function renderMonthlyReport() {
    if (shouldDeferHeavyRender_(['monthly-report', 'monthlyReport'])) return;
    var month = document.getElementById('reportMonth').value;
    var year = document.getElementById('reportYear').value;
    var selectedClass = document.getElementById('monthlyClassSelect').value;
    var thead = document.querySelector('#monthlyReportTable thead');
    var tbody = document.querySelector('#monthlyReportTable tbody');
    if (!thead || !tbody)
        return;
    var workingDays = getMonthWorkingDays(year, month);
    var headerHtml = '<tr><th style="min-width: 150px; position: sticky; right: 0; background: #f8f9fa; z-index: 2;">اسم الطالب/الطالبة</th>';
    workingDays.forEach(function (wd) {
        var parts = wd.dateISO.split('-');
        var shortDate = "".concat(parts[2], "/").concat(parts[1]);
        headerHtml += "<th style=\"font-size:0.78em; padding:5px 3px; min-width:42px;\">".concat(wd.dayName, "<br><span style=\"color:#666;\">").concat(shortDate, "</span></th>");
    });
    headerHtml += '<th>أيام الحضور</th><th>مجموع الشهر</th><th>متوسط الشهر</th><th>مجموع التجويد</th><th>نسبة الحضور</th><th>نسبة التقييم</th></tr>';
    thead.innerHTML = headerHtml;
    tbody.innerHTML = '';
    var classStudents = studentsData
        .filter(function (s) { return s.className === selectedClass; })
        .map(function (s) { return s.name; })
        .sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    if (classStudents.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"".concat(workingDays.length + 7, "\">\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0645\u0633\u062C\u0644\u064A\u0646 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0635\u0641</td></tr>");
        renderBarChart('monthlyReportChart', function (c) { return monthlyReportChartInstance = c; }, function () { return monthlyReportChartInstance; }, [], [], 'متوسط الشهر');
        return;
    }
    var chartLabels = [];
    var chartData = [];
    classStudents.forEach(function (student) {
        var rowHtml = "<tr><td style=\"font-weight:bold; text-align:right; position: sticky; right: 0; background: white; z-index: 1;\"><button type=\"button\" onclick='showStudentReportChart(".concat(JSON.stringify(student), ", \"monthly\")' style=\"border:0;background:none;color:var(--primary-dark);font:inherit;font-weight:800;cursor:pointer;text-decoration:underline;text-decoration-color:var(--accent-gold);\">").concat(student, "</button></td>");
        var totalScore = 0;
        var attendedDaysCount = 0;
        var recordedDaysCount = 0;
        workingDays.forEach(function (wd) {
            var rec = dailyRecords.find(function (r) { return r.className === selectedClass && r.studentName === student && r.dateISO === wd.dateISO; });
            if (rec) {
                recordedDaysCount++;
                var dailyScore = getDailyTotal(rec);
                totalScore += dailyScore;
                if (rec.attendance > 0)
                    attendedDaysCount++;
                rowHtml += "<td style=\"font-weight:bold; color:var(--primary-dark); background:#f9fbf9;\">".concat(dailyScore, "</td>");
            }
            else {
                rowHtml += "<td style=\"color:#ccc;\">-</td>";
            }
        });
        var dailyMax = getDailyMax(selectedClass);
        // المتوسط الشهري يُحسب على جميع أيام العمل في الشهر، حتى لو تم تسجيل يوم واحد فقط.
        var maxPossibleScore = workingDays.length * dailyMax;
        var monthlyAverage = workingDays.length > 0 ? (totalScore / workingDays.length).toFixed(1) : 0;
        var overallPerc = maxPossibleScore > 0 ? ((totalScore / maxPossibleScore) * 100).toFixed(1) : 0;
        var attPerc = workingDays.length > 0 ? ((attendedDaysCount / workingDays.length) * 100).toFixed(1) : 0;
        var badgeOverall = parseFloat(overallPerc) >= 75 ? 'badge-green' : 'badge-yellow';
        var badgeAtt = parseFloat(attPerc) >= 75 ? 'badge-blue' : 'badge-yellow';
        var tajweedRecords = dailyRecords.filter(function (r) { return r.className === selectedClass && r.studentName === student && workingDays.some(function (w) { return w.dateISO === r.dateISO; }); });
        var tajweedTotal = tajweedRecords.reduce(function (sum, r) { return sum + Number(r.tajweed || 0); }, 0);
        var tajweedMax = workingDays.length * 10;
        var tajweedStar = tajweedMax > 0 && ((tajweedTotal / tajweedMax) * 100) > 70 ? ' ⭐' : '';
        rowHtml += "<td><strong>".concat(attendedDaysCount, "</strong> / ").concat(workingDays.length, "</td>");
        rowHtml += "<td><strong>".concat(totalScore, "</strong></td>");
        rowHtml += "<td style=\"color:var(--primary-color); font-weight:bold;\">".concat(monthlyAverage, "</td>");
        rowHtml += "<td class=\"tajweed-cell\"><strong>".concat(tajweedTotal, "</strong> / ").concat(tajweedMax).concat(tajweedStar, "</td>");
        rowHtml += "<td><span class=\"badge ".concat(badgeAtt, "\">").concat(attPerc, "%</span></td>");
        rowHtml += "<td><span class=\"badge ".concat(badgeOverall, "\">").concat(overallPerc, "%</span></td></tr>");
        tbody.innerHTML += rowHtml;
        chartLabels.push(student);
        chartData.push(parseFloat(monthlyAverage));
    });
    renderBarChart('monthlyReportChart', function (c) { return monthlyReportChartInstance = c; }, function () { return monthlyReportChartInstance; }, chartLabels, chartData, 'متوسط الشهر (على جميع أيام العمل)', 'rgba(21, 101, 192, 0.65)');
}
var topStudentsTabBtn = document.getElementById('top-students-tab-btn');
if (topStudentsTabBtn)
    topStudentsTabBtn.classList.remove('hidden');
function switchTopPeriod(period, event) {
    document.querySelectorAll('#top-students-tab .top-period-btn').forEach(function (btn) { return btn.classList.remove('active'); });
    if (event && event.currentTarget)
        event.currentTarget.classList.add('active');
    document.querySelectorAll('#top-students-tab .top-period-panel').forEach(function (panel) { return panel.classList.add('hidden'); });
    var panel = document.getElementById("top-period-".concat(period));
    if (panel)
        panel.classList.remove('hidden');
    renderTopStudents();
}
function getTopStudentsPeriod() {
    var active = document.querySelector('#top-students-tab .top-period-btn.active');
    if (!active)
        return 'day';
    if (active.textContent.includes('الأسبوع'))
        return 'week';
    if (active.textContent.includes('الشهر'))
        return 'month';
    return 'day';
}
function getISODateOnly(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return "".concat(y, "-").concat(m, "-").concat(d);
}
function getTopPeriodDates() {
    var _a, _b, _c;
    var period = getTopStudentsPeriod();
    var dayEl = document.getElementById('topStudentsDayDate');
    var weekEl = document.getElementById('topStudentsWeekDate');
    var monthEl = document.getElementById('topStudentsMonth');
    var yearEl = document.getElementById('topStudentsYear');
    if (period === 'day') {
        var dateISO = (dayEl === null || dayEl === void 0 ? void 0 : dayEl.value) || getISODateOnly(new Date());
        return { period: period, dates: [dateISO], title: "\u0623\u0648\u0627\u0626\u0644 \u064A\u0648\u0645 ".concat(dateISO) };
    }
    if (period === 'week') {
        var selectedISO = (weekEl === null || weekEl === void 0 ? void 0 : weekEl.value) || getISODateOnly(new Date());
        var selected = new Date(selectedISO + 'T00:00:00');
        var day = selected.getDay(); // الأحد = 0
        var start = new Date(selected);
        start.setDate(selected.getDate() - day);
        var dates_1 = [];
        for (var i = 0; i < 7; i++) {
            var d = new Date(start);
            d.setDate(start.getDate() + i);
            dates_1.push(getISODateOnly(d));
        }
        return {
            period: period,
            dates: dates_1,
            title: "\u0623\u0648\u0627\u0626\u0644 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 (".concat(dates_1[0], " \u0625\u0644\u0649 ").concat(dates_1[6], ")")
        };
    }
    var month = Number((_a = monthEl === null || monthEl === void 0 ? void 0 : monthEl.value) !== null && _a !== void 0 ? _a : new Date().getMonth());
    var year = Number((_b = yearEl === null || yearEl === void 0 ? void 0 : yearEl.value) !== null && _b !== void 0 ? _b : new Date().getFullYear());
    var workingDays = getMonthWorkingDays(year, month) || [];
    var dates = workingDays.map(function (w) { return w.dateISO; });
    var monthName = ((_c = monthEl === null || monthEl === void 0 ? void 0 : monthEl.options[monthEl.selectedIndex]) === null || _c === void 0 ? void 0 : _c.text) || '';
    return {
        period: period,
        dates: dates,
        title: "\u0623\u0648\u0627\u0626\u0644 \u0634\u0647\u0631 ".concat(monthName, " ").concat(year)
    };
}
function getStudentGradeColorClass(value, maxValue) {
    var max = Number(maxValue);
    var score = Number(value);
    if (!Number.isFinite(score) || !Number.isFinite(max) || max <= 0)
        return 'grade-red';
    var percent = (score / max) * 100;
    if (percent > 70)
        return 'grade-green';
    if (percent > 50)
        return 'grade-yellow';
    return 'grade-red';
}
function renderTopStudents() {
    if (shouldDeferHeavyRender_(['top-students', 'topStudents'])) return;
    var container = document.getElementById('topStudentsClasses');
    var titleEl = document.getElementById('topStudentsPeriodTitle');
    if (!container)
        return;
    var _a = getTopPeriodDates(), period = _a.period, dates = _a.dates, title = _a.title;
    if (titleEl)
        titleEl.textContent = title;
    if (!dates.length) {
        container.innerHTML = '<div class="card-view"><div class="top-student-empty">لا توجد أيام مسجلة في الفترة المحددة.</div></div>';
        return;
    }
    var periodRecords = dailyRecords.filter(function (r) { return r.dateISO && dates.includes(r.dateISO); });
    container.innerHTML = '';
    GENERAL_CLASSES.forEach(function (className) {
        var classStudents = studentsData.filter(function (s) { return s.className === className; });
        var studentsRanked = classStudents.map(function (student) {
            var records = periodRecords.filter(function (r) {
                return r.className === className && r.studentName === student.name;
            });
            var totalScore = records.reduce(function (sum, r) { return sum + getDailyTotal(r); }, 0);
            // المقارنة تكون على متوسط الدرجات في الفترة حتى لا يحصل طالب لديه
            // أيام مسجلة أكثر على أفضلية غير عادلة.
            var average = dates.length ? totalScore / dates.length : 0;
            // التجويد يستخدم ككاسر تعادل فقط.
            var tajweedTotal = records.reduce(function (sum, r) { return sum + Number(r.tajweed || 0); }, 0);
            var tajweedAverage = dates.length ? tajweedTotal / dates.length : 0;
            return {
                name: student.name,
                average: average,
                tajweedAverage: tajweedAverage,
                recordsCount: records.length
            };
        }).sort(function (a, b) {
            var scoreDiff = b.average - a.average;
            if (Math.abs(scoreDiff) > 0.000001)
                return scoreDiff;
            var tajweedDiff = b.tajweedAverage - a.tajweedAverage;
            if (Math.abs(tajweedDiff) > 0.000001)
                return tajweedDiff;
            return a.name.localeCompare(b.name, 'ar');
        });
        var topThree = studentsRanked.slice(0, 3);
        var rows = topThree.length ? topThree.map(function (student, index) {
            var rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            var tajweedPercent = ((student.tajweedAverage / 10) * 100).toFixed(1);
            return "\n        <div class=\"top-student-row\">\n          <div class=\"top-student-rank\">".concat(rankIcon, "</div>\n          <div>\n            <div class=\"top-student-name\">").concat(student.name, "</div>\n            <div class=\"top-student-meta\">\n              \u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u062F\u0631\u062C\u0627\u062A: ").concat(student.average.toFixed(1), " / ").concat(getDailyMax(className), "\n              \u2014 \u0627\u0644\u062A\u062C\u0648\u064A\u062F: ").concat(student.tajweedAverage.toFixed(1), " / 10 (").concat(tajweedPercent, "%)\n            </div>\n          </div>\n          <div class=\"top-student-score\">").concat(student.average.toFixed(1), "</div>\n        </div>\n      ");
        }).join('') : '<div class="top-student-empty">لا يوجد طلاب مسجلون في هذا الفصل.</div>';
        container.innerHTML += "\n      <div class=\"top-student-card\">\n        <h4>\uD83D\uDCDA ".concat(className, "</h4>\n        ").concat(rows, "\n      </div>\n    ");
    });
}
function switchManagerClass(className, event) {
    document.querySelectorAll('#manager-classes-tabs .tab-btn').forEach(function (btn) { return btn.classList.remove('manager-active'); });
    event.target.classList.add('manager-active');
    currentManagerClass = className;
    document.getElementById('mgr-class-name').innerText = className;
    renderManagerView();
}
function renderManagerView() {
    if (shouldDeferHeavyRender_(['manager-view', 'managerView'])) return;
    if (!document.getElementById('manager-tab').classList.contains('active'))
        return;
    var today = document.getElementById('recordDate').value;
    document.getElementById('mgr-today-date').innerText = today;
    var tDaily = document.querySelector('#mgrDailyTable tbody');
    tDaily.innerHTML = '';
    var dailyClassRecs = dailyRecords.filter(function (r) { return r.className === currentManagerClass && r.dateISO === today; })
        .sort(function (a, b) { return a.studentName.localeCompare(b.studentName, 'ar'); });
    if (dailyClassRecs.length === 0) {
        tDaily.innerHTML = '<tr><td colspan="14">لا توجد درجات مسجلة لهذا الصف اليوم.</td></tr>';
    }
    else {
        var mgrFifth = isFifthClass(currentManagerClass);
        dailyClassRecs.forEach(function (r) {
            var _a, _b, _c, _d, _e, _f, _g;
            tDaily.innerHTML += "<tr>\n        <td>".concat(r.dateISO, "</td><td>").concat(r.teacherName, "</td><td style=\"font-weight:bold;\">").concat(r.studentName, "</td>\n        <td>").concat((_a = r.attendance) !== null && _a !== void 0 ? _a : 0, "</td><td>").concat((_b = r.behavior) !== null && _b !== void 0 ? _b : 0).concat(r.behaviorReasonsText ? " <span class=\"behavior-reason-icon\" title=\"\u0639\u0631\u0636 \u0633\u0628\u0628 \u0627\u0644\u062E\u0635\u0645\" onclick=\"wafdeenShowBehaviorReasons('".concat(String(r.behaviorReasonsText).replace(/'/g, "\\'"), "')\">\u2139\uFE0F</span>") : '', "</td><td class=\"fifth-hide-on-class\">").concat((_c = r.newLesson) !== null && _c !== void 0 ? _c : 0, "</td>\n        <td class=\"fifth-hide-on-class\" style=\"color:#e67e22;\">").concat(r.newTopicToday || r.newTopicText || '-', "</td><td class=\"fifth-hide-on-class\">").concat(r.newTopicRecited || '-', "</td><td class=\"fifth-hide-on-class\">").concat((_d = r.oldRevision) !== null && _d !== void 0 ? _d : 0, "</td>\n        <td class=\"fifth-hide-on-class\" style=\"color:#27ae60;\">").concat(r.oldTopicToday || r.oldTopicText || '-', "</td><td class=\"fifth-hide-on-class\">").concat(r.oldTopicRecited || '-', "</td><td>").concat((_e = r.recitation) !== null && _e !== void 0 ? _e : 0, "</td>\n        <td style=\"color:var(--primary-color);\">").concat(r.recitationTopicToday || r.recitationTopic || '-', "</td><td style=\"color:#7d3c98;\">").concat(r.recitationTopicRecited || '-', "</td><td>").concat((_f = r.homework) !== null && _f !== void 0 ? _f : 0, "</td>\n        <td class=\"tajweed-cell\">").concat((_g = r.tajweed) !== null && _g !== void 0 ? _g : 0).concat(Number(r.tajweed || 0) >= 9 ? " \u2605" : "", "</td>\n        <td><strong style=\"color:var(--primary-dark);\">").concat(getDailyTotal(r), "</strong> / ").concat(getDailyMax(r.className), "</td>\n      </tr>");
        });
    }
    var tWeekly = document.querySelector('#mgrWeeklyTable tbody');
    tWeekly.innerHTML = '';
    var selWeek = document.getElementById('mgrWeekSelect').value;
    var weekRecords = dailyRecords.filter(function (r) { return r.className === currentManagerClass && r.dateISO && getWeekKey(r.dateISO) === selWeek; });
    var classStds = studentsData.filter(function (s) { return s.className === currentManagerClass; }).map(function (s) { return s.name; }).sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    if (classStds.length === 0) {
        tWeekly.innerHTML = '<tr><td colspan="9">لا يوجد طلاب مسجلين في هذا الصف</td></tr>';
    }
    else {
        classStds.forEach(function (student) {
            var sRecs = weekRecords.filter(function (r) { return r.studentName === student; });
            var wd = { "الأحد": "-", "الاثنين": "-", "الثلاثاء": "-", "الأربعاء": "-", "الخميس": "-" };
            var stTotal = 0;
            var attTotal = 0;
            sRecs.forEach(function (r) {
                if (wd[r.dayName] !== undefined) {
                    var d = getDailyTotal(r);
                    wd[r.dayName] = d;
                    stTotal += d;
                    attTotal += r.attendance;
                }
            });
            var mgrDailyMax = getDailyMax(currentManagerClass);
            var wAvg = (stTotal / 5).toFixed(1);
            var attPerc = ((attTotal / 50) * 100).toFixed(1);
            var badgeClass = parseFloat(attPerc) >= 75 ? 'badge-blue' : 'badge-yellow';
            tWeekly.innerHTML += "<tr><td style=\"font-weight:bold;\">".concat(student, "</td><td>").concat(wd["الأحد"], "</td><td>").concat(wd["الاثنين"], "</td><td>").concat(wd["الثلاثاء"], "</td><td>").concat(wd["الأربعاء"], "</td><td>").concat(wd["الخميس"], "</td><td><strong>").concat(stTotal, "</strong> / ").concat(mgrDailyMax * 5, "</td><td><strong>").concat(wAvg, "</strong> / ").concat(mgrDailyMax, "</td><td><span class=\"badge ").concat(badgeClass, "\">").concat(attPerc, "%</span></td></tr>");
        });
    }
    var tMonthlyHead = document.querySelector('#mgrMonthlyTable thead');
    var tMonthly = document.querySelector('#mgrMonthlyTable tbody');
    tMonthly.innerHTML = '';
    var selMonth = document.getElementById('mgrMonthSelect').value;
    var selYear = document.getElementById('mgrYearSelect').value;
    var workingDays = getMonthWorkingDays(selYear, selMonth);
    var headerHtml = '<tr><th style="min-width: 150px; position: sticky; right: 0; background: #f8f9fa; z-index: 2;">اسم الطالب/الطالبة</th>';
    workingDays.forEach(function (wd) {
        var parts = wd.dateISO.split('-');
        headerHtml += "<th style=\"font-size:0.75em; padding:4px;\">".concat(wd.dayName, "<br>").concat(parts[2], "/").concat(parts[1], "</th>");
    });
    headerHtml += '<th>أيام الحضور</th><th>مجموع الشهر</th><th>متوسط الشهر</th><th>نسبة التقييم</th></tr>';
    tMonthlyHead.innerHTML = headerHtml;
    var mStds = studentsData.filter(function (s) { return s.className === currentManagerClass; }).map(function (s) { return s.name; }).sort(function (a, b) { return a.localeCompare(b, 'ar'); });
    if (mStds.length === 0) {
        tMonthly.innerHTML = "<tr><td colspan=\"".concat(workingDays.length + 5, "\">\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0635\u0641</td></tr>");
    }
    else {
        mStds.forEach(function (st) {
            var rowHtml = "<tr><td style=\"font-weight:bold; position: sticky; right: 0; background: white; z-index: 1;\">".concat(st, "</td>");
            var tot = 0;
            var attCnt = 0;
            var recCnt = 0;
            workingDays.forEach(function (wd) {
                var rec = dailyRecords.find(function (r) { return r.className === currentManagerClass && r.studentName === st && r.dateISO === wd.dateISO; });
                if (rec) {
                    recCnt++;
                    var dScore = getDailyTotal(rec);
                    tot += dScore;
                    if (rec.attendance > 0)
                        attCnt++;
                    rowHtml += "<td>".concat(dScore, "</td>");
                }
                else {
                    rowHtml += "<td style=\"color:#ccc;\">-</td>";
                }
            });
            var maxPossible = recCnt * 60;
            var mAvg = recCnt > 0 ? (tot / recCnt).toFixed(1) : 0;
            var perc = maxPossible > 0 ? ((tot / maxPossible) * 100).toFixed(1) : 0;
            rowHtml += "<td><strong>".concat(attCnt, "</strong> / ").concat(recCnt || workingDays.length, "</td>");
            rowHtml += "<td><strong>".concat(tot, "</strong></td>");
            rowHtml += "<td style=\"color:var(--primary-color); font-weight:bold;\">".concat(mAvg, "</td>");
            rowHtml += "<td><span class=\"badge ".concat(parseFloat(perc) >= 75 ? 'badge-green' : 'badge-yellow', "\">").concat(perc, "%</span></td></tr>");
            tMonthly.innerHTML += rowHtml;
        });
    }
}
function addBulkStudents() {
    return __awaiter(this, void 0, void 0, function () {
        var rawText, className, namesList, added, failed, namesList_1, namesList_1_1, name, usedCodes, st, e_29, e_30_1;
        var e_30, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    rawText = document.getElementById('bulkStudentNames').value;
                    className = document.getElementById('newStudentClass').value;
                    namesList = rawText.split('\n').map(function (n) { return n.trim(); }).filter(function (n) { return n.length > 0; });
                    if (!namesList.length)
                        return [2 /*return*/, showMessage('app-msg', 'يرجى كتابة أو لصق أسماء الطلاب أولاً', 'error')];
                    if (!useFirebase || !db)
                        return [2 /*return*/, showMessage('app-msg', 'Supabase غير متصل — لم يتم اعتماد إضافة الطلاب', 'error')];
                    added = [];
                    failed = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 10]);
                    namesList_1 = __values(namesList), namesList_1_1 = namesList_1.next();
                    _b.label = 2;
                case 2:
                    if (!!namesList_1_1.done) return [3 /*break*/, 7];
                    name = namesList_1_1.value;
                    usedCodes = new Set(studentsData.map(function (s) { return String(s.loginCode || '').trim().toUpperCase(); }).filter(Boolean));
                    st = { id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6), name: name, className: className, loginCode: generateStudentLoginCode(usedCodes), updatedAt: new Date().toISOString() };
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, firebaseWriteRecord_('students', st.id, st, { merge: true })];
                case 4:
                    _b.sent();
                    added.push(st);
                    return [3 /*break*/, 6];
                case 5:
                    e_29 = _b.sent();
                    console.error('student cloud save:', e_29);
                    failed.push({ name: name, error: e_29 });
                    return [3 /*break*/, 6];
                case 6:
                    namesList_1_1 = namesList_1.next();
                    return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_30_1 = _b.sent();
                    e_30 = { error: e_30_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (namesList_1_1 && !namesList_1_1.done && (_a = namesList_1.return)) _a.call(namesList_1);
                    }
                    finally { if (e_30) throw e_30.error; }
                    return [7 /*endfinally*/];
                case 10:
                    if (added.length)
                        studentsData = __spreadArray(__spreadArray([], __read(studentsData), false), __read(added), false);
                    try {
                        memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
                    }
                    catch (_) { }
                    renderStudentsTable();
                    updateStudentListDropdown();
                    renderClassCards();
                    renderManagerView();
                    renderAttendanceTable();
                    renderClassStatusTable();
                    document.getElementById('bulkStudentNames').value = '';
                    if (failed.length)
                        return [2 /*return*/, showMessage('app-msg', "\u062A\u0645 \u0631\u0641\u0639 ".concat(added.length, " \u0637\u0627\u0644\u0628 \u0644\u0644\u0633\u062D\u0627\u0628\u0629\u060C \u0648\u0641\u0634\u0644 ").concat(failed.length, ". \u0644\u0645 \u064A\u062A\u0645 \u0627\u062D\u062A\u0633\u0627\u0628 \u0627\u0644\u0641\u0627\u0634\u0644."), added.length ? 'info' : 'error')];
                    showMessage('app-msg', "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0648\u0631\u0641\u0639 ".concat(added.length, " \u0637\u0627\u0644\u0628\u060C \u0643\u0644 \u0637\u0627\u0644\u0628 \u0641\u064A \u0645\u0633\u062A\u0646\u062F \u0645\u0633\u062A\u0642\u0644 \u0639\u0644\u0649 Firebase \u2705"), 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function renderClassCards() {
    var container = document.getElementById('class-cards-container');
    if (!container)
        return;
    container.innerHTML = '';
    GENERAL_CLASSES.forEach(function (cName) {
        var classTeachers = teachersData.filter(function (t) { return t.assignedClass === cName || t.assignedClass === 'الكل'; });
        var primaryTeachers = classTeachers.filter(function (t) { return t.center === 'رئيسي' || t.assignedClass === 'الكل'; }).map(function (t) { return t.username; });
        var assistantTeachers = classTeachers.filter(function (t) { return t.center === 'مساعد'; }).map(function (t) { return t.username; });
        var classStudents = studentsData.filter(function (s) { return s.className === cName; })
            .sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
        var studentsHtml = '';
        if (classStudents.length === 0) {
            studentsHtml = '<p style="color:#888; font-size:0.85em; margin: 5px 0;">لا يوجد طلاب مسجلين في هذا الفصل</p>';
        }
        else {
            studentsHtml = '<div style="max-height: 180px; overflow-y: auto; padding-left:5px;">';
            classStudents.forEach(function (s) {
                studentsHtml += "<div class=\"student-item-row\"> <span>\uD83D\uDC64 ".concat(s.name, "</span> <div> <button type=\"button\" class=\"action-btn btn-edit\" style=\"padding:2px 6px; font-size:0.75em; min-width:auto;\" onclick=\"editStudent('").concat(s.id, "')\">\u062A\u0639\u062F\u064A\u0644</button> <button type=\"button\" class=\"action-btn btn-danger\" style=\"padding:2px 6px; font-size:0.75em; min-width:auto;\" onclick=\"deleteStudent('").concat(s.id, "')\">\u062D\u0630\u0641</button> </div> </div>");
            });
            studentsHtml += '</div>';
        }
        container.innerHTML += "\n      <div class=\"class-box\">\n        <h4>\uD83C\uDFEB ".concat(cName, " <span style=\"font-size:0.8em; color:var(--accent-gold-dark);\">(").concat(classStudents.length, " \u0637\u0627\u0644\u0628)</span></h4>\n        <div class=\"teachers-tag-list\">\n          <div><strong>\u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u064A:</strong> ").concat(primaryTeachers.length > 0 ? primaryTeachers.join('، ') : 'غير محدد', "</div>\n          <div><strong>\u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0645\u0633\u0627\u0639\u062F:</strong> ").concat(assistantTeachers.length > 0 ? assistantTeachers.join('، ') : 'غير محدد', "</div>\n        </div>\n        <hr style=\"border:0; border-top:1px dashed #eee; margin:8px 0;\">\n        ").concat(studentsHtml, "\n      </div>\n    ");
    });
}
function editStudent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var student, result, updatedStudent, idx, localUpdated, e_31;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    student = studentsData.find(function (s) { return s.id.toString() === id.toString(); });
                    if (!student)
                        return [2 /*return*/];
                    return [4 /*yield*/, openStudentEditModal(student)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2 /*return*/];
                    updatedStudent = __assign(__assign({}, student), { name: result.name, className: result.className });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    idx = studentsData.findIndex(function (s) { return s.id.toString() === id.toString(); });
                    localUpdated = __assign(__assign({}, updatedStudent), { updatedAt: new Date().toISOString() });
                    if (idx > -1)
                        studentsData[idx] = localUpdated;
                    memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
                    renderStudentsTable();
                    updateStudentListDropdown();
                    renderClassCards();
                    renderManagerView();
                    renderAttendanceTable();
                    renderClassStatusTable();
                    if (!(useFirebase && db)) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.collection("students").doc(id.toString()).set(localUpdated, { merge: true })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    showMessage('app-msg', 'تم تعديل بيانات الطالب بنجاح', 'success');
                    return [3 /*break*/, 6];
                case 5:
                    e_31 = _a.sent();
                    showSiteError('تعذر حفظ تعديل الطالب.');
                    console.error(e_31);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function editTeacher(id) {
    return __awaiter(this, void 0, void 0, function () {
        var teacher, result, duplicate, updatedTeacher, idx, localUpdated, e_32;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    teacher = teachersData.find(function (t) { return t.id.toString() === id.toString(); });
                    if (!teacher)
                        return [2 /*return*/];
                    return [4 /*yield*/, openTeacherEditModal(teacher)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2 /*return*/];
                    duplicate = teachersData.some(function (t) {
                        return t.id.toString() !== id.toString() && t.username === result.username;
                    });
                    if (duplicate)
                        return [2 /*return*/, showSiteError('اسم المستخدم موجود بالفعل لمعلم آخر.')];
                    updatedTeacher = __assign(__assign({}, teacher), { username: result.username, password: result.password, assignedClass: result.assignedClass, center: result.center, canWafdeen: !!result.canWafdeen });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    idx = teachersData.findIndex(function (t) { return t.id.toString() === id.toString(); });
                    localUpdated = __assign(__assign({}, updatedTeacher), { updatedAt: new Date().toISOString() });
                    if (idx > -1)
                        teachersData[idx] = localUpdated;
                    memoryStorage.setItem('teachersData', JSON.stringify(teachersData));
                    renderTeachersTable();
                    renderClassCards();
                    if (!(useFirebase && db)) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.collection("teachers").doc(id.toString()).set(localUpdated, { merge: true })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    showMessage('app-msg', 'تم تعديل بيانات المعلم بنجاح', 'success');
                    return [3 /*break*/, 6];
                case 5:
                    e_32 = _a.sent();
                    showSiteError('تعذر حفظ تعديل المعلم.');
                    console.error(e_32);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteStudent(id) {
    return __awaiter(this, void 0, void 0, function () {
        var student, ok, e_33;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    student = studentsData.find(function (s) { return s.id.toString() === id.toString(); });
                    if (!student)
                        return [2 /*return*/];
                    return [4 /*yield*/, siteConfirm('🗑️ حذف الطالب', "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0637\u0627\u0644\u0628 <strong>".concat(student.name, "</strong> \u0645\u0646 \u0635\u0641 <strong>").concat(student.className, "</strong>.<br>\u0644\u0646 \u064A\u062A\u0645 \u062D\u0630\u0641 \u062F\u0631\u062C\u0627\u062A\u0647 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B."), 'حذف الطالب', true)];
                case 1:
                    ok = _a.sent();
                    if (!ok)
                        return [2 /*return*/];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    if (!useFirebase || !db) throw new Error('Supabase غير متصل');
                    return [4 /*yield*/, deleteFirebaseRecord('students', id)];
                case 3:
                    _a.sent();
                    renderStudentsTable();
                    updateStudentListDropdown();
                    renderClassCards();
                    renderManagerView();
                    renderAttendanceTable();
                    renderClassStatusTable();
                    return [3 /*break*/, 5];
                case 4:
                    studentsData = studentsData.filter(function (s) { return s.id.toString() !== id.toString(); });
                    memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
                    renderStudentsTable();
                    updateStudentListDropdown();
                    renderClassCards();
                    renderManagerView();
                    renderAttendanceTable();
                    renderClassStatusTable();
                    _a.label = 5;
                case 5:
                    showMessage('app-msg', 'تم حذف الطالب بنجاح', 'success');
                    return [3 /*break*/, 7];
                case 6:
                    e_33 = _a.sent();
                    showSiteError('تعذر حذف الطالب.');
                    console.error(e_33);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function renderStudentsTable() {
    var tbody = document.querySelector('#studentsTable tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    var sortedStudents = __spreadArray([], __read(studentsData), false).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    sortedStudents.forEach(function (s) {
        tbody.innerHTML += "<tr> <td style=\"font-weight:bold;\">".concat(s.name, "</td> <td>").concat(s.className, "</td> <td> <button type=\"button\" class=\"action-btn btn-edit\" style=\"padding:3px 8px; min-width:auto;\" onclick=\"editStudent('").concat(s.id, "')\">\u062A\u0639\u062F\u064A\u0644</button> <button type=\"button\" class=\"action-btn btn-danger\" style=\"padding:3px 8px; min-width:auto;\" onclick=\"deleteStudent('").concat(s.id, "')\">\u062D\u0630\u0641</button> </td> </tr>");
    });
    renderStudentCodesTable();
}
var studentCodesClassFilter = 'الكل';
function renderStudentCodesClassFilter() {
    var wrap = document.getElementById('studentCodesClassFilter');
    if (!wrap)
        return;
    var classesInUse = ALL_CLASSES.filter(function (c) { return studentsData.some(function (s) { return s.className === c; }); });
    var options = __spreadArray(['الكل'], __read(classesInUse), false);
    wrap.innerHTML = options.map(function (c) {
        var active = c === studentCodesClassFilter;
        return "<button type=\"button\" class=\"action-btn ".concat(active ? 'btn-save' : 'btn-edit', "\" style=\"padding:5px 12px; min-width:auto; font-size:.85em;\" onclick=\"filterStudentCodesByClass('").concat(c.replace(/'/g, "\\'"), "')\">").concat(c, "</button>");
    }).join('');
}
function filterStudentCodesByClass(className) {
    studentCodesClassFilter = className;
    renderStudentCodesTable();
}
function renderStudentCodesTable() {
    var tbody = document.querySelector('#studentCodesTable tbody');
    if (!tbody)
        return;
    renderStudentCodesClassFilter();
    tbody.innerHTML = '';
    var filtered = studentCodesClassFilter === 'الكل'
        ? studentsData
        : studentsData.filter(function (s) { return s.className === studentCodesClassFilter; });
    var sortedStudents = __spreadArray([], __read(filtered), false).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    if (!sortedStudents.length) {
        tbody.innerHTML = '<tr><td colspan="3">لا يوجد طلاب مسجلون في هذا الصف حالياً</td></tr>';
        return;
    }
    sortedStudents.forEach(function (s) {
        tbody.innerHTML += "<tr>\n      <td style=\"font-weight:bold;\">".concat(s.name, "</td>\n      <td>").concat(s.className, "</td>\n      <td><span class=\"badge badge-blue\" style=\"font-size:.95em;letter-spacing:2px;\">").concat(s.loginCode || '—', "</span></td>\n    </tr>");
    });
}
function generateMissingStudentCodes() {
    return __awaiter(this, void 0, void 0, function () {
        var scopeClass, pool, monthKey, missing, scopeLabel, missing_1, missing_1_1, student, e_34_1, scopeLabel, e_35;
        var e_34, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!currentTeacher || currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    scopeClass = studentCodesClassFilter;
                    pool = scopeClass === 'الكل' ? studentsData : studentsData.filter(function (s) { return s.className === scopeClass; });
                    if (!pool.length) {
                        return [2 /*return*/, showMessage('student-codes-msg', 'لا يوجد طلاب في هذا الصف', 'error')];
                    }
                    monthKey = getCurrentLoginCodeMonth();
                    missing = pool.filter(function (s) { return !s.loginCode; });
                    if (!missing.length) {
                        renderStudentCodesTable();
                        scopeLabel = scopeClass === 'الكل' ? '' : " \u0641\u064A \u0635\u0641 ".concat(scopeClass);
                        return [2 /*return*/, showMessage('student-codes-msg', "\u0643\u0644 \u0627\u0644\u0637\u0644\u0627\u0628".concat(scopeLabel, " \u0644\u062F\u064A\u0647\u0645 \u0623\u0643\u0648\u0627\u062F \u0628\u0627\u0644\u0641\u0639\u0644 \u2705"), 'info')];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 9]);
                    missing_1 = __values(missing), missing_1_1 = missing_1.next();
                    _b.label = 3;
                case 3:
                    if (!!missing_1_1.done) return [3 /*break*/, 6];
                    student = missing_1_1.value;
                    student.loginCode = deterministicStudentLoginCode(student, monthKey);
                    student.loginCodeMonth = monthKey;
                    if (!useFirebase) return [3 /*break*/, 5];
                    return [4 /*yield*/, db.collection("students").doc(student.id.toString()).set(student, { merge: true })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    missing_1_1 = missing_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_34_1 = _b.sent();
                    e_34 = { error: e_34_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (missing_1_1 && !missing_1_1.done && (_a = missing_1.return)) _a.call(missing_1);
                    }
                    finally { if (e_34) throw e_34.error; }
                    return [7 /*endfinally*/];
                case 9:
                    memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
                    renderStudentCodesTable();
                    scopeLabel = scopeClass === 'الكل' ? '' : " (\u0635\u0641 ".concat(scopeClass, ")");
                    showMessage('student-codes-msg', "\u062A\u0645 \u062A\u0648\u0644\u064A\u062F ".concat(missing.length, " \u0643\u0648\u062F \u062A\u0633\u062C\u064A\u0644 \u0639\u0634\u0648\u0627\u0626\u064A \u0648\u0631\u0641\u0639\u0647 \u0639\u0644\u0649 \u0627\u0644\u0633\u062D\u0627\u0628\u0629 \u0628\u0646\u062C\u0627\u062D \u2705").concat(scopeLabel), 'success');
                    return [3 /*break*/, 11];
                case 10:
                    e_35 = _b.sent();
                    console.error(e_35);
                    showMessage('student-codes-msg', 'تعذر حفظ الأكواد على السحابة', 'error');
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function exportStudentLoginCodes() {
    if (!studentsData.length)
        return showMessage('student-codes-msg', 'لا يوجد طلاب لتصدير الأكواد', 'error');
    var rows = __spreadArray([], __read(studentsData), false).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); })
        .map(function (s) { return ({ 'اسم الطالب/الطالبة': s.name, 'الصف': s.className, 'كود تسجيل الدخول': s.loginCode || '' }); });
    var ws = XLSX.utils.json_to_sheet(rows);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'أكواد تسجيل الدخول');
    XLSX.writeFile(wb, "\u0623\u0643\u0648\u0627\u062F_\u062A\u0633\u062C\u064A\u0644_\u0627\u0644\u0637\u0644\u0627\u0628_".concat(new Date().toISOString().slice(0, 10), ".xlsx"));
}
function addTeacher() {
    return __awaiter(this, void 0, void 0, function () {
        var u, p, c, cn, canWafdeen, newTeacher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    u = document.getElementById('newTeacherUser').value.trim();
                    p = document.getElementById('newTeacherPass').value.trim();
                    c = document.getElementById('newTeacherClass').value;
                    cn = document.getElementById('newTeacherCenter').value;
                    canWafdeen = !!document.getElementById('newTeacherWafdeen') && document.getElementById('newTeacherWafdeen').checked;
                    if (!u || !p)
                        return [2 /*return*/, showMessage('app-msg', 'يرجى إدخال البيانات كاملة', 'error')];
                    if (teachersData.some(function (t) { return t.username === u; }))
                        return [2 /*return*/, showMessage('app-msg', 'اسم المستخدم موجود مسبقاً', 'error')];
                    newTeacher = { id: Date.now().toString(), username: u, password: p, assignedClass: c, center: cn, canWafdeen: canWafdeen };
                    teachersData.push(__assign(__assign({}, newTeacher), { updatedAt: new Date().toISOString() }));
                    memoryStorage.setItem('teachersData', JSON.stringify(teachersData));
                    renderTeachersTable();
                    renderClassCards();
                    if (!(useFirebase && db)) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.collection("teachers").doc(newTeacher.id).set(newTeacher, { merge: true })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    showMessage('app-msg', 'تم إضافة المعلم/المعلمة بنجاح', 'success');
                    document.getElementById('newTeacherUser').value = '';
                    document.getElementById('newTeacherPass').value = '';
                    if (document.getElementById('newTeacherWafdeen')) document.getElementById('newTeacherWafdeen').checked = false;
                    return [2 /*return*/];
            }
        });
    });
}
function renderTeachersTable() {
    var tbody = document.querySelector('#teachersTable tbody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    teachersData.forEach(function (t) {
        var actions = t.username === 'admin' ? '<span style="color:gray;">مدير النظام الرئيسي</span>' :
            "<button type=\"button\" class=\"action-btn btn-edit\" style=\"padding:3px 8px; min-width:auto;\" onclick=\"editTeacher('".concat(t.id, "')\">\u062A\u0639\u062F\u064A\u0644</button> <button type=\"button\" class=\"action-btn btn-danger\" style=\"padding:3px 8px; min-width:auto;\" onclick=\"deleteTeacher('").concat(t.id, "')\">\u062D\u0630\u0641</button>");
        tbody.innerHTML += "<tr><td style=\"font-weight:bold;\">".concat(t.username, "</td><td>").concat(t.password, "</td><td>").concat(t.assignedClass, "</td><td>").concat(t.canWafdeen ? '✅ مسموح' : '—', "</td><td>").concat(t.center, "</td><td>").concat(actions, "</td></tr>");
    });
}
function deleteTeacher(id) {
    return __awaiter(this, void 0, void 0, function () {
        var teacherToDelete, ok, e_36;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (currentTeacher.username !== 'admin')
                        return [2 /*return*/];
                    teacherToDelete = teachersData.find(function (t) { return t.id.toString() === id.toString(); });
                    if (!teacherToDelete)
                        return [2 /*return*/];
                    if (teacherToDelete.username === 'admin') {
                        return [2 /*return*/, showMessage('app-msg', 'لا يمكن حذف حساب المدير الرئيسي', 'error')];
                    }
                    return [4 /*yield*/, siteConfirm('🗑️ حذف المعلم / المعلمة', "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u062D\u0633\u0627\u0628 <strong>".concat(teacherToDelete.username, "</strong> \u0646\u0647\u0627\u0626\u064A\u0627\u064B \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0639\u0644\u0645\u064A\u0646."), 'حذف الحساب', true)];
                case 1:
                    ok = _a.sent();
                    if (!ok)
                        return [2 /*return*/];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    if (!useFirebase || !db) throw new Error('Supabase غير متصل');
                    return [4 /*yield*/, deleteFirebaseRecord('teachers', id)];
                case 3:
                    _a.sent();
                    renderTeachersTable();
                    renderClassCards();
                    return [3 /*break*/, 5];
                case 4:
                    teachersData = teachersData.filter(function (t) { return t.id.toString() !== id.toString(); });
                    memoryStorage.setItem('teachersData', JSON.stringify(teachersData));
                    renderTeachersTable();
                    renderClassCards();
                    _a.label = 5;
                case 5:
                    showMessage('app-msg', 'تم حذف المعلم بنجاح', 'success');
                    return [3 /*break*/, 7];
                case 6:
                    e_36 = _a.sent();
                    showSiteError('تعذر حذف المعلم.');
                    console.error(e_36);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/* ================= الملاحظات ================= */
function getAllowedClassesForCurrentUser() {
    return GENERAL_CLASSES;
}
function populateNotesClasses() {
    var sel = document.getElementById('notesClassSelect');
    if (!sel)
        return;
    var allowed = getAllowedClassesForCurrentUser();
    var current = sel.value;
    sel.innerHTML = allowed.map(function (c) { return "<option value=\"".concat(c, "\">").concat(c, "</option>"); }).join('');
    if (allowed.includes(current))
        sel.value = current;
    updateNotesStudentList();
}
function updateNotesStudentList() {
    var classSel = document.getElementById('notesClassSelect');
    var studentSel = document.getElementById('notesStudentSelect');
    if (!classSel || !studentSel)
        return;
    var className = classSel.value;
    var current = studentSel.value;
    var students = studentsData.filter(function (s) { return s.className === className; }).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    studentSel.innerHTML = students.length
        ? students.map(function (st) { return "<option value=\"".concat(st.name, "\">").concat(st.name, "</option>"); }).join('')
        : '<option value="">لا توجد أسماء مسجلة في هذا الصف</option>';
    if (students.some(function (st) { return st.name === current; }))
        studentSel.value = current;
}
function canAccessNote(note) {
    return !!currentTeacher && ALL_CLASSES.includes(note.className);
}
function saveNote() {
    return __awaiter(this, void 0, void 0, function () {
        var className, studentName, dateISO, text, note, e_37;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    className = document.getElementById('notesClassSelect').value;
                    studentName = document.getElementById('notesStudentSelect').value;
                    dateISO = document.getElementById('noteDate').value;
                    text = document.getElementById('noteText').value.trim();
                    if (!className || !studentName || !dateISO || !text)
                        return [2 /*return*/, showMessage('app-msg', 'يرجى اختيار الصف والطالب والتاريخ وكتابة الملاحظة.', 'error')];
                    note = {
                        id: "note_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8)),
                        className: className,
                        studentName: studentName,
                        dateISO: dateISO,
                        text: text,
                        teacherName: currentTeacher.username,
                        createdAt: new Date().toISOString()
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!useFirebase) return [3 /*break*/, 3];
                    return [4 /*yield*/, firebaseWriteRecord_('notes', note.id, note, { merge: true })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3: throw new Error('Supabase غير متصل');
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_37 = _a.sent();
                    console.error('Firebase note save error:', e_37);
                    return [2 /*return*/, showMessage('app-msg', 'تعذر حفظ الملاحظة على Supabase. لم يتم اعتماد الحفظ.', 'error')];
                case 6:
                    notesData.push(note);
                    try {
                        memoryStorage.setItem('notesData', JSON.stringify(notesData));
                    }
                    catch (_) { }
                    renderNotesTable();
                    document.getElementById('noteText').value = '';
                    showMessage('app-msg', 'تم حفظ الملاحظة على Firebase بنجاح ✨', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function deleteNote(id) {
    return __awaiter(this, void 0, void 0, function () {
        var note, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    note = notesData.find(function (n) { return String(n.id) === String(id); });
                    if (!note || !canAccessNote(note))
                        return [2 /*return*/, showMessage('app-msg', 'ليس لديك صلاحية حذف هذه الملاحظة.', 'error')];
                    return [4 /*yield*/, siteConfirm('🗑️ حذف الملاحظة', "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 <strong>".concat(note.studentName, "</strong>."), 'حذف الملاحظة', true)];
                case 1:
                    ok = _a.sent();
                    if (!ok)
                        return [2 /*return*/];
                    if (!useFirebase || !db) throw new Error('Supabase غير متصل');
                    return [4 /*yield*/, deleteFirebaseRecord('notes', String(note.id))];
                case 2:
                    _a.sent();
                    renderNotesTable();
                    return [3 /*break*/, 4];
                case 3:
                    notesData = notesData.filter(function (n) { return String(n.id) !== String(id); });
                    memoryStorage.setItem('notesData', JSON.stringify(notesData));
                    renderNotesTable();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderNotesTable() {
    var _a;
    var tbody = document.querySelector('#notesTable tbody');
    if (!tbody)
        return;
    var q = (((_a = document.getElementById('searchNotes')) === null || _a === void 0 ? void 0 : _a.value) || '').trim().toLowerCase();
    var visible = notesData.filter(canAccessNote).filter(function (n) { return !q || "".concat(n.studentName, " ").concat(n.className, " ").concat(n.text).toLowerCase().includes(q); }).sort(function (a, b) { return String(b.dateISO).localeCompare(String(a.dateISO)); });
    tbody.innerHTML = visible.length ? visible.map(function (n) { return "\n    <tr>\n      <td>".concat(n.dateISO || '-', "</td>\n      <td>").concat(n.className || '-', "</td>\n      <td style=\"font-weight:bold;\">").concat(n.studentName || '-', "</td>\n      <td style=\"text-align:right;white-space:pre-wrap;\">").concat(String(n.text || '-').replace(/</g, '&lt;'), "</td>\n      <td>").concat(n.teacherName || '-', "</td>\n      <td><button type=\"button\" class=\"action-btn btn-danger\" style=\"min-width:90px;padding:6px 10px;\" onclick=\"deleteNote('").concat(String(n.id).replace(/'/g, "\\'"), "')\">\uD83D\uDDD1\uFE0F \u062D\u0630\u0641</button></td>\n    </tr>"); }).join('') : '<tr><td colspan="6" style="padding:25px;color:#777;">لا توجد ملاحظات مسجلة.</td></tr>';
}
/* ================= دوال النسخ الاحتياطي والاستعادة ================= */
/* -------- أدوات مساعدة عامة لتصدير/استيراد الإكسل -------- */
function exportJsonToExcel(dataArray, headerMap, filename) {
    var rows = dataArray.map(function (item) {
        var row = {};
        headerMap.forEach(function (_a) {
            var _b = __read(_a, 2), header = _b[0], key = _b[1];
            var v = item[key];
            row[header] = (v === undefined || v === null) ? '' : v;
        });
        return row;
    });
    var ws = XLSX.utils.json_to_sheet(rows);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename + ".xlsx");
}
function readExcelFile(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var data = new Uint8Array(e.target.result);
                var wb = XLSX.read(data, { type: 'array' });
                var sheet = wb.Sheets[wb.SheetNames[0]];
                var json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                resolve(json);
            }
            catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
function mapRowsToObjects(rows, headerMap) {
    return rows.map(function (row) {
        var obj = {};
        headerMap.forEach(function (_a) {
            var _b = __read(_a, 2), header = _b[0], key = _b[1];
            obj[key] = (row[header] === undefined) ? '' : row[header];
        });
        return obj;
    });
}
/* ============================================================
   نظام "تحويل الدرجات" — قراءة إكسل النتائج مع الحفاظ على شكل الملف
   ============================================================ */
function normalizeExcelHeaderKey_(header) {
    return String(header == null ? '' : header)
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
        .replace(/[ـ]/g, '')
        .replace(/[إأآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/[\u200f\u200e]/g, '')
        .replace(/[\s\-_–—:：.،,؛;\/\\|()[\]{}]+/g, '')
        .trim()
        .toLowerCase();
}
function normalizeResultHeaderName(header) {
    var original = String(header == null ? '' : header).trim();
    var k = normalizeExcelHeaderKey_(original);
    if (!k) return '';

    // التحريري خاص بنتائج الطلاب العاديين ويُحفظ لعرضه لهم.
    // التمهيدي لا يعرضه، لكن وجوده في Excel لا يسبب كسر القراءة.
    if (k.includes('تحريري')) return 'نسبة التحريري';
    if (k.includes('تجريبي')) return '';

    // أسماء ملف المستخدم الفعلية: نسمح بـ "كلي" و"لكلي" و"الكلي"
    // ونقرأ القيمة كما هي من الخلية دون إعادة حسابها.
    if (k.includes('مجموع') && k.includes('عربي') && k.includes('حساب')) {
        return 'المجموع الكلي العربي والحساب';
    }

    if (k.includes('مجموع') && (k.includes('قران') || k.includes('قرآن')) &&
        (k.includes('كلي') || k.includes('لكلي') || k.includes('مجموع'))) {
        return 'المجموع الكلي للقرآن';
    }

    // السرد في الملف المرفوع مكتوب "انسبة السرد"، لذلك نعتمد على المعنى.
    if (k.includes('سرد')) return 'نسبة السرد';
    if (k.includes('شفوي')) return 'نسبة الشفوي';
    if (k.includes('عربي') && (k.includes('نسبه') || k === 'عربي')) return 'نسبة العربي';
    if (k.includes('حساب') && (k.includes('نسبه') || k === 'حساب')) return 'نسبة الحساب';

    var aliases = {};
    function add(names, canonical) {
        names.forEach(function(n) {
            aliases[normalizeExcelHeaderKey_(n)] = canonical;
        });
    }

    add(['اسم الطالب','اسم الطالبة','اسم الطالب والطالبة','الاسم','الطالب'], 'الاسم');
    add(['الفصل','الصف','العام','السنة','السنـة'], 'السنة');
    add(['كود الطالب','كود تسجيل الدخول','الكود','كود النتيجة'], 'الطالب بالكود');
    add(['نسبة السرد','انسبة السرد','السرد'], 'نسبة السرد');
    add(['نسبة الشفوي','الشفوي'], 'نسبة الشفوي');
    add(['نسبة التحريري','التحريري','نسبة تحريري'], 'نسبة التحريري');
    add(['نسبة العربي','العربي'], 'نسبة العربي');
    add(['نسبة الحساب','الحساب'], 'نسبة الحساب');
    add(['المجموع لكلي للقران','المجموع لكلي للقرآن','المجموع الكلي للقران','المجموع الكلي للقرآن'], 'المجموع الكلي للقرآن');
    add(['المجموع لكلي عربي والحساب','المجموع لكلي للعربي والحساب','المجموع الكلي عربي والحساب','المجموع الكلي للعربي والحساب'], 'المجموع الكلي العربي والحساب');
    add(['التقدير'], 'التقدير');
    add(['النتيجة'], 'النتيجة');
    add(['نوع الطالب','نوع'], 'نوع الطالب');
    add(['كود النتيجة'], 'كود النتيجة');
    add(['شهر النتيجة'], 'شهر النتيجة');

    return aliases[k] || original;
}

function isMonthlyPercentageField_(field) {
    var f = normalizeExcelHeaderKey_(field);
    return f.includes('سرد') ||
        f.includes('شفوي') ||
        f.includes('تحريري') ||
        f.includes('تجريبي') ||
        f.includes('نسبهعربي') || f === 'عربي' ||
        f.includes('نسبهحساب') || f === 'حساب' ||
        (f.includes('مجموع') && f.includes('عربي') && f.includes('حساب')) ||
        (f.includes('مجموع') && (f.includes('قران') || f.includes('قرآن'))) ||
        f === normalizeExcelHeaderKey_('المجموع الكلي') || f === normalizeExcelHeaderKey_('المجموع') ||
        f === normalizeExcelHeaderKey_('النسبة الكلية') || f === normalizeExcelHeaderKey_('الإجمالي');
}
function normalizeMonthlyPercentageValue_(value) {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'string') {
        value = value.trim().replace(/٪/g, '%').replace(/,/g, '');
        if (value.endsWith('%')) value = value.slice(0, -1).trim();
    }
    var n = Number(value);
    if (!isFinite(n)) return value;
    if (Math.abs(n) > 1) n = n / 100;
    return Math.max(0, Math.min(1, n));
}
function formatMonthlyPercentage_(value) {
    if (value === null || value === undefined || value === '') return '';
    var raw = String(value).replace(/٪/g, '%').replace('%', '').replace(/,/g, '').trim();
    var n = Number(raw);
    if (!isFinite(n)) return String(value);
    if (Math.abs(n) > 1) n = n / 100;
    return (n * 100).toFixed(2) + '%';
}
function normalizeResultFields(row) {
    var fields = {};
    var rawFields = {};

    Object.keys(row || {}).forEach(function(header) {
        var originalHeader = String(header == null ? '' : header).trim();
        var value = row[header];

        // نحتفظ بكل خلية أصلية حتى لا تضيع أي خانة عند التصدير.
        rawFields[originalHeader] = value;

        var cleanHeader = normalizeResultHeaderName(originalHeader);
        if (!cleanHeader) return;

        var normalizedValue = isMonthlyPercentageField_(cleanHeader)
            ? normalizeMonthlyPercentageValue_(value)
            : value;

        // إذا تكرر نفس العنوان، لا نستبدل قيمة صحيحة بقيمة فارغة.
        if (fields[cleanHeader] === undefined ||
            fields[cleanHeader] === null ||
            fields[cleanHeader] === '') {
            fields[cleanHeader] = normalizedValue;
        }
    });

    // استخراج احتياطي مباشر من كل عناوين Excel الأصلية.
    // هذا مهم خصوصاً لعمودي "المجموع الكلي عربي والحساب" و"المجموع الكلي للقرآن".
    var rawKeys = Object.keys(rawFields);

    function findRawByMeaning_(kind) {
        for (var i = 0; i < rawKeys.length; i++) {
            var hk = normalizeExcelHeaderKey_(rawKeys[i]);
            if (kind === 'arabicMath' &&
                hk.includes('مجموع') && hk.includes('عربي') && hk.includes('حساب')) {
                return rawFields[rawKeys[i]];
            }
            if (kind === 'quran' &&
                hk.includes('مجموع') && (hk.includes('قران') || hk.includes('قرآن')) &&
                (hk.includes('كلي') || hk.includes('لكلي') || hk.includes('مجموع'))) {
                return rawFields[rawKeys[i]];
            }
            if (kind === 'quran' &&
                hk.includes('نسبه') && (hk.includes('قران') || hk.includes('قرآن'))) {
                return rawFields[rawKeys[i]];
            }
        }
        return '';
    }

    var arabicMathRaw = findRawByMeaning_('arabicMath');
    if (arabicMathRaw !== '' && arabicMathRaw !== null && arabicMathRaw !== undefined) {
        fields['المجموع الكلي العربي والحساب'] = normalizeMonthlyPercentageValue_(arabicMathRaw);
    }

    var quranRaw = findRawByMeaning_('quran');
    if (quranRaw !== '' && quranRaw !== null && quranRaw !== undefined) {
        fields['المجموع الكلي للقرآن'] = normalizeMonthlyPercentageValue_(quranRaw);
    }

    // نخزن نسخة أصلية داخل الكائن لاستخدامها في التصدير، مع استبعادها من العرض.
    fields.__excelRawFields = rawFields;
    return fields;
}

function getResultStudentName(fields) {
    var names = Object.keys(fields || {});
    var nameField = names.find(function (f) { return f.includes('اسم') || f === 'الطالب'; });
    return nameField ? String(fields[nameField] == null ? '' : fields[nameField]).trim() : '';
}
function normalizePersonNameForMatch(v) {
    return String(v == null ? '' : v).trim().replace(/\s+/g, ' ');
}
function getMonthlyFieldValue_(fields, aliases) {
    var keys = Object.keys(fields || {}).filter(function(k) { return k !== '__excelRawFields'; });

    // أولاً المطابقة المباشرة.
    for (var i = 0; i < aliases.length; i++) {
        var exact = keys.find(function(k) {
            return String(k).trim() === String(aliases[i]).trim();
        });
        if (exact != null && fields[exact] !== '' && fields[exact] !== null && fields[exact] !== undefined) {
            return fields[exact];
        }
    }

    // ثم المطابقة بعد تنظيف العربية من المسافات والاختلافات الإملائية.
    var normalizedAliases = aliases.map(function(a){ return normalizeExcelHeaderKey_(a); });
    for (var j = 0; j < normalizedAliases.length; j++) {
        var ak = normalizedAliases[j];
        var found = keys.find(function(k) { return normalizeExcelHeaderKey_(k) === ak; });
        if (found != null && fields[found] !== '' && fields[found] !== null && fields[found] !== undefined) {
            return fields[found];
        }
    }

    // وأخيراً مطابقة جزئية آمنة.
    for (var q = 0; q < normalizedAliases.length; q++) {
        var part = normalizedAliases[q];
        if (!part) continue;
        var partial = keys.find(function(k) {
            return normalizeExcelHeaderKey_(k).includes(part) &&
                   fields[k] !== '' && fields[k] !== null && fields[k] !== undefined;
        });
        if (partial != null) return fields[partial];
    }
    return '';
}

function monthlyResultIsAbsent_(fields) {
    var all = Object.keys(fields || {}).map(function(k){ return String(fields[k] == null ? '' : fields[k]).trim().toLowerCase(); }).join(' | ');
    return /لم\s*يحضر|لم يحضر|غائب|غياب|absent|not present|لم\s*يحضر\s*الطالب/.test(all);
}
function monthlyResultIsPassed_(grade, total) {
    var g = String(grade == null ? '' : grade).trim().toLowerCase();
    if (/ناجح|نجاح|passed|pass/.test(g)) return true;
    if (/راسب|رسوب|failed|fail/.test(g)) return false;
    var n = Number(total);
    return !isNaN(n) && (n <= 1 ? n * 100 : n) >= 50;
}
function stopResultEffects_() {
    document.body.classList.remove('monthly-result-fail');
    var old = document.getElementById('monthlyResultFireworks');
    if (old) old.remove();
}
function launchResultFireworks_() {
    stopResultEffects_();
    var box = document.createElement('div');
    box.id = 'monthlyResultFireworks';
    box.className = 'monthly-result-fireworks';
    for (var i = 0; i < 70; i++) {
        var p = document.createElement('span');
        p.className = 'firework-piece';
        p.textContent = ['🎉','🚀','✨','🎊'][i % 4];
        p.style.left = (5 + Math.random() * 90) + '%';
        p.style.top = (5 + Math.random() * 35) + '%';
        p.style.animationDelay = (Math.random() * 0.7) + 's';
        box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function(){ if(box.parentNode) box.remove(); }, 3200);
}
function renderMonthlyResultCards(result, preparatoryOnly) {
    var requestedPrep = typeof preparatoryOnly === 'boolean' ? preparatoryOnly : isPreparatoryResult_(result);
    var displayId = requestedPrep ? 'preparatoryResultDisplayArea' : 'studentResultDisplayArea';
    var displayArea = document.getElementById(displayId) || getVisibleResultElement_('resultDisplayArea') || document.getElementById('studentPortalArea');
    if (!displayArea || !result) return;
    stopResultEffects_();
    displayArea.innerHTML = '';
    if (isPreparatoryResult_(result) !== !!requestedPrep) {
        showMessage('results-msg', requestedPrep ? 'هذا الكود يخص طالبًا عاديًا، استخدم شاشة الطلاب.' : 'هذا الكود يخص طالبًا تمهيديًا، استخدم شاشة التمهيدي.', 'error');
        return;
    }
    var fields = result.fields || {};
    if (monthlyResultIsAbsent_(fields)) {
        displayArea.innerHTML = '<p style="text-align:center;color:#a33;padding:15px;">لا توجد نتيجة مسجلة لهذا الطالب.</p>';
        return;
    }
    function val(keys) { return getMonthlyFieldValue_(fields, keys); }
    var name = val(['الاسم','اسم الطالب','الطالب','اسم']);
    var className = val(['السنة','الفصل','الصف','العام']);
    var teacher = val(['المدرس','المعلم','المعلّم']);
    var studentCode = getResultStudentCode_(result);
    var narration = val(['نسبة السرد','السرد']);
    var oral = val(['نسبة الشفوي','الشفوي']);
    var written = val(['نسبة التحريري','التحريري','نسبة تحريري']);
    var arabic = val(['نسبة العربي','العربي']);
    var math = val(['نسبة الحساب','الحساب']);
    var combined = val(['المجموع الكلي العربي والحساب','المجموع الكلي عربي والحساب','المجموع لكلي عربي والحساب','المجموع لكلي للعربي والحساب']);
    var total = val(['المجموع الكلي للقرآن','المجموع الكلي للقران','المجموع لكلي للقران','المجموع لكلي للقرآن','نسبة المجموع الكلي للقرآن','المجموع الكلي','المجموع','النسبة الكلية','الإجمالي']);
    var grade = val(['التقدير','النتيجة']);
    var passed = monthlyResultIsPassed_(grade, total);

    var box = document.createElement('div');
    box.className = 'result-display-v17-wrap student-result-whitelist';
    var title = document.createElement('div');
    title.className = 'result-display-v17-title';
    title.textContent = requestedPrep ? 'نتيجة الطالب التمهيدي' : 'نتيجة الطالب';
    box.appendChild(title);
    if (result.monthKey) {
        var month = document.createElement('div');
        month.className = 'monthly-result-month';
        month.textContent = 'نتيجة شهر: ' + String(result.monthKey);
        box.appendChild(month);
    }
    var rows = [
        ['الاسم', name, false],
        ['الصف', className, false],
        ['المدرس', teacher, false],
        ['كود الطالب', studentCode, false],
        ['نسبة السرد', narration, true],
        ['نسبة الشفوي', oral, true]
    ];
    if (requestedPrep) {
        rows.push(['نسبة العربي', arabic, true]);
        rows.push(['نسبة الحساب', math, true]);
        rows.push(['المجموع الكلي للعربي والحساب', combined, true]);
    } else {
        rows.push(['نسبة التحريري', written, true]);
    }
    rows.push(['المجموع الكلي', total, true]);
    var grid = document.createElement('div');
    grid.className = 'result-display-v17-grid';
    rows.forEach(function(row) {
        var card = document.createElement('div');
        card.className = 'result-display-v17-row';
        var label = document.createElement('div');
        label.className = 'result-display-v17-label';
        label.textContent = row[0];
        var value = document.createElement('div');
        value.className = 'result-display-v17-value';
        value.textContent = row[2] ? formatMonthlyPercentage_(row[1]) : String(row[1] == null ? '' : row[1]);
        card.appendChild(label); card.appendChild(value); grid.appendChild(card);
    });
    box.appendChild(grid);
    displayArea.innerHTML = '';
    displayArea.appendChild(box);
    displayArea.classList.remove('monthly-result-pass','monthly-result-fail-card');
    displayArea.classList.add(passed ? 'monthly-result-pass' : 'monthly-result-fail-card');
    if (!passed) document.body.classList.add('monthly-result-fail');
    setTimeout(function(){ try { box.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e){} }, 50);
}

async function firebaseFindResultByCode_(code) {
    if (!useFirebase || !db) return null;
    var normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return null;
    try {
        var direct = await db.collection('results').doc(normalized).get();
        if (direct.exists) return Object.assign({ id: direct.id }, direct.data() || {});
    } catch (e) { console.warn('direct result lookup failed:', e); }
    try {
        var snap = await db.collection('results').where('code', '==', normalized).get();
        if (!snap.empty) { var d=snap.docs[0]; return Object.assign({id:d.id}, d.data()||{}); }
    } catch(e2) { console.warn('code result lookup failed:',e2); }
    try {
        var snap2 = await db.collection('results').where('studentCode', '==', normalized).get();
        if (!snap2.empty) { var sd=snap2.docs[0]; return Object.assign({id:sd.id}, sd.data()||{}); }
    } catch(e3) { console.warn('studentCode result lookup failed:',e3); }
    // fallback قوي: نقرأ النتائج ونطابق الكود حتى لو كان محفوظاً داخل fields بعنوان مختلف.
    try {
        var all = await db.collection('results').get();
        for (var i=0;i<all.docs.length;i++) {
            var item = Object.assign({id:all.docs[i].id}, all.docs[i].data()||{});
            var candidates = [item.code,item.studentCode];
            var f=item.fields||{};
            Object.keys(f).forEach(function(k){
                var nk=normalizeExcelHeaderKey_(k);
                if (nk==='الطالببالكود' || nk==='كودالطالب' || nk==='كودتسجيلالدخول' || nk==='الكود' || nk==='كودالنتيجه') candidates.push(f[k]);
            });
            if (candidates.some(function(v){ return String(v==null?'':v).trim().toUpperCase()===normalized; })) return item;
        }
    } catch(e4) { console.warn('broad result lookup failed:',e4); }
    return null;
}
async function attachResultCodeToStudent_(result) {
    var name = getResultStudentName(result.fields);
    if (!name || !useFirebase || !db) return;
    var wanted = normalizePersonNameForMatch(name);
    var snap = await db.collection('students').get();
    var matches = snap.docs.filter(function (d) {
        var st = d.data() || {};
        return normalizePersonNameForMatch(st.name) === wanted;
    });
    // إذا كان الاسم فريدًا، نربط الكود بالطالب حتى يمكن استخدامه من خانة كود الطالب.
    if (matches.length === 1) {
        var ref = matches[0].ref;
        var st = matches[0].data() || {};
        var codes = Object.assign({}, st.resultCodes || {});
        codes[result.monthKey || 'current'] = result.code;
        await ref.set({ resultCodes: codes, monthlyResultCode: result.code, monthlyResultMonth: result.monthKey || '' }, { merge: true });
    }
}
function isPreparatoryResult_(result) {
    var fields = result && result.fields ? result.fields : {};
    var year = getMonthlyFieldValue_(fields, ['السنة', 'الفصل', 'الصف', 'العام']);
    var type = getMonthlyFieldValue_(fields, ['نوع الطالب', 'نوع']);
    var value = String(type || year || '').trim().toLowerCase();
    return /تمهيد|تمهيدي|تمهيدى|prepar/.test(value);
}
function getResultStudentCode_(result) {
    if (!result) return '';
    var direct = String(result.studentCode || '').trim().toUpperCase();
    if (direct) return direct;
    var fromFields = getMonthlyFieldValue_(result.fields || {}, ['الطالب بالكود', 'كود الطالب', 'الكود']);
    return String(fromFields || '').trim().toUpperCase();
}
function setResultStudentCode_(result, code) {
    if (!result) return;
    result.studentCode = String(code || '').trim().toUpperCase();
    result.fields = result.fields || {};
    result.fields['الطالب بالكود'] = result.studentCode;
}
function collectAllStudentResultCodes_() {
    var used = new Set();
    (studentsData || []).forEach(function(s) {
        var c = String(s.loginCode || '').trim().toUpperCase();
        if (c) used.add(c);
    });
    (resultsData || []).forEach(function(r) {
        var c = getResultStudentCode_(r);
        if (c) used.add(c);
    });
    return used;
}
function normalizeClassForMatch_(v) {
    return normalizeExcelHeaderKey_(v)
        .replace(/اولاد|بنين/g,'ولد')
        .replace(/بنات|بنات/g,'بنت')
        .replace(/تمهيدى|تمهيدي/g,'تمهيدي');
}
function findStudentForResult_(result) {
    var fields = result && result.fields ? result.fields : {};
    var name = normalizePersonNameForMatch(getResultStudentName(fields));
    if (!name) return null;
    var className = normalizeClassForMatch_(getMonthlyFieldValue_(fields, ['السنة','الفصل','الصف','العام']));
    var type = !!isPreparatoryResult_(result);
    var all = (studentsData || []).filter(function(st){
        return normalizePersonNameForMatch(st.name) === name;
    });
    if (!all.length) return null;
    var typed = all.filter(function(st){
        var stClass = String(st.className || st.assignedClass || st.type || '');
        var stPrep = /تمهيد|تمهيدي|تمهيدى|prepar/i.test(stClass);
        return stPrep === type;
    });
    if (typed.length) all = typed;
    if (className) {
        var classMatches = all.filter(function(st){
            var sc = normalizeClassForMatch_(st.className || st.assignedClass || '');
            return sc && (sc === className || sc.includes(className) || className.includes(sc));
        });
        if (classMatches.length) all = classMatches;
    }
    // إذا كان الاسم فريداً بعد تطبيق النوع/الفصل نستخدم نفس كود الطالب المسجل.
    // لا نولد كوداً عشوائياً لطالب معروف في النظام.
    return all.length === 1 ? all[0] : null;
}
function generateMissingResultStudentCodes_(preparatoryOnly) {
    var used = collectAllStudentResultCodes_();
    var changed = 0;
    (resultsData || []).forEach(function(result) {
        if (isPreparatoryResult_(result) !== !!preparatoryOnly) return;
        var current = getResultStudentCode_(result);
        if (current) return;
        var student = findStudentForResult_(result);
        var existing = student && String(student.loginCode || '').trim().toUpperCase();
        var code = existing;
        if (code) {
            // كود الطالب الحالي هو المرجع الصحيح، حتى لو كان مستخدماً في سجله نفسه.
            setResultStudentCode_(result, code);
            changed++;
            return;
        }
        code = generateStudentLoginCode(used);
        setResultStudentCode_(result, code);
        changed++;
    });
    memoryStorage.setItem('resultsData', JSON.stringify(resultsData || []));
    return changed;
}
function generateStudentResultCodes(preparatoryOnly) {
    var typeResults = (resultsData || []).filter(function(r){ return isPreparatoryResult_(r) === !!preparatoryOnly; });
    if (!typeResults.length)
        return showMessage('results-admin-msg', preparatoryOnly ? 'لا توجد نتائج مستوردة لطلاب التمهيدي لتوليد الأكواد لها' : 'لا توجد نتائج مستوردة للطلاب لتوليد الأكواد لها', 'error');
    var changed = generateMissingResultStudentCodes_(!!preparatoryOnly);
    renderResultsAdminSummary();
    // التنزيل يتم فوراً من نفس ضغطة الزر لتفادي منع المتصفح للتنزيلات التي تأتي بعد انتظار Supabase.
    try {
        exportResultsCodesExcel(!!preparatoryOnly);
        showMessage('results-admin-msg', 'تم توليد/تثبيت ' + changed + ' كود وتنزيل Excel بكل البيانات 📥', 'success');
    } catch (e) {
        console.error('Excel export after code generation failed:', e);
        showMessage('results-admin-msg', 'تم توليد الأكواد محلياً، لكن تعذر تنزيل Excel: ' + (e.message || e), 'error');
    }
    if (useFirebase && db) {
        var targets = (resultsData || []).filter(function(r) {
            return isPreparatoryResult_(r) === !!preparatoryOnly && getResultStudentCode_(r);
        });
        return Promise.all(targets.map(function(r) {
            return db.collection('results').doc(String(r.code)).set({
                code: r.code, studentCode: r.studentCode, studentType: r.studentType || (preparatoryOnly ? 'تمهيدي' : 'طالب'),
                fields: r.fields, monthKey: r.monthKey || ''
            }, { merge: true });
        })).then(function(){
            return Promise.all(targets.map(function(r){ return attachResultCodeToStudent_(r).catch(function(){}); }));
        }).catch(function(e){ console.error('Firebase save result codes:', e); });
    }
}
function readResultsExcelFilePreserveShape(file) {
    return new Promise(function(resolve, reject) {
        if (!file) return reject(new Error('لم يتم اختيار ملف Excel'));
        if (typeof XLSX === 'undefined' || !XLSX.read || !XLSX.utils) {
            return reject(new Error('مكتبة Excel غير محملة. تأكد من الاتصال بالإنترنت ثم أعد فتح الصفحة.'));
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var data = new Uint8Array(e.target.result);
                var wb = XLSX.read(data, {type:'array', cellDates:false, raw:true});
                if (!wb.SheetNames || !wb.SheetNames.length) throw new Error('ملف Excel لا يحتوي على أي ورقة');
                var sheetName = wb.SheetNames[0];
                var ws = wb.Sheets[sheetName];
                if (!ws || !ws['!ref']) throw new Error('ورقة Excel فارغة');

                var matrix = XLSX.utils.sheet_to_json(ws, {header:1, defval:'', raw:true, blankrows:false});
                if (!matrix.length) throw new Error('لا توجد بيانات في ورقة Excel');

                function cleanHeader(v) {
                    return String(v == null ? '' : v)
                        .replace(/[\u200e\u200f\ufeff]/g,'')
                        .replace(/[\r\n\t]+/g,' ')
                        .replace(/\s+/g,' ')
                        .trim();
                }
                function headerKey(v) {
                    return normalizeExcelHeaderKey_(cleanHeader(v));
                }
                function scoreHeaderRow(row) {
                    var score = 0, nonEmpty = 0;
                    (row || []).forEach(function(v) {
                        var h = cleanHeader(v); if (!h) return;
                        nonEmpty++;
                        var k = headerKey(h);
                        if (k.includes('اسم')) score += 8;
                        if (k.includes('سنه') || k.includes('فصل') || k.includes('صف')) score += 4;
                        if (k.includes('سرد')) score += 5;
                        if (k.includes('شفوي')) score += 5;
                        if (k.includes('عربي')) score += 4;
                        if (k.includes('حساب')) score += 4;
                        if (k.includes('قران') || k.includes('قرآن')) score += 4;
                        if (k.includes('مجموع')) score += 3;
                        if (k.includes('كود')) score += 4;
                        if (k.includes('نتيجه') || k.includes('نتيجة')) score += 2;
                    });
                    return nonEmpty >= 2 ? score : -1;
                }

                // ابحث عن صف العناوين الحقيقي، حتى لو سبقه عنوان أو شعار أو صفوف فارغة.
                var bestIndex = 0, bestScore = -1;
                var limit = Math.min(matrix.length, 80);
                for (var i=0;i<limit;i++) {
                    var sc = scoreHeaderRow(matrix[i]);
                    if (sc > bestScore) { bestScore = sc; bestIndex = i; }
                }
                var headerRow = matrix[bestIndex] || [];
                var lastCol = 0;
                matrix.forEach(function(r){ if (r && r.length > lastCol) lastCol = r.length; });
                if (lastCol < 1) throw new Error('لم يتم العثور على أعمدة في Excel');

                var headers = [];
                var used = {};
                for (var c=0;c<lastCol;c++) {
                    var h = cleanHeader(headerRow[c]);
                    if (!h) h = 'عمود ' + (c+1);
                    var base = h, n = 1;
                    while (used[h]) { n++; h = base + ' (' + n + ')'; }
                    used[h] = true;
                    headers.push(h);
                }

                var rows = [];
                for (var r=bestIndex+1;r<matrix.length;r++) {
                    var source = matrix[r] || [];
                    var obj = {}, hasValue = false;
                    headers.forEach(function(h,c){
                        var v = source[c];
                        if (v !== '' && v !== null && v !== undefined) hasValue = true;
                        obj[h] = (v === undefined || v === null) ? '' : v;
                    });
                    if (hasValue) rows.push(obj);
                }
                if (!rows.length) throw new Error('تم العثور على العناوين لكن لا توجد صفوف طلاب تحتها');

                resolve({
                    workbook: wb,
                    sheetName: sheetName,
                    sheet: ws,
                    headerIndex: bestIndex,
                    headers: headers,
                    rows: rows,
                    sourceFileName: file.name || ''
                });
            } catch (err) { reject(err); }
        };
        reader.onerror = function(){ reject(new Error('تعذر قراءة ملف Excel من الجهاز')); };
        reader.readAsArrayBuffer(file);
    });
}

function handleTypedResultsExcelUpload(event, preparatoryOnly) {
    var file = event && event.target ? event.target.files[0] : null;
    if (!file) return;
    var monthEl = document.getElementById('resultMonthKey');
    var monthKey = monthEl && monthEl.value ? monthEl.value : getCurrentResultMonthKey();
    var targetType = preparatoryOnly ? 'تمهيدي' : 'طالب';
    readResultsExcelFilePreserveShape(file).then(function(parsed) {
        var rows = parsed.rows || [];
        if (!rows.length) {
            showMessage('results-admin-msg', 'ملف ' + targetType + ' فارغ أو غير صالح', 'error');
            return;
        }
        // نحفظ نسخة من ملف Excel الأصلي نفسه حتى يكون التصدير بنفس ترتيب الأعمدة وشكل الورقة قدر الإمكان.
        resultExcelTemplates[preparatoryOnly ? 'preparatory' : 'normal'] = parsed;
        var existingCodes = new Set();
        (resultsData || []).forEach(function(r){
            var c = getResultStudentCode_(r);
            if (c) existingCodes.add(String(c).toUpperCase());
        });
        var newResults = rows.map(function(row) {
            var fields = normalizeResultFields(row);
            fields['نوع الطالب'] = targetType;
            var result = {
                code: generateStudentLoginCode(existingCodes),
                id: '', monthKey: monthKey, fields: fields,
                studentCode: getResultStudentCode_({ fields: fields }) || '',
                studentType: targetType
            };
            result.id = result.code;
            return result;
        });
        var replaceMessage = 'سيتم رفع ' + newResults.length + ' سجل لـ' + targetType +
            ' لشهر ' + monthKey + '. سيتم استبدال سجلات ' + targetType +
            ' لنفس الشهر فقط. سيتم الاحتفاظ بأعمدة وبيانات ملف Excel الأصلي.';
        return siteConfirm('📥 رفع إكسل ' + targetType, replaceMessage, 'رفع الملف', true).then(function(confirmed) {
            if (!confirmed) return;
            var oldSameType = (resultsData || []).filter(function(r) {
                return String(r.monthKey || '') === monthKey && (isPreparatoryResult_(r) === !!preparatoryOnly);
            });
            var cloudPromise = Promise.resolve();
            if (useFirebase && db) {
                cloudPromise = Promise.all(oldSameType.map(function(r) {
                    return db.collection('results').doc(String(r.code)).delete().catch(function(){ return null; });
                })).then(function() {
                    return Promise.all(newResults.map(function(r) {
                        return db.collection('results').doc(r.id).set({
                            code: r.code, studentCode: r.studentCode || '', studentType: targetType,
                            monthKey: r.monthKey, fields: r.fields, createdAt: new Date().toISOString()
                        });
                    }));
                });
            }
            return cloudPromise.then(function() {
                resultsData = (resultsData || []).filter(function(r) {
                    return !(String(r.monthKey || '') === monthKey && (isPreparatoryResult_(r) === !!preparatoryOnly));
                }).concat(newResults);
                memoryStorage.setItem('resultsData', JSON.stringify(resultsData));
                renderResultsAdminSummary();
                showMessage('results-admin-msg', 'تمت قراءة ' + newResults.length + ' صف من Excel، وتم التعرف على المجموع الكلي عربي والحساب والمجموع الكلي للقرآن. الآن اضغط «توليد الأكواد».', 'success');
            });
        });
    }).catch(function(err) {
        console.error(err);
        showMessage('results-admin-msg', 'تعذر قراءة ملف ' + targetType + ' بشكل صحيح: ' + (err && err.message ? err.message : err), 'error');
    }).finally(function(){ if (event && event.target) event.target.value = ''; });
}
// توافق مع أي استدعاء قديم داخل النسخة السابقة.
function handleResultsExcelUpload(event) {
    return handleTypedResultsExcelUpload(event, false);
}

function exportResultsCodesExcel(preparatoryOnly) {
    var sourceResults = (resultsData || []).filter(function(r){ return isPreparatoryResult_(r) === !!preparatoryOnly; });
    if (!sourceResults.length) throw new Error(preparatoryOnly ? 'لا توجد نتائج لطلاب التمهيدي' : 'لا توجد نتائج للطلاب');
    if (typeof XLSX === 'undefined' || !XLSX.utils || !XLSX.write) throw new Error('مكتبة Excel غير محملة');
    var template = resultExcelTemplates[preparatoryOnly ? 'preparatory' : 'normal'];
    var wb, ws, sheetName;
    if (template && template.workbook && template.sheetName) {
        wb = template.workbook;
        sheetName = template.sheetName;
        ws = wb.Sheets[sheetName];
        // نعيد بناء الصفوف داخل نفس الورقة الأصلية، مع الإبقاء على بياناتها وتنسيقها.
        var range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
        var headerRow = template.headerIndex || 0;
        var headers = template.headers || [];
        var normalizedHeaders = headers.map(function(h){ return normalizeResultHeaderName(h); });
        var codeCol = normalizedHeaders.indexOf('الطالب بالكود');
        if (codeCol < 0) { codeCol = headers.length; headers.push('الطالب بالكود'); normalizedHeaders.push('الطالب بالكود'); }
        var combinedCol = normalizedHeaders.indexOf('المجموع الكلي العربي والحساب');
        if (combinedCol < 0) { combinedCol = headers.length; headers.push('المجموع الكلي العربي والحساب'); normalizedHeaders.push('المجموع الكلي العربي والحساب'); }
        var resultCodeCol = normalizedHeaders.indexOf('كود النتيجة');
        if (resultCodeCol < 0) { resultCodeCol = headers.length; headers.push('كود النتيجة'); normalizedHeaders.push('كود النتيجة'); }
        var typeCol = normalizedHeaders.indexOf('نوع الطالب');
        if (typeCol < 0) { typeCol = headers.length; headers.push('نوع الطالب'); normalizedHeaders.push('نوع الطالب'); }
        var monthCol = normalizedHeaders.indexOf('شهر النتيجة');
        if (monthCol < 0) { monthCol = headers.length; headers.push('شهر النتيجة'); normalizedHeaders.push('شهر النتيجة'); }
        // احذف التحريري/التجريبي من الورقة المصدرة.
        for (var hc = headers.length - 1; hc >= 0; hc--) {
            if (hc < template.headers.length && !normalizedHeaders[hc]) {
                for (var rr = headerRow; rr <= range.e.r; rr++) { delete ws[XLSX.utils.encode_cell({r:rr,c:hc})]; }
            }
        }
        headers.forEach(function(h,c){ ws[XLSX.utils.encode_cell({r:headerRow,c:c})] = {t:'s',v:h}; });
        sourceResults.forEach(function(r, idx){
            var rowNum = headerRow + 1 + idx;
            var fields = r.fields || {};
            var values = {};
            headers.forEach(function(h,c){
                if (h === 'الطالب بالكود') values[c] = getResultStudentCode_(r);
                else if (h === 'المجموع الكلي العربي والحساب') values[c] = getMonthlyFieldValue_(fields,['المجموع الكلي عربي والحساب','المجموع الكلي العربي والحساب','المجموع الكلي للعربي والحساب','مجموع الكلي عربي والحساب','مجموع الكلي العربي والحساب','مجموع العربي والحساب']);
                else if (h === 'كود النتيجة') values[c] = r.code || '';
                else if (h === 'نوع الطالب') values[c] = r.studentType || (preparatoryOnly ? 'تمهيدي' : 'طالب');
                else if (h === 'شهر النتيجة') values[c] = r.monthKey || '';
                else {
                    var canonicalH = normalizeResultHeaderName(h);
                    if (canonicalH === 'المجموع الكلي العربي والحساب') {
                        values[c] = getMonthlyFieldValue_(fields, ['المجموع الكلي العربي والحساب']);
                    } else if (canonicalH === 'المجموع الكلي للقرآن') {
                        values[c] = getMonthlyFieldValue_(fields, ['المجموع الكلي للقرآن']);
                    } else if (fields[canonicalH] !== undefined) {
                        values[c] = fields[canonicalH];
                    } else {
                        var raw = fields.__excelRawFields || {};
                        var rawKey = Object.keys(raw).find(function(rh) {
                            return normalizeExcelHeaderKey_(rh) === normalizeExcelHeaderKey_(h);
                        });
                        values[c] = rawKey != null ? raw[rawKey] : '';
                    }
                }
                var cell = XLSX.utils.encode_cell({r:rowNum,c:c});
                var v = values[c];
                if (v === '' || v === null || v === undefined) delete ws[cell];
                else ws[cell] = { t: (typeof v === 'number' ? 'n' : 's'), v: v };
                if (isMonthlyPercentageField_(h) && typeof v === 'number') ws[cell].z = '0.00%';
            });
        });
        range.e.r = headerRow + sourceResults.length;
        range.e.c = Math.max(range.e.c, headers.length - 1);
        ws['!ref'] = XLSX.utils.encode_range(range);
    } else {
        // في حالة فتح الصفحة من جديد بدون ملف القالب، نُنشئ Excel بكل البيانات الحالية.
        var headers2 = ['الطالب بالكود','الاسم','السنة','نسبة السرد','نسبة الشفوي','نسبة العربي','نسبة الحساب','المجموع الكلي العربي والحساب','المجموع الكلي للقرآن','نوع الطالب','كود النتيجة','شهر النتيجة'];
        var rows2 = sourceResults.map(function(r){
            var f=r.fields||{}, a=Number(String(getMonthlyFieldValue_(f,['المجموع الكلي للعربي','مجموع العربي','إجمالي العربي','درجة العربي'])||'').replace(/,/g,'')), m=Number(String(getMonthlyFieldValue_(f,['المجموع الكلي للحساب','مجموع الحساب','إجمالي الحساب','درجة الحساب'])||'').replace(/,/g,''));
            return {'الطالب بالكود':getResultStudentCode_(r),'الاسم':getMonthlyFieldValue_(f,['الاسم']),'السنة':getMonthlyFieldValue_(f,['السنة']),'نسبة السرد':getMonthlyFieldValue_(f,['نسبة السرد','السرد']),'نسبة الشفوي':getMonthlyFieldValue_(f,['نسبة الشفوي','الشفوي']),'نسبة العربي':getMonthlyFieldValue_(f,['نسبة العربي','العربي']),'نسبة الحساب':getMonthlyFieldValue_(f,['نسبة الحساب','الحساب']),'المجموع الكلي العربي والحساب':getMonthlyFieldValue_(f,['المجموع الكلي عربي والحساب','المجموع الكلي العربي والحساب','المجموع الكلي للعربي والحساب','مجموع الكلي عربي والحساب','مجموع الكلي العربي والحساب','مجموع العربي والحساب']),'المجموع الكلي للقرآن':getMonthlyFieldValue_(f,['المجموع الكلي للقرآن','المجموع الكلي','المجموع','النسبة الكلية','الإجمالي']),'نوع الطالب':r.studentType|| (preparatoryOnly?'تمهيدي':'طالب'),'كود النتيجة':r.code,'شهر النتيجة':r.monthKey||''};
        });
        ws=XLSX.utils.json_to_sheet(rows2,{header:headers2}); wb=XLSX.utils.book_new(); sheetName='النتائج'; XLSX.utils.book_append_sheet(wb,ws,sheetName);
    }
    var filename=(preparatoryOnly?'نتائج_التمهيدي_':'نتائج_الطلاب_')+new Date().toISOString().slice(0,10)+'.xlsx';
    var arrayBuffer=XLSX.write(wb,{bookType:'xlsx',type:'array',cellStyles:true});
    var blob=new Blob([arrayBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    var url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download=filename; a.style.display='none'; document.body.appendChild(a); a.click();
    setTimeout(function(){ if(a.parentNode)a.parentNode.removeChild(a); URL.revokeObjectURL(url); },2000);
    return true;
}
function deleteAllResults() {
    return __awaiter(this, void 0, void 0, function () {
        var confirmed, snap, nowIso;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!resultsData.length)
                        return [2 /*return*/, showMessage('results-admin-msg', 'لا توجد نتائج مخزنة أصلاً', 'error')];
                    return [4 /*yield*/, siteConfirm('🗑️ حذف كل النتائج', "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0643\u0644 \u0627\u0644\u0646\u062A\u0627\u0626\u062C (".concat(resultsData.length, ") \u0648\u0643\u0644 \u0627\u0644\u0623\u0643\u0648\u0627\u062F \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0647\u0627 \u0646\u0647\u0627\u0626\u064A\u0627\u064B. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F"), 'حذف الكل', true)];
                case 1:
                    confirmed = _a.sent();
                    if (!confirmed)
                        return [2 /*return*/];
                    resultsData = [];
                    memoryStorage.setItem('resultsData', JSON.stringify(resultsData));
                    if (!useFirebase) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.collection("results").get()];
                case 2:
                    snap = _a.sent();
                    nowIso = new Date().toISOString();
                    return [4 /*yield*/, Promise.all(snap.docs.map(function (d) { return d.ref.delete(); }))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    renderResultsAdminSummary();
                    showMessage('results-admin-msg', 'تم حذف كل النتائج بنجاح', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function renderResultsAdminSummary() {
    var container = document.getElementById('results-admin-summary');
    if (!container) return;
    if (!resultsData.length) {
        container.innerHTML = '<p style="font-size:0.85em;color:#888;margin-top:10px;">لا توجد نتائج مستوردة حالياً.</p>';
        return;
    }
    var preferredFields = ['الطالب بالكود','الاسم','السنة','نسبة السرد','نسبة الشفوي','نسبة العربي','نسبة الحساب','المجموع الكلي العربي والحساب','المجموع الكلي للقرآن'];
    var allFields = Object.keys(resultsData[0].fields || {});
    var sampleFields = preferredFields.concat(allFields.filter(function(f){ return preferredFields.indexOf(f) === -1; }));
    var previewRows = resultsData.slice(0, 8);
    var html = "<p style=\"font-size:0.88em; color:#555; margin-top:12px;\">📌 عدد النتائج المخزنة حالياً: <strong>".concat(resultsData.length, "</strong> — يتم عرض بيانات الطالب بالكود ودرجات القرآن المطلوبة.</p>");
    html += "<div class=\"table-responsive results-preview-wrap\"><table><thead><tr>";
    sampleFields.forEach(function (f) { html += "<th>".concat(f, "</th>"); });
    html += "<th>كود النتيجة</th></tr></thead><tbody>";
    previewRows.forEach(function (r) {
        html += "<tr>";
        sampleFields.forEach(function (f) {
            var rawValue;
            if (f === 'الطالب بالكود') rawValue = getResultStudentCode_(r);
            else if (f === 'المجموع الكلي العربي والحساب') rawValue = getMonthlyFieldValue_(r.fields || {}, ['المجموع الكلي عربي والحساب','المجموع الكلي العربي والحساب','المجموع الكلي للعربي والحساب','مجموع الكلي عربي والحساب','مجموع الكلي العربي والحساب','مجموع العربي والحساب']);
            else rawValue = (r.fields || {})[f];
            var displayValue = isMonthlyPercentageField_(f) ? formatMonthlyPercentage_(rawValue) : (rawValue == null ? '' : String(rawValue));
            html += "<td>".concat(escapeHtml(displayValue), "</td>");
        });
        html += "<td><span class=\"badge badge-blue\">".concat(escapeHtml(r.code || ''), "</span></td></tr>");
    });
    html += "</tbody></table></div>";
    if (resultsData.length > previewRows.length) {
        html += "<p style=\"font-size:0.8em;color:#888;\">...وعدد ".concat(resultsData.length - previewRows.length, " نتيجة أخرى</p>");
    }
    container.innerHTML = html;
}
function getStudentByLoginCode(code) {
    var normalized = String(code || '').trim().toUpperCase();
    return studentsData.find(function (s) { return String(s.loginCode || '').trim().toUpperCase() === normalized; });
}
function formatStudentDate(iso) {
    if (!iso)
        return '';
    var parts = String(iso).split('-');
    return parts.length === 3 ? "".concat(parts[2], "/").concat(parts[1], "/").concat(parts[0]) : iso;
}
function getCurrentLocalISODate() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
}
function getStudentPortalStats(student) {
    var today = getCurrentLocalISODate();
    var className = student.className;
    var dailyMax = getDailyMax(className);
    var todayRec = dailyRecords.find(function (r) {
        return r.className === className && r.studentName === student.name && r.dateISO === today;
    });
    var weekKey = getWeekKey(today);
    var weekRecords = dailyRecords.filter(function (r) {
        return r.className === className && r.studentName === student.name && r.dateISO && getWeekKey(r.dateISO) === weekKey;
    });
    var weekTotal = weekRecords.reduce(function (sum, r) { return sum + getDailyTotal(r); }, 0);
    var weekAverage = (weekTotal / 5).toFixed(1);
    var d = new Date(today + 'T00:00:00');
    var month = d.getMonth();
    var year = d.getFullYear();
    var monthRecords = dailyRecords.filter(function (r) {
        if (r.className !== className || r.studentName !== student.name || !r.dateISO)
            return false;
        var rd = new Date(r.dateISO + 'T00:00:00');
        return rd.getMonth() === month && rd.getFullYear() === year;
    });
    var monthTotal = monthRecords.reduce(function (sum, r) { return sum + getDailyTotal(r); }, 0);
    // متوسط الشهر يُحسب على جميع أيام الدراسة في الشهر (الأحد إلى الخميس)،
    // وليس على عدد الأيام التي تم تسجيلها فقط. مثال: تسجيل يوم واحد فقط
    // بدرجة 60 في شهر به 20 يوم دراسة = 3 / 60.
    var monthWorkingDays = getMonthWorkingDays(year, month);
    var monthAverage = monthWorkingDays.length ? (monthTotal / monthWorkingDays.length).toFixed(1) : '0';
    var attendanceDays = [];
    var _loop_2 = function (i) {
        var dd = new Date(today + 'T00:00:00');
        dd.setDate(dd.getDate() - i);
        var tzoffset = dd.getTimezoneOffset() * 60000;
        var iso = new Date(dd.getTime() - tzoffset).toISOString().slice(0, 10);
        var rec = dailyRecords.find(function (r) {
            return r.className === className && r.studentName === student.name && r.dateISO === iso;
        });
        attendanceDays.push({
            iso: iso,
            rec: rec,
            status: !rec ? 'pending' : Number(rec.attendance) > 0 ? 'present' : 'absent'
        });
    };
    for (var i = 19; i >= 0; i--) {
        _loop_2(i);
    }
    return { today: today, dailyMax: dailyMax, todayRec: todayRec, weekRecords: weekRecords, weekTotal: weekTotal, weekAverage: weekAverage, monthRecords: monthRecords, monthTotal: monthTotal, monthAverage: monthAverage, attendanceDays: attendanceDays };
}
function showTajweedHigh(studentName, score) {
    showSiteModal('⭐ تميّز في التجويد', "<div style=\"text-align:center;font-size:1.05em;line-height:2;\"><strong>".concat(studentName, "</strong><br>\u062D\u0635\u0644 \u0639\u0644\u0649 \u062F\u0631\u062C\u0629 \u0639\u0627\u0644\u064A\u0629 \u0641\u064A \u0627\u0644\u062A\u062C\u0648\u064A\u062F: <strong style=\"color:var(--accent-gold-dark);\">").concat(score, " / 10</strong> \u2B50</div>"), '<button type="button" class="action-btn btn-save" onclick="closeSiteModal()">حسناً</button>');
}
function studentEscapeHtml_(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(m){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);});
}
function studentBehaviorReasonText_(record){
    if(!record) return '';
    var direct=String(record.behaviorReasonsText || '').trim();
    if(direct) return direct;
    var counts=record.behaviorReasons || {};
    if(typeof WAFDEEN_BEHAVIOR_REASONS === 'undefined') return '';
    return WAFDEEN_BEHAVIOR_REASONS.filter(function(r){return (parseInt(counts[r.key],10)||0)>0;}).map(function(r){
        var n=parseInt(counts[r.key],10)||0;
        return r.label+' ×'+n+' (-'+(n*r.points)+')';
    }).join('، ');
}
function studentBehaviorDetailMarkup_(record){
    var score=Number(record && record.behavior != null ? record.behavior : 10);
    var reason=studentBehaviorReasonText_(record);
    if(!reason && score>=10) return '<div style="font-size:.78em;color:var(--success-color);margin-top:5px;">لا يوجد خصم — الدرجة كاملة</div>';
    return '<div class="student-behavior-deduction" style="font-size:.78em;color:var(--danger-color);margin-top:5px;font-weight:700;">'+
      (reason ? 'سبب الخصم: '+studentEscapeHtml_(reason) : 'تم خصم '+Math.max(0,10-score)+' درجات من السلوك')+'</div>';
}
function studentBehaviorHistoryMarkup_(records){
    var rows=(records||[]).filter(function(r){return r && (studentBehaviorReasonText_(r) || Number(r.behavior||10)<10);}).sort(function(a,b){return String(b.dateISO||'').localeCompare(String(a.dateISO||''));});
    if(!rows.length) return '<div class="student-portal-section"><h4>📋 سجل السلوك والخصومات</h4><p style="text-align:center;color:var(--success-color);">لا توجد خصومات سلوكية مسجلة خلال الفترة الحالية.</p></div>';
    return '<div class="student-portal-section"><h4>📋 سجل السلوك والخصومات</h4>'+rows.slice(0,31).map(function(r){
      var score=Number(r.behavior != null ? r.behavior : 10), reason=studentBehaviorReasonText_(r);
      return '<div class="result-field-card" style="border-right:4px solid var(--danger-color);margin-bottom:8px;">'+
        '<div class="result-field-label">'+studentEscapeHtml_(formatStudentDate(r.dateISO))+'</div>'+ 
        '<div class="result-field-value" style="color:var(--danger-color);">السلوك: '+score+' / 10</div>'+ 
        '<div style="font-size:.8em;color:var(--danger-color);margin-top:4px;">'+studentEscapeHtml_(reason || ('تم خصم '+Math.max(0,10-score)+' درجات'))+'</div></div>';
    }).join('')+'</div>';
}
function studentLogin() {
    var input = document.getElementById('studentLoginCode');
    var code = input ? input.value.trim().toUpperCase() : '';
    if (!code) return studentLoginLegacy();
    if (useFirebase && db) {
        return firebaseFindResultByCode_(code).then(function(result) {
            if (result) {
                var area = document.getElementById('studentPortalArea');
                if (area) {
                    renderMonthlyResultCards(result, isPreparatoryResult_(result));
                    showMessage('student-login-msg', 'تم فتح نتيجة الشهر بالكود ✅', 'success');
                    return;
                }
            }
            return studentLoginLegacy();
        }).catch(function(err) {
            console.warn('تعذر البحث عن كود النتيجة، سيتم تجربة كود الطالب العادي:', err);
            return studentLoginLegacy();
        });
    }
    var localResult = resultsData.find(function(r) {
        return String(r.code || '').toUpperCase() === code || getResultStudentCode_(r) === code;
    });
    if (localResult) {
        renderMonthlyResultCards(localResult, isPreparatoryResult_(localResult));
        showMessage('student-login-msg', 'تم فتح نتيجة الشهر بالكود ✅', 'success');
        return;
    }
    return studentLoginLegacy();
}
function studentLoginLegacy() {
    return __awaiter(this, void 0, void 0, function () {
        var input, code, area, student, stats, todayValue, todayAttendance, html, weekDayOrder, weekDayScores, sortedMonthRecords, monthLabels, monthScores;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    input = document.getElementById('studentLoginCode');
                    code = input.value.trim().toUpperCase();
                    area = document.getElementById('studentPortalArea');
                    area.innerHTML = '';
                    if (!code)
                        return [2 /*return*/, showMessage('student-login-msg', 'اكتب كود تسجيل الدخول أولاً', 'error')];
                    student = getStudentByLoginCode(code);
                    if (!(!student && useFirebase && db)) return [3 /*break*/, 2];
                    return [4 /*yield*/, firebaseFindStudentByLoginCode_(code)];
                case 1:
                    student = _c.sent();
                    _c.label = 2;
                case 2:
                    if (!student) {
                        return [2 /*return*/, showMessage('student-login-msg', 'الكود غير صحيح أو غير موجود، تأكد من الكود الذي أعطته لك الإدارة', 'error')];
                    }
                    stats = getStudentPortalStats(student);
                    todayValue = stats.todayRec ? "".concat(getDailyTotal(stats.todayRec), " / ").concat(stats.dailyMax) : 'لم تُرصد بعد';
                    todayAttendance = stats.todayRec ? (Number(stats.todayRec.attendance) > 0 ? 'حاضر' : 'غائب') : '—';
                    html = "\n    <div class=\"result-student-title\">".concat(student.name, "</div>\n    <div class=\"student-readonly-note\">\uD83D\uDD12 \u0647\u0630\u0647 \u0635\u0641\u062D\u0629 \u0639\u0631\u0636 \u0641\u0642\u0637 \u2014 \u0644\u0627 \u064A\u0645\u0643\u0646 \u0644\u0644\u0637\u0627\u0644\u0628 \u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062D\u0630\u0641 \u0623\u064A \u062F\u0631\u062C\u0629 \u0623\u0648 \u062D\u0636\u0648\u0631.</div>\n\n    <div style=\"text-align:center;font-size:.85em;color:#666;margin-bottom:10px;\">\n      \u0627\u0644\u0635\u0641: <strong style=\"color:var(--primary-dark);\">").concat(student.className, "</strong>\n    </div>\n\n    <div class=\"student-portal-summary\">\n      <div class=\"student-portal-stat\"><div class=\"label\">\u062F\u0631\u062C\u0629 \u0627\u0644\u064A\u0648\u0645</div><div class=\"value\">").concat(todayValue, "</div></div>\n      <div class=\"student-portal-stat\"><div class=\"label\">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0623\u0633\u0628\u0648\u0639</div><div class=\"value\">").concat(stats.weekAverage, " / ").concat(stats.dailyMax, "</div></div>\n      <div class=\"student-portal-stat\"><div class=\"label\">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0634\u0647\u0631</div><div class=\"value\">").concat(stats.monthAverage, " / ").concat(stats.dailyMax, "</div></div>\n    </div>\n\n    <div class=\"student-portal-section\">\n      <h4>\uD83D\uDCDD \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u064A\u0648\u0645 \u2014 ").concat(formatStudentDate(stats.today), "</h4>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0627\u0644\u062D\u0636\u0648\u0631</div>\n        <div class=\"result-field-value\">").concat(todayAttendance, "</div>\n      </div>\n      ").concat(stats.todayRec ? "\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0627\u0644\u0633\u0644\u0648\u0643</div>\n        <div class=\"result-field-value\">".concat((_a = stats.todayRec.behavior) !== null && _a !== void 0 ? _a : 0, " / 10</div>\n        ").concat(studentBehaviorDetailMarkup_(stats.todayRec), "\n      </div>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\uD83D\uDCD6 \u0627\u0644\u062A\u062C\u0648\u064A\u062F \u2014 \u062E\u0627\u0631\u062C \u0627\u0644\u0645\u062C\u0645\u0648\u0639</div>\n        <div class=\"result-field-value\">").concat((_b = stats.todayRec.tajweed) !== null && _b !== void 0 ? _b : 0, " / 10 ").concat(Number(stats.todayRec.tajweed || 0) >= 9 ? '★' : '', "</div>\n      </div>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u064A\u0648\u0645</div>\n        <div class=\"result-field-value\">").concat(getDailyTotal(stats.todayRec), " / ").concat(stats.dailyMax, "</div>\n      </div>") : '<p style="text-align:center;color:#888;">لا توجد درجة مسجلة لهذا اليوم حتى الآن.</p>', "\n    </div>").concat(studentBehaviorHistoryMarkup_(stats.monthRecords), "\n\n    <div class=\"student-portal-section\">\n      <h4>\uD83D\uDCCA \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062D\u0627\u0644\u064A</h4>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0639\u062F\u062F \u0623\u064A\u0627\u0645 \u0627\u0644\u0631\u0635\u062F</div>\n        <div class=\"result-field-value\">").concat(stats.weekRecords.length, "</div>\n      </div>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0623\u0633\u0628\u0648\u0639</div>\n        <div class=\"result-field-value\">").concat(stats.weekTotal, "</div>\n      </div>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0623\u0633\u0628\u0648\u0639</div>\n        <div class=\"result-field-value\">").concat(stats.weekAverage, " / ").concat(stats.dailyMax, "</div>\n      </div>\n      <div class=\"table-responsive student-report-table\"><table><thead><tr><th>\u0627\u0644\u064A\u0648\u0645</th><th>\u0627\u0644\u062F\u0631\u062C\u0629</th><th>\u0627\u0644\u062A\u062C\u0648\u064A\u062F</th><th>\u0627\u0644\u0645\u062C\u0645\u0648\u0639</th></tr></thead><tbody>\n        ").concat(["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map(function (day) { var _a; var rec = stats.weekRecords.find(function (r) { return r.dayName === day; }); return "<tr><td>".concat(day, "</td><td>").concat(rec ? getDailyTotal(rec) : '-', "</td><td>").concat(rec ? ((_a = rec.tajweed) !== null && _a !== void 0 ? _a : 0) : '-', "</td><td>").concat(rec ? "".concat(getDailyTotal(rec), " / ").concat(stats.dailyMax) : '-', "</td></tr>"); }).join(''), "\n      </tbody></table></div>\n      <div style=\"margin-top:10px;\">\n        <canvas id=\"studentWeekChart\" height=\"180\"></canvas>\n      </div>\n    </div>\n\n    <div class=\"student-portal-section\">\n      <h4>\uD83D\uDCC5 \u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u062D\u0627\u0644\u064A</h4>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0639\u062F\u062F \u0623\u064A\u0627\u0645 \u0627\u0644\u0631\u0635\u062F</div>\n        <div class=\"result-field-value\">").concat(stats.monthRecords.length, "</div>\n      </div>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0634\u0647\u0631</div>\n        <div class=\"result-field-value\">").concat(stats.monthTotal, "</div>\n      </div>\n      <div class=\"result-field-card\">\n        <div class=\"result-field-label\">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0634\u0647\u0631</div>\n        <div class=\"result-field-value\">").concat(stats.monthAverage, " / ").concat(stats.dailyMax, "</div>\n      </div>\n      <div class=\"table-responsive student-report-table\"><table><thead><tr><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0627\u0644\u062F\u0631\u062C\u0629</th><th>\u0627\u0644\u062A\u062C\u0648\u064A\u062F</th><th>\u0627\u0644\u0645\u062C\u0645\u0648\u0639</th></tr></thead><tbody>\n        ").concat(__spreadArray([], __read(stats.monthRecords), false).sort(function (a, b) { return a.dateISO.localeCompare(b.dateISO); }).map(function (rec) { var _a; return "<tr><td>".concat(formatStudentDate(rec.dateISO), "</td><td>").concat(getDailyTotal(rec), "</td><td>").concat((_a = rec.tajweed) !== null && _a !== void 0 ? _a : 0, "</td><td>").concat(getDailyTotal(rec), " / ").concat(stats.dailyMax, "</td></tr>"); }).join(''), "\n      </tbody></table></div>\n      <div style=\"margin-top:10px;\">\n        <canvas id=\"studentMonthChart\" height=\"180\"></canvas>\n      </div>\n    </div>\n\n    <div class=\"student-portal-section\">\n      <h4>\uD83D\uDCCB \u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u063A\u064A\u0627\u0628 \u2014 \u0622\u062E\u0631 20 \u064A\u0648\u0645</h4>\n      <div class=\"student-attendance-grid\">\n        ").concat(stats.attendanceDays.map(function (day) {
                        var statusText = day.status === 'present' ? 'حاضر ✓' : day.status === 'absent' ? 'غائب ✗' : '—';
                        var cls = day.status;
                        return "<div class=\"student-attendance-day ".concat(cls, "\">\n            <div>").concat(formatStudentDate(day.iso).slice(0, 5), "</div>\n            <strong>").concat(statusText, "</strong>\n          </div>");
                    }).join(''), "\n      </div>\n    </div>\n  ");
                    area.innerHTML = html;
                    weekDayOrder = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
                    weekDayScores = weekDayOrder.map(function (dayName) {
                        var rec = stats.weekRecords.find(function (r) { return r.dayName === dayName; });
                        return rec ? getDailyTotal(rec) : 0;
                    });
                    renderBarChart('studentWeekChart', function (c) { return studentWeekChartInstance = c; }, function () { return studentWeekChartInstance; }, weekDayOrder, weekDayScores, 'الدرجة اليومية');
                    sortedMonthRecords = __spreadArray([], __read(stats.monthRecords), false).sort(function (a, b) { return a.dateISO.localeCompare(b.dateISO); });
                    monthLabels = sortedMonthRecords.map(function (r) { return formatStudentDate(r.dateISO).slice(0, 5); });
                    monthScores = sortedMonthRecords.map(function (r) { return getDailyTotal(r); });
                    renderBarChart('studentMonthChart', function (c) { return studentMonthChartInstance = c; }, function () { return studentMonthChartInstance; }, monthLabels, monthScores, 'الدرجة اليومية', 'rgba(21, 101, 192, 0.65)');
                    showMessage('student-login-msg', 'تم تسجيل الدخول بنجاح، هذه بياناتك فقط ✅', 'success');
                    return [2 /*return*/];
            }
        });
    });
}
function getVisibleResultElement_(id) {
    var all = document.querySelectorAll('#' + id);
    for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el && el.offsetParent !== null) return el;
    }
    return all.length ? all[all.length - 1] : null;
}
async function lookupResultByCode(preparatoryOnly) {
  preparatoryOnly = !!preparatoryOnly;
  var inputId = preparatoryOnly ? 'preparatoryResultCodeInput' : 'studentResultCodeInput';
  var displayId = preparatoryOnly ? 'preparatoryResultDisplayArea' : 'studentResultDisplayArea';
  var input = document.getElementById(inputId), displayArea = document.getElementById(displayId);
  var code = String(input && input.value || '').trim().toUpperCase();
  if (displayArea) displayArea.innerHTML = '';
  if (!code) return showMessage('results-msg', preparatoryOnly ? 'من فضلك اكتب كود التمهيدي أولاً' : 'من فضلك اكتب كود الطالب أولاً', 'error');

  // السرعة أولاً: ابحث في النتائج الموجودة بالفعل داخل الصفحة قبل أي طلب Supabase.
  var localCandidates = (resultsData || []).filter(function(r){ return isPreparatoryResult_(r) === preparatoryOnly; });
  var result = localCandidates.find(function(r){
    var candidates = [r.code, r.studentCode, getResultStudentCode_(r)];
    var f = r.fields || {};
    Object.keys(f).forEach(function(k){
      var nk = normalizeExcelHeaderKey_(k);
      if (nk === 'الطالببالكود' || nk === 'كودالطالب' || nk === 'كودتسجيلالدخول' || nk === 'الكود' || nk === 'كودالنتيجه') candidates.push(f[k]);
    });
    return candidates.some(function(v){ return String(v == null ? '' : v).trim().toUpperCase() === code; });
  });
  if (result) {
    renderMonthlyResultCards(result, preparatoryOnly);
    return showMessage('results-msg', 'تم العثور على النتيجة بنجاح ✅', 'success');
  }

  // ثم نبحث في Supabase مباشرة بالكود، بدون تحميل كل النتائج.
  try {
    if (useFirebase && db) result = await firebaseFindResultByCode_(code);
    if (result && isPreparatoryResult_(result) !== preparatoryOnly) result = null;
    if (!result && typeof studentsData !== 'undefined') {
      var student = (studentsData || []).find(function(st){ return String(st.loginCode || '').trim().toUpperCase() === code; });
      if (student) result = localCandidates.find(function(r){ return normalizePersonNameForMatch(getResultStudentName(r.fields || {})) === normalizePersonNameForMatch(student.name); });
    }
    if (!result) return showMessage('results-msg', preparatoryOnly ? 'الكود غير صحيح أو لا توجد نتيجة تمهيدي بهذا الكود' : 'الكود غير صحيح أو لا توجد نتيجة للطلاب بهذا الكود', 'error');
    renderMonthlyResultCards(result, preparatoryOnly);
    showMessage('results-msg', 'تم العثور على النتيجة بنجاح ✅', 'success');
  } catch (e) {
    console.error(e);
    showMessage('results-msg', 'تعذر الاتصال بالنتائج في Supabase: ' + (e.message || e), 'error');
  }
}

/* -------- 1) نسخة درجات الرصد اليومي (كل السنين) -------- */
var gradesHeaderMap = [
    ['المعرف', 'id'], ['المدرس', 'teacherName'], ['الصف', 'className'], ['التاريخ', 'dateISO'], ['اليوم', 'dayName'],
    ['اسم الطالب', 'studentName'], ['الحضور', 'attendance'], ['السلوك', 'behavior'], ['سبب خصم السلوك', 'behaviorReasonsText'], ['الجديد', 'newLesson'], ['مقرر الجديد اليوم', 'newTopicToday'], ['مقرر الجديد الذي تم تسميعه', 'newTopicRecited'],
    ['الماضي', 'oldRevision'], ['مقرر الماضي اليوم', 'oldTopicToday'], ['مقرر الماضي الذي تم تسميعه', 'oldTopicRecited'], ['التلاوة', 'recitation'], ['مقرر التلاوة اليوم', 'recitationTopicToday'], ['مقرر التلاوة الذي تم تسميعه', 'recitationTopicRecited'],
    ['الواجب', 'homework'], ['التجويد', 'tajweed']
];
function exportAllGradesToExcel() {
    if (!dailyRecords.length)
        return showMessage('app-msg', 'لا توجد أي درجات مسجلة لتصديرها', 'error');
    var sorted = __spreadArray([], __read(dailyRecords), false).sort(function (a, b) { return String(a.dateISO).localeCompare(String(b.dateISO)); });
    exportJsonToExcel(sorted, gradesHeaderMap, "\u0646\u0633\u062E\u0629_\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629_\u0627\u0644\u062F\u0631\u062C\u0627\u062A_".concat(new Date().toISOString().slice(0, 10)));
    showMessage('app-msg', "\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 ".concat(sorted.length, " \u062F\u0631\u062C\u0629 (\u0643\u0644 \u0627\u0644\u0633\u0646\u064A\u0646) \u0628\u0646\u062C\u0627\u062D \uD83D\uDCCA"), 'success');
}
function importGradesFromExcel(event) {
    return __awaiter(this, void 0, void 0, function () {
        var file, rows, imported, confirmed, dailyRecords_1, dailyRecords_1_1, r, e_39_1, err_3;
        var e_39, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = event.target.files[0];
                    if (!file)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, readExcelFile(file)];
                case 2:
                    rows = _b.sent();
                    if (!rows.length) {
                        showMessage('app-msg', 'الملف فارغ أو غير صالح', 'error');
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    imported = mapRowsToObjects(rows, gradesHeaderMap).map(function (r) { return (__assign(__assign({}, r), { attendance: r.attendance === '' ? 0 : Number(r.attendance), behavior: r.behavior === '' ? 0 : Number(r.behavior), tajweed: r.tajweed === '' || r.tajweed == null ? 0 : Number(r.tajweed), oldRevision: r.oldRevision === '' ? 0 : Number(r.oldRevision), newLesson: r.newLesson === '' ? 0 : Number(r.newLesson), recitation: r.recitation === '' ? 0 : Number(r.recitation), homework: r.homework === '' ? 0 : Number(r.homework), recitation1: r.recitation1 === '' || r.recitation1 == null ? 0 : Number(r.recitation1), recitation2: r.recitation2 === '' || r.recitation2 == null ? 0 : Number(r.recitation2), recitation3: r.recitation3 === '' || r.recitation3 == null ? 0 : Number(r.recitation3), recitation4: r.recitation4 === '' || r.recitation4 == null ? 0 : Number(r.recitation4), id: r.id || dailyStableRecordId_(r.studentId || dailyStudentId_(r.studentName, r.className), r.className, r.dateISO), studentId: r.studentId || dailyStudentId_(r.studentName, r.className) })); });
                    return [4 /*yield*/, siteConfirm('📂 استعادة الدرجات من النسخة الاحتياطية', "\u0633\u064A\u062A\u0645 \u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0643\u0644 \u0627\u0644\u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629 (".concat(dailyRecords.length, " \u0633\u062C\u0644) \u0628\u0639\u062F\u062F ").concat(imported.length, " \u0633\u062C\u0644 \u0645\u0646 \u0645\u0644\u0641 \u0627\u0644\u0625\u0643\u0633\u0644. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F"), 'استعادة الدرجات', true)];
                case 3:
                    confirmed = _b.sent();
                    if (!confirmed) {
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    dailyRecords = imported;
                    memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
                    if (!useFirebase) return [3 /*break*/, 11];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 9, 10, 11]);
                    dailyRecords_1 = __values(dailyRecords), dailyRecords_1_1 = dailyRecords_1.next();
                    _b.label = 5;
                case 5:
                    if (!!dailyRecords_1_1.done) return [3 /*break*/, 8];
                    r = dailyRecords_1_1.value;
                    return [4 /*yield*/, db.collection("dailyRecords").doc(r.id.toString()).set(r)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    dailyRecords_1_1 = dailyRecords_1.next();
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_39_1 = _b.sent();
                    e_39 = { error: e_39_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (dailyRecords_1_1 && !dailyRecords_1_1.done && (_a = dailyRecords_1.return)) _a.call(dailyRecords_1);
                    }
                    finally { if (e_39) throw e_39.error; }
                    return [7 /*endfinally*/];
                case 11:
                    populateWeeks();
                    renderDailyTable();
                    renderAttendanceTable();
                    renderClassStatusTable();
                    renderWeeklyTable();
                    renderMonthlyReport();
                    renderManagerView();
                    showMessage('app-msg', "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 ".concat(imported.length, " \u062F\u0631\u062C\u0629 \u0628\u0646\u062C\u0627\u062D \uD83C\uDF89"), 'success');
                    return [3 /*break*/, 13];
                case 12:
                    err_3 = _b.sent();
                    console.error(err_3);
                    showMessage('app-msg', 'حدث خطأ أثناء قراءة ملف الإكسل، تأكد أنه نفس الملف المُصدَّر من هذه الصفحة', 'error');
                    return [3 /*break*/, 13];
                case 13:
                    event.target.value = '';
                    return [2 /*return*/];
            }
        });
    });
}
/* -------- 2) نسخة بيانات المدرسين -------- */
var teachersHeaderMap = [
    ['المعرف', 'id'], ['اسم المستخدم', 'username'], ['كلمة المرور', 'password'], ['الصف المسؤول عنه', 'assignedClass'], ['المركز', 'center']
];
function exportTeachersToExcel() {
    if (!teachersData.length)
        return showMessage('app-msg', 'لا توجد بيانات مدرسين لتصديرها', 'error');
    var sorted = __spreadArray([], __read(teachersData), false).sort(function (a, b) { return a.username.localeCompare(b.username, 'ar'); });
    exportJsonToExcel(sorted, teachersHeaderMap, "\u0646\u0633\u062E\u0629_\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629_\u0627\u0644\u0645\u062F\u0631\u0633\u064A\u0646_".concat(new Date().toISOString().slice(0, 10)));
    showMessage('app-msg', "\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 ".concat(sorted.length, " \u0645\u062F\u0631\u0633/\u0629 \u0628\u0646\u062C\u0627\u062D \uD83D\uDCCA"), 'success');
}
function importTeachersFromExcel(event) {
    return __awaiter(this, void 0, void 0, function () {
        var file, rows, imported, confirmed, teachersData_1, teachersData_1_1, t, e_40_1, err_4;
        var e_40, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = event.target.files[0];
                    if (!file)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, readExcelFile(file)];
                case 2:
                    rows = _b.sent();
                    if (!rows.length) {
                        showMessage('app-msg', 'الملف فارغ أو غير صالح', 'error');
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    imported = mapRowsToObjects(rows, teachersHeaderMap).map(function (r) { return (__assign(__assign({}, r), { id: r.id || Date.now().toString() + Math.random().toString(36).substr(2, 4) })); });
                    return [4 /*yield*/, siteConfirm('📂 استعادة بيانات المدرسين من النسخة الاحتياطية', "\u0633\u064A\u062A\u0645 \u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0643\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062F\u0631\u0633\u064A\u0646 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 (".concat(teachersData.length, ") \u0628\u0639\u062F\u062F ").concat(imported.length, " \u0645\u0646 \u0645\u0644\u0641 \u0627\u0644\u0625\u0643\u0633\u0644. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F"), 'استعادة المدرسين', true)];
                case 3:
                    confirmed = _b.sent();
                    if (!confirmed) {
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    teachersData = imported;
                    memoryStorage.setItem('teachersData', JSON.stringify(teachersData));
                    if (!useFirebase) return [3 /*break*/, 11];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 9, 10, 11]);
                    teachersData_1 = __values(teachersData), teachersData_1_1 = teachersData_1.next();
                    _b.label = 5;
                case 5:
                    if (!!teachersData_1_1.done) return [3 /*break*/, 8];
                    t = teachersData_1_1.value;
                    return [4 /*yield*/, db.collection("teachers").doc(t.id.toString()).set(t)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    teachersData_1_1 = teachersData_1.next();
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_40_1 = _b.sent();
                    e_40 = { error: e_40_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (teachersData_1_1 && !teachersData_1_1.done && (_a = teachersData_1.return)) _a.call(teachersData_1);
                    }
                    finally { if (e_40) throw e_40.error; }
                    return [7 /*endfinally*/];
                case 11:
                    renderTeachersTable();
                    showMessage('app-msg', "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 ".concat(imported.length, " \u0645\u062F\u0631\u0633/\u0629 \u0628\u0646\u062C\u0627\u062D \uD83C\uDF89"), 'success');
                    return [3 /*break*/, 13];
                case 12:
                    err_4 = _b.sent();
                    console.error(err_4);
                    showMessage('app-msg', 'حدث خطأ أثناء قراءة ملف الإكسل، تأكد أنه نفس الملف المُصدَّر من هذه الصفحة', 'error');
                    return [3 /*break*/, 13];
                case 13:
                    event.target.value = '';
                    return [2 /*return*/];
            }
        });
    });
}
/* -------- 3) نسخة بيانات الطلاب -------- */
var studentsHeaderMap = [
    ['المعرف', 'id'], ['اسم الطالب', 'name'], ['الصف', 'className'], ['كود تسجيل الدخول', 'loginCode']
];
function exportStudentsToExcel() {
    if (!studentsData.length)
        return showMessage('app-msg', 'لا توجد بيانات طلاب لتصديرها', 'error');
    var sorted = __spreadArray([], __read(studentsData), false).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    exportJsonToExcel(sorted, studentsHeaderMap, "\u0646\u0633\u062E\u0629_\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629_\u0627\u0644\u0637\u0644\u0627\u0628_".concat(new Date().toISOString().slice(0, 10)));
    showMessage('app-msg', "\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 ".concat(sorted.length, " \u0637\u0627\u0644\u0628/\u0629 \u0628\u0646\u062C\u0627\u062D \uD83D\uDCCA"), 'success');
}
function importStudentsFromExcel(event) {
    return __awaiter(this, void 0, void 0, function () {
        var file, rows, imported, confirmed, studentsData_1, studentsData_1_1, s, e_41_1, err_5;
        var e_41, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = event.target.files[0];
                    if (!file)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, readExcelFile(file)];
                case 2:
                    rows = _b.sent();
                    if (!rows.length) {
                        showMessage('app-msg', 'الملف فارغ أو غير صالح', 'error');
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    imported = mapRowsToObjects(rows, studentsHeaderMap).map(function (r) { return (__assign(__assign({}, r), { id: r.id || 's_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 4) })); });
                    return [4 /*yield*/, siteConfirm('📂 استعادة بيانات الطلاب من النسخة الاحتياطية', "\u0633\u064A\u062A\u0645 \u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0643\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 (".concat(studentsData.length, ") \u0628\u0639\u062F\u062F ").concat(imported.length, " \u0645\u0646 \u0645\u0644\u0641 \u0627\u0644\u0625\u0643\u0633\u0644. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F"), 'استعادة الطلاب', true)];
                case 3:
                    confirmed = _b.sent();
                    if (!confirmed) {
                        event.target.value = '';
                        return [2 /*return*/];
                    }
                    studentsData = ensureStudentLoginCodes(imported);
                    memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
                    if (!useFirebase) return [3 /*break*/, 11];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 9, 10, 11]);
                    studentsData_1 = __values(studentsData), studentsData_1_1 = studentsData_1.next();
                    _b.label = 5;
                case 5:
                    if (!!studentsData_1_1.done) return [3 /*break*/, 8];
                    s = studentsData_1_1.value;
                    return [4 /*yield*/, db.collection("students").doc(s.id.toString()).set(s)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    studentsData_1_1 = studentsData_1.next();
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_41_1 = _b.sent();
                    e_41 = { error: e_41_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (studentsData_1_1 && !studentsData_1_1.done && (_a = studentsData_1.return)) _a.call(studentsData_1);
                    }
                    finally { if (e_41) throw e_41.error; }
                    return [7 /*endfinally*/];
                case 11:
                    renderStudentsTable();
                    renderClassCards();
                    updateStudentListDropdown();
                    showMessage('app-msg', "\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 ".concat(imported.length, " \u0637\u0627\u0644\u0628/\u0629 \u0628\u0646\u062C\u0627\u062D \uD83C\uDF89"), 'success');
                    return [3 /*break*/, 13];
                case 12:
                    err_5 = _b.sent();
                    console.error(err_5);
                    showMessage('app-msg', 'حدث خطأ أثناء قراءة ملف الإكسل، تأكد أنه نفس الملف المُصدَّر من هذه الصفحة', 'error');
                    return [3 /*break*/, 13];
                case 13:
                    event.target.value = '';
                    return [2 /*return*/];
            }
        });
    });
}
function backupDataAndEmail(isAuto) {
    if (isAuto === void 0) { isAuto = false; }
    if (currentTeacher && currentTeacher.username !== 'admin' && currentTeacher.assignedClass !== 'الكل')
        return;
    var sortedRecords = __spreadArray([], __read(dailyRecords), false).sort(function (a, b) { return new Date(a.dateISO) - new Date(b.dateISO); });
    var sortedStudents = __spreadArray([], __read(studentsData), false).sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    var sortedTeachers = __spreadArray([], __read(teachersData), false).sort(function (a, b) { return a.username.localeCompare(b.username, 'ar'); });
    var backupObj = {
        exportDate: new Date().toISOString(),
        teachersData: sortedTeachers,
        studentsData: sortedStudents,
        dailyRecords: sortedRecords,
        notesData: __spreadArray([], __read(notesData), false).sort(function (a, b) { return String(a.dateISO).localeCompare(String(b.dateISO)); })
    };
    var jsonStr = JSON.stringify(backupObj, null, 2);
    var blob = new Blob([jsonStr], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "backup_al_majd_system_".concat(new Date().toISOString().slice(0, 10), ".json");
    a.click();
    sendEmailBackup(jsonStr, isAuto);
}
function sendEmailBackup(jsonString, isAuto) {
    var targetEmail = "yousirallam28@gmail.com";
    try {
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            to_email: targetEmail,
            message: "مرفق النسخة الاحتياطية المكتملة لمعهد المجد - لجميع الطلاب والمعلمين والدرجات مرتبة بجميع التواريخ.",
            backup_data: jsonString.substring(0, 4500)
        }).then(function () {
            showMessage('app-msg', 'تم تنزيل النسخة بالكمبيوتر وإرسالها إلى البريد الإلكتروني بنجاح', 'success');
        }).catch(function () {
            fallbackMailto(targetEmail, isAuto);
        });
    }
    catch (e) {
        fallbackMailto(targetEmail, isAuto);
    }
}
function fallbackMailto(email, isAuto) {
    if (!isAuto) {
        showMessage('app-msg', 'تم تحميل الملف بنجاح وتجهيز الرسالة للبريد: ' + email, 'success');
        window.location.href = "mailto:".concat(email, "?subject=\u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0627\u0644\u0634\u0627\u0645\u0644\u0629 - \u0645\u0639\u0647\u062F \u0627\u0644\u0645\u062C\u062F&body=\u062A\u0645 \u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u0645\u0644\u0641 \u0648\u062A\u062D\u0645\u064A\u0644\u0647 \u0644\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u0628\u0646\u062C\u0627\u062D.");
    }
}
function checkWeeklyAutoBackup() {
    if (!currentTeacher || (currentTeacher.username !== 'admin' && currentTeacher.assignedClass !== 'الكل'))
        return;
    var lastBackup = memoryStorage.getItem('lastWeeklyBackupDate');
    var now = new Date();
    var todayStr = now.toISOString().slice(0, 10);
    if (!lastBackup) {
        memoryStorage.setItem('lastWeeklyBackupDate', todayStr);
        return;
    }
    var diffDays = Math.floor((now - new Date(lastBackup)) / (1000 * 60 * 60 * 24));
    if (diffDays >= 7) {
        backupDataAndEmail(true);
        memoryStorage.setItem('lastWeeklyBackupDate', todayStr);
    }
}
// دالة استعادة البيانات المكتملة
function restoreData(event) {
    var file = event.target.files[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var data_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    data_1 = JSON.parse(e.target.result);
                    if (data_1.teachersData && data_1.studentsData && data_1.dailyRecords) {
                        siteConfirm('📂 استعادة النسخة الاحتياطية', 'سيتم استبدال البيانات الحالية بالبيانات الموجودة في النسخة الاحتياطية. يُفضّل التأكد من وجود نسخة حالية قبل المتابعة.', 'استعادة النسخة', true).then(function (confirmed) { return __awaiter(_this, void 0, void 0, function () {
                            var teachersData_2, teachersData_2_1, t, e_42_1, studentsData_2, studentsData_2_1, s, e_43_1, dailyRecords_2, dailyRecords_2_1, r, e_44_1, notesData_1, notesData_1_1, n, e_45_1;
                            var e_42, _a, e_43, _b, e_44, _c, e_45, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!confirmed)
                                            return [2 /*return*/];
                                        teachersData = data_1.teachersData;
                                        studentsData = ensureStudentLoginCodes(data_1.studentsData || []);
                                        dailyRecords = data_1.dailyRecords;
                                        notesData = data_1.notesData || [];
                                        memoryStorage.setItem('teachersData', JSON.stringify(teachersData));
                                        memoryStorage.setItem('studentsData', JSON.stringify(studentsData));
                                        memoryStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
                                        memoryStorage.setItem('notesData', JSON.stringify(notesData));
                                        if (!useFirebase) return [3 /*break*/, 29];
                                        _e.label = 1;
                                    case 1:
                                        _e.trys.push([1, 6, 7, 8]);
                                        teachersData_2 = __values(teachersData), teachersData_2_1 = teachersData_2.next();
                                        _e.label = 2;
                                    case 2:
                                        if (!!teachersData_2_1.done) return [3 /*break*/, 5];
                                        t = teachersData_2_1.value;
                                        return [4 /*yield*/, db.collection("teachers").doc(t.id.toString()).set(t)];
                                    case 3:
                                        _e.sent();
                                        _e.label = 4;
                                    case 4:
                                        teachersData_2_1 = teachersData_2.next();
                                        return [3 /*break*/, 2];
                                    case 5: return [3 /*break*/, 8];
                                    case 6:
                                        e_42_1 = _e.sent();
                                        e_42 = { error: e_42_1 };
                                        return [3 /*break*/, 8];
                                    case 7:
                                        try {
                                            if (teachersData_2_1 && !teachersData_2_1.done && (_a = teachersData_2.return)) _a.call(teachersData_2);
                                        }
                                        finally { if (e_42) throw e_42.error; }
                                        return [7 /*endfinally*/];
                                    case 8:
                                        _e.trys.push([8, 13, 14, 15]);
                                        studentsData_2 = __values(studentsData), studentsData_2_1 = studentsData_2.next();
                                        _e.label = 9;
                                    case 9:
                                        if (!!studentsData_2_1.done) return [3 /*break*/, 12];
                                        s = studentsData_2_1.value;
                                        return [4 /*yield*/, db.collection("students").doc(s.id.toString()).set(s)];
                                    case 10:
                                        _e.sent();
                                        _e.label = 11;
                                    case 11:
                                        studentsData_2_1 = studentsData_2.next();
                                        return [3 /*break*/, 9];
                                    case 12: return [3 /*break*/, 15];
                                    case 13:
                                        e_43_1 = _e.sent();
                                        e_43 = { error: e_43_1 };
                                        return [3 /*break*/, 15];
                                    case 14:
                                        try {
                                            if (studentsData_2_1 && !studentsData_2_1.done && (_b = studentsData_2.return)) _b.call(studentsData_2);
                                        }
                                        finally { if (e_43) throw e_43.error; }
                                        return [7 /*endfinally*/];
                                    case 15:
                                        _e.trys.push([15, 20, 21, 22]);
                                        dailyRecords_2 = __values(dailyRecords), dailyRecords_2_1 = dailyRecords_2.next();
                                        _e.label = 16;
                                    case 16:
                                        if (!!dailyRecords_2_1.done) return [3 /*break*/, 19];
                                        r = dailyRecords_2_1.value;
                                        return [4 /*yield*/, db.collection("dailyRecords").doc(r.id.toString()).set(r)];
                                    case 17:
                                        _e.sent();
                                        _e.label = 18;
                                    case 18:
                                        dailyRecords_2_1 = dailyRecords_2.next();
                                        return [3 /*break*/, 16];
                                    case 19: return [3 /*break*/, 22];
                                    case 20:
                                        e_44_1 = _e.sent();
                                        e_44 = { error: e_44_1 };
                                        return [3 /*break*/, 22];
                                    case 21:
                                        try {
                                            if (dailyRecords_2_1 && !dailyRecords_2_1.done && (_c = dailyRecords_2.return)) _c.call(dailyRecords_2);
                                        }
                                        finally { if (e_44) throw e_44.error; }
                                        return [7 /*endfinally*/];
                                    case 22:
                                        _e.trys.push([22, 27, 28, 29]);
                                        notesData_1 = __values(notesData), notesData_1_1 = notesData_1.next();
                                        _e.label = 23;
                                    case 23:
                                        if (!!notesData_1_1.done) return [3 /*break*/, 26];
                                        n = notesData_1_1.value;
                                        return [4 /*yield*/, db.collection("notes").doc(n.id.toString()).set(n)];
                                    case 24:
                                        _e.sent();
                                        _e.label = 25;
                                    case 25:
                                        notesData_1_1 = notesData_1.next();
                                        return [3 /*break*/, 23];
                                    case 26: return [3 /*break*/, 29];
                                    case 27:
                                        e_45_1 = _e.sent();
                                        e_45 = { error: e_45_1 };
                                        return [3 /*break*/, 29];
                                    case 28:
                                        try {
                                            if (notesData_1_1 && !notesData_1_1.done && (_d = notesData_1.return)) _d.call(notesData_1);
                                        }
                                        finally { if (e_45) throw e_45.error; }
                                        return [7 /*endfinally*/];
                                    case 29:
                                        showMessage('app-msg', 'تمت استعادة البيانات بنجاح! 🎉', 'success');
                                        showAppScreen();
                                        return [2 /*return*/];
                                }
                            });
                        }); }).catch(function (err) {
                            console.error(err);
                            showSiteError('حدث خطأ أثناء استعادة النسخة الاحتياطية.');
                        });
                    }
                    else {
                        showMessage('app-msg', 'ملف النسخة الاحتياطية غير صالح أو تنسيقه غير مطابق!', 'error');
                    }
                }
                catch (err) {
                    showMessage('app-msg', 'حدث خطأ أثناء قراءة ملف النسخة الاحتياطية', 'error');
                }
                return [2 /*return*/];
            });
        });
    };
    reader.readAsText(file);
}
function tajweedStar(type, tajweed, totalDays) {
    var score = Number(tajweed || 0);
    if (type === 'daily')
        return score > 8 ? ' ⭐' : '';
    var total = Number(totalDays || 0);
    if (total <= 0)
        return '';
    return (score / (total * 10)) >= 0.70 ? ' ⭐' : '';
}
