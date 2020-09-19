
const cacheName = "app-shell-v1";
const assetsToCache = [
  "offline.html"
];

async function cacheStaticAssets() {
  const cache = await caches.open(cacheName);
  return cache.addAll(assetsToCache);
}

async function getChache(nameCache, file) {
  const cache = await caches.open(nameCache);
  return cache.match(file);
}

self.addEventListener("install", event => {
  console.log("[Service Worker] Installing service worker...", event);
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener("actvate", event => {
  console.log("[Service Worker] Activating service Worker...", event);
  return self.clients.claim();
});

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return getChache(cacheName, "offline.html");
  }
}

self.addEventListener("fetch", event => {
  console.log("[Service Worker] Fetch event: ", event.request.url);
  event.respondWith(networkFirst(event.request));
});
