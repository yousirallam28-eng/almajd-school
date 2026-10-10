/* ===== Cache سريع لقائمة طلاب الرصد اليومي دون تغيير مزامنة Firebase ===== */
(function installStudentFastCache_(){
  if(window.__studentFastCacheInstalled)return;
  window.__studentFastCacheInstalled=true;
  var KEY='majd_students_fast_cache_v1', MAX_AGE=1000*60*60*24*30;
  window.studentFastCloudReady_=false;
  window.studentFastCacheLoaded_=false;
  function storage_(){try{var k='__majd_student_cache_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return localStorage;}catch(_){return memoryStorage;}}
  function norm_(v){return String(v==null?'':v).trim();}
  function allowed_(s){var t=window.currentTeacher;if(!t)return true;var u=norm_(t.username),a=norm_(t.assignedClass);if(u==='admin'||a==='الكل')return true;if(norm_(s.className)==='الوافدين'&&typeof teacherCanAccessWafdeen_==='function'&&!teacherCanAccessWafdeen_(t))return false;return !a||norm_(s.className)===a;}
  window.studentFastCacheSave_=function(list){var arr=(Array.isArray(list)?list:[]).filter(function(s){return s&&!s._deleted&&norm_(s.name)&&norm_(s.className);}).map(function(s){return {id:String(s.id||s.studentId||''),studentId:String(s.studentId||s.id||''),name:norm_(s.name),className:norm_(s.className),loginCode:s.loginCode||'',loginCodeMonth:s.loginCodeMonth||''};});if(!arr.length)return;try{storage_().setItem(KEY,JSON.stringify({savedAt:Date.now(),students:arr}));}catch(e){console.warn('تعذر حفظ Cache الطلاب',e);}};
  window.studentFastCacheLoad_=function(){try{var raw=storage_().getItem(KEY);if(!raw)return false;var box=JSON.parse(raw);if(!box||!Array.isArray(box.students)||!box.students.length||Date.now()-Number(box.savedAt||0)>MAX_AGE)return false;var cached=box.students.filter(allowed_);if(!cached.length)return false;studentsData=cached;window.studentFastCacheLoaded_=true;return true;}catch(e){return false;}};
  var originalUpdate=window.updateStudentListDropdown;
  window.updateStudentListDropdown=function(){
    var sel=document.getElementById('studentNameSelect'),previous=sel?String(sel.value||''):'';
    var result=typeof originalUpdate==='function'?originalUpdate.apply(this,arguments):undefined;
    var className=String((document.getElementById('classSelect')||document.getElementById('dailyClassSelect')||{}).value||'');
    var hasStudents=Array.isArray(window.studentsData)&&window.studentsData.some(function(s){return s&&!s._deleted&&norm_(s.className)===norm_(className)&&allowed_(s);});
    if(sel&&!hasStudents&&window.studentFastCloudError_){sel.innerHTML='<option value="">⚠️ تعذر تحميل أسماء الطلاب. سجّل الدخول مجددًا أو تحقق من اتصال السحابة.</option>';var ws=document.getElementById('daily-workspace');if(ws)ws.classList.remove('visible');}
    else if(sel&&!hasStudents&&!window.studentFastCloudReady_){sel.innerHTML='<option value="">'+(navigator.onLine?'⏳ جاري تحميل أسماء الطلاب…':'⚠️ لا يوجد اتصال — تعذر تحميل أسماء الطلاب')+'</option>';var ws=document.getElementById('daily-workspace');if(ws)ws.classList.remove('visible');}
    if(sel&&previous&&Array.prototype.some.call(sel.options,function(o){return String(o.value)===previous;}))sel.value=previous;
    if(Array.isArray(window.studentsData)&&window.studentsData.length)try{studentFastCacheSave_(window.studentsData);}catch(_){ }
    return result;
  };
  function refresh_(){try{if(typeof window.updateStudentListDropdown==='function')window.updateStudentListDropdown();}catch(e){console.warn('student list refresh',e);}}
  window.studentFastCacheBootstrap_=function(){
    if(!window.studentFastCloudReady_)window.studentFastCacheLoad_();
    refresh_();
  };
  /* Cache is loaded before the existing app render; Firebase sync continues unchanged. */
  var originalShow=window.showAppScreen;
  if(typeof originalShow==='function')window.showAppScreen=function(){studentFastCacheBootstrap_();return originalShow.apply(this,arguments);};
  var originalOnload=window.onload;
  if(typeof originalOnload==='function')window.onload=function(e){studentFastCacheBootstrap_();return originalOnload.call(this,e);};
  window.addEventListener('online',function(){window.studentFastCloudReady_=false;refresh_();});
  /* First valid cloud snapshot: replace cache and preserve the selected student. */
  window.studentFastMarkCloudReady_=function(){window.studentFastCloudReady_=true;try{studentFastCacheSave_(studentsData);}catch(_){ }refresh_();};
  document.addEventListener('DOMContentLoaded',function(){if(window.currentTeacher)studentFastCacheBootstrap_();});
})();
