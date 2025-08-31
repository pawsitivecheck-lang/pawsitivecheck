import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW: Service Worker registered successfully');

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New service worker is available, prompt user to refresh
                    console.log('SW: New version available, updating...');
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW: Service Worker registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          // Automatically reload the page when cache is updated
          console.log('SW: Cache updated, reloading page...');
          window.location.reload();
        }
      });

      // Handle controller change (new service worker takes control)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('SW: Controller changed, reloading page...');
        window.location.reload();
      });
    }
  }, []);
};