self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  // index.html не версионируется query-параметром (в отличие от style.css/
  // app.js/data.js), поэтому именно его чаще всего кэширует браузер —
  // навигационные запросы принудительно идут в сеть, минуя HTTP-кэш.
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
  } else {
    event.respondWith(fetch(event.request));
  }
});
