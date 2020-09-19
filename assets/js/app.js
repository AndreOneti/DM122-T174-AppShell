'use strict'

if ('serviceWorker' in navigator) {
  const success = () => console.log("[Service Worker] Registered");
  const failure = () => console.log("[Service Worker] Failed");

  navigator.serviceWorker
    .register("sw.js")
    .then(success)
    .catch(failure);
}
