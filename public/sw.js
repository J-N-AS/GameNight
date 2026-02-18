const CACHE_NAME = 'gamenight-cache-v1';

// All game data files
const gameDataUrls = [
  '/data/after-dark.json',
  '/data/afterparty.json',
  '/data/dating-fails.json',
  '/data/fyllevalg.json',
  '/data/girl-power.json',
  '/data/girls-vs-boys.json',
  '/data/gutta.json',
  '/data/hemmelig-bonus.json',
  '/data/hemmeligheter.json',
  '/data/jeg-har-aldri.json',
  '/data/kaosrunden.json',
  '/data/kjapp-party-runde.json',
  '/data/party-klassikere.json',
  '/data/pekefest.json',
  '/data/pest-eller-kolera.json',
  '/data/rolig-sosial.json',
  '/data/sannhet-eller-shot.json',
  '/data/sexy-action.json',
  '/data/sexy-dares.json',
  '/data/sexy-vibes.json',
  '/data/singles-body.json',
  '/data/singles-night.json',
  '/data/spinn-flasken.json',
  '/data/spinn-flasken-action.json',
  '/data/spinn-flasken-sannhet.json',
  '/data/snusboksen.json',
  '/data/snusboksen-utfordring.json',
  '/data/snusboksen-sannhet.json',
  '/data/vorspiel-mix.json',
  '/data/drikkeleker.json',
  '/data/musikkleker.json',
];

// All static assets (core shell, images, etc.)
const staticAssets = [
  '/',
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

// Combine all URLs to cache
const urlsToCache = [...staticAssets, ...gameDataUrls];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache during install:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                if (!event.request.url.includes('_next/static/development')) {
                   cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});
