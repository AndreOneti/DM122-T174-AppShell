const cacheName = "app-shell-v1";
const assetsToCache = [
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'assets/images/pwa-logo.png',
  'assets/js/material.min.js',
  'assets/css/style.css',
  'assets/js/app.js',
  'favicon.ico',
  'index.html',
  '/'
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
