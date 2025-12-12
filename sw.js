const CACHE_VERSION = 'v6'; // <-- aumenta a v2, v3, v4... ad ogni aggiornamento
const CACHE_NAME = `corriferrara-${CACHE_VERSION}`;

// Metti qui le pagine/risorse che devono SEMPRE funzionare
const CORE_ASSETS = [
  '/',                 // home
  '/index.html',
  '/biblioteca.html',
  '/manifest.json',
  '/service-worker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Strategia: Network-first + fallback cache + fallback index
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(resp => resp || caches.match('/index.html'))
      )
  );
});
