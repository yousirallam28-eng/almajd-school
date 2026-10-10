(function(){
  function esc(v){return String(v==null?'':v).replace(/[&<>'"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];});}
  function recoveryKey(r){
    if(!r)return '';
    var sid=String(r.studentId||'').trim();
    var cls=String(r.className||'').trim();
    var date=String(r.dateISO||'').slice(0,10);
    var name=String(r.studentName||'').trim();
    if(sid||cls||date||name)return [sid,cls,date,name].join('||');
    return String(r.id||'');
  }
  function localDailyRecords(){
    try{
      var arr=Array.isArray(window.dailyRecords)?window.dailyRecords:[];
      if(!arr.length){
        var raw=localStorage.getItem('majd_local_sync_v3_dailyRecords');
        var parsed=raw?JSON.parse(raw):[];
        if(Array.isArray(parsed)) arr=parsed;
      }
      return Array.isArray(arr)?arr:[];
    }catch(_){return Array.isArray(window.dailyRecords)?window.dailyRecords:[];}
  }
  function persistRecovered(arr){
    try{localStorage.setItem('majd_local_sync_v3_dailyRecords',JSON.stringify(arr));}catch(_){ }
    try{memoryStorage.setItem('dailyRecords',JSON.stringify(arr));}catch(_){ }
    try{window.dailyRecords=arr;}catch(_){ }
  }
  window.reviewAndRestoreDailyRecordsFromCloud=async function(){
    var btn=document.getElementById('daily-cloud-recovery-start'), status=document.getElementById('daily-cloud-recovery-status'), result=document.getElementById('daily-cloud-recovery-result');
    if(!status||!result)return;
    status.style.display='block'; result.style.display='none';
    if(!window.useFirebase || !window.db){status.innerHTML='<b style="color:#b91c1c">❌ Supabase غير متصل حاليًا.</b><br>تأكد من الاتصال ثم حاول مرة أخرى.';return;}
    if(btn)btn.disabled=true;
    try{
      status.innerHTML='⏳ جاري فحص السجلات الحالية + الأرشيف السحابي ومقارنتها بالسجلات الموجودة على الجهاز...';
      var snaps=await Promise.all([
        window.db.collection('dailyRecords').get(),
        window.db.collection('dailyRecordsArchive').get()
      ]);
      var cloudMap=new Map();
      snaps.forEach(function(snap){
        if(typeof window.firebaseDailyQuotaInc_==='function')window.firebaseDailyQuotaInc_('reads',Math.max(1,snap.size||0));
        snap.docs.forEach(function(d){
          var x=d.data()||{}; if(x._legacyMigrated)return;
          var id=String(x.id||d.id); if(!id)return;
          var old=cloudMap.get(id);
          if(!old || syncStamp_(x)>=syncStamp_(old)) cloudMap.set(id,Object.assign({id:id},x));
        });
      });
      var cloud=Array.from(cloudMap.values());
      var local=localDailyRecords();
      var localIds=new Set(local.map(function(x){return String(x&&x.id||'');}).filter(Boolean));
      var localKeys=new Set(local.map(recoveryKey).filter(Boolean));
      var missing=[];
      cloud.forEach(function(r){
        var id=String(r.id||''); var key=recoveryKey(r);
        if((id&&!localIds.has(id)) && (!key||!localKeys.has(key)) && !r._deleted) missing.push(r);
      });
      if(!missing.length){
        status.innerHTML='<b style="color:#166534">✅ تمت المراجعة.</b><br>كل السجلات الموجودة في السحابة/الأرشيف موجودة محليًا بالفعل.<br><small>تم فحص '+cloud.length.toLocaleString('ar-EG')+' سجلًا محفوظًا سحابيًا.</small>';
        result.style.display='block'; result.innerHTML='<div style="color:#166534;font-weight:800">لا توجد سجلات تحتاج إلى استعادة.</div>';
        return;
      }
      missing.sort(function(a,b){return String(a.dateISO||'').localeCompare(String(b.dateISO||''));});
      var merged=local.concat(missing);
      persistRecovered(merged);
      try{window.dailyRecords=merged;}catch(_){ }
      try{if(typeof window.renderDailyTable==='function')window.renderDailyTable();}catch(_){ }
      try{if(typeof window.renderManagerView==='function')window.renderManagerView();}catch(_){ }
      try{if(typeof window.renderClassStatusTable==='function')window.renderClassStatusTable();}catch(_){ }
      var rows=missing.map(function(r,i){
        var teacher=r.teacherName||r.teacherUsername||r.savedBy||r.createdBy||r.updatedBy||'غير مسجل';
        return '<tr><td>'+((i+1))+'</td><td>'+esc(r.studentName||'غير معروف')+'</td><td>'+esc(r.className||'—')+'</td><td>'+esc(r.dateISO||'—')+'</td><td>'+esc(teacher)+'</td><td>'+esc(r.id||'—')+'</td><td>'+esc(r.archivedAt||r.updatedAt||'—')+'</td></tr>';
      }).join('');
      status.innerHTML='<b style="color:#166534">✅ تمت الاستعادة بنجاح.</b><br>تم العثور على <b>'+missing.length.toLocaleString('ar-EG')+'</b> سجلًا من السجلات الحالية أو الأرشيف السحابي، ولم تكن موجودة على هذا الجهاز، وتم إرجاعها.';
      result.style.display='block';
      result.innerHTML='<div style="font-weight:800;color:#1e3a8a;margin-bottom:8px">📋 تفاصيل السجلات التي تم إرجاعها</div><div style="overflow:auto"><table style="width:100%;min-width:900px;border-collapse:collapse"><thead><tr><th style="padding:8px;border:1px solid #ddd">#</th><th style="padding:8px;border:1px solid #ddd">اسم الطالب</th><th style="padding:8px;border:1px solid #ddd">الفصل</th><th style="padding:8px;border:1px solid #ddd">التاريخ</th><th style="padding:8px;border:1px solid #ddd">المعلم الذي سجل</th><th style="padding:8px;border:1px solid #ddd">معرف السجل</th><th style="padding:8px;border:1px solid #ddd">وقت الأرشفة</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
    }catch(e){
      console.error('daily cloud recovery failed',e);
      status.innerHTML='<b style="color:#b91c1c">❌ فشلت المراجعة.</b><br>'+esc(e&&e.message?e.message:e);
    }finally{if(btn)btn.disabled=false;}
  };})();
