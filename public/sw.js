const VERSION = 'network-only-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Deliberately network-only: no Cache Storage, offline fallback, or precaching.
self.addEventListener('fetch', (event) => {
  const request =
    event.request.method === 'GET'
      ? new Request(event.request, { cache: 'no-store' })
      : event.request;

  event.respondWith(fetch(request));
});

void VERSION;
