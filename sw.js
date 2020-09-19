const cacheName = "app-shell-v2";
const assetsToCache = [
  "offline.html",
  "assets/images/pwa-logo.png"
];

function removeOldCache(key) {
  if (key !== cacheName) {
    console.log(`[Service Worker] Removing old cache: ${key}`);
    return caches.delete(key);
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys();
  return Promise.all(keyList.map(removeOldCache));
}

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
  event.waitUntil(cacheCleanup());
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
