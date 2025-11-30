self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("corriferrara-cache-v2").then(cache => {
      return cache.addAll([
        "./",
        "./index.html"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== "corriferrara-cache-v2")
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
