(function(){
  'use strict';
  var W='الوافدين';
  function isWafdeen(c){ return String(c||'')===W; }
  function getClassValue(id){ var e=document.getElementById(id); return e?e.value:''; }
  function markGroupByInput(id, hidden){
    var el=document.getElementById(id); if(!el) return;
    var g=el.closest('.form-group'); if(!g) return;
    g.classList.toggle('wafdeen-grade-hidden', !!hidden);
  }
  function applyDailyWafdeenUI(className){
    var on=isWafdeen(className);
    if(String(className||'').trim()==='أولى شرعي'){
      var shariaSave=document.querySelector('#daily-tab .daily-scores-card .btn-save');
      if(shariaSave) shariaSave.innerText='💾 حفظ';
      return;
    }
    document.body.classList.toggle('wafdeen-selected',on);
    ['attendance','behavior','homework','tajweed'].forEach(function(id){
      markGroupByInput(id,on);
      if(on){ var e=document.getElementById(id); if(e) e.value=0; }
    });
    var grid=document.getElementById('daily-behavior-grid');
    if(on && grid) grid.innerHTML='';
    var saveBtn=document.querySelector('#daily-tab .daily-scores-card .btn-save');
    if(saveBtn) saveBtn.innerText='💾 حفظ الدرجات والوقت (من '+(on?30:getDailyMax(className))+')';
    var th=document.querySelector('#gradesTable th:nth-child(18)');
    if(th) th.textContent='المجموع (من '+(on?30:getDailyMax(className))+')';
  }
  function applyWafdeenReportUI(){
    var weekly=isWafdeen(getClassValue('weeklyClassSelect'));
    var monthly=isWafdeen(getClassValue('monthlyClassSelect'));
    var manager=isWafdeen(window.currentManagerClass);
    var on=weekly||monthly||manager;
    document.body.classList.toggle('wafdeen-report-selected',on);
    if(weekly){
      var wh=document.querySelectorAll('#weeklyTable thead th');
      if(wh.length>=10){ wh[1].textContent='الأحد (30)'; wh[2].textContent='الاثنين (30)'; wh[3].textContent='الثلاثاء (30)'; wh[4].textContent='الأربعاء (30)'; wh[5].textContent='الخميس (30)'; wh[6].textContent='مجموع الأسبوع (من 150)'; wh[7].textContent='متوسط الأسبوع (من 30)'; }
    }
    if(monthly){
      var mh=document.querySelectorAll('#monthlyReportTable thead th');
      if(mh.length>=6){
        mh[mh.length-6] && (mh[mh.length-6].textContent='أيام التسجيل');
        mh[mh.length-5] && (mh[mh.length-5].textContent='مجموع الشهر');
        mh[mh.length-4] && (mh[mh.length-4].textContent='متوسط الشهر (من 30)');
      }
    }
    if(manager){
      var mwh=document.querySelectorAll('#mgrWeeklyTable thead th');
      if(mwh.length>=9){
        mwh[mwh.length-1].textContent='متوسط/نسبة الحضور';
      }
      var mmh=document.querySelectorAll('#mgrMonthlyTable thead th');
      if(mmh.length>=4) mmh[mmh.length-3].textContent='مجموع الشهر';
    }
  }
  function stripWafdeenFromSelect(id){
    var sel=document.getElementById(id); if(!sel) return;
    Array.from(sel.options||[]).forEach(function(o){ if(isWafdeen(o.value)) o.remove(); });
    if(sel.value===W && sel.options.length) sel.selectedIndex=0;
  }
  function applyExcludedBusinessClasses(){
    ['paymentsClassSelect','paymentReportClassSelect','notesClassSelect'].forEach(stripWafdeenFromSelect);
  }

  var oldGetDailyMax=window.getDailyMax;
  window.getDailyMax=function(className){ return isWafdeen(className)?30:oldGetDailyMax(className); };
  var oldGetDailyTotal=window.getDailyTotal;
  window.getDailyTotal=function(record){
    if(record && isWafdeen(record.className)) return (Number(record.newLesson)||0)+(Number(record.oldRevision)||0)+(Number(record.recitation)||0);
    return oldGetDailyTotal(record);
  };

  var oldWeeklyTable=window.renderWeeklyTable;
  window.renderWeeklyTable=function(){
    var c=(document.getElementById('weeklyClassSelect')||{}).value||'';
    if(shariaIsClass_(c)) return renderShariaWeeklyReport_();
    if(wafdeenIsClass_(c)) return renderWafdeenWeeklyReport_();
    return oldWeeklyTable.apply(this,arguments);
  };
  var oldMonthlyReport=window.renderMonthlyReport;
  window.renderMonthlyReport=function(){
    var c=(document.getElementById('monthlyClassSelect')||{}).value||'';
    if(shariaIsClass_(c)) return renderShariaMonthlyReport_();
    if(wafdeenIsClass_(c)) return renderWafdeenMonthlyReport_();
    return oldMonthlyReport.apply(this,arguments);
  };
  var oldUpdateFifth=window.updateFifthGradeFields;
  window.updateFifthGradeFields=function(className){
    oldUpdateFifth(className);
    applyDailyWafdeenUI(className);
  };

  ['renderDailyTable','renderWeeklyTable','renderMonthlyReport','renderManagerView'].forEach(function(name){
    if(typeof window[name]!=='function') return;
    var old=window[name];
    window[name]=function(){
      var result=old.apply(this,arguments);
      if(name==='renderDailyTable') applyDailyWafdeenUI(getClassValue('classSelect'));
      applyWafdeenReportUI();
      return result;
    };
  });

  ['populatePaymentsClasses','populatePaymentReportClasses','populateNotesClasses'].forEach(function(name){
    if(typeof window[name]!=='function') return;
    var old=window[name];
    window[name]=function(){ var r=old.apply(this,arguments); applyExcludedBusinessClasses(); return r; };
  });
  if(typeof window.ensureAllClassSelects_==='function'){
    var oldEnsure=window.ensureAllClassSelects_;
    window.ensureAllClassSelects_=function(){ var r=oldEnsure.apply(this,arguments); applyExcludedBusinessClasses(); return r; };
  }

  document.addEventListener('DOMContentLoaded',function(){
    applyDailyWafdeenUI(getClassValue('classSelect'));
    applyWafdeenReportUI();
    applyExcludedBusinessClasses();
    ['weeklyClassSelect','monthlyClassSelect'].forEach(function(id){
      var e=document.getElementById(id); if(e) e.addEventListener('change',applyWafdeenReportUI);
    });
  });
})();
