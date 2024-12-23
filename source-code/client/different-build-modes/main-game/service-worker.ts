const CACHE_NAME = "game-assets-v1"
const ASSETS_TO_CACHE = ["../../images/login-bg.jpg"]
// @ts-nocheck
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets")
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request)
    })
  )
})

self.addEventListener("activate", (event) => {
  const allowedCaches = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!allowedCaches.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    )
  )
})
