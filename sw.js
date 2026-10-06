const CACHE_NAME = 'rinde-dos-v7'; // Cambia este número para forzar actualización en los celulares

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.json'
    ]))
  );
  // Fuerza a que el service worker se instale inmediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Limpia los cachés viejos (ej: si pasas de v6 a v7, borra el v6)
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

// Escucha el mensaje desde la app para forzar la actualización
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
