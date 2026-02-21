// sw.js v5 — network-first, kills all old caches
const CACHE = 'fatburn-v5';
const BASE = '/fat-burn-pwa-dumpala/';
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json'
];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
