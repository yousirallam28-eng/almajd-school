/* ===== ./js/features/install-app-prompt.js ===== */

/* تثبيت الموقع كتطبيق من Chrome وواجهة الهاتف */
(function installFromChrome(){
  var deferredInstallPrompt = null;

  function isInstalledApp(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function setButtonVisibility(installed){
    document.querySelectorAll('.install-app-btn').forEach(function(btn){
      btn.hidden = installed;
      btn.setAttribute('aria-hidden', String(installed));
      if(installed){
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        return;
      }
      btn.textContent = '📲 تثبيت التطبيق';
      btn.disabled = false;
      btn.removeAttribute('aria-disabled');
    });
  }

  function updateInstallButton(){
    setButtonVisibility(isInstalledApp());
  }

  window.addEventListener('beforeinstallprompt', function(event){
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallButton();
  });

  window.addEventListener('appinstalled', function(){
    deferredInstallPrompt = null;
    setButtonVisibility(true);
    if(typeof showSiteModal === 'function'){
      showSiteModal(
        '✅ تم تثبيت الموقع',
        'تم تثبيت معهد المجد كتطبيق على جهازك. يمكنك فتحه الآن من شاشة التطبيقات.',
        '<button type="button" class="action-btn modal-success" onclick="closeSiteModal()">حسنًا</button>'
      );
    }
  });

  window.installSiteApp = async function(){
    if(isInstalledApp()){
      setButtonVisibility(true);
      return;
    }

    if(deferredInstallPrompt){
      var promptEvent = deferredInstallPrompt;
      deferredInstallPrompt = null;
      try{
        await promptEvent.prompt();
        var choice = await promptEvent.userChoice;
        if(choice && choice.outcome === 'accepted'){
          // يخفي الزر فور قبول التثبيت، ويؤكده حدث appinstalled عند اكتماله.
          setButtonVisibility(true);
        }else{
          updateInstallButton();
        }
      }catch(error){
        console.warn('Install prompt was dismissed:', error);
        updateInstallButton();
      }
      return;
    }

    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var instructions = isIOS
      ? 'من Safari اضغط زر المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية».'
      : 'في Chrome اضغط ⋮ من أعلى الشاشة ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا لم يظهر الخيار، افتح الموقع عبر HTTPS ثم حدّث الصفحة مرة أخرى.';
    if(typeof showSiteModal === 'function'){
      showSiteModal(
        'تثبيت معهد المجد',
        '<div style="line-height:2;text-align:right;"><strong>طريقة التثبيت:</strong><br>' + instructions + '</div>',
        '<button type="button" class="action-btn modal-success" onclick="closeSiteModal()">حسنًا</button>'
      );
    }
  };

  function registerServiceWorker(){
    if(!('serviceWorker' in navigator)) return;
    if(location.protocol !== 'http:' && location.protocol !== 'https:') return;
    navigator.serviceWorker.register('sw.js', {scope: './'}).catch(function(error){
      console.warn('Service worker registration failed:', error);
    });
  }

  window.addEventListener('DOMContentLoaded', function(){
    updateInstallButton();
    registerServiceWorker();
  });
  window.addEventListener('pageshow', updateInstallButton);
})();
