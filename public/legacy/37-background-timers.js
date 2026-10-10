/* استمرار تحديث عدادات الموقع بعد وضع التبويب في الخلفية.
   الحساب نفسه يعتمد على Date.now()، لذلك لا يتوقف عند throttling المتصفح. */
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
      if (typeof wafdeenTimerRunning !== 'undefined' && wafdeenTimerRunning){
        if (wafdeenTimerInterval) clearInterval(wafdeenTimerInterval);
        wafdeenTimerInterval = setInterval(wafdeenTick, 1000);
        wafdeenTick();
      }
      if (typeof wafdeenQuranTimerRunning !== 'undefined' && wafdeenQuranTimerRunning){
        if (typeof __wafdeenSetQuranTimerIntervalSafe === 'function') __wafdeenSetQuranTimerIntervalSafe();
        if (typeof wafdeenQuranTick === 'function') wafdeenQuranTick();
      }
      if (typeof wafdeenEduTimerRunning !== 'undefined' && wafdeenEduTimerRunning){
        if (wafdeenEduTimerInterval) clearInterval(wafdeenEduTimerInterval);
        wafdeenEduTimerInterval = setInterval(wafdeenEduTick, 1000);
        wafdeenEduTick();
      }
    }catch(error){
      console.warn('تعذر تحديث تايمرات الخلفية', error);
    }
  }

  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') refreshRunningTimers();
  });
  window.addEventListener('pageshow', refreshRunningTimers);
  refreshRunningTimers();
})();
