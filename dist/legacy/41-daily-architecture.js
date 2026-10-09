/* =====================================================================
   DAILY V2 — طبقة جديدة للرصد اليومي
   الواجهة الحالية لا تتغير. هذه الطبقة تفصل State / Storage / Sync / CRUD.
   البيانات القديمة تبقى قابلة للقراءة، وID السجل لا يتغير عند التعديل.
   ===================================================================== */
(function(){
  'use strict';
  var KEY='majd_daily_v2_state';
  var QUEUE='majd_daily_v2_ops';
  var state={status:'idle',lastError:null,pending:0,version:2};
  var queueBusy=false;
  var writeChain=Promise.resolve();

  function safeParse(k, fallback){try{var x=JSON.parse(localStorage.getItem(k)||'');return x==null?fallback:x;}catch(e){return fallback;}}
  function persistState(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function readQueue(){var q=safeParse(QUEUE,[]);return Array.isArray(q)?q:[];}
  function writeQueue(q){try{localStorage.setItem(QUEUE,JSON.stringify(q.slice(-500)));}catch(e){}}
  function now(){return new Date().toISOString();}
  function s(v){return String(v==null?'':v).trim();}
  function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(s(v));}
  function recordKey(r){return s(r&&r.id);}
  function composite(r){return [s(r.studentId)||s(r.studentName),s(r.classId)||s(r.className),s(r.dateISO||r.date).slice(0,10)].join('|');}
  function currentUser(){return window.currentTeacher||{};}
  function allowed(r){
    var u=currentUser(), name=s(u.username), cls=s(r.className);
    if(name==='admin'||s(u.assignedClass)==='الكل')return true;
    try{return typeof teacherOwnsClass_==='function' ? !!teacherOwnsClass_(cls) : s(u.assignedClass)===cls;}catch(e){return s(u.assignedClass)===cls;}
  }
  function normalize(r){
    r=Object.assign({},r||{});
    r.id=s(r.id||r.recordId);
    if(!r.id && r.studentId && r.className && r.dateISO && typeof dailyStableRecordId_==='function'){
      try{r.id=dailyStableRecordId_(r.studentId,r.className,String(r.dateISO).slice(0,10));}catch(e){}
    }
    if(!r.id)r.id='daily-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
    r.recordId=r.id;
    r.dateISO=s(r.dateISO||r.date).slice(0,10);
    r.createdAt=r.createdAt||r.recordedAt||now();
    r.updatedAt=r.updatedAt||r.createdAt;
    r.teacherId=s(r.teacherId||r.teacherUsername||currentUser().id||currentUser().username);
    r.teacherName=s(r.teacherName||currentUser().username);
    r.className=s(r.className);
    r.studentId=s(r.studentId);
    r.studentName=s(r.studentName);
    if(r.total!==undefined && r.total!==null && r.total!=='')r.total=Number(r.total)||0;
    return r;
  }
  function readLocal(){
    var arr=Array.isArray(window.dailyRecords)?window.dailyRecords:[];
    return arr.filter(function(r){return r&&!r._deleted&&!r._legacyMigrated;}).map(normalize);
  }
  function setLocal(arr){
    window.dailyRecords=arr.map(normalize);
    try{memoryStorage.setItem('dailyRecords',JSON.stringify(window.dailyRecords));}catch(e){try{localStorage.setItem('dailyRecords',JSON.stringify(window.dailyRecords));}catch(_) {}}
  }
  function find(rid){return readLocal().find(function(r){return s(r.id)===s(rid);})||null;}
  function findByContext(studentId,className,dateISO){
    var sid=s(studentId), cls=s(className), dt=s(dateISO).slice(0,10);
    return readLocal().find(function(r){return (sid ? s(r.studentId)===sid : s(r.studentName)===sid) && s(r.className)===cls && s(r.dateISO).slice(0,10)===dt;})||null;
  }
  function upsertLocal(payload){
    payload=normalize(payload);
    var arr=readLocal(), i=arr.findIndex(function(r){return s(r.id)===s(payload.id);});
    if(i<0){var same=findByContext(payload.studentId,payload.className,payload.dateISO);if(same){payload.id=same.id;payload.recordId=payload.id;i=arr.findIndex(function(r){return s(r.id)===s(payload.id);});}}
    if(i<0)arr.push(payload);else arr[i]=Object.assign({},arr[i],payload,{id:arr[i].id,recordId:arr[i].id});
    setLocal(arr);return payload;
  }
  function removeLocal(id){setLocal(readLocal().filter(function(r){return s(r.id)!==s(id);}));}
  function enqueue(op){
    var q=readQueue().filter(function(x){return !(s(x.id)===s(op.id));});
    q.push(Object.assign({queuedAt:now(),attempts:0},op));writeQueue(q);state.pending=q.length;state.status='syncing';persistState();
  }
  function cloudAvailable(){return !!(window.useFirebase&&window.db&&navigator.onLine!==false);}
  async function cloudSave(r){
    if(!cloudAvailable())throw new Error('OFFLINE');
    var ref=db.collection('dailyRecords').doc(s(r.id));
    var payload=Object.assign({},r,{id:s(r.id),recordId:s(r.id),updatedAt:r.updatedAt||now()});
    await ref.set(payload,{merge:true});
    var snap=await ref.get();
    if(!snap.exists)throw new Error('VERIFY_MISSING');
    var saved=Object.assign({},snap.data()||{}, {id:snap.data().id||r.id});
    if(s(saved.id)!==s(r.id))throw new Error('VERIFY_ID');
    return normalize(saved);
  }
  async function cloudDelete(id){
    if(!cloudAvailable())throw new Error('OFFLINE');
    var ref=db.collection('dailyRecords').doc(s(id));
    await ref.delete();
    var snap=await ref.get();
    if(snap.exists)throw new Error('DELETE_VERIFY_FAILED');
  }
  async function save(payload){
    payload=normalize(payload);
    if(!payload.className||!payload.studentName||!validDate(payload.dateISO))throw new Error('بيانات الرصد الأساسية غير مكتملة');
    if(!allowed(payload))throw new Error('لا توجد صلاحية لهذا الفصل');
    var existing=find(payload.id)||findByContext(payload.studentId,payload.className,payload.dateISO);
    if(existing){payload.id=existing.id;payload.recordId=existing.id;payload.createdAt=existing.createdAt||payload.createdAt;}
    payload.updatedAt=now();
    upsertLocal(payload);
    var op={type:'save',id:payload.id,payload:payload};
    enqueue(op);
    try{
      var saved=await cloudSave(payload);
      upsertLocal(saved);
      removeQueueItem(payload.id);
      state.status='synced';state.lastError=null;state.pending=readQueue().length;persistState();
      return {status:'synced',record:saved};
    }catch(e){
      state.lastError=String(e&&e.message||e);state.status='pending';persistState();
      if(String(e&&e.message)!=='OFFLINE') console.warn('[DailyV2] cloud save pending:',e);
      return {status:'pending',record:payload,error:e};
    }
  }
  function removeQueueItem(id){var q=readQueue().filter(function(x){return s(x.id)!==s(id);});writeQueue(q);state.pending=q.length;}
  async function sync(){
    if(queueBusy||!cloudAvailable())return {status:'offline',pending:readQueue().length};
    queueBusy=true;state.status='syncing';persistState();
    try{
      var q=readQueue();
      for(var i=0;i<q.length;i++){
        var op=q[i];
        try{
          if(op.type==='delete')await cloudDelete(op.id);else await cloudSave(normalize(op.payload));
          removeQueueItem(op.id);q=readQueue();i=-1;
        }catch(e){
          op.attempts=Number(op.attempts||0)+1;op.lastError=String(e&&e.message||e);q[i]=op;writeQueue(q);
          if(op.attempts>=5)break;
        }
      }
      state.pending=readQueue().length;state.status=state.pending?'pending':'synced';persistState();
      return {status:state.status,pending:state.pending};
    }finally{queueBusy=false;}
  }
  async function del(id){
    var r=find(id);if(!r)throw new Error('السجل غير موجود');
    if(!allowed(r))throw new Error('ليس لديك صلاحية حذف هذا السجل');
    removeLocal(id);enqueue({type:'delete',id:s(id)});
    try{await cloudDelete(id);removeQueueItem(id);state.status='synced';state.lastError=null;persistState();}
    catch(e){state.status='pending';state.lastError=String(e&&e.message||e);persistState();}
    return true;
  }
  function getState(){return Object.assign({},state,{pending:readQueue().length});}

  window.DailyArchitectureV2={save:save,delete:del,sync:sync,find:find,findByContext:findByContext,normalize:normalize,state:getState,readLocal:readLocal};

  /* احتفظ بالتكاملات الأخرى كما هي، لكن افصل dailyRecords عن دالة التخزين القديمة. */
  if(typeof window.firebaseWriteRecord_==='function'&&!window.__dailyV2LegacyWrite){
    window.__dailyV2LegacyWrite=window.firebaseWriteRecord_;
    window.firebaseWriteRecord_=async function(collectionName,id,data,options){
      if(String(collectionName)!=='dailyRecords')return window.__dailyV2LegacyWrite.apply(this,arguments);
      var payload=normalize(Object.assign({},data||{},{id:String(id||data&&data.id||data&&data.recordId||'')}));
      if(!payload.id)throw new Error('معرف سجل الرصد مفقود');
      var result=await save(payload);
      /* الدالة القديمة تتوقع Promise ناجحة حتى في الوضع المحلي؛ pending حالة صالحة وليست فقدًا للبيانات. */
      return result.record;
    };
  }
  if(typeof window.deleteFirebaseRecord==='function'&&!window.__dailyV2LegacyDelete){
    window.__dailyV2LegacyDelete=window.deleteFirebaseRecord;
    window.deleteFirebaseRecord=async function(collectionName,id){
      if(String(collectionName)==='dailyRecords')return DailyArchitectureV2.delete(id);
      return window.__dailyV2LegacyDelete.apply(this,arguments);
    };
  }

  /* قفل عمليات الرصد يمنع النقر المزدوج والتعديل/الحذف المتزامن. */
  if(typeof window.addGrade==='function'&&!window.__dailyV2LegacyAdd){
    window.__dailyV2LegacyAdd=window.addGrade;
    var locked=false;
    window.addGrade=async function(){
      if(locked){showMessage('app-msg','جارٍ حفظ الرصد الحالي، انتظر لحظة واحدة.', 'info');return;}
      locked=true;
      try{var result=await window.__dailyV2LegacyAdd.apply(this,arguments);try{var st=DailyArchitectureV2.state();if(st.pending>0)showMessage('app-msg','تم حفظ الرصد على هذا الجهاز، وجارٍ مزامنته مع السحابة تلقائيًا.','info');}catch(_){}return result;}finally{locked=false;}
    };
  }
  if(typeof window.deleteRecord==='function'&&!window.__dailyV2LegacyDeleteRecord){
    window.__dailyV2LegacyDeleteRecord=window.deleteRecord;
    var deleteLocked=false;
    window.deleteRecord=async function(id){
      if(deleteLocked)return;
      deleteLocked=true;
      try{return await window.__dailyV2LegacyDeleteRecord.apply(this,arguments);}finally{deleteLocked=false;}
    };
  }

  /* إعادة المزامنة عند رجوع الإنترنت/العودة للتطبيق. */
  window.addEventListener('online',function(){setTimeout(function(){DailyArchitectureV2.sync();},400);});
  window.addEventListener('pageshow',function(){setTimeout(function(){DailyArchitectureV2.sync();},700);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(function(){DailyArchitectureV2.sync();},700);});

  /* ترقية آمنة للبيانات القديمة: لا تغيير في IDs ولا حذف للسجلات. */
  try{setLocal(readLocal());}catch(e){console.warn('[DailyV2] migration:',e);}
  setTimeout(function(){DailyArchitectureV2.sync();},1200);

  /* المؤقت: لا نعتمد على عدد مرات interval؛ نستخدم timestamps عند بدء/استراحة/توقف. */
  if(typeof window.startDailyTimer==='function'&&!window.__dailyV2LegacyStartTimer){
    window.__dailyV2LegacyStartTimer=window.startDailyTimer;
    window.startDailyTimer=function(){
      try{
        if(typeof dailyTimerStartedAt!=='undefined'&&!dailyTimerStartedAt) dailyTimerStartedAt=Date.now();
      }catch(e){}
      return window.__dailyV2LegacyStartTimer.apply(this,arguments);
    };
  }
  if(typeof window.pauseDailyTimer==='function'&&!window.__dailyV2LegacyPauseTimer){
    window.__dailyV2LegacyPauseTimer=window.pauseDailyTimer;
    window.pauseDailyTimer=function(){return window.__dailyV2LegacyPauseTimer.apply(this,arguments);};
  }
  if(typeof window.stopDailyTimer==='function'&&!window.__dailyV2LegacyStopTimer){
    window.__dailyV2LegacyStopTimer=window.stopDailyTimer;
    window.stopDailyTimer=function(){return window.__dailyV2LegacyStopTimer.apply(this,arguments);};
  }

  window.getDailyArchitectureStatus=function(){return DailyArchitectureV2.state();};
})();
