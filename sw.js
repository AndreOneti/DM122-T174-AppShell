
self.addEventListener("install", event => {
  console.log("[Service Worker] Installing service worker...", event);
  self.skipWaiting();
});

self.addEventListener("actvate", event => {
  console.log("[Service Worker] Activating service Worker...", event);
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  console.log("[Service Worker] Fetch event: ", event.request.url);
});
