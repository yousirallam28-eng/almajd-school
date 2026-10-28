/* ===== ./js/features/daily-record-identity.js ===== */

/* ===== Stable daily-record identity + non-destructive legacy compatibility ===== */
(function installStableDailyIdentity_(){
  function norm(v){return String(v==null?'':v).trim();}
  function token(v){var x=encodeURIComponent(norm(v)).replace(/%/g,'_');return x.length>90?x.slice(0,90):x;}
  function hash(v){var h=2166136261;for(var i=0;i<String(v).length;i++){h^=String(v).charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
  window.dailyStudentId_=function(name,cls){var list=Array.isArray(window.studentsData)?window.studentsData:[];var st=list.find(function(x){return norm(x.name)===norm(name)&&norm(x.className)===norm(cls);})||list.find(function(x){return norm(x.name)===norm(name);});if(st){if(!st.id)st.id='s_'+hash(norm(st.name)+'|'+norm(st.className));if(!st.studentId)st.studentId=String(st.id);return String(st.studentId||st.id);}return 'legacy_'+hash(norm(name)+'|'+norm(cls));};
  window.dailyStableRecordId_=function(sid,cls,date){return 'daily_'+token(sid)+'_'+token(cls)+'_'+norm(date).slice(0,10);};
  window.dailyNormalizeStudents_=function(){var list=Array.isArray(window.studentsData)?window.studentsData:[];var dirty=false;list.forEach(function(st){if(!st.id){st.id='s_'+hash(norm(st.name)+'|'+norm(st.className));dirty=true;}if(String(st.studentId||'')!==String(st.id)){st.studentId=String(st.id);dirty=true;}});if(dirty){try{memoryStorage.setItem('studentsData',JSON.stringify(list));}catch(_){}if(localIsAvailable())list.forEach(function(st){window.MajdLocalDataAPI.writeRecord('students',String(st.id),{studentId:String(st.id)},{merge:true}).catch(function(e){console.warn('studentId migration',e);});});}return list;};
  window.dailyNormalizeRecords_=function(records){var out=[],byKey={};(records||[]).forEach(function(r){if(!r||r._deleted||r._legacyMigrated)return;var sid=String(r.studentId||dailyStudentId_(r.studentName,r.className));var key=sid+'|'+norm(r.className)+'|'+norm(r.dateISO).slice(0,10);var stable=dailyStableRecordId_(sid,r.className,r.dateISO);var item=Object.assign({},r,{studentId:sid});if(String(item.id)!==stable && !String(item.id).startsWith('daily_')) item._legacy=true;else item.id=stable;if(!byKey[key]||(!item._legacy&&byKey[key]._legacy))byKey[key]=item;});Object.keys(byKey).forEach(function(k){out.push(byKey[k]);});return out;};
  var oldHas=window.hasDailyRecordForSelectedStudent_;
  window.hasDailyRecordForSelectedStudent_=function(){var cls=(document.getElementById('classSelect')||{}).value||'',date=(document.getElementById('recordDate')||{}).value||'',name=norm((document.getElementById('studentNameSelect')||{}).value||'');if(!name||!cls||!date)return null;var sid=dailyStudentId_(name,cls),stable=dailyStableRecordId_(sid,cls,date);return (window.dailyRecords||[]).find(function(r){return !r._deleted&&!r._legacyMigrated&&(String(r.id)===stable||(String(r.studentId||'')===sid&&norm(r.className)===norm(cls)&&norm(r.dateISO).slice(0,10)===norm(date).slice(0,10))||(!r.studentId&&norm(r.studentName)===name&&norm(r.className)===norm(cls)&&norm(r.dateISO).slice(0,10)===norm(date).slice(0,10)));})||null;};
  var oldSelected=window.getSelectedDailyRecord;
  window.getSelectedDailyRecord=function(){var cls=(document.getElementById('classSelect')||{}).value||'',date=(document.getElementById('recordDate')||{}).value||'',name=norm((document.getElementById('studentNameSelect')||{}).value||'');var sid=dailyStudentId_(name,cls),stable=dailyStableRecordId_(sid,cls,date);return (window.dailyRecords||[]).find(function(r){return !r._deleted&&!r._legacyMigrated&&(String(r.id)===stable||(String(r.studentId||'')===sid&&norm(r.dateISO).slice(0,10)===norm(date).slice(0,10)));})||null;};
  async function migrate(){
    dailyNormalizeStudents_();
    if(!localIsAvailable()) return;
    try { await window.MajdLocalDataAPI.migrateLegacyDailyRecords(); }
    catch(e){ console.warn('daily legacy migration deferred',e); }
  }
  var oldSync=window.syncDataFromLocal;window.syncDataFromLocal=function(){dailyNormalizeStudents_();return oldSync.apply(this,arguments);};
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){dailyNormalizeStudents_();migrate();dailyRetryQueue_();},1200);});
})();
