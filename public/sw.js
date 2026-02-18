// This is a basic service worker that caches assets for offline use.

const CACHE_NAME = 'gamenight-cache-v1.4'; // increment to force update

const PRECACHE_ASSETS = [
  // Core App Shell
  '/',
  '/alle-spill',
  '/drikkeleker',
  '/musikkleker',
  '/info/om-oss',
  '/info/personvern',
  '/info/kontakt-oss',
  '/manifest.json',
  '/GameNight-logo-small.webp',

  // All JSON data files for games and articles
  '/data/after-dark.json',
  '/data/afterparty.json',
  '/data/dating-fails.json',
  '/data/drikkeleker.json',
  '/data/fyllevalg.json',
  '/data/girl-power.json',
  '/data/girls-vs-boys.json',
  '/data/gutta.json',
  '/data/hemmelig-bonus.json',
  '/data/hemmeligheter.json',
  '/data/jeg-har-aldri.json',
  '/data/kaosrunden.json',
  '/data/kjapp-party-runde.json',
  '/data/musikkleker.json',
  '/data/party-klassikere.json',
  '/data/pekefest.json',
  '/data/pest-eller-kolera.json',
  '/data/rolig-sosial.json',
  '/data/rt-2025-dummy.json',
  '/data/sannhet-eller-shot.json',
  '/data/sexy-action.json',
  '/data/sexy-dares.json',
  '/data/sexy-vibes.json',
  '/data/singles-body.json',
  '/data/singles-night.json',
  '/data/snusboksen.json',
  '/data/snusboksen-sannhet.json',
  '/data/snusboksen-utfordring.json',
  '/data/spinn-flasken.json',
  '/data/spinn-flasken-action.json',
  '/data/spinn-flasken-sannhet.json',
  '/data/vorspiel-mix.json',
  
  // All images
  '/drikkeleker/axville-ox7SACCsnRA-unsplash.jpg',
  '/drikkeleker/benovator-ai-generated-9602834_1280.png',
  '/drikkeleker/david-schultz-uP0XEms7Ias-unsplash.jpg',
  '/drikkeleker/decster1-hd-wallpaper-8095421_1280.png',
  '/drikkeleker/fotorech-bus-2663034_1280.jpg',
  '/drikkeleker/javardh--_5TphPhx5c-unsplash.jpg',
  '/drikkeleker/kyraxys-swords-8652518_1920.png',
  '/drikkeleker/michal-parzuchowski-bRqsXcEcKFw-unsplash.jpg',
  '/drikkeleker/yosoylxcamara-ng-Z8SOXEPQYjQ-unsplash.jpg',
  
  // All logos
  '/logos/rt-2025-dummy-logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache. Caching files...');
        return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, {cache: 'reload'})));
      })
      .then(() => {
        console.log('All assets were successfully cached.');
      })
      .catch(error => {
        console.error('Failed to cache assets:', error);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('gamenight-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For Next.js data requests, use a network-first strategy
  if (url.pathname.startsWith('/_next/data/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, cacheCopy);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If we found a match in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from the network
        return fetch(event.request).then(response => {
          // If the response is valid, clone it and store it in the cache
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
