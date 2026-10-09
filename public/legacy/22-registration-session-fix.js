/* ===== إصلاح ثبات جلسة التسجيل بعد أول حفظ =====
   يمنع انتقال واجهة النظام إلى شاشة الدخول/الرئيسية بسبب إعادة الرسم أو أي خطأ جانبي أثناء أول تسجيل.
   يعمل مع جميع الفصول، بما فيها الوافدين وأولى شرعي. */
(function installStableRecordNavigation_(){
  if(window.__stableRecordNavigationInstalled) return;
  window.__stableRecordNavigationInstalled=true;

  function snapshot_(){
    var active=document.querySelector('.tab-content.active');
    return {
      tabId: active ? active.id : 'daily-tab',
      className: String((document.getElementById('classSelect')||{}).value||''),
      dailyClass: String((document.getElementById('dailyClassSelect')||{}).value||''),
      student: String((document.getElementById('studentNameSelect')||{}).value||''),
      scroll: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
      teacher: currentTeacher ? Object.assign({}, currentTeacher) : null,
      wafdeenTeacher: currentWafdeenTeacher ? Object.assign({}, currentWafdeenTeacher) : null
    };
  }

  function restore_(st){
    try{
      /* لا نسمح بفقد جلسة المعلم بسبب إعادة رسم الواجهة. */
      if(!currentTeacher && st.teacher){
        currentTeacher=st.teacher;
        try{persistentAuthStorage.setItem('currentTeacher',JSON.stringify(currentTeacher));}catch(_){ }
      }
      if(!currentWafdeenTeacher && st.wafdeenTeacher){
        currentWafdeenTeacher=st.wafdeenTeacher;
        try{persistentAuthStorage.setItem('currentWafdeenTeacher',JSON.stringify(currentWafdeenTeacher));}catch(_){ }
      }

      /* إذا ظهرت شاشة الدخول بشكل غير مقصود، أعد شاشة العمل فقط إذا كانت الجلسة موجودة. */
      if(currentTeacher && document.getElementById('app-screen') && document.getElementById('app-screen').classList.contains('hidden')){
        if(typeof showAppScreen==='function') showAppScreen();
      } else if(currentWafdeenTeacher && document.getElementById('wafdeen-app-screen') && document.getElementById('wafdeen-app-screen').classList.contains('hidden')){
        if(typeof showWafdeenAppScreen==='function') showWafdeenAppScreen();
      }

      var cls=document.getElementById('classSelect');
      var dcls=document.getElementById('dailyClassSelect');
      if(cls && st.className){cls.value=st.className;}
      if(dcls && st.dailyClass){dcls.value=st.dailyClass;}
      if(typeof updateStudentListDropdown==='function' && st.className){
        try{updateStudentListDropdown();}catch(_){ }
      }
      setTimeout(function(){
        var sel=document.getElementById('studentNameSelect');
        if(sel && st.student){sel.value=st.student; try{sel.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}}
        if(st.tabId && document.getElementById(st.tabId) && typeof switchTab==='function'){
          try{switchTab(st.tabId,{currentTarget:document.querySelector('.sidebar-nav .tab-btn[onclick*="'+st.tabId+'"]'),target:null});}catch(_){
            document.querySelectorAll('.tab-content').forEach(function(x){x.classList.remove('active');});
            document.getElementById(st.tabId).classList.add('active');
          }
        }
        try{window.scrollTo(0,st.scroll);}catch(_){ }
        [50,200,600].forEach(function(ms){setTimeout(function(){try{window.scrollTo(0,st.scroll);}catch(_){ }},ms);});
      },120);
    }catch(e){console.warn('stable record restore',e);}
  }

  function wrap_(name){
    var original=window[name];
    if(typeof original!=='function' || original.__stableWrapped) return;
    var wrapped=function(){
      var st=snapshot_();
      var args=arguments;
      var result;
      try{result=original.apply(this,args);}catch(e){restore_(st);throw e;}
      if(result && typeof result.then==='function'){
        return result.then(function(v){restore_(st);return v;},function(e){restore_(st);throw e;});
      }
      restore_(st); return result;
    };
    wrapped.__stableWrapped=true;
    window[name]=wrapped;
  }

  /* دوال التسجيل الرئيسية لكل الفصول. */
  wrap_('addGrade');
  wrap_('markAbsent');
  wrap_('saveShariaGrade');
  wrap_('markShariaAbsent');
  wrap_('saveWafdeenDailyRecord');
  wrap_('wafdeenSaveGradeType');
  wrap_('wafdeenSaveGradeAndTime');
  wrap_('wafdeenGuardedDailySave');

  /* بعض الدوال قد تُعرّف بعد هذا الجزء؛ أعد الربط بعد اكتمال تحميل السكربتات. */
  setTimeout(function(){
    ['addGrade','markAbsent','saveShariaGrade','markShariaAbsent','saveWafdeenDailyRecord','wafdeenSaveGradeType','wafdeenSaveGradeAndTime','wafdeenGuardedDailySave'].forEach(wrap_);
  },0);
})();
