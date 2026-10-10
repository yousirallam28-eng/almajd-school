/* إبقاء شاشة الجهاز مستيقظة طالما الصفحة مفتوحة ومرئية.
   تعمل الميزة في المتصفحات الداعمة لـ Screen Wake Lock API،
   وتفشل بصمت في المتصفحات الأخرى دون التأثير على وظائف الموقع. */
(function installScreenWakeLock(){
  var screenWakeLock = null;
  var retryTimer = null;

  function scheduleWakeLockRetry(){
    if (retryTimer || document.visibilityState !== 'visible') return;
    retryTimer = setTimeout(function(){
      retryTimer = null;
      requestScreenWakeLock();
    }, 1500);
  }

  async function requestScreenWakeLock(){
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    if (screenWakeLock && !screenWakeLock.released) return;

    try{
      screenWakeLock = await navigator.wakeLock.request('screen');
      screenWakeLock.addEventListener('release', function(){
        screenWakeLock = null;
        scheduleWakeLockRetry();
      });
    }catch(error){
      /* قد يرفض المتصفح الطلب مؤقتًا عند عمل الصفحة في الخلفية. */
      screenWakeLock = null;
      scheduleWakeLockRetry();
    }
  }

  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') requestScreenWakeLock();
  });
  window.addEventListener('pageshow', requestScreenWakeLock);
  window.addEventListener('focus', requestScreenWakeLock);

  requestScreenWakeLock();
})();
