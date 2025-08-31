import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW: Service Worker registered successfully'))
      .catch(() => console.log('SW: Service Worker registration failed'));
  });
}

createRoot(document.getElementById("root")!).render(<App />);