import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./polyfills";

// PWA Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("PWA: Service Worker registered successfully:", registration.scope);
        
        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New content available, notify user
                  console.log("PWA: New content available, please refresh!");
                } else {
                  // Content cached for first time
                  console.log("PWA: Content cached for offline use!");
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log("PWA: Service Worker registration failed:", error);
      });
  });
}

// PWA Install Prompt
let deferredPrompt: any;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Create install button or show install UI
  console.log("PWA: Install prompt available");
  
  // You can trigger the prompt manually later with:
  // deferredPrompt.prompt();
});

window.addEventListener("appinstalled", () => {
  console.log("PWA: App was installed");
  deferredPrompt = null;
});

createRoot(document.getElementById("root")!).render(<App />);
