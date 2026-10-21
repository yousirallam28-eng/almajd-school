/* استمرار تحديث مؤقتات الموقع بعد وضع التبويب في الخلفية. */
(function keepSiteTimersAliveInBackground(){
  function refreshRunningTimers(){
    try{
      if (typeof dailyTimerRunning !== 'undefined' && dailyTimerRunning){
        if (typeof dailyTimerInterval !== 'undefined' && dailyTimerInterval) clearInterval(dailyTimerInterval);
        dailyTimerInterval = setInterval(function(){ if (typeof renderDailyTimer === 'function') renderDailyTimer(); }, 1000);
        if (typeof renderDailyTimer === 'function') renderDailyTimer();
      }
      if (typeof wafdeenQuranTimerRunning !== 'undefined' && wafdeenQuranTimerRunning){
        if (typeof __wafdeenSetQuranTimerIntervalSafe === 'function') __wafdeenSetQuranTimerIntervalSafe();
        if (typeof wafdeenQuranTick === 'function') wafdeenQuranTick();
      }
    }catch(error){ console.warn('تعذر تحديث تايمرات الخلفية', error); }
  }
  document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'visible') refreshRunningTimers(); });
  window.addEventListener('pageshow', refreshRunningTimers);
  refreshRunningTimers();
})();
