/* تسجيل عامل الخدمة اختياريًا عند تشغيل الموقع عبر HTTPS، دون التأثير على فتح الملف محليًا. */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js?v=3', {scope: './'}).catch(function (error) {
      console.warn('Service Worker registration skipped:', error);
    });
  });
}
