// Secure Service Worker - Only caches safe GET requests
const CACHE_NAME = 'pawsitive-check-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-cache-v1';

// Performance optimized static resources cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Additional critical resources to cache
const CRITICAL_RESOURCES = [
  '/assets/index.js', // Main bundle
  '/assets/index.css' // Main styles
];

// API endpoints that are safe to cache (GET only) - Performance optimized
const CACHEABLE_API_PATTERNS = [
  /^\/api\/products(\?.*)?$/, // Product listings with query params
  /^\/api\/recalls$/, // Recalls data
  /^\/api\/analytics\/dashboard$/, // Dashboard analytics
  /^\/api\/reviews(\?.*)?$/, // Reviews with pagination
  /^\/api\/information-sources$/ // Information sources
];

// Cache expiration times for different API types
const API_CACHE_TIMES = {
  products: 5 * 60 * 1000, // 5 minutes
  recalls: 15 * 60 * 1000, // 15 minutes (less frequent updates)
  analytics: 10 * 60 * 1000, // 10 minutes
  reviews: 5 * 60 * 1000, // 5 minutes
  default: 3 * 60 * 1000 // 3 minutes default
};

console.log('Secure service worker loaded');

self.addEventListener('install', (event) => {
  console.log('SW: Installing secure service worker');
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_RESOURCES);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activating secure service worker');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE
            )
            .map(cacheName => {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // SECURITY: Never cache POST, PUT, DELETE, PATCH requests
  if (request.method !== 'GET') {
    console.log('SW: Bypassing non-GET request:', request.method, url.pathname);
    return; // Let the request go through normally, don't cache
  }

  // Handle different types of GET requests
  if (url.origin === location.origin) {
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request));
    } else {
      event.respondWith(handleStaticRequest(request));
    }
  }
});

async function handleStaticRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try cache first for static resources
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('SW: Serving from cache:', url.pathname);
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful GET responses for static resources
    if (networkResponse.ok) {
      console.log('SW: Caching static resource:', url.pathname);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed for static resource:', url.pathname);
    
    // Try to serve index.html for navigation requests when offline
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      const indexResponse = await cache.match('/index.html');
      if (indexResponse) {
        return indexResponse;
      }
    }
    
    throw error;
  }
}

async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API endpoint should be cached
  const shouldCache = CACHEABLE_API_PATTERNS.some(pattern => 
    pattern.test(url.pathname)
  );
  
  if (!shouldCache) {
    console.log('SW: API request not cacheable, bypassing:', url.pathname);
    return fetch(request);
  }
  
  try {
    // Network first strategy for API requests
    console.log('SW: Fetching API from network:', url.pathname);
    const networkResponse = await fetch(request);
    
    // Only cache successful GET responses
    if (networkResponse.ok && request.method === 'GET') {
      console.log('SW: Caching API response:', url.pathname);
      const cache = await caches.open(API_CACHE);
      const responseClone = networkResponse.clone();
      
      // Set expiry header for API cache (30 minutes)
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed for API, trying cache:', url.pathname);
    
    // Try to serve from cache when network fails
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is not too old (30 minutes)
      const cachedAt = cachedResponse.headers.get('sw-cached-at');
      const isStale = cachedAt && (Date.now() - parseInt(cachedAt)) > 30 * 60 * 1000;
      
      if (!isStale) {
        console.log('SW: Serving stale API from cache:', url.pathname);
        return cachedResponse;
      } else {
        console.log('SW: Cached API response is stale:', url.pathname);
      }
    }
    
    // Return a user-friendly offline message for failed API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This content is not available offline. Please check your connection.' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle background sync for failed POST requests (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('SW: Background sync triggered');
    // Could implement retry logic for failed POST requests here
  }
});

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('SW: Push message received');
  // Could implement push notifications here
});