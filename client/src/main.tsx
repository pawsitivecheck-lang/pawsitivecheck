import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register secure service worker with proper error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Secure SW registered: ', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('SW registration failed: ', error);
        // Don't fail silently - but don't break the app either
      });

    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('SW message:', event.data);
      
      // Handle offline status updates
      if (event.data.type === 'OFFLINE_STATUS') {
        // Could update UI to show offline indicator
      }
    });
  });
}

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);