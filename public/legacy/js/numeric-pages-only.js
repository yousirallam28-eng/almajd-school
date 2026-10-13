/* Restrict every page-count field, including dynamically created variants, to digits. */
(function(){
  'use strict';
  function isPageCountField_(field){return !!field&&field.tagName==='INPUT'&&/PagesCount$/i.test(String(field.id||''));}
  function normalizePageCountField_(field){
    if(!isPageCountField_(field))return;
    field.setAttribute('inputmode','numeric');
    field.setAttribute('pattern','[0-9]*');
    field.setAttribute('autocomplete','off');
    var value=String(field.value||'');
    value=value.replace(/[٠-٩]/g,function(d){return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));});
    value=value.replace(/[۰-۹]/g,function(d){return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d));});
    var digits=value.replace(/[^0-9]/g,'');
    if(field.value!==digits)field.value=digits;
  }
  function preparePageCountFields_(root){
    if(!root||!root.querySelectorAll)return;
    root.querySelectorAll('input[id$="PagesCount"]').forEach(normalizePageCountField_);
  }
  preparePageCountFields_(document);
  document.addEventListener('input',function(event){normalizePageCountField_(event.target);});
  document.addEventListener('change',function(event){normalizePageCountField_(event.target);});
  if(typeof MutationObserver==='function'&&document.body){
    new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1){if(isPageCountField_(node))normalizePageCountField_(node);preparePageCountFields_(node);}});});}).observe(document.body,{childList:true,subtree:true});
  }
})();
