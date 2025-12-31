self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("my-growth-cache").then(cache =>
      cache.addAll([
        "/my-growth-app/",
        "/my-growth-app/index.html",
        "/my-growth-app/style.css"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
