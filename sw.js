self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  // index.html не версионируется query-параметром (в отличие от style.css/
  // app.js/data.js), поэтому именно его чаще всего кэширует браузер —
  // навигационные запросы принудительно идут в сеть, минуя HTTP-кэш.
  if (event.request.mode === 'navigate') {
    // Строка URL, а не сам event.request — Fetch-спека запрещает передавать
    // init вместе с Request, чей mode == "navigate" (в некоторых браузерах
    // это бросает TypeError и ломает навигацию чёрным экраном). На всякий
    // случай ловим любую другую ошибку и откатываемся к обычному fetch,
    // чтобы обработчик никогда не мог сорвать открытие страницы.
    event.respondWith(
      fetch(event.request.url, { cache: 'no-store' }).catch(() => fetch(event.request))
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
