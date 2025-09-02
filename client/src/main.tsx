import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// DISABLE service worker completely
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service worker forcibly unregistered');
    }
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