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
window.wafdeenStartRegistration = function () {
    return __awaiter(this, arguments, void 0, function (extra) {
        if (extra === void 0) { extra = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.wafdeenRegistrationActive = true;
                    return [4 /*yield*/, wafdeenPersistRegistrationState_(true, extra)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
window.wafdeenStopRegistration = function () {
    return __awaiter(this, arguments, void 0, function (extra) {
        if (extra === void 0) { extra = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.wafdeenRegistrationActive = false;
                    return [4 /*yield*/, wafdeenPersistRegistrationState_(false, extra)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
/* ===== حذف Firebase موحد وآمن ===== */
function deleteFirebaseRecord(collectionName, recordId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, col, collectionRef, direct, directSnap, refs, seen, q1, q2, i, err, code, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = String(recordId || '').trim();
                    col = String(collectionName || '').trim();
                    if (!col || !id) throw new Error('بيانات الحذف غير مكتملة');
                    if (typeof db === 'undefined' || !db || !db.collection) throw new Error('Supabase غير متصل');
                    collectionRef = db.collection(col);
                    direct = collectionRef.doc(id);
                    refs = [];
                    seen = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    /* أولًا: نختبر المستند بالـ Document ID فقط.
                       هذا مهم لأن بعض قواعد Firestore تسمح بالقراءة/الحذف المباشر
                       لكنها لا تسمح بعمل collection query. */
                    return [4 /*yield*/, direct.get()];
                case 2:
                    directSnap = _a.sent();
                    if (directSnap.exists) {
                        refs.push(direct);
                        seen[id] = true;
                    }
                    if (refs.length) return [3 /*break*/, 5];
                    /* لو الـ Document ID مختلف، نبحث عن id ثم recordId. */
                    return [4 /*yield*/, collectionRef.where('id', '==', id).get()];
                case 3:
                    q1 = _a.sent();
                    q1.forEach(function(d){ if(!seen[d.id]){ seen[d.id]=true; refs.push(d.ref); } });
                    return [4 /*yield*/, collectionRef.where('recordId', '==', id).get()];
                case 4:
                    q2 = _a.sent();
                    q2.forEach(function(d){ if(!seen[d.id]){ seen[d.id]=true; refs.push(d.ref); } });
                    _a.label = 5;
                case 5:
                    if (!refs.length) throw new Error('السجل غير موجود في Supabase: '+id+' | المجموعة: '+col);
                    i = 0;
                    _a.label = 8;
                case 8:
                    if (!(i < refs.length)) return [3 /*break*/, 11];
                    return [4 /*yield*/, refs[i].delete()];
                case 9:
                    _a.sent();
                    i++;
                    return [3 /*break*/, 8];
                case 10: return [3 /*break*/, 11];
                case 11:
                    /* تحقق نهائي: المستند المباشر أولًا، ثم الاستعلامات إذا لزم */
                    return [4 /*yield*/, direct.get()];
                case 12:
                    directSnap = _a.sent();
                    if (directSnap.exists) throw new Error('تم رفض حذف المستند من Supabase: '+id);
                    return [4 /*yield*/, collectionRef.where('id', '==', id).get()];
                case 13:
                    q1 = _a.sent();
                    if (!q1.empty) throw new Error('ما زال سجل يحمل id='+id+' في Supabase');
                    return [4 /*yield*/, collectionRef.where('recordId', '==', id).get()];
                case 14:
                    q2 = _a.sent();
                    if (!q2.empty) throw new Error('ما زال سجل يحمل recordId='+id+' في Supabase');
                    firebaseDailyQuotaInc_('deletes',refs.length);
                    return [2 /*return*/, {ok:true, collection:col, id:id, deleted:true, count:refs.length, verified:true}];
                case 6:
                    err = _a.sent();
                    code = String((err && err.code) || '');
                    msg = String((err && err.message) || err || 'خطأ غير معروف');
                    if (code.indexOf('permission-denied') >= 0 || /Missing or insufficient permissions|permission/i.test(msg))
                        throw new Error('Firebase منع عملية الحذف بسبب الصلاحيات (permission-denied). المجموعة: '+col+' — المعرّف: '+id);
                    throw err;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/* ===== توافق وحماية متغيرات Firebase القديمة ===== */
if (typeof window.wafdeenUsageData === 'undefined')
    window.wafdeenUsageData = [];
if (typeof window.wafdeenDailyRecords === 'undefined')
    window.wafdeenDailyRecords = [];
if (typeof window.wafdeenExamsData === 'undefined')
    window.wafdeenExamsData = [];
if (typeof window.wafdeenMonthlyImportedReports === 'undefined')
    window.wafdeenMonthlyImportedReports = [];
