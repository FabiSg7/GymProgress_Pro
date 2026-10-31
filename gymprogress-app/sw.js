const CACHE_NAME = 'gym-tracker-v1.11.0';

// Asset locali: OBBLIGATORI per il funzionamento offline (cache atomica).
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './tailwind.css'
];

// Icone del manifest (v1.11.0): best-effort come i CDN. All'app non servono per funzionare, e
// sono binari che si rigenerano a parte (tools/make_icons.html): se mancassero sul server,
// in LOCAL_ASSETS farebbero fallire l'intera installazione e quindi la cache offline.
const OPTIONAL_ASSETS = [
  './icon-192.png',
  './icon-maskable-512.png'
];

// Asset da CDN: best-effort. Se un CDN non risponde, NON deve far fallire tutta la cache.
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Installazione: gli asset locali sono obbligatori; icone e CDN vengono aggiunti singolarmente
// con catch, così una risorsa irraggiungibile non pregiudica l'intera installazione (#5a).
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const local = cache.addAll(LOCAL_ASSETS);
      const cdn = Promise.all(
        [...OPTIONAL_ASSETS, ...CDN_ASSETS].map((url) => cache.add(url).catch((err) => {
          console.warn('SW: risorsa non memorizzata in cache (verrà ritentata in runtime):', url, err);
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

// Tap sulla notifica di fine recupero: porta in primo piano una scheda dell'app già aperta
// (o ne apre una nuova) invece di lasciare l'utente sulla schermata di sistema.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
