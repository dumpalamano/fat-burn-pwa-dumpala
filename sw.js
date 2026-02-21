// v4 — force clears all previous caches
const CACHE = 'fatburn-v4';
const BASE = '/fat-burn-pwa-dumpala/';
const ASSETS = [BASE, BASE+'index.html', BASE+'manifest.json'];

self.addEventListener('install', e => {
  // Skip waiting immediately — don't let old SW stay active
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Delete ALL old caches unconditionally
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        console.log('[SW] Deleting cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first strategy — always try network, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Update cache with fresh response
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
