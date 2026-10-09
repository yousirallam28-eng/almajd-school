/* ================= PERFORMANCE FIX V6 =================
   تحسينات آمنة: لا نؤخر دوال العرض الأساسية ولا نغير ترتيب تنفيذ وظائف الموقع.
   نركز فقط على منع التهيئة المكررة، وتحديثات Firebase المؤجلة الموجودة أصلًا،
   وتنظيف الأعمال غير الضرورية وقت الخمول. خدمة الجداول الخارجية غير مستخدمة.
*/
(function(){
  'use strict';
  /* منع تكرار أي تهيئة إضافية تحمل نفس المفتاح، بدون تغيير التهيئات الأصلية. */
  window.__wafdeenPerfOnce = window.__wafdeenPerfOnce || Object.create(null);
  window.wafdeenPerfRunOnce = function(key, fn){
    if(window.__wafdeenPerfOnce[key]) return false;
    window.__wafdeenPerfOnce[key]=true;
    try{ if(typeof fn==='function') fn(); }catch(e){ console.warn('Performance init skipped ['+key+']',e); }
    return true;
  };

  /* تنفيذ تنظيف التخزين المؤجل وقت خمول المتصفح فقط؛ لا نلمس عمليات الحفظ الأساسية. */
  var idle=window.requestIdleCallback || function(cb){ return setTimeout(function(){ cb({timeRemaining:function(){return 1;}}); },500); };
  idle(function(){
    try{
      if(typeof wafdeenFlushLocalPersist_==='function' && typeof isRecitationPerformanceMode_==='function' && !isRecitationPerformanceMode_()) wafdeenFlushLocalPersist_();
    }catch(e){}
  });
})();
