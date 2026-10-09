/* عامل خدمة خفيف: لا يخزن بيانات الموقع أو Firebase، ويضمن قابلية التثبيت كتطبيق. */
self.addEventListener('install', function () {
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).catch(function () {
    return caches.match(event.request);
  }));
});
