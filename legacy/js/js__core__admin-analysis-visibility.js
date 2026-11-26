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
   Session storage policy
   Keep the teacher session for the current tab only.
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
var persistentAuthStorage = (function () {
    var localStore = null;
    var sessionStore = null;
    try { localStore = window.localStorage; } catch (_) { }
    try { sessionStore = window.sessionStorage; } catch (_) { }
    function removeFrom(store, key) {
        try { if (store) store.removeItem(key); } catch (_) { }
    }
    function getFrom(store, key) {
        try { return store ? store.getItem(key) : null; } catch (_) { return null; }
    }
    function setIn(store, key, value) {
        try { if (store) store.setItem(key, value); return !!store; } catch (_) { return false; }
    }
    function authValueWithoutPassword(value) {
        if (value == null) return value;
        try {
            var parsed = JSON.parse(String(value));
            if (parsed && typeof parsed === 'object' && Object.prototype.hasOwnProperty.call(parsed, 'password')) {
                delete parsed.password;
                return JSON.stringify(parsed);
            }
        } catch (_) { }
        return String(value);
    }
    return {
        getItem: function (key) {
            return getFrom(sessionStore, key) || memoryStorage.getItem(key);
        },
        setItem: function (key, value) {
            var serialized = key === 'currentTeacher' ? authValueWithoutPassword(value) : String(value);
            if (key === 'currentTeacher') {
                removeFrom(localStore, key);
                if (setIn(sessionStore, key, serialized)) return;
            }
            memoryStorage.setItem(key, serialized);
        },
        removeItem: function (key) {
            removeFrom(localStore, key);
            removeFrom(sessionStore, key);
            memoryStorage.removeItem(key);
        },
        clear: function () {
            try { if (localStore) localStore.removeItem('currentTeacher'); } catch (_) { }
            try { if (sessionStore) sessionStore.clear(); } catch (_) { }
            memoryStorage.clear();
        }
    };
})();
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
