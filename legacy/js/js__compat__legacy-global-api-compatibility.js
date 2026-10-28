/* ===== ./js/compat/legacy-global-api-compatibility.js ===== */

// V44 compatibility fixes: expose functions required by inline handlers and older timer calls.
window.deletelocaldataRecord = window.deletelocaldataRecord || (typeof deletelocaldataRecord === 'function' ? deletelocaldataRecord : function(){ return Promise.reject(new Error('دالة الحذف غير متاحة')); });
