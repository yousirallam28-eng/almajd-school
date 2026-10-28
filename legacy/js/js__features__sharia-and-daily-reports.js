/* ===== ./js/features/sharia-and-daily-reports.js ===== */
/* ================= نظام درجات الشرعي المستقل ================= */
function shariaIsClass_(c){ return String(c || '').trim() === 'أولى شرعي'; }
function shariaCanEdit_(){
  return !!(currentTeacher && (
    String(currentTeacher.username || '').trim() === 'admin' ||
    String(currentTeacher.assignedClass || '').trim() === 'أولى شرعي'
  ));
}
function shariaEsc_(value){
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
var shariaRemovedNodes_ = [];
function shariaRemoveNode_(node){
  if(!node || !node.parentNode) return;
  shariaRemovedNodes_.push({node:node,parent:node.parentNode,next:node.nextSibling});
  node.parentNode.removeChild(node);
}
function shariaRestoreNodes_(){
  shariaRemovedNodes_.slice().reverse().forEach(function(item){
    if(item.parent && !item.node.parentNode){
      item.parent.insertBefore(item.node,item.next && item.next.parentNode===item.parent ? item.next : null);
    }
  });
  shariaRemovedNodes_=[];
}
function shariaRemoveFieldById_(id){
  var el=document.getElementById(id);
  if(el){
    var group=el.closest ? el.closest('.form-group') : el.parentNode;
    shariaRemoveNode_(group || el);
  }
}
function shariaPrepareDailyFields_(isShariaUi){
  if(!isShariaUi){
    shariaRestoreNodes_();
    var normalBehavior=document.getElementById('behavior');
    if(normalBehavior) normalBehavior.readOnly=true;
    return;
  }
  if(shariaRemovedNodes_.length) return;
  ['daily-score-auto-note','daily-score-time-summary','daily-selected-grade-note','daily-error-counters','daily-behavior-summary','daily-behavior-grid'].forEach(shariaRemoveNodeById_);
  var scoreCard=document.querySelector('#daily-workspace .daily-scores-card');
  document.querySelectorAll('#daily-workspace > .daily-timer-card').forEach(shariaRemoveNode_);
  if(scoreCard){
    scoreCard.querySelectorAll('.daily-grade-type-selector,.daily-timer-card,.daily-type-grid,.daily-selected-timer-box,.daily-type-status,.daily-timer-actions').forEach(shariaRemoveNode_);
    scoreCard.querySelectorAll('button[onclick*="toggleBehaviorPanel"]').forEach(shariaRemoveNode_);
  }
  ['newLesson','newTopicToday','newPagesCount','newTopicRecited','newRecitationCount',
   'oldRevision','oldTopicToday','oldPagesCount','oldTopicRecited','oldRecitationCount',
   'recitation','recitationTopicToday','recitationPagesCount','recitationTopicRecited','recitationRecitationCount',
   'homework','tajweed'].forEach(shariaRemoveFieldById_);
  var behavior=document.getElementById('behavior');
  if(behavior) behavior.readOnly=false;
}
function shariaRemoveNodeById_(id){
  var el=document.getElementById(id);
  if(el) shariaRemoveNode_(el);
}
async function editShariaGrade_(id){
  try{id=decodeURIComponent(String(id));}catch(e){}
  if(!shariaCanEdit_()) return showMessage('app-msg','لا توجد صلاحية لتعديل سجل الشرعي','error');
  var rec=(shariaGradesData||[]).find(function(r){return String(r.id)===String(id);});
  if(!rec && localIsAvailable()){
    try{ var localRec=await window.MajdLocalDataAPI.readRecord('shariaGrades',id); if(localRec) rec=localRec; }catch(e){}
  }
  if(!rec) return showMessage('app-msg','السجل غير موجود','error');
  var html='<div class="modal-grid">'+
    '<div class="form-group"><label>الطالب:</label><input value="'+shariaEsc_(rec.studentName)+'" readonly></div>'+
    '<div class="form-group"><label>التاريخ:</label><input value="'+shariaEsc_(String(rec.dateISO||'').slice(0,10))+'" readonly></div>'+
    '<div class="form-group"><label>الحضور من 10:</label><input id="shariaEditAttendance" type="number" min="0" max="10" value="'+Number(rec.attendance||0)+'"></div>'+
    '<div class="form-group"><label>المقرر:</label><input id="shariaEditSubject" value="'+shariaEsc_(rec.subject||'')+'"></div>'+
    '<div class="form-group"><label>السلوك من 10:</label><input id="shariaEditBehavior" type="number" min="0" max="10" value="'+Number(rec.behavior||0)+'"></div>'+
    '<div class="form-group"><label>الامتحان من 100:</label><input id="shariaEditExam" type="number" min="0" max="100" value="'+Number(rec.examScore||0)+'"></div></div>';
  var ok=await siteConfirm('✏️ تعديل سجل الشرعي',html,'حفظ التعديل');
  if(!ok) return;
  var a=String((document.getElementById('shariaEditAttendance')||{}).value||'').trim();
  var b=String((document.getElementById('shariaEditBehavior')||{}).value||'').trim();
  var e=String((document.getElementById('shariaEditExam')||{}).value||'').trim();
  var subject=String((document.getElementById('shariaEditSubject')||{}).value||'').trim();
  if(a===''||b===''||e==='') return showMessage('app-msg','أكمل جميع الدرجات قبل الحفظ','error');
  var attendance=Number(a), behavior=Number(b), exam=Number(e);
  if(!Number.isFinite(attendance)||attendance<0||attendance>10) return showMessage('app-msg','الحضور يجب أن يكون من 0 إلى 10','error');
  if(!Number.isFinite(behavior)||behavior<0||behavior>10) return showMessage('app-msg','السلوك يجب أن يكون من 0 إلى 10','error');
  if(!Number.isFinite(exam)||exam<0||exam>100) return showMessage('app-msg','الامتحان يجب أن يكون من 0 إلى 100','error');
  if(attendance>0 && !subject) return showMessage('app-msg','اكتب اسم المقرر','error');
  try{
    var saved=await window.MajdLocalDataAPI.updateVerified('shariaGrades',id,{attendance:attendance,absent:attendance===0,subject:subject,behavior:behavior,examScore:exam,editedBy:currentTeacher.username,editedAt:new Date().toISOString()});
    var i=shariaGradesData.findIndex(function(r){return String(r.id)===String(id);});
    if(i>=0) shariaGradesData[i]=Object.assign({},shariaGradesData[i],saved); else shariaGradesData.push(Object.assign({},rec,saved));
    memoryStorage.setItem('shariaGradesData',JSON.stringify(shariaGradesData));
    renderShariaGradesReport(); renderShariaDailyLog_();
    showMessage('app-msg','تم تعديل سجل الشرعي بنجاح','success');
  }catch(err){ console.error('Sharia edit error:',err); showMessage('app-msg','تعذر تعديل سجل الشرعي: '+String(err.message||err),'error'); }
}
async function deleteShariaGrade_(id){
  try{id=decodeURIComponent(String(id));}catch(e){}
  if(!shariaCanEdit_()) return showMessage('app-msg','لا توجد صلاحية لحذف سجل الشرعي','error');
  var rec=(shariaGradesData||[]).find(function(r){return String(r.id)===String(id);});
  if(!rec) return showMessage('app-msg','السجل غير موجود','error');
  var ok=await siteConfirm('🗑️ حذف سجل الشرعي','سيتم حذف سجل الطالب <strong>'+shariaEsc_(rec.studentName||'')+'</strong> بتاريخ <strong>'+shariaEsc_(String(rec.dateISO||'').slice(0,10))+'</strong> نهائيًا من التخزين المحلي.','حذف السجل',true);
  if(!ok) return;
  try{
    await window.MajdLocalDataAPI.deleteRecord('shariaGrades',id);
    shariaGradesData=shariaGradesData.filter(function(r){return String(r.id)!==String(id);});
    memoryStorage.setItem('shariaGradesData',JSON.stringify(shariaGradesData));
    renderShariaGradesReport(); renderShariaDailyLog_();
    showMessage('app-msg','تم حذف سجل الشرعي بنجاح','success');
  }catch(err){ console.error('Sharia delete error:',err); showMessage('app-msg','تعذر حذف سجل الشرعي: '+String(err.message||err),'error'); }
}
var shariaDailyTableOriginalHead_=null;
function renderShariaDailyLog_(){
  var table=document.getElementById('gradesTable');
  if(!table) return;
  var thead=table.querySelector('thead');
  var tbody=table.querySelector('tbody');
  if(!thead || !tbody) return;
  if(!shariaDailyTableOriginalHead_) shariaDailyTableOriginalHead_=thead.innerHTML;
  thead.innerHTML='<tr><th>التاريخ</th><th>الطالب</th><th>الحضور</th><th>المقرر</th><th>السلوك</th><th>درجة الامتحان</th><th>إجراء</th></tr>';
  // عند ترك فلتر التاريخ فارغًا اعرض جميع سجلات الشرعي، لا تاريخ اليوم فقط.
  var date=String((document.getElementById('filterDateDaily')||{}).value||'').slice(0,10);
  var search=String((document.getElementById('searchDaily')||{}).value||'').trim();
  var rows=(shariaGradesData||[]).filter(function(r){
    return String(r.className||'').trim()==='أولى شرعي' &&
      (!date || String(r.dateISO||'').slice(0,10)===String(date).slice(0,10)) &&
      (!search || String(r.studentName||'').includes(search)) && !r._deleted;
  }).sort(function(a,b){return String(a.studentName||'').localeCompare(String(b.studentName||''),'ar');});
  tbody.innerHTML=rows.length ? rows.map(function(r){
    var absent=!!r.absent || Number(r.attendance||0)===0;
    return '<tr><td>'+shariaEsc_(String(r.dateISO||'').slice(0,10))+'</td>'+
      '<td>'+shariaEsc_(r.studentName||'')+'</td>'+
      '<td>'+(absent?'<span class="badge" style="background:var(--danger-color);color:#fff;padding:4px 10px;">🚫 غائب</span>':Number(r.attendance||0)+'/10')+'</td>'+
      '<td>'+shariaEsc_(r.subject||'')+'</td>'+
      '<td>'+Number(r.behavior||0)+'/10</td>'+
      '<td><strong>'+Number(r.examScore||0)+'</strong> / 100</td>'+
      '<td><button type="button" class="action-btn btn-edit" style="padding:3px 8px;min-width:auto;" onclick="editShariaGrade_(\''+encodeURIComponent(String(r.id))+ '\')">تعديل</button> <button type="button" class="action-btn btn-danger" style="padding:3px 8px;min-width:auto;" onclick="deleteShariaGrade_(\''+encodeURIComponent(String(r.id))+ '\')">حذف</button></td></tr>';
  }).join('') : '<tr><td colspan="7">لا توجد سجلات شرعي محفوظة لهذا التاريخ</td></tr>';
}
function restoreNormalDailyTable_(){
  var table=document.getElementById('gradesTable');
  if(!table || !shariaDailyTableOriginalHead_) return;
  var thead=table.querySelector('thead');
  if(thead) thead.innerHTML=shariaDailyTableOriginalHead_;
}
function shariaSetMode_(className){
  var isShariaUi=(String(className||'').trim()==='أولى شرعي');
  document.body.classList.toggle('sharia-ui-selected',isShariaUi);
  document.body.classList.remove('sharia-selected');
  shariaPrepareDailyFields_(isShariaUi);
  var card=document.getElementById('sharia-daily-card'); if(card) card.classList.add('hidden');
  var hint=document.getElementById('dailyStudentHint');
  if(hint) hint.textContent=isShariaUi ? 'أدخل الحضور والمقرر والسلوك ودرجة الامتحان فقط.' : 'اختر الصف أولاً لتظهر أسماء الطلاب المسجلين فيه، ثم اختر الاسم لفتح التايمر ودرجات الرصد.';
  var save=document.querySelector('#daily-tab .daily-scores-card .btn-save');
  if(save){ save.style.display=''; save.innerHTML=isShariaUi?'💾 حفظ':'💾 حفظ الدرجات (من 70)'; }
  if(isShariaUi) renderShariaDailyLog_(); else restoreNormalDailyTable_();
  var subject=document.getElementById('shariaNormalSubject'), exam=document.getElementById('shariaNormalExam');
  [subject,exam].forEach(function(el){
    if(!el) return;
    var group=el.closest('.form-group');
    if(group) group.style.display=isShariaUi?'':'none';
    el.setAttribute('aria-hidden',isShariaUi?'false':'true');
  });
  // الحقول موجودة للشرعي فقط، وتُخفى خارج الشرعي دون حذف قيمها المحفوظة.
}
function shariaGetCurrentStudent_(){
  var sel=document.getElementById('studentNameSelect');
  var name=(sel&&sel.value||'').trim();
  return studentsData.find(function(s){return String(s.name||'')===name && s.className==='أولى شرعي';}) || null;
}
function shariaDate_(){ return (document.getElementById('recordDate')||{}).value || new Date().toISOString().slice(0,10); }
async function saveShariaGrade(forceAbsent){
  if(!shariaCanEdit_()) return showMessage('app-msg','لا توجد صلاحية لتسجيل درجات فصل أولى شرعي','error');
  var st=shariaGetCurrentStudent_();
  if(!st) return showMessage('app-msg','اختر طالبًا من فصل أولى شرعي أولاً','error');

  var attendanceRaw=String((document.getElementById('attendance')||{}).value||'').trim();
  var behaviorRaw=String((document.getElementById('behavior')||{}).value||'').trim();
  var subject=((document.getElementById('shariaNormalSubject')||{}).value||'').trim();
  var examRaw=String((document.getElementById('shariaNormalExam')||{}).value||'').trim();
  if(forceAbsent) attendanceRaw='0';
  if(attendanceRaw==='') return showMessage('app-msg','أدخل درجة الحضور','error');
  if(examRaw==='') return showMessage('app-msg','أدخل درجة الامتحان من 100','error');

  var attendance=Number(attendanceRaw), behavior=Number(behaviorRaw), exam=Number(examRaw);
  if(!Number.isFinite(attendance)||attendance<0||attendance>10) return showMessage('app-msg','الحضور يجب أن يكون من 0 إلى 10','error');
  if(!subject && attendance!==0) return showMessage('app-msg','اكتب اسم المقرر','error');
  if(behaviorRaw==='' || !Number.isFinite(behavior)||behavior<0||behavior>10) return showMessage('app-msg','السلوك يجب أن يكون من 0 إلى 10','error');
  if(!Number.isFinite(exam)||exam<0||exam>100) return showMessage('app-msg','درجة الامتحان يجب أن تكون من 0 إلى 100','error');

  var date=shariaDate_(), id='sharia_'+String(st.id||st.name)+'_'+date;
  var rec={id:id,studentId:st.id,studentName:st.name,className:'أولى شرعي',teacherName:currentTeacher.username,dateISO:date,dayName:(document.getElementById('daySelect')||{}).value||'',attendance:attendance,absent:attendance===0,subject:subject,behavior:behavior,examScore:exam,updatedAt:new Date().toISOString()};
  var saveBtn=document.querySelector('#daily-workspace .daily-scores-card .btn-save');
  if(saveBtn){ saveBtn.disabled=true; saveBtn.dataset.oldText=saveBtn.innerText; saveBtn.innerText='⏳ جارٍ الحفظ والتحقق...'; }
  try{
    await window.MajdLocalDataAPI.saveAndVerifySharia(id,rec);
    var idx=shariaGradesData.findIndex(function(r){return String(r.id)===id;});
    if(idx>=0) shariaGradesData[idx]=Object.assign({},shariaGradesData[idx],rec); else shariaGradesData.push(rec);
    memoryStorage.setItem('shariaGradesData',JSON.stringify(shariaGradesData));
    var shariaFilterDate=document.getElementById('filterDateDaily');
    if(shariaFilterDate) shariaFilterDate.value=date;
    showMessage('app-msg',forceAbsent?'تم تسجيل الغياب':'تم الحفظ','success');
    renderShariaGradesReport();
    renderShariaDailyLog_();
  }catch(e){
    console.error('Sharia save error:',e);
    showMessage('app-msg','فشل حفظ درجة الشرعي: '+String(e.message||e),'error');
  }finally{
    if(saveBtn){ saveBtn.disabled=false; saveBtn.innerText=shariaIsClass_((document.getElementById('classSelect')||{}).value)?'💾 حفظ':(saveBtn.dataset.oldText||'💾 حفظ الدرجات'); }
  }
}
async function markShariaAbsent(){
  if(!shariaCanEdit_()) return showMessage('app-msg','لا توجد صلاحية لتسجيل غياب فصل أولى شرعي','error');
  var st=shariaGetCurrentStudent_();
  if(!st) return showMessage('app-msg','اختر طالبًا من فصل أولى شرعي أولاً','error');
  var date=shariaDate_(), id='sharia_'+String(st.id||st.name)+'_'+date;
  var existing=shariaGradesData.find(function(r){return String(r.id)===id;});
  var rec={id:id,studentId:st.id,studentName:st.name,className:'أولى شرعي',teacherName:currentTeacher.username,dateISO:date,dayName:(document.getElementById('daySelect')||{}).value||'',attendance:0,absent:true,subject:existing&&existing.subject||'',behavior:0,examScore:0,updatedAt:new Date().toISOString()};
  if(!window.confirm('سيتم تسجيل الطالب غائبًا وتصفير السلوك ودرجة الامتحان لهذا التاريخ. هل تريد المتابعة؟')) return;
  try{
    await window.MajdLocalDataAPI.saveAndVerifySharia(id,rec);
    var idx=shariaGradesData.findIndex(function(r){return String(r.id)===id;});
    if(idx>=0) shariaGradesData[idx]=Object.assign({},shariaGradesData[idx],rec); else shariaGradesData.push(rec);
    memoryStorage.setItem('shariaGradesData',JSON.stringify(shariaGradesData));
    var shariaFilterDate=document.getElementById('filterDateDaily');
    if(shariaFilterDate) shariaFilterDate.value=date;
    showMessage('app-msg','تم تسجيل الغياب والتحقق من حفظه ✅','success');
    renderShariaGradesReport();
    renderShariaDailyLog_();
  }catch(e){
    console.error('Sharia absent error:',e);
    showMessage('app-msg','فشل تسجيل الغياب: '+String(e.message||e),'error');
  }
}
function shariaPeriodRange_(period,date){
  var d=new Date(date+'T00:00:00'); if(isNaN(d.getTime())) d=new Date();
  if(period==='day') return [date,date];
  if(period==='week'){ var day=d.getDay(); var start=new Date(d); start.setDate(d.getDate()-day); var end=new Date(start); end.setDate(start.getDate()+4); return [start.toISOString().slice(0,10),end.toISOString().slice(0,10)]; }
  var start=new Date(d.getFullYear(),d.getMonth(),1), end=new Date(d.getFullYear(),d.getMonth()+1,0); return [start.toISOString().slice(0,10),end.toISOString().slice(0,10)];
}
function renderShariaGradesReport(){
  var tbody=document.querySelector('#shariaGradesReportTable tbody'); if(!tbody) return;
  if(!currentTeacher){ tbody.innerHTML='<tr><td colspan="7">سجّل الدخول لعرض التقرير</td></tr>'; return; }
  var dateEl=document.getElementById('shariaReportDate'); if(dateEl&&!dateEl.value) dateEl.value=new Date().toISOString().slice(0,10);
  var period=(document.getElementById('shariaReportPeriod')||{}).value||'day'; var range=shariaPeriodRange_(period,(dateEl&&dateEl.value)||new Date().toISOString().slice(0,10));
  var rows=shariaGradesData.filter(function(r){var d=String(r.dateISO||'').slice(0,10);return String(r.className||'').trim()==='أولى شرعي'&&d>=range[0]&&d<=range[1]&&!r._deleted;}).sort(function(a,b){return String(a.dateISO).localeCompare(String(b.dateISO))||String(a.studentName).localeCompare(String(b.studentName),'ar');});
  tbody.innerHTML=rows.length?rows.map(function(r){var att=Number(r.attendance||0);return '<tr><td>'+shariaEsc_(r.dateISO||'')+'</td><td>'+shariaEsc_(r.studentName||'')+'</td><td>'+shariaEsc_(r.teacherName||'')+'</td><td>'+(r.absent||att===0?'<span class="badge badge-red">غياب</span>':'<span class="badge badge-green">حاضر</span>')+'</td><td>'+shariaEsc_(r.subject||'')+'</td><td>'+Number(r.behavior||0)+'/10</td><td><strong>'+Number(r.examScore||0)+'</strong> / 100</td></tr>';}).join(''):'<tr><td colspan="7">لا توجد درجات شرعي في الفترة المحددة</td></tr>';
}
function shariaWeekRecords_(weekKey, student){
  return (shariaGradesData||[]).filter(function(r){return String(r.className||'').trim()==='أولى شرعي' && (!student || String(r.studentName||'')===String(student)) && r.dateISO && getWeekKey(r.dateISO)===weekKey && !r._deleted;});
}
function shariaStudents_(){
  return (studentsData||[]).filter(function(s){return String(s.className||'').trim()==='أولى شرعي';}).map(function(s){return s.name;}).sort(function(a,b){return String(a).localeCompare(String(b),'ar');});
}
function shariaReportCell_(r){
  if(!r) return '-';
  return r.absent || Number(r.attendance||0)===0 ? '<span class="badge" style="background:var(--danger-color);color:#fff;padding:3px 7px;">🚫 غائب</span>' : '<strong>'+Number(r.examScore||0)+'</strong>';
}
function shariaDayNameFromDate_(dateISO){
  var d=new Date(String(dateISO||'')+'T00:00:00');
  return isNaN(d.getTime()) ? '' : ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'][d.getDay()];
}
function renderShariaWeeklyReport_(){
  var tbody=document.querySelector('#weeklyTable tbody'), thead=document.querySelector('#weeklyTable thead');
  if(!tbody||!thead) return;
  var weekKey=(document.getElementById('weekSelect')||{}).value||'';
  var days=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
  thead.innerHTML='<tr><th>اسم الطالب/الطالبة</th><th>الأحد<br>الامتحان</th><th>الاثنين<br>الامتحان</th><th>الثلاثاء<br>الامتحان</th><th>الأربعاء<br>الامتحان</th><th>الخميس<br>الامتحان</th><th>مجموع الامتحان</th><th>متوسط الامتحان</th><th>أيام الحضور</th><th>نسبة الحضور</th></tr>';
  var students=shariaStudents_();
  if(!weekKey||!students.length){tbody.innerHTML='<tr><td colspan="10">لا توجد بيانات شرعي للأسبوع المحدد</td></tr>';renderBarChart('weeklyReportChart',function(c){weeklyReportChartInstance=c;},function(){return weeklyReportChartInstance;},[],[],'متوسط امتحان الشرعي');return;}
  var labels=[], data=[];
  tbody.innerHTML=students.map(function(student){
    var records=shariaWeekRecords_(weekKey,student), total=0, attended=0, cells=days.map(function(day){var r=records.find(function(x){return String(x.dayName||'')===day || (!x.dayName && shariaDayNameFromDate_(x.dateISO)===day);});if(r&&!r.absent&&Number(r.attendance||0)>0){attended++;total+=Number(r.examScore||0);}return '<td>'+shariaReportCell_(r)+'</td>';}).join('');
    var avg=(total/5).toFixed(1), perc=((attended/5)*100).toFixed(0); labels.push(student);data.push(Number(avg));
    return '<tr><td style="font-weight:bold;">'+shariaEsc_(student)+'</td>'+cells+'<td><strong>'+total+'</strong> / 500</td><td>'+avg+' / 100</td><td>'+attended+' / 5</td><td><span class="badge '+(Number(perc)>=75?'badge-blue':'badge-yellow')+'">'+perc+'%</span></td></tr>';
  }).join('');
  renderBarChart('weeklyReportChart',function(c){weeklyReportChartInstance=c;},function(){return weeklyReportChartInstance;},labels,data,'متوسط امتحان الشرعي','rgba(19,104,77,1)');
}
function renderShariaMonthlyReport_(){
  var tbody=document.querySelector('#monthlyReportTable tbody'), thead=document.querySelector('#monthlyReportTable thead');
  if(!tbody||!thead) return;
  var month=Number((document.getElementById('reportMonth')||{}).value||new Date().getMonth()), year=Number((document.getElementById('reportYear')||{}).value||new Date().getFullYear());
  var days=getMonthWorkingDays(year,month);
  var head='<tr><th style="min-width:150px;position:sticky;right:0;background:#f8f9fa;z-index:2;">اسم الطالب/الطالبة</th>';
  days.forEach(function(d){var p=d.dateISO.split('-');head+='<th style="font-size:.78em;padding:5px 3px;min-width:42px;">'+d.dayName+'<br><span style="color:#666;">'+p[2]+'/'+p[1]+'</span></th>';});
  head+='<th>أيام الحضور</th><th>مجموع الامتحان</th><th>متوسط الامتحان</th><th>متوسط السلوك</th><th>نسبة الحضور</th></tr>';thead.innerHTML=head;
  var students=shariaStudents_();
  if(!students.length){tbody.innerHTML='<tr><td colspan="'+(days.length+6)+'">لا يوجد طلاب مسجلون في فصل أولى شرعي</td></tr>';renderBarChart('monthlyReportChart',function(c){monthlyReportChartInstance=c;},function(){return monthlyReportChartInstance;},[],[],'متوسط امتحان الشرعي');return;}
  var labels=[],data=[];
  tbody.innerHTML=students.map(function(student){var total=0,attended=0,behaviorTotal=0,behaviorDays=0;
    var cells=days.map(function(d){var r=(shariaGradesData||[]).find(function(x){return String(x.className||'').trim()==='أولى شرعي'&&String(x.studentName||'')===String(student)&&String(x.dateISO||'').slice(0,10)===d.dateISO&&!x._deleted;});if(r){if(!r.absent&&Number(r.attendance||0)>0){attended++;total+=Number(r.examScore||0);}behaviorTotal+=Number(r.behavior||0);behaviorDays++;}return '<td>'+shariaReportCell_(r)+'</td>';}).join('');
    var avg=(total/(days.length||1)).toFixed(1), behaviorAvg=(behaviorTotal/(behaviorDays||1)).toFixed(1), perc=((attended/(days.length||1))*100).toFixed(0);labels.push(student);data.push(Number(avg));
    return '<tr><td style="font-weight:bold;position:sticky;right:0;background:white;z-index:1;">'+shariaEsc_(student)+'</td>'+cells+'<td>'+attended+' / '+days.length+'</td><td><strong>'+total+'</strong></td><td>'+avg+' / 100</td><td>'+behaviorAvg+' / 10</td><td><span class="badge '+(Number(perc)>=75?'badge-blue':'badge-yellow')+'">'+perc+'%</span></td></tr>';}).join('');
  renderBarChart('monthlyReportChart',function(c){monthlyReportChartInstance=c;},function(){return monthlyReportChartInstance;},labels,data,'متوسط امتحان الشرعي','rgba(19,104,77,1)');
}
var dailyFormPersistenceInstalled_=false;
var dailyFormFieldIds_=['attendance','behavior','newLesson','newTopicToday','newPagesCount','newTopicRecited','newRecitationCount','oldRevision','oldTopicToday','oldPagesCount','oldTopicRecited','oldRecitationCount','recitation','recitationTopicToday','recitationPagesCount','recitationTopicRecited','recitationRecitationCount','homework','tajweed','shariaNormalSubject','shariaNormalExam'];
function dailyFormSessionKey_(){
  var user=currentTeacher&&currentTeacher.username?currentTeacher.username:'guest';
  return 'dailyFormSession:'+String(user);
}
function saveDailyFormSession_(){
  try{
    var fields={};
    dailyFormFieldIds_.forEach(function(id){var el=document.getElementById(id);if(el) fields[id]={value:el.value,checked:!!el.checked};});
    var cls=(document.getElementById('classSelect')||{}).value || (document.getElementById('dailyClassSelect')||{}).value || '';
    var sessionTimer={new:Number(dailyTimerSeconds&&dailyTimerSeconds.new||0),old:Number(dailyTimerSeconds&&dailyTimerSeconds.old||0),recitation:Number(dailyTimerSeconds&&dailyTimerSeconds.recitation||0)};
    if(typeof dailyTimerRunning!=='undefined'&&dailyTimerRunning&&typeof getCurrentTimerElapsed==='function') sessionTimer[dailyTimerType]=getCurrentTimerElapsed();
    var draft={className:cls,studentName:(document.getElementById('studentNameSelect')||{}).value||'',date:(document.getElementById('recordDate')||{}).value||'',fields:fields,savedAt:new Date().toISOString(),timer:{new:sessionTimer.new,old:sessionTimer.old,recitation:sessionTimer.recitation,type:dailyTimerType||'new'}};
    memoryStorage.setItem(dailyFormSessionKey_(),JSON.stringify(draft));
    try{dailySaveTimerDraft_();}catch(e){}
  }catch(e){console.error('daily form draft save',e);}
}
function pauseAndSaveDailySession_(){
  try{
    /* لا نوقف التايمر عند إخفاء التبويب؛ يعتمد الحساب على Date.now()
       حتى يستمر الزمن أثناء وضع الصفحة في الخلفية. */
    saveDailyFormSession_();
  }catch(e){console.error('daily session pause',e);}
}
function restoreDailyFormSession_(){
  try{
    var draft=JSON.parse(memoryStorage.getItem(dailyFormSessionKey_())||'null');
    if(!draft) return;
    var cls=draft.className||'';
    var classEl=document.getElementById('classSelect'), visibleClass=document.getElementById('dailyClassSelect'), dateEl=document.getElementById('recordDate');
    if(dateEl&&draft.date) dateEl.value=draft.date;
    if(classEl&&cls){classEl.value=cls;if(visibleClass) visibleClass.value=cls;}
    if(typeof updateStudentListDropdown==='function'&&cls) updateStudentListDropdown();
    setTimeout(function(){
      var studentEl=document.getElementById('studentNameSelect');
      if(studentEl&&draft.studentName){studentEl.value=draft.studentName;studentEl.dispatchEvent(new Event('change',{bubbles:true}));}
      Object.keys(draft.fields||{}).forEach(function(id){var el=document.getElementById(id),v=draft.fields[id];if(el&&v&&v.value!==undefined) el.value=v.value;});
      if(draft.timer){dailyTimerSeconds={new:Number(draft.timer.new||0),old:Number(draft.timer.old||0),recitation:Number(draft.timer.recitation||0)};dailyTimerType=['new','old','recitation'].includes(draft.timer.type)?draft.timer.type:'new';dailyTimerBaseSeconds=dailyTimerSeconds[dailyTimerType]||0;dailyTimerRunning=false;dailyTimerStartedAt=0;clearInterval(dailyTimerInterval);dailyTimerInterval=null;renderDailyTimer();updateDailyTypeTimes();}
      if(typeof shariaIsClass_==='function'&&shariaIsClass_(cls)) shariaSetMode_(cls);
    },250);
  }catch(e){console.error('daily form draft restore',e);}
}
function installDailyFormPersistence_(){
  if(dailyFormPersistenceInstalled_) return;
  dailyFormPersistenceInstalled_=true;
  var save=function(){saveDailyFormSession_();};
  document.addEventListener('input',save,true);
  document.addEventListener('change',save,true);
  window.addEventListener('pagehide',pauseAndSaveDailySession_);
  window.addEventListener('beforeunload',pauseAndSaveDailySession_);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden') pauseAndSaveDailySession_();});
  var oldShow=window.showAppScreen;
  if(typeof oldShow==='function') window.showAppScreen=function(){oldShow.apply(this,arguments);setTimeout(restoreDailyFormSession_,350);};
  setTimeout(restoreDailyFormSession_,700);
}
(function installShariaMode(){
  var oldUpdateFifth=window.updateFifthGradeFields;
  window.updateFifthGradeFields=function(className){ if(typeof oldUpdateFifth==='function') oldUpdateFifth(className); shariaSetMode_(className); };
  var oldSync=window.syncDailyClassAndStudents;
  window.syncDailyClassAndStudents=function(){ if(typeof oldSync==='function') oldSync(); var v=(document.getElementById('dailyClassSelect')||{}).value||''; shariaSetMode_(v); };
  var oldUpdateList=window.updateStudentListDropdown;
  window.updateStudentListDropdown=function(){ if(typeof oldUpdateList==='function') oldUpdateList(); var v=(document.getElementById('classSelect')||{}).value||''; shariaSetMode_(v); };
  var oldAddGrade=window.addGrade;
  window.addGrade=async function(forceAbsent){ var c=(document.getElementById('dailyClassSelect')||{}).value || (document.getElementById('classSelect')||{}).value || ''; if(String(c).trim()==='أولى شرعي'){ if(forceAbsent) return saveShariaGrade(true); return saveShariaGrade(false); } return oldAddGrade.apply(this,arguments); };
  var oldMarkAbsent=window.markAbsent;
  window.markAbsent=async function(){ var c=(document.getElementById('dailyClassSelect')||{}).value || (document.getElementById('classSelect')||{}).value || ''; if(String(c).trim()==='أولى شرعي') return markShariaAbsent(); return oldMarkAbsent.apply(this,arguments); };
  var oldMainSaveButton=window.updateMainDailySaveButton_;
  window.updateMainDailySaveButton_=function(){
    var c=(document.getElementById('dailyClassSelect')||{}).value || (document.getElementById('classSelect')||{}).value || '';
    if(String(c).trim()==='أولى شرعي'){
      var b=document.querySelector('#daily-tab .daily-scores-card button[onclick="addGrade()"]');
      if(b){ b.disabled=false; b.classList.remove('daily-type-save-done'); b.textContent='💾 حفظ'; b.title='حفظ'; }
      return;
    }
    return oldMainSaveButton.apply(this,arguments);
  };
  // Remove الشرعي from general report/status/ranking selectors; keep it only in student/teacher assignment and daily selection.
  function cleanGeneralSelect(id){ return; }
  ['attendanceClassSelect','weeklyClassSelect','monthlyClassSelect','notesClassSelect','paymentsClassSelect','paymentReportClassSelect'].forEach(cleanGeneralSelect);
  // Hide sharia from generic tables even if old records exist.
  function filterNonSharia(arr){return (arr||[]).filter(function(r){return String((r&&r.className)||'').trim()!=='أولى شرعي';});}
  var fns=['renderDailyTable','renderAttendanceTable','renderWeeklyTable','renderMonthlyReport','renderManagerView','renderClassStatusTable','renderTopStudents'];
  fns.forEach(function(n){ if(typeof window[n]==='function'){ var orig=window[n]; window[n]=function(){ var selectedReportClass=n==='renderWeeklyTable'?((document.getElementById('weeklyClassSelect')||{}).value||''):n==='renderMonthlyReport'?((document.getElementById('monthlyClassSelect')||{}).value||''):''; if((n==='renderWeeklyTable'||n==='renderMonthlyReport')&&shariaIsClass_(selectedReportClass)) return orig.apply(this,arguments); var oldD=window.dailyRecords, oldS=window.studentsData; if(n==='renderClassStatusTable'){ window.dailyRecords=(oldD||[]).concat((shariaGradesData||[]).map(function(r){return Object.assign({},r,{isAbsent:!!r.absent,attendanceStatus:r.absent?'absent':'present'});})); try{return orig.apply(this,arguments);} finally{window.dailyRecords=oldD;} } window.dailyRecords=filterNonSharia(oldD); window.studentsData=filterNonSharia(oldS); try{return orig.apply(this,arguments);} finally{window.dailyRecords=oldD;window.studentsData=oldS;} }; }});
  var normalDailyRender=window.renderDailyTable;
  window.renderDailyTable=function(){
    var selected=(document.getElementById('dailyClassSelect')||{}).value || (document.getElementById('classSelect')||{}).value || '';
    if(shariaIsClass_(selected)) return renderShariaDailyLog_();
    return normalDailyRender.apply(this,arguments);
  };
  if(typeof window.renderShariaGradesReport==='function') window.renderShariaGradesReport();
  installDailyFormPersistence_();

})();
