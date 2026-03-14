const VERSION = "orq-sw-v1";
const APP_SHELL_CACHE = `app-shell-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const APP_SHELL_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/images/orquestrador-robot.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

function isSensitiveRequest(req) {
  const url = new URL(req.url);
  return (
    url.pathname.includes("/auth") ||
    url.pathname.includes("/token") ||
    (url.hostname.includes("supabase") && url.pathname.includes("/auth"))
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (isSensitiveRequest(req)) return;

  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(APP_SHELL_CACHE);
        const offline = await cache.match("/offline");
        return offline || new Response("Offline", { status: 200, headers: { "Content-Type": "text/plain" } });
      })
    );
    return;
  }

  if (url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".svg") || url.pathname.endsWith(".woff2")) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const fetchPromise = fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await cache.match(req);
        return cached || new Response("Offline", { status: 200, headers: { "Content-Type": "text/plain" } });
      }
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
