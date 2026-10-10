// V44 compatibility fixes: expose functions required by inline handlers and older timer calls.
window.deleteFirebaseRecord = window.deleteFirebaseRecord || (typeof deleteFirebaseRecord === 'function' ? deleteFirebaseRecord : function(){ return Promise.reject(new Error('دالة الحذف غير متاحة')); });
window.wafdeenQuranUpdateQuranTimer = window.wafdeenQuranUpdateQuranTimer || (typeof wafdeenUpdateQuranTimer === 'function' ? wafdeenUpdateQuranTimer : function(){
  var el=document.getElementById('wafdeen-quran-timer');
  if(el && typeof wafdeenFormatTimer==='function') el.innerText=wafdeenFormatTimer(Number(window.wafdeenQuranElapsedSeconds||0));
});
// Ensure the Start button always reaches the independent Quran-session timer.
window.wafdeenQuranStartPause = window.wafdeenQuranStartPause || function(forcePause){
  if(typeof wafdeenQuranStartPause === 'function') return wafdeenQuranStartPause(forcePause);
};
