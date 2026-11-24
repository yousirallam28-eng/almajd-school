/* ===== ./js/features/quick-registration.js ===== */

(function(){
'use strict';
var QUICK_FIELDS=['newLesson','oldRevision','recitation','behavior','attendance','homework','tajweed'];
var QUICK_LABELS={newLesson:'الجديد',oldRevision:'الماضي',recitation:'التلاوة',behavior:'السلوك',attendance:'الحضور',homework:'الواجب',tajweed:'التجويد'};
function qesc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(m){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];});}
function qtoday(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function qteacher(){return window.currentTeacher||null;}
function qisAdmin(){var t=qteacher();return !!t&&String(t.username||'').trim()==='admin';}
function qowns(c){try{return typeof teacherOwnsClass_==='function'&&teacherOwnsClass_(c);}catch(e){var t=qteacher();return !!t&&(qisAdmin()||String(t.assignedClass||'')===String(c||''));}}
function qdateAllowed(){var t=qteacher();return qisAdmin()||!!(t&&t.quickRegistrationDateEditAllowed===true);}
function qdateStorageKey(){var t=qteacher()||{};return 'majd.quickRegistration.date.'+encodeURIComponent(String(t.id||t.username||'guest').trim().toLowerCase());}
function qrememberDate(value){try{if(/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))window.localStorage.setItem(qdateStorageKey(),String(value));}catch(e){}}
function qlastDate(){try{var d=window.localStorage.getItem(qdateStorageKey())||'';return qdateAllowed()&&/^\d{4}-\d{2}-\d{2}$/.test(d)?d:'';}catch(e){return '';}}
function qrecordKey(studentId,cls,date){return typeof dailyStableRecordId_==='function'?dailyStableRecordId_(studentId,cls,date):'daily_'+String(studentId)+'_'+String(cls)+'_'+String(date).slice(0,10);}
function qstudentId(name,cls){try{return dailyStudentId_(name,cls);}catch(e){var st=(window.studentsData||[]).find(function(x){return String(x.name||'').trim()===String(name||'').trim()&&String(x.className||'')===String(cls||'');});return st?String(st.studentId||st.id):'legacy_'+String(name)+'_'+String(cls);}}
function qfind(name,cls,date){var sid=qstudentId(name,cls),id=qrecordKey(sid,cls,date),list=window.dailyRecords||[];return list.find(function(r){return !r._deleted&&!r._legacyMigrated&&(String(r.id)===String(id)||(String(r.studentId||'')===String(sid)&&String(r.className||'')===String(cls)&&String(r.dateISO||'').slice(0,10)===String(date).slice(0,10)));})||null;}
function qclasses(){var all=window.ALL_CLASSES||[];var t=qteacher();if(qisAdmin()||String(t&&t.assignedClass||'')==='الكل')return all.slice();return all.filter(function(c){return qowns(c);});}
function qshowTab(){if(qteacher()&&String(qteacher().center||'')==='مشرف')return showMessage('app-msg','التسجيل السريع متاح للمدير والمدرسين فقط.','error');var btn=document.getElementById('quick-registration-tab-btn');if(btn)btn.classList.add('active');document.querySelectorAll('.sidebar-nav .tab-btn').forEach(function(b){if(b!==btn)b.classList.remove('active');});document.querySelectorAll('.tab-content').forEach(function(x){x.classList.remove('active');});var tab=document.getElementById('quick-registration-tab');if(tab)tab.classList.add('active');try{closeMainMenu();}catch(e){} qrender();}
window.openQuickRegistration=function(cls){if(!qowns(cls))return showMessage('app-msg','لا يمكنك الوصول إلى التسجيل السريع لهذا الفصل.','error');var cs=document.getElementById('quickClassSelect');if(cs){cs.value=cls;qstudents();}qshowTab();};
function qstudents(){var cls=(document.getElementById('quickClassSelect')||{}).value||'',sel=document.getElementById('quickStudentSelect'),prev=sel&&sel.value;if(!sel)return;var list=(window.studentsData||[]).filter(function(s){return String(s.className||'')===String(cls);}).sort(function(a,b){return String(a.name||'').localeCompare(String(b.name||''),'ar');});sel.innerHTML='<option value="">اختر الطالب</option>'+list.map(function(s){return '<option value="'+qesc(s.name)+'" data-id="'+qesc(s.studentId||s.id||'')+'">'+qesc(s.name)+'</option>';}).join('');if(prev&&list.some(function(s){return String(s.name)===String(prev);}))sel.value=prev;qload();}
function qsetDate(v){var input=document.getElementById('quickDate');if(!input)return;var d=v||qtoday();if(!qdateAllowed()&&d!==qtoday())d=qtoday();input.value=d;qrememberDate(d);qload();qrenderDateControls();}
function qchangeDate(delta){if(!qdateAllowed())return showMessage('app-msg','ليس لديك صلاحية الرجوع بالتاريخ في التسجيل السريع.','error');var input=document.getElementById('quickDate');var d=new Date((input&&input.value||qtoday())+'T00:00:00');d.setDate(d.getDate()+Number(delta||0));qsetDate(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));}
function qrenderDateControls(){var b=document.getElementById('quickDateNav');if(!b)return;b.style.display=qdateAllowed()?'flex':'none';}
var qEditingId='';
function qtoggleEntryPanel(name){var panel=document.getElementById('quick-entry-panel'),gate=document.getElementById('quick-entry-gate'),ready=!!String(name||'').trim();if(panel){panel.classList.toggle('is-ready',ready);panel.setAttribute('aria-hidden',ready?'false':'true');}if(gate){gate.classList.toggle('is-hidden',ready);gate.textContent=ready?'تم اختيار الطالب — أدخل الدرجات ثم احفظ التسجيل.':'👤 اختر الطالب أولاً لعرض قائمة التسجيل';}}
function qupdateSaveLock(record){var saveBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave()"]'),absentBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave(true)"]'),hasRecord=!!record,editing=hasRecord&&String(qEditingId)===String(record.id||record.recordId||'');[saveBtn,absentBtn].forEach(function(btn){if(!btn)return;var busy=btn.textContent.indexOf('جارٍ الحفظ')>=0;if(!busy)btn.disabled=hasRecord&&!editing;btn.title=hasRecord&&!editing?'تم تسجيل هذا الطالب. استخدم زر تعديل من القائمة لتعديل السجل.':'';});}
function qbehaviorReasons(){
  if(typeof DAILY_BEHAVIOR_REASONS!=='undefined'&&Array.isArray(DAILY_BEHAVIOR_REASONS))return DAILY_BEHAVIOR_REASONS;
  return [{key:'late',label:'التأخر عن الحصة'},{key:'talking',label:'كثرة الكلام'},{key:'not_ready',label:'عدم الاستعداد'},{key:'bad_behavior',label:'سلوك غير مناسب'}];
}
function qrenderBehaviorReasons(){
  var sel=document.getElementById('quick-behavior-reason');if(!sel)return;
  var cur=sel.value;sel.innerHTML='<option value="">اختر سبب الخصم (اختياري)</option>'+qbehaviorReasons().map(function(r){return '<option value="'+qesc(r.label||r.key)+'">'+qesc(r.label||r.key)+'</option>';}).join('');if(cur)sel.value=cur;
}
function qtoggleBehaviorReason(){
  var panel=document.getElementById('quick-behavior-reason-panel');if(!panel)return;
  panel.hidden=!panel.hidden;if(!panel.hidden)qrenderBehaviorReasons();
}

function qload(){var cls=(document.getElementById('quickClassSelect')||{}).value||'',name=(document.getElementById('quickStudentSelect')||{}).value||'',date=(document.getElementById('quickDate')||{}).value||qtoday();var r=name?qfind(name,cls,date):null;QUICK_FIELDS.forEach(function(id){var el=document.getElementById('quick-'+id);if(el)el.value=r&&r[id]!==undefined&&r[id]!==null?r[id]:'';});var reason=document.getElementById('quick-behavior-reason');if(reason)reason.value=r&&r.behaviorReasonsText||'';var absent=document.getElementById('quick-absent');if(absent)absent.checked=!!(r&&((r.isAbsent===true)||String(r.attendanceStatus||'')==='absent'));var note=document.getElementById('quick-existing-note');if(note)note.textContent=r?(r.isAbsent||String(r.attendanceStatus||'')==='absent'?'🚫 هذا الطالب مسجل غيابًا اليوم. يمكنك إعادة تسجيله بالحضور إذا لزم الأمر.':'يوجد تسجيل لهذا الطالب في هذا اليوم. استخدم زر تعديل من القائمة لتغيير البيانات.'):'لا يوجد تسجيل لهذا الطالب في هذا اليوم.';qtoggleEntryPanel(name);qupdateSaveLock(r);qcalc();}
function qcalc(){var total=QUICK_FIELDS.reduce(function(sum,id){var v=Number(document.getElementById('quick-'+id)?.value);return sum+(Number.isFinite(v)?Math.max(0,Math.min(10,v)):0);},0);var el=document.getElementById('quick-total');if(el)el.value=total;}
function qclear(){QUICK_FIELDS.forEach(function(id){var el=document.getElementById('quick-'+id);if(el){el.value='';el.disabled=false;}});var reason=document.getElementById('quick-behavior-reason');if(reason)reason.value='';var a=document.getElementById('quick-absent');if(a)a.checked=false;qcalc();}
window.quickRegistrationToggleAbsent=function(){var a=document.getElementById('quick-absent'),on=!!(a&&a.checked);QUICK_FIELDS.forEach(function(id){var el=document.getElementById('quick-'+id);if(el){el.value=on?'0':'';el.disabled=on;}});if(a&&!on)QUICK_FIELDS.forEach(function(id){var el=document.getElementById('quick-'+id);if(el)el.disabled=false;});qcalc();};
window.quickRegistrationDateChange=function(){var input=document.getElementById('quickDate');var today=qtoday();if(!qdateAllowed()&&input&&input.value!==today){input.value=today;qrememberDate(today);return showMessage('app-msg','هذا المدرس مسموح له بالتسجيل في اليوم الحالي فقط.','error');}if(input)qrememberDate(input.value);qload();};
window.quickRegistrationSave=async function(forceAbsent){
  var saveBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave()"]');
  var absentBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave(true)"]');
  if(saveBtn&&saveBtn.disabled)return;
  try{
    var cls=(document.getElementById('quickClassSelect')||{}).value||'';
    var name=(document.getElementById('quickStudentSelect')||{}).value||'';
    var date=(document.getElementById('quickDate')||{}).value||qtoday();
    if(!cls||!name)return showMessage('app-msg','اختر الفصل والطالب أولاً.','error');
    if(!qowns(cls))return showMessage('app-msg','لا يمكنك التسجيل خارج الفصل المسموح لك به.','error');
    if(!qdateAllowed()&&date!==qtoday())return showMessage('app-msg','لا يمكنك تسجيل يوم سابق بهذا الحساب.','error');
    var sid=qstudentId(name,cls),id=qrecordKey(sid,cls,date),old=qfind(name,cls,date);
    var absent=forceAbsent===true;
    var now=new Date();
    var record=Object.assign({},old||{},{id:id,recordId:id,studentId:String(sid),studentName:name,className:cls,dateISO:date,dayName:(typeof updateDayOfWeek==='function'&&date===((document.getElementById('recordDate')||{}).value||''))?((document.getElementById('daySelect')||{}).value||''):['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][new Date(date+'T00:00:00').getDay()],teacherName:(qteacher()&&qteacher().username)||'',updatedAt:now.toISOString(),quickRegistration:true});
    if(absent){record.behaviorReasonsText='';record.attendance=0;record.behavior=0;record.newLesson=0;record.oldRevision=0;record.recitation=0;record.homework=0;record.tajweed=0;record.attendanceStatus='absent';record.isAbsent=true;record.absence=true;record._quickFields=['newLesson','oldRevision','recitation','behavior','attendance','homework','tajweed'];}
    else{
      var bad=[];
      QUICK_FIELDS.forEach(function(field){var raw=(document.getElementById('quick-'+field)||{}).value;if(String(raw||'').trim()==='')bad.push(QUICK_LABELS[field]);else{var n=Number(raw);if(!Number.isFinite(n)||n<0||n>10)bad.push(QUICK_LABELS[field]);else record[field]=n;}});
      if(bad.length)return showMessage('app-msg','يرجى إدخال الدرجات بشكل صحيح: '+bad.join('، '),'error');
      record.attendanceStatus='present';record.isAbsent=false;record.absence=false;record.behaviorReasonsText=String((document.getElementById('quick-behavior-reason')||{}).value||'').trim();record._quickFields=QUICK_FIELDS.slice();
    }
    record.total=typeof getDailyTotal==='function'?getDailyTotal(record):QUICK_FIELDS.reduce(function(sum,key){return sum+Number(record[key]||0);},0);
    record._dailyTypeSaved=Object.assign({},record._dailyTypeSaved||{},{new:true,old:true,recitation:true});
    if(!window.localIsAvailable||!window.localIsAvailable()||!window.MajdLocalDataAPI||typeof window.MajdLocalDataAPI.writeRecord!=='function')throw new Error('اتصال الحفظ غير متاح؛ لم يتم تسجيل البيانات.');
    if(saveBtn){saveBtn.disabled=true;saveBtn.dataset.oldText=saveBtn.textContent;saveBtn.textContent='⏳ جارٍ الحفظ...';}
    if(absentBtn){absentBtn.disabled=true;absentBtn.dataset.oldText=absentBtn.textContent;absentBtn.textContent='⏳ جارٍ الحفظ...';}
    await window.MajdLocalDataAPI.writeRecord('dailyRecords',id,record,{merge:true});
    if(typeof window.dailyRemoveDraftForContext_==='function')window.dailyRemoveDraftForContext_(name,cls,date,(window.currentTeacher&&window.currentTeacher.username)||'');
    qrememberDate(date);
    var idx=(window.dailyRecords||[]).findIndex(function(r){return String(r.id)===String(id);});
    if(idx>=0)window.dailyRecords[idx]=Object.assign({},window.dailyRecords[idx],record);else(window.dailyRecords||(window.dailyRecords=[])).push(record);
    try{memoryStorage.setItem('dailyRecords',JSON.stringify(window.dailyRecords));}catch(e){}
    try{if(typeof renderDailyTable==='function')renderDailyTable();if(typeof renderManagerView==='function')renderManagerView();if(typeof renderClassStatusTable==='function')renderClassStatusTable();}catch(e){}
    qrenderTable();qEditingId='';showMessage('app-msg',absent?'تم تسجيل غياب '+name+' في الرصد اليومي بنجاح ✅':'تم حفظ التسجيل السريع لـ '+name+' داخل سجلات الرصد اليومي ✅','success');qload();
  }catch(e){console.error('quickRegistrationSave',e);showMessage('app-msg','تعذر حفظ التسجيل السريع: '+(e.message||e),'error');}
finally{if(saveBtn){saveBtn.disabled=false;saveBtn.textContent=saveBtn.dataset.oldText||'💾 حفظ التسجيل';}if(absentBtn){absentBtn.disabled=false;absentBtn.textContent=absentBtn.dataset.oldText||'🚫 غياب (صفر لليوم كامل)';}var lockCls=(document.getElementById('quickClassSelect')||{}).value||'',lockName=(document.getElementById('quickStudentSelect')||{}).value||'',lockDate=(document.getElementById('quickDate')||{}).value||qtoday();qupdateSaveLock(lockName?qfind(lockName,lockCls,lockDate):null);}
};
window.quickRegistrationEdit=function(id){var rid=String(id||''),r=(window.dailyRecords||[]).find(function(x){return !x._deleted&&String(x.id||x.recordId||'')===rid;});if(!r)return showMessage('app-msg','لم يتم العثور على السجل المطلوب تعديله.','error');if(!qowns(r.className))return showMessage('app-msg','لا يمكنك تعديل سجل خارج الفصل المسموح لك به.','error');qEditingId=rid;var cls=document.getElementById('quickClassSelect'),student=document.getElementById('quickStudentSelect');if(cls){cls.value=String(r.className||'');qstudents();}if(student){student.value=String(r.studentName||'');}qload();var panel=document.getElementById('quick-entry-panel');if(panel)panel.scrollIntoView({behavior:'smooth',block:'center'});showMessage('app-msg','تم تحميل سجل '+(r.studentName||'')+' للتعديل.','info');};
window.quickRegistrationDelete=async function(id){var rid=String(id||''),r=(window.dailyRecords||[]).find(function(x){return !x._deleted&&String(x.id||x.recordId||'')===rid;});if(!r)return showMessage('app-msg','لم يتم العثور على السجل المطلوب حذفه.','error');if(!qowns(r.className))return showMessage('app-msg','لا يمكنك حذف سجل خارج الفصل المسموح لك به.','error');if(!window.confirm('هل تريد حذف تسجيل '+(r.studentName||'')+' بتاريخ '+(r.dateISO||'')+'؟'))return;try{if(!window.localIsAvailable||!window.localIsAvailable()||!window.MajdLocalDataAPI||typeof window.MajdLocalDataAPI.deleteRecord!=='function')throw new Error('اتصال الحذف غير متاح.');await window.MajdLocalDataAPI.deleteRecord('dailyRecords',rid);if(typeof window.dailyRemoveDraftForContext_==='function')window.dailyRemoveDraftForContext_(r.studentName,r.className,r.dateISO,(window.currentTeacher&&window.currentTeacher.username)||'');window.dailyRecords=(window.dailyRecords||[]).filter(function(x){return String(x.id||x.recordId||'')!==rid;});try{memoryStorage.setItem('dailyRecords',JSON.stringify(window.dailyRecords));}catch(e){}try{if(typeof renderDailyTable==='function')renderDailyTable();if(typeof renderManagerView==='function')renderManagerView();if(typeof renderClassStatusTable==='function')renderClassStatusTable();}catch(e){}qrenderTable();qEditingId='';qload();showMessage('app-msg','تم حذف تسجيل '+(r.studentName||'')+' بنجاح.','success');}catch(e){console.error('quickRegistrationDelete',e);showMessage('app-msg','تعذر حذف التسجيل: '+(e.message||e),'error');}};
function qrenderTable(){var body=document.querySelector('#quickRegistrationTable tbody');if(!body)return;var cls=(document.getElementById('quickClassSelect')||{}).value||'',date=(document.getElementById('quickDate')||{}).value||'';var list=(window.dailyRecords||[]).filter(function(r){return !r._deleted&&(!cls||String(r.className)===String(cls))&&(!date||String(r.dateISO||'').slice(0,10)===String(date).slice(0,10))&&r.quickRegistration===true&&qowns(r.className);}).sort(function(a,b){return String(a.studentName||'').localeCompare(String(b.studentName||''),'ar');});body.innerHTML=list.length?list.map(function(r){var abs=!!r.isAbsent||String(r.attendanceStatus||'')==='absent',rid=qesc(encodeURIComponent(String(r.id||r.recordId||'')));return '<tr><td>'+qesc(r.className)+'</td><td>'+qesc(r.studentName)+'</td><td>'+qesc(r.dateISO)+'</td>'+QUICK_FIELDS.map(function(k){return '<td>'+ (abs&&k!=='attendance'?'-':(r[k]===undefined||r[k]===null||r[k]===''?'-':qesc(r[k]))) +'</td>';}).join('')+'<td><strong>'+qesc(typeof getDailyTotal==='function'?getDailyTotal(r):r.total||0)+'</strong></td><td class="quick-actions"><button type="button" class="action-btn btn-edit" onclick="quickRegistrationEdit(decodeURIComponent(\''+rid+'\'))">✏️ تعديل</button><button type="button" class="action-btn btn-danger" onclick="quickRegistrationDelete(decodeURIComponent(\''+rid+'\'))">🗑️ حذف</button></td></tr>';}).join(''):'<tr><td colspan="12">لا توجد سجلات تسجيل سريع لهذا التاريخ.</td></tr>';}
function qrender(){var cls=document.getElementById('quickClassSelect');if(cls){var cur=cls.value,arr=qclasses();cls.innerHTML=arr.map(function(c){return '<option value="'+qesc(c)+'">'+qesc(c)+'</option>';}).join('');if(arr.indexOf(cur)>=0)cls.value=cur;else if(arr.length)cls.value=arr[0];}var date=document.getElementById('quickDate');if(date&&!date.value)date.value=qlastDate()||qtoday();if(date&&!qdateAllowed()&&date.value!==qtoday())date.value=qtoday();if(date)qrememberDate(date.value);qstudents();qrenderDateControls();qrenderTable();}
function installUI(){if(document.getElementById('quick-registration-tab'))return;var side=document.querySelector('.sidebar-nav .tabs');if(!side)return;var dailyBtn=side.querySelector('#daily-tab-btn')||side.querySelector('button[onclick*="daily-tab"]');var btn=document.createElement('button');btn.className='tab-btn';btn.id='quick-registration-tab-btn';btn.type='button';btn.innerHTML='⚡ التسجيل السريع';btn.onclick=qshowTab;if(dailyBtn&&dailyBtn.parentNode)dailyBtn.insertAdjacentElement('afterend',btn);else side.prepend(btn);
var main=document.querySelector('main.content-area');if(!main)return;var tab=document.createElement('div');tab.className='tab-content';tab.id='quick-registration-tab';tab.innerHTML='<div class="card-view"><h3 class="card-title">⚡ التسجيل السريع</h3><div class="quick-registration-note">يسجل هذا القسم في نفس سجلات الرصد اليومي. عند إعادة فتح نفس الطالب والتاريخ ستظهر البيانات المحفوظة وسيتم تحديث نفس السجل بدل إنشاء سجل جديد.</div><div class="quick-registration-toolbar"><div class="form-group"><label>الفصل:</label><select id="quickClassSelect" onchange="quickRegistrationClassChange()"></select></div><div class="form-group"><label>الطالب:</label><select id="quickStudentSelect" onchange="quickRegistrationStudentChange()"></select></div><div class="form-group"><label>التاريخ:</label><div id="quickDateNav" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><button class="action-btn btn-warning" type="button" onclick="quickRegistrationChangeDate(-1)">◀ السابق</button><input id="quickDate" type="date" onchange="quickRegistrationDateChange()" style="flex:1;min-width:150px"><button class="action-btn btn-warning" type="button" onclick="quickRegistrationChangeDate(1)">التالي ▶</button><button class="action-btn btn-export" type="button" onclick="quickRegistrationGoToday()">اليوم</button></div></div></div><div id="quick-entry-gate" class="quick-entry-gate" role="status" aria-live="polite">👤 اختر الطالب أولاً لعرض قائمة التسجيل</div><div id="quick-entry-panel" class="quick-entry-panel"><div id="quick-existing-note" class="quick-registration-note" style="margin-top:12px"></div><div class="form-grid"><div class="form-group"><label>الجديد (10):</label><input id="quick-newLesson" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"></div><div class="form-group"><label>الماضي (10):</label><input id="quick-oldRevision" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"></div><div class="form-group"><label>التلاوة (10):</label><input id="quick-recitation" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"></div><div class="form-group quick-behavior-field"><label>السلوك (10): <button type="button" class="quick-behavior-info-btn" title="اختيار سبب خصم السلوك" onclick="qtoggleBehaviorReason()">ⓘ</button></label><input id="quick-behavior" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"><div id="quick-behavior-reason-panel" hidden><select id="quick-behavior-reason"><option value="">اختر سبب الخصم (اختياري)</option></select></div></div><div class="form-group"><label>الحضور (10):</label><input id="quick-attendance" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"></div><div class="form-group"><label>الواجب (10):</label><input id="quick-homework" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"></div><div class="form-group"><label>التجويد (10):</label><input id="quick-tajweed" type="number" placeholder="0 - 10" min="0" max="10" oninput="quickRegistrationRecalc()"></div><div class="form-group"><label>المجموع:</label><input id="quick-total" type="number" readonly></div></div><div class="btn-group"><button class="action-btn btn-save" type="button" onclick="quickRegistrationSave()">💾 حفظ التسجيل</button><button type="button" class="action-btn btn-danger quick-absent-action" onclick="quickRegistrationSave(true)">🚫 غياب (صفر لليوم كامل)</button><button class="action-btn btn-warning" type="button" onclick="quickRegistrationClear()">🧹 تفريغ</button></div></div></div><div class="card-view quick-registration-table"><h3 class="card-title">📋 سجلات التسجيل السريع</h3><div class="table-responsive"><table id="quickRegistrationTable"><thead><tr><th>الفصل</th><th>الطالب</th><th>التاريخ</th><th>الجديد</th><th>الماضي</th><th>التلاوة</th><th>السلوك</th><th>الحضور</th><th>الواجب</th><th>التجويد</th><th>المجموع</th><th>الإجراءات</th></tr></thead><tbody></tbody></table></div></div></div>';main.appendChild(tab);qrenderBehaviorReasons();
}
window.quickRegistrationClassChange=function(){qstudents();};window.quickRegistrationStudentChange=function(){qload();};window.quickRegistrationRecalc=function(){qcalc();};window.quickRegistrationClear=function(){qclear();};window.quickRegistrationChangeDate=function(d){qchangeDate(d);};window.quickRegistrationGoToday=function(){qsetDate(qtoday());};
var GENERAL_QUICK_FIELDS=QUICK_FIELDS.slice();
var SHARIA_QUICK_FIELDS=['attendance','behavior','subject','examScore'];
QUICK_LABELS.subject='المقرر';QUICK_LABELS.examScore='درجة الامتحان';
function qisShariaClass(cls){return String(cls||'').trim()==='أولى شرعي';}
function qsetClassFields(cls){
  var isSharia=qisShariaClass(cls);
  QUICK_FIELDS=isSharia?SHARIA_QUICK_FIELDS.slice():GENERAL_QUICK_FIELDS.slice();
  ['newLesson','oldRevision','recitation','behavior','attendance','homework','tajweed','subject','examScore'].forEach(function(id){
    var input=document.getElementById('quick-'+id),group=input&&input.closest('.form-group');
    if(group)group.style.display=QUICK_FIELDS.indexOf(id)>=0?'':'none';
  });
  var total=document.getElementById('quick-total'),totalGroup=total&&total.closest('.form-group');if(totalGroup)totalGroup.style.display=isSharia?'none':'';
  var reasonButton=document.querySelector('#quick-registration-tab .quick-behavior-info-btn'),reasonPanel=document.getElementById('quick-behavior-reason-panel');
  if(reasonButton)reasonButton.style.display=isSharia?'none':'';if(reasonPanel&&isSharia)reasonPanel.hidden=true;
}
var qfindBase=qfind;
qfind=function(name,cls,date){
  if(!qisShariaClass(cls))return qfindBase(name,cls,date);
  var student=(window.studentsData||[]).find(function(s){return String(s.name||'').trim()===String(name||'').trim()&&String(s.className||'').trim()==='أولى شرعي';});
  var sid=String(student&&(student.id||student.studentId)||qstudentId(name,cls)),idPart=String(student&&(student.id||student.name)||sid),id='sharia_'+idPart+'_'+String(date||'').slice(0,10);
  return (window.shariaGradesData||[]).find(function(r){var recordSid=String(r.studentId||'');return !r._deleted&&String(r.className||'').trim()==='أولى شرعي'&&String(r.dateISO||'').slice(0,10)===String(date||'').slice(0,10)&&(String(r.id||'')===id||(recordSid&&recordSid===sid)||(!recordSid&&String(r.studentName||'')===String(name||'')));})||null;
};
var qstudentsBase=qstudents;
qstudents=function(){var cls=(document.getElementById('quickClassSelect')||{}).value||'';qsetClassFields(cls);qstudentsBase();qrenderTable();};
var qcalcBase=qcalc;
qcalc=function(){if(!qisShariaClass((document.getElementById('quickClassSelect')||{}).value)){qcalcBase();return;}var exam=Number((document.getElementById('quick-examScore')||{}).value);var total=document.getElementById('quick-total');if(total)total.value=Number.isFinite(exam)?Math.max(0,Math.min(100,exam)):0;};
var qtoggleAbsentBase=window.quickRegistrationToggleAbsent;
window.quickRegistrationToggleAbsent=function(){if(!qisShariaClass((document.getElementById('quickClassSelect')||{}).value)){if(qtoggleAbsentBase)qtoggleAbsentBase();return;}var on=!!((document.getElementById('quick-absent')||{}).checked);['attendance','behavior','examScore'].forEach(function(id){var el=document.getElementById('quick-'+id);if(el){el.value=on?'0':'';el.disabled=on;}});var subject=document.getElementById('quick-subject');if(subject)subject.disabled=on;qcalc();};
var qrenderTableBase=qrenderTable;
qrenderTable=function(){
  var body=document.querySelector('#quickRegistrationTable tbody'),table=document.getElementById('quickRegistrationTable');if(!body||!table){qrenderTableBase();return;}
  var cls=(document.getElementById('quickClassSelect')||{}).value||'',date=(document.getElementById('quickDate')||{}).value||'',isSharia=qisShariaClass(cls),fields=QUICK_FIELDS.slice();
  var labels={newLesson:'الجديد',oldRevision:'الماضي',recitation:'التلاوة',behavior:'السلوك',attendance:'الحضور',homework:'الواجب',tajweed:'التجويد',subject:'المقرر',examScore:'درجة الامتحان'};
  var header=table.querySelector('thead');if(header)header.innerHTML='<tr><th>الفصل</th><th>الطالب</th><th>التاريخ</th>'+fields.map(function(k){return '<th>'+qesc(labels[k]||k)+'</th>';}).join('')+(isSharia?'':'<th>المجموع</th>')+'<th>الإجراءات</th></tr>';
  var source=isSharia?(window.shariaGradesData||[]):(window.dailyRecords||[]);
  var list=source.filter(function(r){return !r._deleted&&(!cls||String(r.className)===String(cls))&&(!date||String(r.dateISO||'').slice(0,10)===String(date).slice(0,10))&&(isSharia||r.quickRegistration===true)&&qowns(r.className);}).sort(function(a,b){return String(a.studentName||'').localeCompare(String(b.studentName||''),'ar');});
  var colspan=3+fields.length+(isSharia?0:1)+1;
  body.innerHTML=list.length?list.map(function(r){var absent=!!r.isAbsent||!!r.absent||String(r.attendanceStatus||'')==='absent',rid=qesc(encodeURIComponent(String(r.id||r.recordId||'')));
    var values=fields.map(function(k){var value=r[k];if(absent&&!isSharia&&k!=='attendance')return '<td>-</td>';return '<td>'+(value===undefined||value===null||value===''?'-':qesc(value))+'</td>';}).join('');
    var total=isSharia?'':'<td><strong>'+qesc(typeof getDailyTotal==='function'?getDailyTotal(r):r.total||0)+'</strong></td>';
    return '<tr><td>'+qesc(r.className)+'</td><td>'+qesc(r.studentName)+'</td><td>'+qesc(r.dateISO)+'</td>'+values+total+'<td class="quick-actions"><button type="button" class="action-btn btn-edit" onclick="quickRegistrationEdit(decodeURIComponent(\''+rid+'\'))">✏️ تعديل</button><button type="button" class="action-btn btn-danger" onclick="quickRegistrationDelete(decodeURIComponent(\''+rid+'\'))">🗑️ حذف</button></td></tr>';
  }).join(''):'<tr><td colspan="'+colspan+'">لا توجد سجلات تسجيل سريع لهذا التاريخ.</td></tr>';
};
var installUIBase=installUI;
installUI=function(){
  installUIBase();
  var grid=document.querySelector('#quick-registration-tab #quick-entry-panel .form-grid');
  if(grid&&!document.getElementById('quick-subject')){
    var subject=document.createElement('div');subject.className='form-group';subject.innerHTML='<label for="quick-subject">المقرر:</label><input id="quick-subject" type="text" placeholder="اكتب مقرر اليوم">';
    var exam=document.createElement('div');exam.className='form-group';exam.innerHTML='<label for="quick-examScore">درجة الامتحان (من 100):</label><input id="quick-examScore" type="number" min="0" max="100" placeholder="0 - 100" oninput="quickRegistrationRecalc()">';
    var total=(document.getElementById('quick-total')||{}).closest&&document.getElementById('quick-total').closest('.form-group');
    if(total){grid.insertBefore(subject,total);grid.insertBefore(exam,total);}else{grid.appendChild(subject);grid.appendChild(exam);}
  }
  qsetClassFields((document.getElementById('quickClassSelect')||{}).value||'');
};
var quickSaveBase=window.quickRegistrationSave;
window.quickRegistrationSave=async function(forceAbsent){
  var cls=(document.getElementById('quickClassSelect')||{}).value||'';
  if(!qisShariaClass(cls))return quickSaveBase.apply(this,arguments);
  var name=(document.getElementById('quickStudentSelect')||{}).value||'',date=(document.getElementById('quickDate')||{}).value||qtoday();
  var saveBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave()"]'),absentBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave(true)"]');
  if(!cls||!name)return showMessage('app-msg','اختر الفصل والطالب أولاً.','error');
  if(!qowns(cls))return showMessage('app-msg','لا يمكنك التسجيل خارج الفصل المسموح لك به.','error');
  if(!qdateAllowed()&&date!==qtoday())return showMessage('app-msg','لا يمكنك تسجيل يوم سابق بهذا الحساب.','error');
  if(saveBtn&&saveBtn.disabled)return;
  try{
    var old=qfind(name,cls,date),student=(window.studentsData||[]).find(function(s){return String(s.name||'').trim()===String(name).trim()&&String(s.className||'').trim()==='أولى شرعي';});
    var sid=String(student&&(student.id||student.studentId)||qstudentId(name,cls)),idPart=String(student&&(student.id||student.name)||sid),id=String(old&&old.id||('sharia_'+idPart+'_'+date)),absent=forceAbsent===true;
    var attendanceRaw=String((document.getElementById('quick-attendance')||{}).value||'').trim(),behaviorRaw=String((document.getElementById('quick-behavior')||{}).value||'').trim(),subject=String((document.getElementById('quick-subject')||{}).value||'').trim(),examRaw=String((document.getElementById('quick-examScore')||{}).value||'').trim();
    var attendance,behavior,exam;
    if(absent){attendance=0;behavior=0;exam=0;subject=subject||(old&&old.subject)||'';}
    else{
      if(attendanceRaw===''||behaviorRaw===''||examRaw==='')return showMessage('app-msg','أدخل الحضور والسلوك ودرجة الامتحان.','error');
      attendance=Number(attendanceRaw);behavior=Number(behaviorRaw);exam=Number(examRaw);
      if(!Number.isFinite(attendance)||attendance<0||attendance>10)return showMessage('app-msg','الحضور يجب أن يكون من 0 إلى 10.','error');
      if(!Number.isFinite(behavior)||behavior<0||behavior>10)return showMessage('app-msg','السلوك يجب أن يكون من 0 إلى 10.','error');
      if(!Number.isFinite(exam)||exam<0||exam>100)return showMessage('app-msg','درجة الامتحان يجب أن تكون من 0 إلى 100.','error');
      if(!subject&&attendance>0)return showMessage('app-msg','اكتب اسم المقرر.','error');
    }
    var dateObj=new Date(date+'T00:00:00'),dayNames=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    var record=Object.assign({},old||{},{id:id,recordId:id,studentId:sid,studentName:name,className:'أولى شرعي',dateISO:date,dayName:dayNames[dateObj.getDay()]||'',teacherName:(qteacher()&&qteacher().username)||'',attendance:attendance,behavior:behavior,subject:subject,examScore:exam,absent:absent||attendance===0,isAbsent:absent||attendance===0,absence:absent||attendance===0,attendanceStatus:absent||attendance===0?'absent':'present',total:exam,quickRegistration:true,_quickFields:SHARIA_QUICK_FIELDS.slice(),updatedAt:new Date().toISOString()});
    if(!window.localIsAvailable||!window.localIsAvailable()||!window.MajdLocalDataAPI||typeof window.MajdLocalDataAPI.writeRecord!=='function')throw new Error('اتصال الحفظ غير متاح؛ لم يتم تسجيل البيانات.');
    if(saveBtn){saveBtn.disabled=true;saveBtn.dataset.oldText=saveBtn.textContent;saveBtn.textContent='⏳ جارٍ الحفظ...';}if(absentBtn){absentBtn.disabled=true;absentBtn.dataset.oldText=absentBtn.textContent;absentBtn.textContent='⏳ جارٍ الحفظ...';}
    await window.MajdLocalDataAPI.writeRecord('shariaGrades',id,record,{merge:true});
    var records=window.shariaGradesData||(window.shariaGradesData=[]),idx=records.findIndex(function(r){return String(r.id||'')===id;});if(idx>=0)records[idx]=Object.assign({},records[idx],record);else records.push(record);
    try{memoryStorage.setItem('shariaGradesData',JSON.stringify(records));}catch(e){}
    qrememberDate(date);qrenderTable();qEditingId='';if(typeof renderShariaGradesReport==='function')renderShariaGradesReport();if(typeof renderShariaDailyLog_==='function')renderShariaDailyLog_();if(typeof renderStudentDataAnalysis==='function')renderStudentDataAnalysis();
    showMessage('app-msg',absent?'تم تسجيل غياب '+name+' في الرصد الشرعي بنجاح ✅':'تم حفظ التسجيل الشرعي السريع لـ '+name+' ✅','success');qload();
  }catch(e){console.error('Sharia quick registration save',e);showMessage('app-msg','تعذر حفظ التسجيل الشرعي: '+(e.message||e),'error');}
  finally{if(saveBtn){saveBtn.disabled=false;saveBtn.textContent=saveBtn.dataset.oldText||'💾 حفظ التسجيل';}if(absentBtn){absentBtn.disabled=false;absentBtn.textContent=absentBtn.dataset.oldText||'🚫 غياب (صفر لليوم كامل)';}qupdateSaveLock(name?qfind(name,cls,date):null);}
};
var quickEditBase=window.quickRegistrationEdit;
window.quickRegistrationEdit=function(id){var cls=(document.getElementById('quickClassSelect')||{}).value||'';if(!qisShariaClass(cls))return quickEditBase.apply(this,arguments);var record=(window.shariaGradesData||[]).find(function(r){return !r._deleted&&String(r.id||r.recordId||'')===String(id||'');});if(!record)return showMessage('app-msg','لم يتم العثور على السجل المطلوب تعديله.','error');if(!qowns(record.className))return showMessage('app-msg','لا يمكنك تعديل سجل خارج الفصل المسموح لك به.','error');qEditingId=String(id);var student=document.getElementById('quickStudentSelect');if(student)student.value=String(record.studentName||'');qload();var panel=document.getElementById('quick-entry-panel');if(panel)panel.scrollIntoView({behavior:'smooth',block:'center'});showMessage('app-msg','تم تحميل سجل '+(record.studentName||'')+' للتعديل.','info');};
var quickDeleteBase=window.quickRegistrationDelete;
window.quickRegistrationDelete=async function(id){var cls=(document.getElementById('quickClassSelect')||{}).value||'';if(!qisShariaClass(cls))return quickDeleteBase.apply(this,arguments);var rid=String(id||''),record=(window.shariaGradesData||[]).find(function(r){return !r._deleted&&String(r.id||r.recordId||'')===rid;});if(!record)return showMessage('app-msg','لم يتم العثور على السجل المطلوب حذفه.','error');if(!qowns(record.className))return showMessage('app-msg','لا يمكنك حذف سجل خارج الفصل المسموح لك به.','error');if(!window.confirm('هل تريد حذف تسجيل '+(record.studentName||'')+' بتاريخ '+(record.dateISO||'')+'؟'))return;try{if(!window.localIsAvailable||!window.localIsAvailable()||!window.MajdLocalDataAPI||typeof window.MajdLocalDataAPI.deleteRecord!=='function')throw new Error('اتصال الحذف غير متاح.');await window.MajdLocalDataAPI.deleteRecord('shariaGrades',rid);window.shariaGradesData=(window.shariaGradesData||[]).filter(function(r){return String(r.id||r.recordId||'')!==rid;});try{memoryStorage.setItem('shariaGradesData',JSON.stringify(window.shariaGradesData));}catch(e){}qrenderTable();if(typeof renderShariaGradesReport==='function')renderShariaGradesReport();if(typeof renderStudentDataAnalysis==='function')renderStudentDataAnalysis();qEditingId='';qload();showMessage('app-msg','تم حذف تسجيل '+(record.studentName||'')+' بنجاح.','success');}catch(e){console.error('Sharia quick registration delete',e);showMessage('app-msg','تعذر حذف التسجيل: '+(e.message||e),'error');}};
var FIFTH_QUICK_FIELDS=['attendance','behavior','recitation','recitationTopicToday','recitationPagesCount','recitationTopicRecited','recitationRecitationCount','homework','tajweed'];
function qisFifthClass(cls){return typeof isFifthClass==='function'?isFifthClass(String(cls||'')):String(cls||'').indexOf('خامسة')===0;}
QUICK_LABELS.recitationTopicToday='مقرر التلاوة اليوم';
QUICK_LABELS.recitationPagesCount='عدد الصفحات/الأجزاء (التلاوة)';
QUICK_LABELS.recitationTopicRecited='مقرر التلاوة الذي تم تسميعه';
QUICK_LABELS.recitationRecitationCount='عدد مرات تسميع التلاوة';
var qsetClassFieldsAfterSharia=qsetClassFields;
qsetClassFields=function(cls){
  qsetClassFieldsAfterSharia(cls);
  var isFifth=qisFifthClass(cls);
  if(isFifth)QUICK_FIELDS=FIFTH_QUICK_FIELDS.slice();
  ['newLesson','oldRevision','recitation','behavior','attendance','homework','tajweed','subject','examScore','recitationTopicToday','recitationPagesCount','recitationTopicRecited','recitationRecitationCount'].forEach(function(id){
    var input=document.getElementById('quick-'+id),group=input&&input.closest('.form-group');
    if(group)group.style.display=QUICK_FIELDS.indexOf(id)>=0?'':'none';
  });
  var reasonButton=document.querySelector('#quick-registration-tab .quick-behavior-info-btn'),reasonPanel=document.getElementById('quick-behavior-reason-panel');
  if(reasonButton)reasonButton.style.display=qisShariaClass(cls)?'none':'';
  if(reasonPanel&&qisShariaClass(cls))reasonPanel.hidden=true;
};
var qfindAfterSharia=qfind;
qfind=function(name,cls,date){
  if(!qisFifthClass(cls))return qfindAfterSharia(name,cls,date);
  var sid=qstudentId(name,cls),id=qrecordKey(sid,cls,date);
  return (window.dailyRecords||[]).find(function(r){return !r._deleted&&!r._legacyMigrated&&r.quickRegistration===true&&String(r.className||'')===String(cls)&&String(r.dateISO||'').slice(0,10)===String(date||'').slice(0,10)&&(String(r.id||r.recordId||'')===String(id)||String(r.studentId||'')===String(sid));})||null;
};
var qcalcAfterSharia=qcalc;
qcalc=function(){
  if(qisShariaClass((document.getElementById('quickClassSelect')||{}).value)){qcalcAfterSharia();return;}
  if(!qisFifthClass((document.getElementById('quickClassSelect')||{}).value)){qcalcAfterSharia();return;}
  var total=['attendance','behavior','recitation','homework','tajweed'].reduce(function(sum,id){var value=Number((document.getElementById('quick-'+id)||{}).value);return sum+(Number.isFinite(value)?Math.max(0,Math.min(10,value)):0);},0);
  var output=document.getElementById('quick-total');if(output)output.value=total;
};
var qrenderTableAfterSharia=qrenderTable;
qrenderTable=function(){
  var cls=(document.getElementById('quickClassSelect')||{}).value||'';
  if(!qisFifthClass(cls)){qrenderTableAfterSharia();return;}
  var body=document.querySelector('#quickRegistrationTable tbody'),table=document.getElementById('quickRegistrationTable');if(!body||!table){qrenderTableAfterSharia();return;}
  var date=(document.getElementById('quickDate')||{}).value||'',fields=FIFTH_QUICK_FIELDS.slice();
  var labels={attendance:'الحضور',behavior:'السلوك',recitation:'التلاوة',recitationTopicToday:'مقرر التلاوة اليوم',recitationPagesCount:'عدد الصفحات/الأجزاء (التلاوة)',recitationTopicRecited:'مقرر التلاوة الذي تم تسميعه',recitationRecitationCount:'عدد مرات تسميع التلاوة',homework:'الواجب',tajweed:'التجويد'};
  var head=table.querySelector('thead');if(head)head.innerHTML='<tr><th>الفصل</th><th>الطالب</th><th>التاريخ</th>'+fields.map(function(key){return '<th>'+qesc(labels[key])+'</th>';}).join('')+'<th>المجموع / 50</th><th>الإجراءات</th></tr>';
  var rows=(window.dailyRecords||[]).filter(function(r){return !r._deleted&&r.quickRegistration===true&&String(r.className||'')===String(cls)&&(!date||String(r.dateISO||'').slice(0,10)===String(date).slice(0,10))&&qowns(r.className);}).sort(function(a,b){return String(a.studentName||'').localeCompare(String(b.studentName||''),'ar');});
  body.innerHTML=rows.length?rows.map(function(r){var absent=!!r.isAbsent||String(r.attendanceStatus||'')==='absent',rid=qesc(encodeURIComponent(String(r.id||r.recordId||'')));var cells=fields.map(function(key){var value=r[key];if(absent&&key!=='attendance')return '<td>-</td>';return '<td>'+(value===undefined||value===null||value===''?'-':qesc(value))+'</td>';}).join('');return '<tr><td>'+qesc(r.className)+'</td><td>'+qesc(r.studentName)+'</td><td>'+qesc(r.dateISO)+'</td>'+cells+'<td><strong>'+qesc(typeof getDailyTotal==='function'?getDailyTotal(r):r.total||0)+'</strong></td><td class="quick-actions"><button type="button" class="action-btn btn-edit" onclick="quickRegistrationEdit(decodeURIComponent(\''+rid+'\'))">✏️ تعديل</button><button type="button" class="action-btn btn-danger" onclick="quickRegistrationDelete(decodeURIComponent(\''+rid+'\'))">🗑️ حذف</button></td></tr>';}).join(''):'<tr><td colspan="'+(fields.length+5)+'">لا توجد سجلات تسجيل سريع لهذا التاريخ.</td></tr>';
};
var installUIAfterSharia=installUI;
installUI=function(){
  installUIAfterSharia();
  var grid=document.querySelector('#quick-registration-tab #quick-entry-panel .form-grid');
  if(grid&&!document.getElementById('quick-recitationTopicToday')){
    var total=(document.getElementById('quick-total')||{}).closest&&document.getElementById('quick-total').closest('.form-group');
    var fifthFields=[
      {id:'recitationTopicToday',html:'<label for="quick-recitationTopicToday">مقرر التلاوة اليوم:</label><input id="quick-recitationTopicToday" type="text" placeholder="اكتب مقرر التلاوة اليوم">'},
      {id:'recitationPagesCount',html:'<label for="quick-recitationPagesCount">عدد الصفحات/الأجزاء (التلاوة):</label><input id="quick-recitationPagesCount" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="اكتب عدد الصفحات أو الأجزاء">'},
      {id:'recitationTopicRecited',html:'<label for="quick-recitationTopicRecited">مقرر التلاوة الذي تم تسميعه:</label><input id="quick-recitationTopicRecited" type="text" placeholder="اكتب المقرر الذي تم تسميعه">'},
      {id:'recitationRecitationCount',html:'<label for="quick-recitationRecitationCount">عدد التسميع (التلاوة):</label><select id="quick-recitationRecitationCount"><option value="1">مرة</option><option value="2">مرتين</option><option value="3">ثلاث مرات</option></select>'}
    ];
    fifthFields.forEach(function(field){var group=document.createElement('div');group.className='form-group';group.innerHTML=field.html;if(total)grid.insertBefore(group,total);else grid.appendChild(group);});
  }
  qsetClassFields((document.getElementById('quickClassSelect')||{}).value||'');
};
function qsaveFifthRegistration(forceAbsent){
  return (async function(){
    var cls=(document.getElementById('quickClassSelect')||{}).value||'',name=(document.getElementById('quickStudentSelect')||{}).value||'',date=(document.getElementById('quickDate')||{}).value||qtoday();
    var saveBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave()"]'),absentBtn=document.querySelector('#quick-registration-tab button[onclick="quickRegistrationSave(true)"]');
    if(!cls||!name)return showMessage('app-msg','اختر الفصل والطالب أولاً.','error');
    if(!qowns(cls))return showMessage('app-msg','لا يمكنك التسجيل خارج الفصل المسموح لك به.','error');
    if(!qdateAllowed()&&date!==qtoday())return showMessage('app-msg','لا يمكنك تسجيل يوم سابق بهذا الحساب.','error');
    if(saveBtn&&saveBtn.disabled)return;
    try{
      var old=qfind(name,cls,date),student=(window.studentsData||[]).find(function(s){return String(s.name||'').trim()===String(name).trim()&&String(s.className||'')===String(cls);});
      var sid=String(student&&(student.id||student.studentId)||qstudentId(name,cls)),id=String(old&&old.id||qrecordKey(sid,cls,date)),absent=forceAbsent===true;
      var read=function(key){return String((document.getElementById('quick-'+key)||{}).value||'').trim();};
      var attendance,behavior,recitation,homework,tajweed,topicToday,pages,topicRecited,count;
      if(absent){attendance=0;behavior=0;recitation=0;homework=0;tajweed=0;topicToday='';pages='';topicRecited='';count=1;}
      else{
        var numeric={attendance:'الحضور',behavior:'السلوك',recitation:'التلاوة',homework:'الواجب',tajweed:'التجويد'},values={};
        var invalid=[];Object.keys(numeric).forEach(function(key){var raw=read(key),number=Number(raw);if(raw===''||!Number.isFinite(number)||number<0||number>10)invalid.push(numeric[key]);else values[key]=number;});
        topicToday=read('recitationTopicToday');pages=read('recitationPagesCount');topicRecited=read('recitationTopicRecited');count=read('recitationRecitationCount');
        if(!topicToday)invalid.push('مقرر التلاوة اليوم');if(!/^[0-9]+$/.test(pages))invalid.push('عدد الصفحات/الأجزاء');if(!topicRecited)invalid.push('المقرر الذي تم تسميعه');if(!['1','2','3'].includes(count))invalid.push('عدد مرات التسميع');
        if(invalid.length)return showMessage('app-msg','يرجى إدخال البيانات المطلوبة بشكل صحيح: '+invalid.join('، '),'error');
        attendance=values.attendance;behavior=values.behavior;recitation=values.recitation;homework=values.homework;tajweed=values.tajweed;
        var maxRecitation=typeof dailyGradeFromRecitationCount==='function'?Number(dailyGradeFromRecitationCount(count)):({1:10,2:8,3:5}[count]);
        if(Number.isFinite(maxRecitation)&&recitation>maxRecitation)return showMessage('app-msg','درجة التلاوة لا تتجاوز '+maxRecitation+' حسب عدد مرات التسميع.','error');
      }
      var dateObj=new Date(date+'T00:00:00'),days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],now=new Date();
      var record=Object.assign({},old||{},{id:id,recordId:id,studentId:sid,studentName:name,className:cls,dateISO:date,dayName:days[dateObj.getDay()]||'',teacherName:(qteacher()&&qteacher().username)||'',attendance:attendance,behavior:behavior,behaviorReasonsText:absent?'':String((document.getElementById('quick-behavior-reason')||{}).value||'').trim(),newLesson:0,oldRevision:0,newTopicToday:'',newTopicRecited:'',newPagesCount:'',newRecitationCount:1,oldTopicToday:'',oldTopicRecited:'',oldPagesCount:'',oldRecitationCount:1,recitation:recitation,recitationTopicToday:topicToday,recitationTopic:topicToday,recitationPagesCount:pages,recitationTopicRecited:topicRecited,recitationRecitationCount:Number(count),homework:homework,tajweed:tajweed,newLessonTimeSeconds:0,oldRevisionTimeSeconds:0,recitationTimeSeconds:Number(old&&old.recitationTimeSeconds||0),isAbsent:absent,absence:absent,attendanceStatus:absent?'absent':'present',total:0,quickRegistration:true,_quickFields:FIFTH_QUICK_FIELDS.slice(),_dailyTypeSaved:{recitation:true},updatedAt:now.toISOString()});
      record.total=typeof getDailyTotal==='function'?getDailyTotal(record):attendance+behavior+recitation+homework+tajweed;
      if(!window.localIsAvailable||!window.localIsAvailable()||!window.MajdLocalDataAPI||typeof window.MajdLocalDataAPI.writeRecord!=='function')throw new Error('اتصال الحفظ غير متاح؛ لم يتم تسجيل البيانات.');
      if(saveBtn){saveBtn.disabled=true;saveBtn.dataset.oldText=saveBtn.textContent;saveBtn.textContent='⏳ جارٍ الحفظ...';}if(absentBtn){absentBtn.disabled=true;absentBtn.dataset.oldText=absentBtn.textContent;absentBtn.textContent='⏳ جارٍ الحفظ...';}
      await window.MajdLocalDataAPI.writeRecord('dailyRecords',id,record,{merge:true});
      if(typeof window.dailyRemoveDraftForContext_==='function')window.dailyRemoveDraftForContext_(name,cls,date,(window.currentTeacher&&window.currentTeacher.username)||'');
      var records=window.dailyRecords||(window.dailyRecords=[]),index=records.findIndex(function(r){return String(r.id||r.recordId||'')===id;});if(index>=0)records[index]=Object.assign({},records[index],record);else records.push(record);
      try{memoryStorage.setItem('dailyRecords',JSON.stringify(records));}catch(e){}
      qrememberDate(date);if(typeof renderDailyTable==='function')renderDailyTable();if(typeof renderManagerView==='function')renderManagerView();if(typeof renderClassStatusTable==='function')renderClassStatusTable();qrenderTable();qEditingId='';if(typeof renderStudentDataAnalysis==='function')renderStudentDataAnalysis();
      showMessage('app-msg',absent?'تم تسجيل غياب '+name+' في التسجيل السريع بنجاح ✅':'تم حفظ التسجيل السريع لـ '+name+' داخل سجلات الرصد اليومي ✅','success');qload();
    }catch(e){console.error('Fifth quick registration save',e);showMessage('app-msg','تعذر حفظ التسجيل السريع: '+(e.message||e),'error');}
    finally{if(saveBtn){saveBtn.disabled=false;saveBtn.textContent=saveBtn.dataset.oldText||'💾 حفظ التسجيل';}if(absentBtn){absentBtn.disabled=false;absentBtn.textContent=absentBtn.dataset.oldText||'🚫 غياب (صفر لليوم كامل)';}qupdateSaveLock(name?qfind(name,cls,date):null);}
  })();
}
var quickSaveWithSharia=window.quickRegistrationSave;
window.quickRegistrationSave=function(forceAbsent){var cls=(document.getElementById('quickClassSelect')||{}).value||'';if(qisFifthClass(cls))return qsaveFifthRegistration(forceAbsent);return quickSaveWithSharia.apply(this,arguments);};
var quickDeleteRefreshBase=window.quickRegistrationDelete;
window.quickRegistrationDelete=async function(){var result=await quickDeleteRefreshBase.apply(this,arguments);if(qisShariaClass((document.getElementById('quickClassSelect')||{}).value)&&typeof renderShariaDailyLog_==='function')renderShariaDailyLog_();return result;};
function installAdminPermission(){if(!qisAdmin())return;var admin=document.getElementById('admin-tab');if(!admin||document.getElementById('quickRegistrationTeacherPermissions'))return;var card=document.createElement('div');card.className='card-view';card.id='quickRegistrationTeacherPermissions';card.style.borderTop='4px solid var(--primary-color)';card.innerHTML='<h3 class="card-title">⚡ صلاحية الرجوع بالتاريخ في التسجيل السريع</h3><p style="font-size:.88em;color:#666;line-height:1.8;margin-top:-6px">حدد لكل مدرس هل يُسمح له بالرجوع إلى الأيام السابقة في التسجيل السريع. المدرس غير المسموح له يرى اليوم الحالي فقط، مع بقاء صلاحيات الفصول كما هي.</p><div id="quickRegistrationTeacherPermissionsList" style="display:grid;gap:10px"></div><div class="toast-msg" id="quick-registration-permission-msg"></div>';var anchor=document.getElementById('dailyDateEditPermissions');if(anchor&&anchor.closest('.card-view'))anchor.closest('.card-view').insertAdjacentElement('afterend',card);else admin.prepend(card);qrenderTeacherPermissions();}
function qrenderTeacherPermissions(){var box=document.getElementById('quickRegistrationTeacherPermissionsList');if(!box)return;box.innerHTML=(window.teachersData||[]).map(function(t){var disabled=String(t.username||'')==='admin';var allowed=t.quickRegistrationDateEditAllowed===true;return '<div class="quick-registration-permission-row"><strong>'+qesc(t.username)+' — '+qesc(t.assignedClass||'')+'</strong><label><input type="checkbox" '+(allowed?'checked':'')+(disabled?' disabled':'')+' onchange="setQuickRegistrationDatePermission(\''+qesc(String(t.id))+'\',this.checked)"><span>'+ (allowed?'مسموح':'منع')+'</span></label></div>';}).join('');}
window.setQuickRegistrationDatePermission=async function(id,allowed){if(!qisAdmin())return;var t=(window.teachersData||[]).find(function(x){return String(x.id)===String(id);});if(!t)return;t.quickRegistrationDateEditAllowed=!!allowed;t.updatedAt=new Date().toISOString();try{if(window.localIsAvailable&&window.localIsAvailable())await window.MajdLocalDataAPI.writeRecord('teachers',String(t.id),{quickRegistrationDateEditAllowed:!!allowed,updatedAt:t.updatedAt},{merge:true});memoryStorage.setItem('teachersData',JSON.stringify(window.teachersData));qrenderTeacherPermissions();showMessage('app-msg','تم تحديث صلاحية '+t.username+' للتسجيل السريع.','success');}catch(e){t.quickRegistrationDateEditAllowed=!allowed;qrenderTeacherPermissions();showMessage('app-msg','تعذر حفظ صلاحية المدرس: '+(e.message||e),'error');}};
function patchClassCards(){document.querySelectorAll('#class-cards-container .class-box').forEach(function(card){if(card.querySelector('.quick-registration-class-card'))return;var h=card.querySelector('h4');if(!h)return;var txt=String(h.textContent||'').replace(/\s*\(.*?\)\s*$/,'').trim();if(!txt||!qowns(txt))return;var wrap=document.createElement('div');wrap.className='quick-registration-class-card';wrap.innerHTML='<button type="button" class="action-btn btn-save quick-registration-launch">⚡ تسجيل سريع - '+qesc(txt)+'</button>';wrap.querySelector('button').onclick=function(){openQuickRegistration(txt);};card.appendChild(wrap);});}
var oldRenderClassCards=window.renderClassCards; if(typeof oldRenderClassCards==='function'){window.renderClassCards=function(){var r=oldRenderClassCards.apply(this,arguments);setTimeout(patchClassCards,0);return r;};}
var oldSwitchTab=window.switchTab; if(typeof oldSwitchTab==='function'){window.switchTab=function(tabId,event){var r=oldSwitchTab.apply(this,arguments);if(tabId==='quick-registration-tab'){qrender();}return r;};}
function boot(){installUI();installAdminPermission();patchClassCards();qrenderDateControls();var obs=document.getElementById('class-cards-container');if(obs){new MutationObserver(function(){patchClassCards();}).observe(obs,{childList:true,subtree:true});}var t=qteacher();if(t&&t.username!=='admin'&&String(t.assignedClass||'')!=='الكل'){var btn=document.getElementById('quick-registration-tab-btn');if(btn)btn.style.display='';}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
