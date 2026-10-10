(function(){
  'use strict';
  function isoLocalV10(d){
    d=d instanceof Date?d:new Date(d);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function dateObjV10(v){
    var d=new Date(String(v||isoLocalV10(new Date()))+'T00:00:00');
    return Number.isNaN(d.getTime())?new Date():d;
  }
  function dayNameV10(v){return ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][dateObjV10(v).getDay()];}
  function currentDailyDateV10(){
    var e=document.getElementById('recordDate');
    return e&&/^\d{4}-\d{2}-\d{2}$/.test(e.value)?e.value:isoLocalV10(new Date());
  }
  function currentWafdeenDateV10(){
    var e=document.getElementById('wafdeenDailyDate');
    return e&&/^\d{4}-\d{2}-\d{2}$/.test(e.value)?e.value:isoLocalV10(new Date());
  }
  function resetDailyEntryV10(){
    try{ if(typeof dailyTimerRunning!=='undefined' && dailyTimerRunning && typeof pauseDailyTimer==='function') pauseDailyTimer(); }catch(e){}
    try{ if(typeof dailyTimerInterval!=='undefined' && dailyTimerInterval) clearInterval(dailyTimerInterval); }catch(e){}
    try{ dailyTimerRunning=false; dailyTimerStartedAt=0; dailyTimerBaseSeconds=0; dailyTimerSeconds={new:0,old:0,recitation:0}; }catch(e){}
    try{ if(typeof dailyErrorCounters!=='undefined') dailyErrorCounters={new:{errors:0,tashkeel:0,repetition:0},old:{errors:0,tashkeel:0,repetition:0},recitation:{errors:0,tashkeel:0,repetition:0}}; }catch(e){}
    var st=document.getElementById('studentNameSelect'); if(st) st.value='';
    var ws=document.getElementById('daily-workspace'); if(ws) ws.classList.remove('visible');
    try{ if(typeof showDailyStudentWorkspace==='function') showDailyStudentWorkspace(); }catch(e){}
    try{ if(typeof updateMainDailySaveButton_==='function') updateMainDailySaveButton_(); }catch(e){}
  }
  function updateDailyDateUIV10(){
    var d=currentDailyDateV10();
    var hidden=document.getElementById('recordDate');
    if(hidden) hidden.value=d;
    var day=document.getElementById('daySelect'); if(day) day.value=dayNameV10(d);
    var label=document.getElementById('v10DailyDateText'); if(label) label.textContent=d+' — '+dayNameV10(d);
    var note=document.getElementById('daily-record-date-note'); if(note) note.textContent='الرصد مستقل لهذا اليوم فقط: '+d+' — '+dayNameV10(d);
    try{ if(typeof isShowingAllDays!=='undefined' && !isShowingAllDays){var f=document.getElementById('filterDateDaily');if(f)f.value=d;} }catch(e){}
    try{ if(typeof renderDailyTable==='function') renderDailyTable(); }catch(e){}
    try{ if(typeof populateWeeks==='function') populateWeeks(); }catch(e){}
  }
  window.v10SetDailyDate=function(delta){
    var input=document.getElementById('recordDate'); if(!input)return;
    var d=dateObjV10(currentDailyDateV10()); d.setDate(d.getDate()+Number(delta||0)); input.value=isoLocalV10(d);
    resetDailyEntryV10(); updateDailyDateUIV10();
    var note=document.getElementById('v10DailyDateStatus'); if(note) note.textContent='اليوم المحدد للرصد: '+input.value+' — '+dayNameV10(input.value)+' (كل يوم منفصل عن الآخر)';
  };
  window.v10GoDailyToday=function(){
    var input=document.getElementById('recordDate'); if(!input)return;
    input.value=isoLocalV10(new Date()); resetDailyEntryV10(); updateDailyDateUIV10();
    var note=document.getElementById('v10DailyDateStatus'); if(note) note.textContent='اليوم المحدد للرصد: '+input.value+' — '+dayNameV10(input.value)+' (كل يوم منفصل عن الآخر)';
  };
  window.v10SetWafdeenDate=function(delta){
    var input=document.getElementById('wafdeenDailyDate'); if(!input)return;
    var d=dateObjV10(currentWafdeenDateV10()); d.setDate(d.getDate()+Number(delta||0)); input.value=isoLocalV10(d);
    try{ if(typeof changeWafdeenDailyDate==='function') changeWafdeenDailyDate(0); }catch(e){}
    var st=document.getElementById('wafdeenStudentSelect'); if(st) st.value='';
    var note=document.getElementById('v10WafdeenDateStatus'); if(note) note.textContent='اليوم المحدد: '+input.value+' — كل يوم منفصل عن الآخر';
  };
  window.v10GoWafdeenToday=function(){
    var input=document.getElementById('wafdeenDailyDate'); if(!input)return;
    input.value=isoLocalV10(new Date());
    try{ if(typeof changeWafdeenDailyDate==='function') changeWafdeenDailyDate(0); }catch(e){}
    var st=document.getElementById('wafdeenStudentSelect'); if(st) st.value='';
    var note=document.getElementById('v10WafdeenDateStatus'); if(note) note.textContent='اليوم المحدد: '+input.value+' — كل يوم منفصل عن الآخر';
  };
  function installDailyBar(){
    var tab=document.getElementById('daily-tab'); if(!tab || document.getElementById('v10DailyDateBar'))return;
    var bar=document.createElement('div'); bar.id='v10DailyDateBar'; bar.className='v10-daily-date-bar';
    bar.innerHTML='<span class="v10-date-label">📅 تاريخ الرصد:</span><button type="button" class="action-btn btn-warning" onclick="v10SetDailyDate(-1)">◀ اليوم السابق</button><input type="date" id="v10DailyDatePicker"><button type="button" class="action-btn btn-warning" onclick="v10SetDailyDate(1)">اليوم التالي ▶</button><button type="button" class="action-btn btn-export" onclick="v10GoDailyToday()">اليوم</button>';
    var status=document.createElement('div'); status.id='v10DailyDateStatus'; status.className='v10-daily-date-status';
    var anchor=tab.querySelector('.daily-hidden-field');
    if(anchor) anchor.parentNode.insertBefore(bar,anchor); else tab.insertBefore(bar,tab.firstChild);
    bar.insertAdjacentElement('afterend',status);
    var picker=document.getElementById('v10DailyDatePicker');
    if(picker){picker.value=currentDailyDateV10();picker.onchange=function(){var real=document.getElementById('recordDate');if(real){real.value=picker.value;resetDailyEntryV10();updateDailyDateUIV10();status.textContent='اليوم المحدد للرصد: '+picker.value+' — '+dayNameV10(picker.value)+' (كل يوم منفصل عن الآخر)';}};}
    updateDailyDateUIV10(); status.textContent='اليوم المحدد للرصد: '+currentDailyDateV10()+' — '+dayNameV10(currentDailyDateV10())+' (كل يوم منفصل عن الآخر)';
  }
  function installWafdeenBar(){
    var el=document.getElementById('wafdeenDailyDate'); if(!el || document.getElementById('v10WafdeenDateBar'))return;
    var host=el.closest('.form-group')||el.parentElement; if(!host)return;
    var bar=document.createElement('div'); bar.id='v10WafdeenDateBar'; bar.className='v10-daily-date-bar';
    bar.innerHTML='<span class="v10-date-label">📅 تاريخ رصد الوافدين:</span><button type="button" class="action-btn btn-warning" onclick="v10SetWafdeenDate(-1)">◀ اليوم السابق</button><button type="button" class="action-btn btn-warning" onclick="v10SetWafdeenDate(1)">اليوم التالي ▶</button><button type="button" class="action-btn btn-export" onclick="v10GoWafdeenToday()">اليوم</button>';
    var status=document.createElement('div'); status.id='v10WafdeenDateStatus'; status.className='v10-daily-date-status';
    host.parentNode.insertBefore(bar,host); bar.insertAdjacentElement('afterend',status);
    status.textContent='اليوم المحدد: '+currentWafdeenDateV10()+' — كل يوم منفصل عن الآخر';
  }
  // إعادة بناء قائمة الطلاب بحيث كل يوم يبدأ من قائمة الطلاب الأصلية، مع توضيح المسجل في اليوم الحالي فقط.
  var oldUpdate=window.updateStudentListDropdown;
  window.updateStudentListDropdown=function(){
    try{
      var hiddenClass=document.getElementById('classSelect'), visibleClass=document.getElementById('dailyClassSelect');
      var className=hiddenClass?hiddenClass.value:(visibleClass?visibleClass.value:'');
      var studentSelect=document.getElementById('studentNameSelect');
      if(!studentSelect)return typeof oldUpdate==='function'?oldUpdate():undefined;
      var previousStudent=String(studentSelect.value||'').trim();
      if(visibleClass && hiddenClass && visibleClass.value!==hiddenClass.value) visibleClass.value=hiddenClass.value;
      var date=currentDailyDateV10();
      var records=Array.isArray(window.dailyRecords)?window.dailyRecords:[];
      var todayMap={}; records.forEach(function(r){if(!r._deleted && String(r.className||'')===String(className||'') && String(r.dateISO||'').slice(0,10)===date) todayMap[String(r.studentName||'').trim()]=true;});
      var students=(Array.isArray(window.studentsData)?window.studentsData:[]).filter(function(s){return String(s.className||'')===String(className||'') && !s._deleted;}).sort(function(a,b){return String(a.name||'').localeCompare(String(b.name||''),'ar');});
      studentSelect.innerHTML='<option value="">اختر اسم الطالب/الطالبة</option>';
      students.forEach(function(s){var name=String(s.name||'').trim(), done=!!todayMap[name]; studentSelect.innerHTML+='<option value="'+name.replace(/"/g,'&quot;')+'">'+name+' — '+(done?'تم رصده اليوم':'غير مسجل اليوم')+'</option>';});
      if(!students.length)studentSelect.innerHTML='<option value="">لا توجد أسماء مسجلة في هذا الصف</option>';
      var keepStudent=!!previousStudent && students.some(function(s){return String(s.name||'').trim()===previousStudent;});
      studentSelect.value=keepStudent?previousStudent:'';
      var ws=document.getElementById('daily-workspace');
      if(!keepStudent && ws)ws.classList.remove('visible');
      var info=document.getElementById('dailyStudentClass');
      if(!keepStudent && info)info.textContent='';
    }catch(e){console.error('V10 updateStudentListDropdown',e);if(typeof oldUpdate==='function')return oldUpdate();}
  };
  // منع اعتبار سجل يوم آخر سجلًا لليوم الحالي.
  window.hasDailyRecordForSelectedStudent_=function(){
    var cls=(document.getElementById('classSelect')||{}).value||'';
    var date=(document.getElementById('recordDate')||{}).value||'';
    var name=((document.getElementById('studentNameSelect')||{}).value||'').trim();
    if(!cls||!date||!name)return null;
    var arr=Array.isArray(window.dailyRecords)?window.dailyRecords:[];
    return arr.find(function(r){return !r._deleted && String(r.className||'')===String(cls) && String(r.dateISO||'').slice(0,10)===String(date).slice(0,10) && String(r.studentName||'').trim()===name;})||null;
  };
  // عند فتح صفحة الرصد أو تغيير التاريخ، نعيد تحميل سياق اليوم فقط.
  function bootV10(){
    if(window.__wafdeenV10Booted) return;
    window.__wafdeenV10Booted=true;
    try{
      var rd=document.getElementById('recordDate');if(rd && !/^\d{4}-\d{2}-\d{2}$/.test(rd.value))rd.value=isoLocalV10(new Date());
      installDailyBar();installWafdeenBar();
      try{ if(typeof applyDailyDateEditPermission_==='function') applyDailyDateEditPermission_(); }catch(e){}
      var todayOnly=isoLocalV10(new Date());
      var realDate=document.getElementById('recordDate');if(realDate)realDate.value=todayOnly;
      var picker=document.getElementById('v10DailyDatePicker');if(picker)picker.value=todayOnly;
      updateDailyDateUIV10();
      if(typeof window.updateStudentListDropdown==='function')window.updateStudentListDropdown();
    }catch(e){console.error('V10 date boot',e);}
  }
  document.addEventListener('DOMContentLoaded',bootV10);
  setTimeout(bootV10,500);
  setTimeout(bootV10,1500);
  setTimeout(function(){ try{ if(typeof applyDailyDateEditPermission_==='function') applyDailyDateEditPermission_(); }catch(e){} },2000);
})();
