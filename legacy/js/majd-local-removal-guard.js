/* Local providers removed: strict local-only mode. Compatibility names remain
   solely so older UI code does not crash; all remote operations are disabled. */
(function (w) {
  'use strict';
  w.__MAJD_LOCAL_DISABLED__ = true;
  w.uselocaldata = false;
  w.db = null;
  w.wafdeenStorage = null;
  w.localIsAvailable = function () { return false; };
  w.localDatabase = function () { return null; };
  w.MajdLocalDataAPI = {
    isAvailable: function () { return false; },
    database: function () { return null; },
    writeRecord: function () { return Promise.resolve(false); },
    deleteRecord: function () { return Promise.resolve(false); },
    readRecord: function () { return Promise.resolve(null); },
    updateVerified: function (_c, _id, patch) { return Promise.resolve(patch || {}); },
    collection: function () { return {
      doc: function () { return {
        set: function () { return Promise.resolve(false); },
        delete: function () { return Promise.resolve(false); },
        get: function () { return Promise.resolve({ empty: true, docs: [], data: function () { return null; } }); }
      }; },
      get: function () { return Promise.resolve({ empty: true, docs: [] }); }
    }; }
  };
  /* The real Supabase adapter is installed below; do not disable V2 sync here. */
})(window);
