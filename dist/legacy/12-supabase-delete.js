/* ===== V8: حذف موحّد ونهائي من Supabase فقط ===== */
(async function(){
  function norm(v){ return String(v == null ? '' : v).trim(); }
  function getDb(){
    if (typeof db === 'undefined' || !db || !db.collection) throw new Error('Supabase غير متصل');
    return db;
  }
  window.deleteFirebaseRecord = async function(collectionName, recordId){
    var col = norm(collectionName), id = norm(recordId);
    if (!col || !id) throw new Error('بيانات الحذف غير مكتملة');
    var firestore = getDb();
    var collection = firestore.collection(col);
    var refs = {};
    var docs = [];
    function addDoc(d){ if (d && d.id && !refs[d.id]) { refs[d.id]=true; docs.push(d); } }

    /* 1) جرّب الـ Document ID مباشرة */
    var direct = await collection.doc(id).get();
    if (direct.exists) addDoc(direct);

    /* 2) ابحث بالـ id */
    try {
      var byId = await collection.where('id','==',id).get();
      byId.forEach(addDoc);
    } catch(e) { console.warn('تعذر البحث بحقل id في '+col,e); }

    /* 3) ابحث بالـ recordId */
    try {
      var byRecord = await collection.where('recordId','==',id).get();
      byRecord.forEach(addDoc);
    } catch(e) { console.warn('تعذر البحث بحقل recordId في '+col,e); }

    /* 4) لو لم نجد شيئًا بالطرق السابقة، افحص المستندات نفسها
          للتعامل مع السجلات القديمة التي كان لها معرف مختلف. */
    if (!docs.length) {
      var all = await collection.get();
      all.forEach(function(d){
        var v = d.data() || {};
        if (norm(d.id)===id || norm(v.id)===id || norm(v.recordId)===id) addDoc(d);
      });
    }
    if (!docs.length) throw new Error('السجل غير موجود في Supabase: '+id);

    for (var i=0;i<docs.length;i++) await docs[i].ref.delete();

    /* تحقق حقيقي بعد الحذف */
    var checkDirect = await collection.doc(id).get();
    if (checkDirect.exists) throw new Error('فشل حذف المستند من Supabase: '+id);
    try {
      var checkId = await collection.where('id','==',id).get();
      if (!checkId.empty) throw new Error('ما زال سجل بنفس id موجودًا في Supabase');
    } catch(e) {
      if (/ما زال سجل/.test(String(e && e.message))) throw e;
    }
    try {
      var checkRecord = await collection.where('recordId','==',id).get();
      if (!checkRecord.empty) throw new Error('ما زال سجل بنفس recordId موجودًا في Supabase');
    } catch(e) {
      if (/ما زال سجل/.test(String(e && e.message))) throw e;
    }
    return {ok:true, deleted:true, collection:col, id:id, count:docs.length};
  };

  /* حذف المدفوعات: نفس الآلية، بدون Soft Delete */
  window.deletePaymentFromFirebase_ = async function(recordId){
    return await window.deleteFirebaseRecord('payments', recordId);
  };

  /* حذف كل النتائج: لا نعلن النجاح إلا بعد التحقق من أن المجموعة أصبحت فارغة */
  window.deleteAllResults = async function(){
    var count = (resultsData || []).length;
    if (!count) return showMessage('results-admin-msg','لا توجد نتائج مخزنة أصلاً','info');
    var ok = await siteConfirm('🗑️ حذف كل النتائج','سيتم حذف كل النتائج ('+count+') نهائيًا من الموقع وSupabase. هل تريد المتابعة؟','حذف الكل',true);
    if (!ok) return;
    try {
      if (useFirebase && db) {
        var snap = await db.collection('results').get();
        for (var i=0;i<snap.docs.length;i++) await snap.docs[i].ref.delete();
        var check = await db.collection('results').get();
        if (!check.empty) throw new Error('بعض النتائج ما زالت موجودة في Supabase');
      }
      resultsData=[];
      try { memoryStorage.setItem('resultsData', JSON.stringify([])); } catch(e) { console.warn(e); }
      renderResultsAdminSummary();
      var area = document.getElementById('resultDisplayArea') || document.getElementById('studentPortalArea');
      if (area) area.innerHTML='';
      showMessage('results-admin-msg','تم حذف كل النتائج والأكواد المرتبطة بها بنجاح ✅','success');
    } catch(e) {
      console.error('deleteAllResults:',e);
      showMessage('results-admin-msg','تعذر حذف النتائج من Supabase: '+(e.message||e),'error');
    }
  };
})();
