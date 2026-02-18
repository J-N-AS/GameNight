const CACHE_NAME = 'gamenight-cache-v1.6'; // Incremented version to force update
const urlsToCache = [
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

// List of all data files to pre-cache for offline use
const dataUrlsToCache = [
  // Games
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
  // Articles & Music
  '/data/drikkeleker.json',
  '/data/musikkleker.json',
];

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Cache basic app shell and images
        const appShellPromise = cache.addAll(urlsToCache);
        // Cache all game/article data
        const dataPromise = cache.addAll(dataUrlsToCache);
        return Promise.all([appShellPromise, dataPromise]);
      })
      .then(() => {
        console.log('All resources have been cached for offline use.');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('Cache-all failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        console.log('Claiming clients.');
        return self.clients.claim(); // Take control of all open clients
    })
  );
});

self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
