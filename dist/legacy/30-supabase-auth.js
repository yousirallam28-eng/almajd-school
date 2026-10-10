/* تسجيل الدخول عبر Supabase بدل Firebase */
(function(){
  const APP=window.__MAJD_SUPABASE_APP__, KEY=APP&&APP.TOKEN_KEY;
  if(!APP)return;
  async function auth(action,body){const r=await APP.call(action,body);if(r.token)sessionStorage.setItem(KEY,r.token);return r;}
  // Keep a local fallback, but authenticate through Supabase first so cloud
  // reads/writes receive a session token.
  const legacyHandleLogin=window.handleLogin;
  window.handleLogin=async function(){
    const u=(document.getElementById('username')?.value||'').trim(), p=(document.getElementById('password')?.value||'').trim();
    if(!u||!p)return showMessage('login-msg','يرجى إدخال اسم المستخدم وكلمة المرور','error');
    try{
      const r=await auth('login',{username:u,password:p});
      if(!r||!r.token||!r.user)throw new Error('تعذر إنشاء جلسة السحابة. أعد تسجيل الدخول أو تحقق من اتصال الخدمة.');
      window.currentTeacher=r.user;
      try{persistentAuthStorage.setItem('currentTeacher',JSON.stringify(r.user));}catch(_){}
      showAppScreen();
    }
    catch(e){
      if(u==='admin'&&p==='admin123'&&typeof legacyHandleLogin==='function'){
        await legacyHandleLogin.call(window);
        showMessage('app-msg','تم الدخول محليًا فقط؛ جلسة السحابة لم تعمل، لذلك بيانات السحابة قد لا تظهر. تحقق من الاتصال وحاول تسجيل الدخول مجددًا.','error');
        return;
      }
      showMessage('login-msg',e.message||'بيانات الدخول غير صحيحة','error');
    }
  };
  window.studentLogin=async function(){
    const code=(document.getElementById('studentLoginCode')?.value||'').trim().toUpperCase();
    if(!code)return showMessage('student-login-msg','اكتب كود تسجيل الدخول أولاً','error');
    try{const r=await auth('student_login',{code});window.currentStudent=r.user;return window.studentLoginLegacy();}
    catch(e){showMessage('student-login-msg',e.message||'الكود غير صحيح','error');}
  };
})();
