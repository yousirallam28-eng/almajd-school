/* ===== ./js/compat/class-render-compatibility.js ===== */

(function(){
  function ensure(){try{if(window.ALL_CLASSES&&window.ALL_CLASSES.length){window.GENERAL_CLASSES=window.ALL_CLASSES.filter(function(c){return String(c).trim()!=='الوافدين';});} if(typeof window.renderClassCards==='function') window.renderClassCards(); if(typeof window.ensureAllClassSelects_==='function') window.ensureAllClassSelects_();}catch(e){console.warn('class restore guard',e);}}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(ensure,300);setTimeout(ensure,1500);}); else {setTimeout(ensure,300);setTimeout(ensure,1500);}
})();
