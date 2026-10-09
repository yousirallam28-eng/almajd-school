/* تسجيل الدخول عبر Supabase بدل Firebase */
(function(){
  const APP=window.__MAJD_SUPABASE_APP__, KEY=APP&&APP.TOKEN_KEY;
  if(!APP)return;
  async function auth(action,body){const r=await APP.call(action,body);if(r.token)sessionStorage.setItem(KEY,r.token);return r;}
  window.handleLogin=async function(){
    const u=(document.getElementById('username')?.value||'').trim(), p=(document.getElementById('password')?.value||'').trim();
    if(!u||!p)return showMessage('login-msg','يرجى إدخال اسم المستخدم وكلمة المرور','error');
    try{const r=await auth('login',{username:u,password:p});window.currentTeacher=r.user;try{persistentAuthStorage.setItem('currentTeacher',JSON.stringify(r.user));}catch(_){};showAppScreen();}
    catch(e){showMessage('login-msg',e.message||'بيانات الدخول غير صحيحة','error');}
  };
  window.studentLogin=async function(){
    const code=(document.getElementById('studentLoginCode')?.value||'').trim().toUpperCase();
    if(!code)return showMessage('student-login-msg','اكتب كود تسجيل الدخول أولاً','error');
    try{const r=await auth('student_login',{code});window.currentStudent=r.user;return window.studentLoginLegacy();}
    catch(e){showMessage('student-login-msg',e.message||'الكود غير صحيح','error');}
  };
})();
