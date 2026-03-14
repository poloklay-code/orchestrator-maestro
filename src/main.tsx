import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Auto-update service worker — keeps desktop & mobile in sync
const updateSW = registerSW({
  onNeedRefresh() {
    // Auto-apply updates silently for seamless sync
    updateSW(true);
  },
  onOfflineReady() {
    console.log("[PWA] App ready for offline use");
  },
  onRegisteredSW(swUrl, registration) {
    // Check for updates every 60 seconds for real-time sync
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 1000);
    }
    console.log("[PWA] Service Worker registered:", swUrl);

    // Request persistent storage for background operation
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((granted) => {
        console.log(`[PWA] Persistent storage: ${granted ? "granted" : "denied"}`);
      });
    }

    // Request notification permission for background alerts
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        console.log(`[PWA] Notification permission: ${perm}`);
      });
    }
  },
});

createRoot(document.getElementById("root")!).render(<App />);
