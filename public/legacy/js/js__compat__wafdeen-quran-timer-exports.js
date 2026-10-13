/* ===== ./js/compat/wafdeen-quran-timer-exports.js ===== */
window.wafdeenQuranStartPause = wafdeenQuranStartPause;
window.__wafdeenStartSessionTimer = __wafdeenStartSessionTimerSafe;
window.__wafdeenPauseSessionTimer = __wafdeenPauseSessionTimerSafe;
window.wafdeenQuranStopTimer = wafdeenQuranStopTimer;
window.wafdeenSelectGradeType = wafdeenSelectGradeType;
window.wafdeenGuardedDailySave = window.wafdeenGuardedDailySave || wafdeenGuardedDailySave;
window.markWafdeenAbsent = window.markWafdeenAbsent || markWafdeenAbsent;
window.saveWafdeenDailyRecord = window.saveWafdeenDailyRecord || saveWafdeenDailyRecord;
if(typeof deletelocaldataRecord === 'function') window.deletelocaldataRecord = deletelocaldataRecord;
