// PawsitiveCheck Service Worker
const CACHE_VERSION = Date.now(); // Use timestamp for automatic cache invalidation
const STATIC_CACHE = `pawsitivecheck-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `pawsitivecheck-dynamic-${CACHE_VERSION}`;
const API_CACHE = `pawsitivecheck-api-${CACHE_VERSION}`;

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
            // Delete ALL old caches to prevent stale content
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
              console.log('PWA: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Force immediate control of all clients
        return self.clients.claim();
      })
      .then(() => {
        // Notify all clients to reload for fresh content
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_UPDATED' });
          });
        });
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip external domains (like Google Ads, fonts, etc.) - let browser handle them
  if (!url.origin.includes(self.location.hostname) && 
      !url.hostname.includes('fonts.googleapis.com') && 
      !url.hostname.includes('fonts.gstatic.com')) {
    return; // Let browser handle external requests normally
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses with short TTL
          if (response.ok && request.method === 'GET' && API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern))) {
            const responseClone = response.clone();
            // Add cache timestamp for TTL management
            const cachedResponse = new Response(responseClone.body, {
              status: responseClone.status,
              statusText: responseClone.statusText,
              headers: {
                ...Object.fromEntries(responseClone.headers.entries()),
                'sw-cached-at': Date.now().toString(),
                'cache-control': 'max-age=300' // 5 minute TTL for API responses
              }
            });
            caches.open(API_CACHE)
              .then((cache) => {
                cache.put(request, cachedResponse);
              });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache when offline, but check TTL
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                const cachedAt = cachedResponse.headers.get('sw-cached-at');
                if (cachedAt) {
                  const age = Date.now() - parseInt(cachedAt);
                  // If cached response is older than 5 minutes, don't use it
                  if (age > 300000) {
                    return null;
                  }
                }
                return cachedResponse;
              }
              // Return offline fallback for critical API endpoints
              if (url.pathname === '/api/products') {
                return new Response(JSON.stringify([]), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              // Silently fail for non-critical API requests
              return new Response('{"error": "Service unavailable"}', {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
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

            // Cache new resources with versioning (only same-origin)
            if (url.origin === self.location.origin && !url.pathname.startsWith('/api/')) {
              const responseClone = response.clone();
              // Don't cache if response indicates no-cache
              const cacheControl = response.headers.get('cache-control');
              if (!cacheControl || !cacheControl.includes('no-cache')) {
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  })
                  .catch(() => {}); // Silently fail cache operations
              }
            }

            return response;
          })
          .catch(() => {
            // Return offline fallback page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // Silently fail for other resources
            return new Response('', { status: 503 });
          });
      })
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('PWA: Background sync triggered:', event.tag);

  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncPendingReviews());
  } else if (event.tag === 'sync-scans') {
    event.waitUntil(syncPendingScans());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New notification from PawsitiveCheck',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'PawsitiveCheck', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});

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