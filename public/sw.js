// Sube esta versión en cada release para forzar actualización
const VERSION = 'v4';
const STATIC_CACHE = `static-${VERSION}`;
const PAGE_CACHE   = `pages-${VERSION}`;

// Archivos estáticos que quieres precachear
const STATIC_ASSETS = [
  '/',                 // home
  '/offline',          // fallback offline (lo creamos abajo)
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(c => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => ![STATIC_CACHE, PAGE_CACHE].includes(k)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estrategias
const cacheFirst = async (req) => {
  const hit = await caches.match(req);
  return hit || fetch(req);
};

const staleWhileRevalidate = async (req, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then(res => { cache.put(req, res.clone()); return res; })
    .catch(() => cached); // en error, devuelve lo que haya
  return cached || network;
};

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Trabaja solo con tu mismo dominio
  if (url.origin !== location.origin) return;

  // Navegaciones (HTML): SWR + fallback offline
  if (request.mode === 'navigate') {
    e.respondWith(
      staleWhileRevalidate(request, PAGE_CACHE)
        .catch(() => caches.match('/offline'))
    );
    return;
  }

  // Estáticos comunes: cache-first
  if (/\.(?:png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/.test(url.pathname)) {
    e.respondWith(cacheFirst(request));
    return;
  }

  // Por defecto: intenta red y, si falla, busca en caché
  e.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});