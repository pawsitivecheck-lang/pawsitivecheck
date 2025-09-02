// Service worker disabled - causing cache issues
console.log('Service worker disabled to fix caching issues');

// Immediately unregister any existing service workers
self.addEventListener('install', (event) => {
  console.log('SW: Skipping waiting');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Claiming clients and clearing caches');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clear all caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('SW: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    ])
  );
});

// Don't cache anything - pass through all requests
self.addEventListener('fetch', (event) => {
  // Just pass through - no caching
  return;
});