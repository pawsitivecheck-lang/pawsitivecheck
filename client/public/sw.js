// PawsitiveCheck Service Worker
const CACHE_NAME = 'pawsitivecheck-v1.0.0';
const STATIC_CACHE = 'pawsitivecheck-static-v1';
const DYNAMIC_CACHE = 'pawsitivecheck-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/products',
  '/api/recalls',
  '/api/animal-tags'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('PWA: Caching static assets');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('PWA: Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('PWA: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok && API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern))) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache when offline
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for critical API endpoints
              if (url.pathname === '/api/products') {
                return new Response(JSON.stringify([]), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              throw new Error('Offline and no cached response available');
            });
        })
    );
    return;
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response;
            }

            // Cache new resources
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return response;
          })
          .catch(() => {
            // Return offline fallback page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            throw new Error('Offline and no cached response available');
          });
      })
  );
});

// Simplified for mobile compatibility - complex features disabled

// Helper functions
async function syncPendingReviews() {
  try {
    // Implementation for syncing pending reviews when back online
    console.log('PWA: Syncing pending reviews...');
  } catch (error) {
    console.error('PWA: Failed to sync reviews:', error);
  }
}

async function syncPendingScans() {
  try {
    // Implementation for syncing pending scans when back online
    console.log('PWA: Syncing pending scans...');
  } catch (error) {
    console.error('PWA: Failed to sync scans:', error);
  }
}