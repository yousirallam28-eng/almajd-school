(function(){
'use strict';

const SUPABASE_URL='https://kryihlhqsxauhnbaukqe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_ne1_WmbgrTLYVSCqBFKH7g_pDn0kQ6z';
const SUPABASE_MIGRATION_FUNCTION=SUPABASE_URL+'/functions/v1/smart-worker';
const SUPABASE=window.supabase&&window.supabase.createClient ? window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}}):null;
window.__MAJD_SUPABASE__=SUPABASE;
window.__MAJD_SUPABASE_CONFIG__={url:SUPABASE_URL,migrationFunction:SUPABASE_MIGRATION_FUNCTION};

/* تم استخراج هذه المجموعات من استخدامات Firebase الفعلية في الملف الحالي. */
const COLLECTIONS=[
 'students','teachers','dailyRecords','dailyRecordsArchive','notes','results','payments','shariaGrades',
 'wafdeenStudents','wafdeenTeachers','wafdeenDailyRecords','wafdeenExams','wafdeenMonthlyReports',
 'wafdeenSettings','wafdeenUsage','dailySyncDiagnostics','_firebase_delete_diagnostic'
];
const BATCH_SIZE=100;
let migrationRunning=false, migrationRunId=null, migrationCounts={}, migrationStartedAt=0, migrationAbort=false, migrationResumeRun=null;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=String(v==null?'':v);}
function fmt(n){return Number(n||0).toLocaleString('ar-EG');}
function formatDuration(ms){ms=Number(ms)||0;let s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;let h=Math.floor(m/60);m%=60;return h?(h+'س '+m+'د'):m?(m+'د '+s+'ث'):s+'ث';}
function isFullAdmin(){try{const t=window.currentTeacher||(typeof currentTeacher!=='undefined'?currentTeacher:null);return !!t&&String(t.username||'').trim()==='admin';}catch(e){return false;}}
function ensureAdmin(){if(!isFullAdmin()){try{if(typeof showMessage==='function')showMessage('app-msg','هذه العملية متاحة لمدير النظام الرئيسي فقط.','error');}catch(e){}return false;}return true;}
function logLine(msg,kind){const box=document.getElementById('supabase-migration-log');if(!box)return;const d=document.createElement('div');d.style.color=kind==='error'?'#fecaca':kind==='success'?'#bbf7d0':'#e2e8f0';d.textContent=new Date().toLocaleTimeString('ar-EG')+' — '+msg;box.appendChild(d);box.scrollTop=box.scrollHeight;}
function updateProgress(p){p=p||{};const total=Number(p.total||0),done=Number(p.done||0),pct=total?Math.min(100,Math.max(0,Math.round(done*100/total))):Number(p.percent||0);const bar=document.getElementById('supabase-migration-bar');if(bar)bar.style.width=pct+'%';setText('supabase-migration-percent',pct+'%');setText('supabase-migration-total',fmt(total));setText('supabase-migration-done',fmt(done));setText('supabase-migration-remaining',fmt(Math.max(0,total-done)));setText('supabase-migration-success',fmt(p.success));setText('supabase-migration-updated',fmt(p.updated));setText('supabase-migration-skipped',fmt(p.skipped));setText('supabase-migration-failed',fmt(p.failed));setText('supabase-migration-current',p.collection||'—');setText('supabase-migration-stage',p.stage||'—');setText('supabase-migration-speed',p.speed?Number(p.speed).toFixed(1)+' سجل/ث':'—');setText('supabase-migration-elapsed',formatDuration(p.elapsedMs));setText('supabase-migration-eta',p.etaMs?formatDuration(p.etaMs):'—');}
function openPanel(){const p=document.getElementById('supabase-migration-panel');if(p)p.style.display='block';}
function setConfirm(show){const c=document.getElementById('supabase-migration-confirm-inline');if(c)c.style.display=show?'block':'none';}
async function api(action,body){
 if(!SUPABASE)throw new Error('مكتبة Supabase غير متاحة.');
 const token=String(document.getElementById('supabase-migration-token')?.value||'').trim();
 if(!token)throw new Error('أدخل MIGRATION_ADMIN_TOKEN أولًا.');
 const r=await fetch(SUPABASE_MIGRATION_FUNCTION,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'apikey':SUPABASE_PUBLISHABLE_KEY},body:JSON.stringify(Object.assign({action},body||{})),cache:'no-store'});
 let data={};try{data=await r.json();}catch(e){}
 if(!r.ok)throw new Error(data.error||data.message||('HTTP '+r.status));
 return data;
}
function firebaseReady(){return !!(window.useFirebase&&window.db&&window.firebase&&window.firebase.firestore);}
async function testConnections(){
 openPanel();setText('supabase-connection-status','جارٍ الاختبار...');setText('firebase-connection-status','جارٍ الاختبار...');setText('supabase-write-status','—');
 let firebaseOk=false,supabaseOk=false;
 try{if(!firebaseReady())throw new Error('Supabase غير متصل أو Firestore غير متاح.');await window.db.collection(COLLECTIONS[0]).limit(1).get();firebaseOk=true;setText('firebase-connection-status','✓ متصل');logLine('Firebase: الاتصال ناجح.','success');}catch(e){setText('firebase-connection-status','✗ '+(e.message||e));logLine('Firebase: '+(e.message||e),'error');}
 try{const h=await api('health');if(!h.ok)throw new Error(h.error||'Supabase غير متاح.');supabaseOk=true;setText('supabase-connection-status','✓ متصل');setText('supabase-write-status','✓ صلاحية النقل متاحة عبر Edge Function');logLine('Supabase/Edge Function: الاتصال وصلاحية الخدمة ناجحان.','success');}catch(e){setText('supabase-connection-status','✗ '+(e.message||e));setText('supabase-write-status','✗ غير متاحة');logLine('Supabase: '+(e.message||e),'error');}
 return {firebaseOk,supabaseOk};
}
async function scanFirebaseCollection(col,onDocs,afterId){
 if(!firebaseReady())throw new Error('Supabase غير متصل.');
 let lastId=afterId||null,total=0;
 while(true){
  if(migrationAbort)throw new Error('__MIGRATION_PAUSED__');
  let q=window.db.collection(col).orderBy(window.firebase.firestore.FieldPath.documentId()).limit(BATCH_SIZE);
  if(lastId!==null)q=q.startAfter(lastId);
  const snap=await q.get();if(!snap.size)break;
  const docs=snap.docs.map(d=>({id:String(d.id),data:d.data()||{}}));await onDocs(docs);total+=docs.length;lastId=docs[docs.length-1].id;if(snap.size<BATCH_SIZE)break;await new Promise(r=>setTimeout(r,0));
 }
 return total;
}
async function countAllCollections(){
 const counts={},totalStart=Date.now();let total=0;
 for(const c of COLLECTIONS){if(migrationAbort)throw new Error('__MIGRATION_PAUSED__');setText('supabase-migration-stage','حساب إجمالي السجلات');setText('supabase-migration-current',c);let n=0;await scanFirebaseCollection(c,docs=>{n+=docs.length;},null);counts[c]=n;total+=n;logLine('فحص '+c+': '+fmt(n)+' سجل.');}
 logLine('اكتمل حساب الإجمالي في '+formatDuration(Date.now()-totalStart),'success');return {counts,total};
}
function renderVerification(v){const body=document.getElementById('supabase-verification-body');if(!body)return;const rows=(v&&v.results)||[];body.innerHTML=rows.map(r=>'<tr><td>'+esc(r.collection)+'</td><td>'+fmt(r.firebaseCount)+'</td><td>'+fmt(r.supabaseCount)+'</td><td>'+esc(r.status||'—')+'</td></tr>').join('')||'<tr><td colspan="4">لا توجد نتائج.</td></tr>';}
function renderErrors(rows){const body=document.getElementById('supabase-errors-body');if(!body)return;body.innerHTML=(rows||[]).map(r=>'<tr><td>'+esc(r.collection_name)+'</td><td>'+esc(r.record_id)+'</td><td>'+esc(r.error_message)+'</td></tr>').join('')||'<tr><td colspan="3">لا توجد سجلات فاشلة.</td></tr>';setText('supabase-errors-count',fmt((rows||[]).length));}
async function loadErrors(runId){const r=await api('errors',{runId});renderErrors(r.rows||[]);return r.rows||[];}
async function saveCheckpoint(c,lastId,count){await api('checkpoint',{runId:migrationRunId,collection:c,lastId,count});}
async function verifyIdsExact(){
 const out=[];let missing=0;
 for(const c of COLLECTIONS){let checked=0,miss=[];await scanFirebaseCollection(c,async docs=>{checked+=docs.length;const r=await api('verify_ids',{runId:migrationRunId,collection:c,ids:docs.map(x=>x.id)});if(r.missing?.length)miss=miss.concat(r.missing);},null);missing+=miss.length;out.push({collection:c,checked,missing:miss.length});logLine(c+': Verification IDs — '+checked+' مفحوص، '+miss.length+' مفقود.',miss.length?'error':'success');}
 return {results:out,missing};
}
async function retryFailed(){
 if(migrationRunning||!ensureAdmin()||!migrationRunId)return;const rows=await loadErrors(migrationRunId);if(!rows.length){logLine('لا توجد سجلات فاشلة لإعادة المحاولة.','success');return;}
 migrationRunning=true;migrationAbort=false;openPanel();const groups={};rows.forEach(x=>{(groups[x.collection_name]||(groups[x.collection_name]=new Set())).add(String(x.record_id));});
 try{for(const c of Object.keys(groups)){const docs=[];for(const id of groups[c]){if(migrationAbort)break;try{const d=await window.db.collection(c).doc(id).get();if(d.exists)docs.push({id:String(d.id),data:d.data()||{}});else logLine(c+' / '+id+': غير موجود في Supabase.','error');}catch(e){logLine(c+' / '+id+': '+(e.message||e),'error');}if(docs.length>=BATCH_SIZE){const r=await api('batch',{runId:migrationRunId,collection:c,records:docs.splice(0,BATCH_SIZE)});logLine(c+': إعادة المحاولة — نجاح '+r.success+'، تحديث '+r.updated+'، تخطي '+r.skipped+'، فشل '+r.failed,r.failed?'error':'success');}}if(docs.length&&!migrationAbort){const r=await api('batch',{runId:migrationRunId,collection:c,records:docs});logLine(c+': إعادة المحاولة — نجاح '+r.success+'، تحديث '+r.updated+'، تخطي '+r.skipped+'، فشل '+r.failed,r.failed?'error':'success');}}await loadErrors(migrationRunId);}catch(e){logLine('فشلت إعادة المحاولة: '+(e.message||e),'error');}finally{migrationRunning=false;}
}
async function showHistory(){if(!ensureAdmin())return;openPanel();try{const r=await api('history',{limit:20});const body=document.getElementById('supabase-history-body');if(!body)return;body.innerHTML=(r.rows||[]).map(x=>'<tr><td>'+esc(x.id)+'</td><td>'+esc(x.status)+'</td><td>'+esc(x.started_at||'')+'</td><td>'+esc(x.finished_at||'')+'</td><td>'+fmt(x.total_records)+'</td><td>'+fmt(x.failed_records)+'</td></tr>').join('')||'<tr><td colspan="6">لا توجد عمليات.</td></tr>';}catch(e){logLine('تعذر قراءة سجل العمليات: '+(e.message||e),'error');}}
async function startMigration(){
 if(migrationRunning||!ensureAdmin())return;
 openPanel();migrationAbort=false;
 const token=String(document.getElementById('supabase-migration-token')?.value||'').trim();if(!token){logLine('أدخل MIGRATION_ADMIN_TOKEN.','error');return;}
 if(!firebaseReady()){logLine('Supabase غير متصل.','error');return;}
 if(!SUPABASE){logLine('Supabase غير متاح.','error');return;}
 setConfirm(true);setText('supabase-confirm-summary','سيتم فحص '+COLLECTIONS.length+' Collections فعلية مكتشفة من كود Supabase، ثم نسخها إلى Supabase على دفعات. لن يتم حذف أو تعديل أي بيانات في Supabase.');
}
async function beginConfirmed(){
 setConfirm(false);migrationRunning=true;migrationAbort=false;migrationStartedAt=Date.now();openPanel();const startBtn=document.getElementById('supabase-migration-start');const stopBtn=document.getElementById('supabase-migration-stop');if(startBtn)startBtn.disabled=true;if(stopBtn)stopBtn.style.display='inline-block';document.getElementById('supabase-migration-log').innerHTML='';setText('supabase-migration-final','جاري التحقق والتحضير...');
 let summary={total:0,success:0,updated:0,skipped:0,failed:0};
 try{
  const conn=await testConnections();
  if(!conn.firebaseOk||!conn.supabaseOk)throw new Error('لا يمكن بدء النقل قبل نجاح اتصال Supabase وSupabase معًا. راجع تفاصيل اختبار الاتصال.');
  const pre=await countAllCollections();migrationCounts=pre.counts;summary.total=pre.total;setText('supabase-migration-total',fmt(pre.total));
  let checkpoints={};
  if(migrationResumeRun){
   migrationRunId=migrationResumeRun.id;setText('supabase-migration-run',migrationRunId);checkpoints=(migrationResumeRun.summary&&migrationResumeRun.summary.checkpoints)||{};summary.success=Number(migrationResumeRun.success_records||0);summary.updated=Number(migrationResumeRun.updated_records||0);summary.skipped=Number(migrationResumeRun.skipped_records||0);summary.failed=Number(migrationResumeRun.failed_records||0);logLine('استكمال العملية السابقة من آخر Batch محفوظ: '+migrationRunId,'success');await api('resume',{runId:migrationRunId});
  }else{
   const init=await api('start',{collections:COLLECTIONS,total:pre.total,batchSize:BATCH_SIZE,startedBy:String((window.currentTeacher||{}).username||'admin')});migrationRunId=init.runId;setText('supabase-migration-run',migrationRunId);logLine('بدأت عملية Migration جديدة: '+migrationRunId,'success');
  }
  let done=0;
  for(const c of COLLECTIONS){
   if(migrationAbort)break;const totalCol=migrationCounts[c]||0;const cp=checkpoints[c]||{};const afterId=cp.id||null;let localCount=Number(cp.count||0);done+=localCount;if(localCount>=totalCol){logLine(c+': مكتملة بالفعل حسب آخر Checkpoint.','success');continue;}
   if(!totalCol){logLine(c+': لا توجد سجلات.');continue;}
   setText('supabase-migration-stage','نقل البيانات');
   await scanFirebaseCollection(c,async docs=>{
    if(migrationAbort)throw new Error('__MIGRATION_PAUSED__');
    let pendingDocs=docs;
    try{
     // افحص المعرفات الموجودة أولًا، ولا تعيد إرسال السجلات المنقولة سابقًا.
     const check=await api('verify_ids',{runId:migrationRunId,collection:c,ids:docs.map(x=>x.id)});
     const missing=new Set((check.missing||[]).map(String));
     pendingDocs=docs.filter(x=>missing.has(String(x.id)));
     const already=docs.length-pendingDocs.length;
     if(already){
      summary.skipped+=already;
      done+=already;
      localCount+=already;
      logLine(c+': تم تجاوز '+already+' سجل منقول مسبقًا.','success');
     }
     if(!pendingDocs.length){
      await saveCheckpoint(c,docs[docs.length-1].id,localCount);
      const elapsed=Date.now()-migrationStartedAt,speed=done/(elapsed/1000||1),eta=(pre.total-done)/(speed||1)*1000;
      updateProgress({total:pre.total,done,success:summary.success,updated:summary.updated,skipped:summary.skipped,failed:summary.failed,collection:c,stage:'تجاوز المنقول سابقًا',speed,elapsedMs:elapsed,etaMs:eta});
      return;
     }
     const r=await api('batch',{runId:migrationRunId,collection:c,records:pendingDocs});
     summary.success+=Number(r.success||0);summary.updated+=Number(r.updated||0);summary.skipped+=Number(r.skipped||0);summary.failed+=Number(r.failed||0);
     done+=pendingDocs.length;localCount+=pendingDocs.length;await saveCheckpoint(c,docs[docs.length-1].id,localCount);
     if(r.errors?.length)r.errors.slice(0,5).forEach(x=>logLine(c+' / '+(x.id||'')+': '+x.message,'error'));
     const elapsed=Date.now()-migrationStartedAt,speed=done/(elapsed/1000||1),eta=(pre.total-done)/(speed||1)*1000;updateProgress({total:pre.total,done,success:summary.success,updated:summary.updated,skipped:summary.skipped,failed:summary.failed,collection:c,stage:'نقل البيانات',speed,elapsedMs:elapsed,etaMs:eta});
     logLine(c+': دفعة '+pendingDocs.length+' — جديد '+r.success+'، محدث '+r.updated+'، متخطى '+(Number(r.skipped||0)+already)+'، فشل '+r.failed,r.failed?'error':'success');
    }catch(e){const failedCount=pendingDocs.length;summary.failed+=failedCount;done+=failedCount;updateProgress({total:pre.total,done,success:summary.success,updated:summary.updated,skipped:summary.skipped,failed:summary.failed,collection:c,stage:'خطأ في دفعة',elapsedMs:Date.now()-migrationStartedAt});await api('batch_error',{runId:migrationRunId,collection:c,records:pendingDocs.map(x=>x.id),error:String(e.message||e)}).catch(()=>{});logLine('فشل Batch في '+c+': '+(e.message||e),'error');}
    await new Promise(r=>setTimeout(r,0));
   },afterId);
  }
  if(migrationAbort){await api('pause',{runId:migrationRunId,error:'تم إيقاف النقل بواسطة المدير.',summary:{...summary,checkpoints:(migrationResumeRun?.summary?.checkpoints||{})}});setText('supabase-migration-final','تم إيقاف النقل. يمكنك استئنافه من آخر Batch.');logLine('تم إيقاف النقل وحفظ آخر Checkpoint.','error');return;}
  setText('supabase-migration-stage','Verification بالأعداد');const verification=await api('verify',{runId:migrationRunId,collections:COLLECTIONS,firebaseCounts:migrationCounts});renderVerification(verification);
  setText('supabase-migration-stage','Verification بالمعرفات');const exact=await verifyIdsExact();
  const verificationOk=(verification.results||[]).every(x=>String(x.status).indexOf('متطابق')>=0)&&exact.missing===0;
  const errors=await loadErrors(migrationRunId);summary.total=pre.total;await api('finish',{runId:migrationRunId,summary:{...summary,verification,exactIdVerification:exact,errorCount:errors.length},error:verificationOk&&summary.failed===0?'':'يوجد أخطاء أو اختلاف بعد Verification'});
  updateProgress({total:pre.total,done:pre.total,success:summary.success,updated:summary.updated,skipped:summary.skipped,failed:summary.failed,percent:100,stage:'اكتمل',elapsedMs:Date.now()-migrationStartedAt});setText('supabase-migration-final',verificationOk&&summary.failed===0?'✓ تم نقل جميع البيانات والتحقق منها بنجاح':'⚠ اكتمل النقل مع وجود أخطاء/ملاحظات.');logLine(verificationOk&&summary.failed===0?'اكتملت عملية النقل والتحقق بنجاح.':'انتهى النقل مع ملاحظات. ',verificationOk&&summary.failed===0?'success':'error');
  setText('supabase-auth-note','Authentication: تتم إدارة الدخول عبر Supabase، ولم يتم تغيير كلمات المرور الحالية.');setText('supabase-storage-note','Storage: ملفات الكتب تستخدم Supabase Storage عبر الحاوية المخصصة لها.');
 }catch(e){
  if(String(e.message||e)==='__MIGRATION_PAUSED__'){if(migrationRunId)await api('pause',{runId:migrationRunId,error:'تم إيقاف النقل.',summary}).catch(()=>{});setText('supabase-migration-final','تم إيقاف النقل.');logLine('تم إيقاف النقل.','error');}
  else{logLine('توقفت العملية: '+(e.message||e),'error');if(migrationRunId)await api('pause',{runId:migrationRunId,error:String(e.message||e),summary}).catch(()=>{});setText('supabase-migration-final','توقفت العملية بسبب خطأ؛ راجع التفاصيل ثم استأنف.');}
 }finally{migrationRunning=false;migrationResumeRun=null;if(startBtn)startBtn.disabled=false;if(stopBtn)stopBtn.style.display='none';await loadErrors(migrationRunId).catch(()=>{});}
}

function stopMigration(){if(!migrationRunning)return;migrationAbort=true;setText('supabase-migration-final','جارٍ إيقاف النقل بعد إنهاء الدفعة الحالية...');logLine('طلب المدير إيقاف النقل؛ لن يتم حذف أي بيانات.');}
async function resumeMigration(){
 if(migrationRunning||!ensureAdmin())return;openPanel();
 try{const r=await api('history',{limit:20});const run=(r.rows||[]).find(x=>x.status==='paused'||x.status==='running');if(!run){logLine('لا توجد عملية غير مكتملة للاستئناف.','error');return;}migrationResumeRun=run;migrationRunId=run.id;setText('supabase-migration-run',run.id);setConfirm(true);setText('supabase-confirm-summary','سيتم استئناف العملية '+run.id+' من آخر Checkpoint محفوظ، ولن يعاد إنشاء السجلات الموجودة.');}
 catch(e){logLine('تعذر العثور على عملية غير مكتملة: '+(e.message||e),'error');}
}

function addUI(){
 if(document.getElementById('supabase-migration-entry'))return;if(!isFullAdmin())return;const host=document.getElementById('admin-tab');if(!host)return;
 const entry=document.createElement('section');entry.id='supabase-migration-entry';entry.style.cssText='display:block;margin:12px 12px 22px;padding:18px;border:2px solid #0f766e;border-radius:18px;background:#fff;box-shadow:0 8px 28px rgba(15,118,110,.12);direction:rtl;position:relative;z-index:100;';
 entry.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><h2 style="margin:0 0 6px;color:#0f766e;font-size:1.25rem">☁️ إدارة البيانات في Supabase</h2><div style="color:#475569;line-height:1.8">تخزين آمن على Supabase مع الحفاظ على البيانات وعدم حذف أي سجلات دون طلب.</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="supabase-test" type="button" class="action-btn">🔌 اختبار الاتصال</button><button id="supabase-migration-start" type="button" class="action-btn btn-save">🚀 إدارة البيانات في Supabase</button><button id="supabase-migration-stop" type="button" class="action-btn" style="display:none">⏹ إيقاف النقل</button><button id="supabase-migration-resume" type="button" class="action-btn">▶️ استئناف</button></div></div>
 <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><input id="supabase-migration-token" type="password" autocomplete="off" placeholder="أدخل MIGRATION_ADMIN_TOKEN" style="flex:1;min-width:250px;padding:11px;border:1px solid #cbd5e1;border-radius:10px"><button id="supabase-migration-history" type="button" class="action-btn">📋 سجل العمليات</button><button id="supabase-migration-retry" type="button" class="action-btn">🔁 إعادة محاولة الفاشل</button></div>
 <div style="margin-top:12px;background:#f8fafc;border-radius:12px;padding:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px"><div>Supabase: <b id="firebase-connection-status">—</b></div><div>Supabase: <b id="supabase-connection-status">—</b></div><div>صلاحية الكتابة: <b id="supabase-write-status">—</b></div><div id="supabase-resume-info">لا توجد معلومات عن عملية سابقة.</div></div>
 <div id="supabase-migration-confirm-inline" style="display:none;margin-top:14px;padding:14px;border:1px solid #cbd5e1;border-radius:12px;background:#fff"><b>تأكيد العملية</b><div id="supabase-confirm-summary" style="margin:8px 0;line-height:1.8"></div><button id="supabase-confirm-ok" type="button" class="action-btn btn-save">بدء النقل الآن</button><button id="supabase-confirm-cancel" type="button" class="action-btn">إلغاء</button></div>
 <div id="supabase-migration-panel" style="display:none;margin-top:16px;border:1px solid #dbe7f3;border-radius:14px;padding:16px;background:#f8fafc"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong>الحالة: <span id="supabase-migration-final">جاهز</span></strong><span>Run: <span id="supabase-migration-run">—</span></span></div><div style="margin-top:10px">المرحلة: <b id="supabase-migration-stage">—</b> | المجموعة الحالية: <b id="supabase-migration-current">—</b></div><div style="height:22px;background:#e5e7eb;border-radius:999px;overflow:hidden;margin:14px 0"><div id="supabase-migration-bar" style="height:100%;width:0%;transition:width .25s ease;background:#0f766e"></div></div><div style="font-size:1.3em;font-weight:800;margin-bottom:12px"><span id="supabase-migration-percent">0%</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px"><div>الإجمالي<div id="supabase-migration-total">0</div></div><div>تم نقله/معالجته<div id="supabase-migration-done">0</div></div><div>المتبقي<div id="supabase-migration-remaining">0</div></div><div>نجح<div id="supabase-migration-success">0</div></div><div>تم تحديثه<div id="supabase-migration-updated">0</div></div><div>تم تخطيه<div id="supabase-migration-skipped">0</div></div><div>فشل<div id="supabase-migration-failed">0</div></div><div>السرعة<div id="supabase-migration-speed">—</div></div><div>المنقضي<div id="supabase-migration-elapsed">—</div></div><div>المتبقي المتوقع<div id="supabase-migration-eta">—</div></div></div><div id="supabase-migration-log" style="margin-top:12px;max-height:240px;overflow:auto;background:#0f172a;color:#e2e8f0;padding:10px;border-radius:10px;font:12px/1.7 monospace"></div><h4>Verification</h4><div style="overflow:auto"><table style="min-width:620px;width:100%"><thead><tr><th>Collection</th><th>Firebase</th><th>Supabase</th><th>الحالة</th></tr></thead><tbody id="supabase-verification-body"><tr><td colspan="4">لم يبدأ.</td></tr></tbody></table></div><h4>الأخطاء</h4><div>العدد: <b id="supabase-errors-count">0</b></div><div style="overflow:auto"><table style="min-width:700px;width:100%"><thead><tr><th>Collection</th><th>معرف السجل</th><th>السبب</th></tr></thead><tbody id="supabase-errors-body"><tr><td colspan="3">لا توجد أخطاء.</td></tr></tbody></table></div><div style="margin-top:12px;padding:10px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px"><b>ملاحظات أمنية وبيانات غير قابلة للنقل من الواجهة:</b><div id="supabase-auth-note">Authentication: نظام الدخول الحالي يعمل عبر Supabase.</div><div id="supabase-storage-note">Storage: سيتم عرض حالة Storage بعد الفحص.</div></div><h4>سجل عمليات Migration</h4><div style="overflow:auto"><table style="min-width:850px;width:100%"><thead><tr><th>Run</th><th>الحالة</th><th>البدء</th><th>الانتهاء</th><th>الإجمالي</th><th>الفشل</th></tr></thead><tbody id="supabase-history-body"><tr><td colspan="6">اضغط سجل العمليات.</td></tr></tbody></table></div></div>`;
 host.insertBefore(entry,host.firstChild);
 entry.querySelector('#supabase-test').addEventListener('click',testConnections);entry.querySelector('#supabase-migration-start').addEventListener('click',startMigration);entry.querySelector('#supabase-confirm-ok').addEventListener('click',beginConfirmed);entry.querySelector('#supabase-confirm-cancel').addEventListener('click',()=>setConfirm(false));entry.querySelector('#supabase-migration-stop').addEventListener('click',stopMigration);entry.querySelector('#supabase-migration-resume').addEventListener('click',resumeMigration);entry.querySelector('#supabase-migration-history').addEventListener('click',showHistory);entry.querySelector('#supabase-migration-retry').addEventListener('click',retryFailed);
}
function boot(){ /* Migration UI intentionally disabled; legacy routines/data remain untouched. */ }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
