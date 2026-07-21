const CACHE_NAME = 'gym-tracker-v1.3.0';

// Asset locali: OBBLIGATORI per il funzionamento offline (cache atomica).
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Asset da CDN: best-effort. Se un CDN non risponde, NON deve far fallire tutta la cache.
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Installazione: gli asset locali sono obbligatori; i CDN vengono aggiunti singolarmente
// con catch, così un CDN irraggiungibile non pregiudica l'intera installazione (#5a).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const local = cache.addAll(LOCAL_ASSETS);
      const cdn = Promise.all(
        CDN_ASSETS.map((url) => cache.add(url).catch((err) => {
          console.warn('SW: CDN non memorizzato in cache (verrà ritentato in runtime):', url, err);
        }))
      );
      return Promise.all([local, cdn]);
    })
  );
  self.skipWaiting();
});

// Attivazione: pulizia delle vecchie cache (nome diverso da quello corrente).
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategia: Cache First con popolamento runtime della cache (#5b).
// Se la risorsa è in cache la servo; altrimenti la scarico dalla rete e ne salvo una copia
// (solo GET http/https andate a buon fine) per renderla disponibile offline la volta dopo.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(req).then((networkResponse) => {
        const url = req.url;
        const cacheable = networkResponse && networkResponse.status === 200 &&
          (url.startsWith('http://') || url.startsWith('https://'));
        if (cacheable) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      }).catch(() => cachedResponse); // offline e non in cache: lascia fallire nel modo naturale
    })
  );
});
