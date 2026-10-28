/* Keep the school's active daily timer responsive when the page returns to the foreground. */
(function keepSiteTimersAliveInBackground(){
  function refreshRunningTimers(){
    try{
      if (typeof dailyTimerRunning !== 'undefined' && dailyTimerRunning){
        if (typeof dailyTimerInterval !== 'undefined' && dailyTimerInterval) clearInterval(dailyTimerInterval);
        dailyTimerInterval = setInterval(function(){
          if (typeof renderDailyTimer === 'function') renderDailyTimer();
        }, 1000);
        if (typeof renderDailyTimer === 'function') renderDailyTimer();
      }
    }catch(error){
      console.warn('تعذر تحديث مؤقت الموقع في الخلفية', error);
    }
  }
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') refreshRunningTimers();
  });
  window.addEventListener('pageshow', refreshRunningTimers);
  refreshRunningTimers();
})();
