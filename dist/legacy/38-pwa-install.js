/* تثبيت الموقع كتطبيق من Chrome وواجهة الهاتف */
(function installFromChrome(){
  var deferredInstallPrompt = null;
  function isInstalledApp(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function updateInstallButton(){
    document.querySelectorAll('.install-app-btn').forEach(function(btn){
      if(isInstalledApp()){
        btn.textContent='✅ الموقع مثبت على الجهاز';
        btn.disabled=true;
        btn.setAttribute('aria-disabled','true');
      }else{
        btn.textContent=btn.id==='loginInstallAppBtn'?'📲 تثبيت الموقع على الهاتف':'📲 تثبيت الموقع كتطبيق';
        btn.disabled=false;
        btn.removeAttribute('aria-disabled');
      }
    });
  }
  window.addEventListener('beforeinstallprompt',function(event){
    event.preventDefault();
    deferredInstallPrompt=event;
    updateInstallButton();
  });
  window.addEventListener('appinstalled',function(){
    deferredInstallPrompt=null;
    updateInstallButton();
    if(typeof showSiteModal==='function') showSiteModal('✅ تم تثبيت الموقع','تم تثبيت معهد المجد كتطبيق على جهازك. يمكنك فتحه الآن من شاشة التطبيقات.','<button type="button" class="action-btn modal-success" onclick="closeSiteModal()">حسنًا</button>');
  });
  window.installSiteApp=async function(){
    if(isInstalledApp()){
      showSiteModal('الموقع مثبت بالفعل','الموقع مثبت بالفعل على هذا الجهاز ويمكن فتحه من شاشة التطبيقات.','<button type="button" class="action-btn modal-success" onclick="closeSiteModal()">حسنًا</button>');
      return;
    }
    if(deferredInstallPrompt){
      var promptEvent=deferredInstallPrompt;
      deferredInstallPrompt=null;
      try{
        await promptEvent.prompt();
        await promptEvent.userChoice;
      }catch(error){ console.warn('Install prompt was dismissed:',error); }
      updateInstallButton();
      return;
    }
    var isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
    var instructions=isIOS
      ? 'من Safari اضغط زر المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية».'
      : 'في Chrome اضغط ⋮ من أعلى الشاشة ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا لم يظهر الخيار، افتح الموقع عبر HTTPS ثم حدّث الصفحة مرة أخرى.';
    showSiteModal('تثبيت معهد المجد', '<div style="line-height:2;text-align:right;"><strong>طريقة التثبيت:</strong><br>'+instructions+'</div>', '<button type="button" class="action-btn modal-success" onclick="closeSiteModal()">حسنًا</button>');
  };
  window.addEventListener('DOMContentLoaded',updateInstallButton);
  window.addEventListener('pageshow',updateInstallButton);
})();
