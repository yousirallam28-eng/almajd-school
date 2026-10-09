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
/* =========================================================
   Supabase persistence policy
   No localStorage/sessionStorage/IndexedDB persistence is used.
   This store exists only in RAM and is cleared when the page closes
   or is refreshed. Supabase is the permanent data source.
   ========================================================= */
var memoryStorage = (function () {
    var store = Object.create(null);
    return {
        getItem: function (key) {
            return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
        },
        setItem: function (key, value) {
            store[key] = String(value);
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            var e_1, _a;
            try {
                for (var _b = __values(Object.keys(store)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    delete store[key];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
})();
/* جلسات الدخول فقط تُحفظ على الجهاز حتى بعد إغلاق أو تحديث الصفحة. */
var persistentAuthStorage = (function(){
    try{
        var testKey='__majd_auth_storage_test__';
        window.localStorage.setItem(testKey,'1');
        window.localStorage.removeItem(testKey);
        return window.localStorage;
    }catch(e){
        return memoryStorage;
    }
})();
(function () {
    function hideAdminInsideAnalysis() {
        var analysis = document.querySelector('#analysis-section, .student-analysis-section, [id*="analysis"]');
        if (!analysis)
            return;
        analysis.querySelectorAll('#admin-tab,#backup-tab,#manager-tab,.admin-panel,.admin-section,[data-tab="admin"],[data-tab="backup"],[data-tab="manager"]')
            .forEach(function (el) { return el.style.setProperty('display', 'none', 'important'); });
    }
    // يتم استدعاء دالة استعادة حالة التسجيل بعد اكتمال تحميل جميع كتل JavaScript.
    // الدالة معرفة في كتلة لاحقة من الملف، لذلك استدعاؤها هنا مباشرة كان يسبب:
    // ReferenceError: wafdeenRestoreRegistrationState_ is not defined
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof wafdeenRestoreRegistrationState_ === 'function') {
            wafdeenRestoreRegistrationState_().catch(console.error);
        }
    });
    document.addEventListener('DOMContentLoaded', function () {
        hideAdminInsideAnalysis();
        var target = document.body;
        if (target && target.nodeType === 1) {
            var observer = new MutationObserver(hideAdminInsideAnalysis);
            observer.observe(target, { childList: true, subtree: true });
        }
    });
})();
