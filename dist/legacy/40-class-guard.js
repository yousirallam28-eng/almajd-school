(function(){
  var CANONICAL_CLASSES=["تمهيدي","الوافدين","أولى - أولاد","أولى - بنات","ثانية - أولاد","ثانية - بنات","ثالثة - أولاد","ثالثة - بنات","رابعة - أولاد","رابعة - بنات","خامسة - أولاد","خامسة - بنات","أولى شرعي"];
  function guard(){
    try{
      if(!Array.isArray(window.ALL_CLASSES)||!window.ALL_CLASSES.length) window.ALL_CLASSES=CANONICAL_CLASSES.slice();
      if(!Array.isArray(window.GENERAL_CLASSES)||!window.GENERAL_CLASSES.length) window.GENERAL_CLASSES=window.ALL_CLASSES;
      if(typeof window.renderClassCards==='function') window.renderClassCards();
    }catch(e){console.warn('class guard:',e);}
    try{
      if(typeof window.installUI==='function') window.installUI();
    }catch(e){console.warn('quick UI guard:',e);}
    try{
      if(typeof window.patchClassCards==='function') window.patchClassCards();
    }catch(e){console.warn('quick class button guard:',e);}
  }
  function start(){
    guard();
    [500,1500,3000,6000].forEach(function(ms){setTimeout(guard,ms);});
    try{
      var mo=new MutationObserver(function(){
        if(!document.getElementById('quick-registration-tab-btn') || !document.getElementById('quick-registration-tab')) guard();
      });
      mo.observe(document.body,{childList:true,subtree:true});
    }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
  window.addEventListener('pageshow',function(){setTimeout(guard,500);});
})();
