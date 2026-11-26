const CACHE_NAME = 'almajd-app-v2026112601';

self.addEventListener('install', function(){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(function(names){ return Promise.all(names.filter(function(name){ return name.indexOf('almajd-app-') === 0 && name !== CACHE_NAME; }).map(function(name){ return caches.delete(name); })); })
  ]));
});

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if(requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(function(response){
        if(response && response.ok){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(event.request, copy);
          });
        }
        return response;
      })
      .catch(function(){
        return caches.match(event.request);
      })
  );
});
