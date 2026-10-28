/* ===== ./js/core/admin-analysis-visibility.js ===== */
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
   Local in-memory storage policy
   No memoryStorage/memoryStorage/IndexedDB persistence is used.
   This store exists only in RAM and is cleared when the page closes
   or is refreshed. No remote database is configured.
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
/* لا يوجد تخزين دائم؛ جلسة الدخول محفوظة في الذاكرة حتى إعادة تحميل الصفحة فقط. */
var persistentAuthStorage = memoryStorage;
(function () {
    function hideAdminInsideAnalysis() {
        var analysis = document.querySelector('#analysis-section, .student-analysis-section, [id*="analysis"]');
        if (!analysis)
            return;
        analysis.querySelectorAll('#admin-tab,#backup-tab,#manager-tab,.admin-panel,.admin-section,[data-tab="admin"],[data-tab="backup"],[data-tab="manager"]')
            .forEach(function (el) { return el.style.setProperty('display', 'none', 'important'); });
    }
    document.addEventListener('DOMContentLoaded', function () {
        hideAdminInsideAnalysis();
        var target = document.body;
        if (target && target.nodeType === 1) {
            var observer = new MutationObserver(hideAdminInsideAnalysis);
            observer.observe(target, { childList: true, subtree: true });
        }
    });
})();
