self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("corriferrara-cache").then(cache => {
      return cache.addAll([
        "/corriferrara-app/",
        "/corriferrara-app/index.html"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
