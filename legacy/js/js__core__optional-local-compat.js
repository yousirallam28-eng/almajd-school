/* ===== ./js/core/optional-local-compat.js ===== */
/* Optional local compatibility layer.
   This file keeps the local application usable when js/local is omitted.
   Real local modules overwrite these no-op implementations when included. */
(function (window) {
  'use strict';
  window.__MAJD_LOCAL_DISABLED__ = true;
  if (typeof window.uselocaldata === 'undefined') window.uselocaldata = false;
  if (typeof window.db === 'undefined') window.db = null;
  if (typeof window.wafdeenStorage === 'undefined') window.wafdeenStorage = null;
  window.MajdLocalDataAPI = window.MajdLocalDataAPI || {
    isAvailable: function () { return false; },
    database: function () { return null; }
  };
  window.localIsAvailable = window.localIsAvailable || function () {
    try { return !!(window.MajdLocalDataAPI && window.MajdLocalDataAPI.isAvailable()); } catch (_) { return false; }
  };
  window.localDatabase = window.localDatabase || function () {
    var db = window.MajdLocalDataAPI && window.MajdLocalDataAPI.database ? window.MajdLocalDataAPI.database() : null;
    if (!db) throw new Error('LOCAL_DISABLED');
    return db;
  };
  window.MajdLocalDataAPI.writeRecord = window.MajdLocalDataAPI.writeRecord || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.deleteRecord = window.MajdLocalDataAPI.deleteRecord || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.readRecord = window.MajdLocalDataAPI.readRecord || function () { return Promise.resolve(null); };
  window.MajdLocalDataAPI.updateVerified = window.MajdLocalDataAPI.updateVerified || function (_collection, _id, patch) { return Promise.resolve(patch || {}); };
  window.MajdLocalDataAPI.saveAndVerifySharia = window.MajdLocalDataAPI.saveAndVerifySharia || function (_id, record) { return Promise.resolve(Object.assign({}, record)); };
  window.MajdLocalDataAPI.migrateLegacyDailyRecords = window.MajdLocalDataAPI.migrateLegacyDailyRecords || function () { return Promise.resolve(false); };

  window.MajdLocalDataAPI.collection = window.MajdLocalDataAPI.collection || function () { throw new Error('LOCAL_DISABLED'); };
  window.MajdLocalDataAPI.saveByAction = window.MajdLocalDataAPI.saveByAction || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.getWafdeenMonthlyReports = window.MajdLocalDataAPI.getWafdeenMonthlyReports || function () { return Promise.resolve([]); };
  window.MajdLocalDataAPI.getPayments = window.MajdLocalDataAPI.getPayments || function () { return Promise.resolve([]); };
  window.MajdLocalDataAPI.savePayment = window.MajdLocalDataAPI.savePayment || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.deletePayment = window.MajdLocalDataAPI.deletePayment || function () { return Promise.resolve({deleted:false}); };
  window.MajdLocalDataAPI.savePaymentAction = window.MajdLocalDataAPI.savePaymentAction || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.dailyQuotaRead = window.MajdLocalDataAPI.dailyQuotaRead || function () { return {}; };
  window.MajdLocalDataAPI.findStudentByLoginCode = window.MajdLocalDataAPI.findStudentByLoginCode || function () { return Promise.resolve(null); };
  window.MajdLocalDataAPI.findResultByCode = window.MajdLocalDataAPI.findResultByCode || function () { return Promise.resolve(null); };
  window.MajdLocalDataAPI.flushLocalRenderQueue = window.MajdLocalDataAPI.flushLocalRenderQueue || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.findWafdeenRecord = window.MajdLocalDataAPI.findWafdeenRecord || function () { return Promise.reject(new Error('LOCAL_DISABLED')); };
  window.MajdLocalDataAPI.saveWafdeenUsage = window.MajdLocalDataAPI.saveWafdeenUsage || function () { return Promise.resolve(false); };
  window.MajdLocalDataAPI.loadWafdeen = window.MajdLocalDataAPI.loadWafdeen || function () { return false; };
  window.MajdLocalDataAPI.loadBooks = window.MajdLocalDataAPI.loadBooks || function () { return Promise.reject(new Error('LOCAL_DISABLED')); };
  window.MajdLocalDataAPI.uploadBook = window.MajdLocalDataAPI.uploadBook || function () { return Promise.reject(new Error('LOCAL_DISABLED')); };
  window.MajdLocalDataAPI.deleteBookFromDrive = window.MajdLocalDataAPI.deleteBookFromDrive || function () { return Promise.resolve(false); };

  function unavailable(name) {
    return function () {
      console.info('الخدمة المحلية غير متاحة في هذه النسخة:', name);
      return false;
    };
  }
  var falseAsync = function () { return Promise.resolve(false); };

  [
    'localdataWriteRecord_', 'deletelocaldataRecord',
    'syncCollection_',
    'syncDataFromLocal',
    'wafdeenRenderLocalReview',
  ].forEach(function (name) {
    if (typeof window[name] === 'undefined') window[name] = unavailable(name);
  });

  if (typeof window.wafdeenLoadLocal === 'undefined') window.wafdeenLoadLocal = unavailable('wafdeenLoadLocal');
  if (typeof window.wafdeenSaveRecordDurably_ === 'undefined') window.wafdeenSaveRecordDurably_ = falseAsync;
  if (typeof window.wafdeenFormatTimer === 'undefined') window.wafdeenFormatTimer = function (s) { return String(s || 0); };

  // Keep the original interface safe if local-only panels remain visible in the markup.
  ['refreshDailyRecordsVerificationVisibility_','renderClassStatusTable']
    .forEach(function (name) {
      if (typeof window[name] === 'undefined') window[name] = unavailable(name);
    });
})(window);
