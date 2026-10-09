(function(){
  function bindResultButtons(){
    var map={
      'btn-upload-student-results':function(){var e=document.getElementById('studentsResultsExcelFile');if(e){e.value='';e.click();}},
      'btn-generate-student-results':function(){if(typeof generateStudentResultCodes==='function') return generateStudentResultCodes(false); throw new Error('دالة توليد أكواد الطلاب غير موجودة');},
      'btn-upload-prep-results':function(){var e=document.getElementById('preparatoryResultsExcelFile');if(e){e.value='';e.click();}},
      'btn-generate-prep-results':function(){if(typeof generateStudentResultCodes==='function') return generateStudentResultCodes(true); throw new Error('دالة توليد أكواد التمهيدي غير موجودة');},
      'btn-delete-all-results':function(){if(typeof deleteAllResults==='function') return deleteAllResults(); if(typeof window.deleteAllResults==='function') return window.deleteAllResults(); throw new Error('دالة حذف النتائج غير موجودة');}
    };
    Object.keys(map).forEach(function(id){
      var b=document.getElementById(id); if(!b || b.__v35bound) return;
      b.__v35bound=true;
      b.addEventListener('click',function(ev){
        ev.preventDefault(); ev.stopPropagation();
        try{ var r=map[id](); if(r && typeof r.catch==='function') r.catch(function(err){console.error(err); if(typeof showMessage==='function') showMessage('results-admin-msg','حدث خطأ: '+(err.message||err),'error');}); }
        catch(err){console.error(err); if(typeof showMessage==='function') showMessage('results-admin-msg','حدث خطأ: '+(err.message||err),'error');}
      },true);
      b.addEventListener('touchend',function(ev){ev.preventDefault(); b.click();},{passive:false});
    });
  }
  function forceButtons(){
    bindResultButtons();
    ['btn-upload-student-results','btn-generate-student-results','btn-upload-prep-results','btn-generate-prep-results','btn-delete-all-results'].forEach(function(id){
      var b=document.getElementById(id); if(b){b.style.pointerEvents='auto';b.style.cursor='pointer';}
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',forceButtons); else forceButtons();
  setTimeout(forceButtons,500);
})();
