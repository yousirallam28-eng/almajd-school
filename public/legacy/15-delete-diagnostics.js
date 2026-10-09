window.runFirebaseDeleteDiagnostic = async function(){
  var box=document.getElementById('firebase-delete-diagnostic-result');
  if(box) box.innerHTML='<span style="color:#555">⏳ جاري الاختبار على Supabase...</span>';
  var id='delete_test_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
  var ref=null;
  try{
    if(typeof db==='undefined'||!db||!db.collection) throw new Error('Supabase غير متصل');
    ref=db.collection('_firebase_delete_diagnostic').doc(id);
    await ref.set({id:id,createdAt:new Date().toISOString(),test:true});
    var before=await ref.get();
    if(!before.exists) throw new Error('فشل إنشاء مستند الاختبار');
    await ref.delete();
    var after=await ref.get();
    if(after.exists) throw new Error('Firebase لم يحذف مستند الاختبار فعليًا');
    if(box) box.innerHTML='<div style="color:#166534;font-weight:bold">✅ الحذف يعمل فعليًا من Supabase.</div><div style="color:#555">تم إنشاء مستند اختبار ثم حذفه والتحقق من اختفائه.</div>';
  }catch(e){
    var code=String((e&&e.code)||''); var msg=String((e&&e.message)||e);
    if(ref){ try{ await ref.delete(); }catch(cleanErr){} }
    var diagnosis=code.indexOf('permission-denied')>=0||/permission|Missing or insufficient/i.test(msg)
      ? 'المشكلة من Firestore Security Rules: الحساب الحالي لا يملك صلاحية الحذف.'
      : 'المشكلة تحتاج قراءة رسالة Firebase التالية لتحديد السبب.';
    if(box) box.innerHTML='<div style="color:#b91c1c;font-weight:bold">❌ اختبار الحذف فشل</div><div>'+diagnosis+'</div><div style="direction:ltr;text-align:left;background:#f8fafc;padding:8px;border-radius:6px;margin-top:6px;word-break:break-word">'+msg+'</div>';
    console.error('Firebase delete diagnostic:',e);
  }
};
