const CACHE_NAME = 'gamenight-cache-v1';

// These are the core files for the app shell.
// This list should be updated if core assets change.
const CORE_ASSETS = [
  '/',
  '/alle-spill',
  '/drikkeleker',
  '/musikkleker',
  '/info/om-oss',
  '/info/personvern',
  '/info/kontakt-oss',
  '/manifest.json',
  '/GameNight-logo-small.webp',
  '/drikkeleker/kyraxys-swords-8652518_1920.png',
  '/drikkeleker/yosoylxcamara-ng-Z8SOXEPQYjQ-unsplash.jpg',
  '/drikkeleker/axville-ox7SACCsnRA-unsplash.jpg',
  '/drikkeleker/david-schultz-uP0XEms7Ias-unsplash.jpg',
  '/drikkeleker/michal-parzuchowski-bRqsXcEcKFw-unsplash.jpg',
  '/drikkeleker/fotorech-bus-2663034_1280.jpg',
  '/drikkeleker/decster1-hd-wallpaper-8095421_1280.png',
  '/drikkeleker/javardh--_5TphPhx5c-unsplash.jpg',
  '/drikkeleker/benovator-ai-generated-9602834_1280.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Add all core assets to the cache.
        return cache.addAll(CORE_ASSETS);
      })
      .catch(err => {
        console.error('Failed to cache core assets:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // For navigation requests (HTML pages), use a network-first strategy.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If the network is successful, cache the new response.
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If the network fails, serve the page from the cache.
          // Fallback to '/' if the specific page isn't cached.
          return caches.match(request).then(res => res || caches.match('/'));
        })
    );
    return;
  }

  // For other requests (CSS, JS, images, fonts), use a cache-first strategy.
  event.respondWith(
    caches.match(request)
      .then(response => {
        // If we have a cached response, return it.
        if (response) {
          return response;
        }
        // Otherwise, fetch from the network, cache it, and return it.
        return fetch(request).then(
          networkResponse => {
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
