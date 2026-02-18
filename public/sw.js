// Updated Service Worker

const CACHE_NAME = 'gamenight-v1.6'; // Increment version to trigger update
const DYNAMIC_CACHE_NAME = 'gamenight-dynamic-v1.6';

// URLs to cache on install
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
  // --- Core app shell files will be added by the build process ---
  // Note: We won't hardcode every single file here. We cache core pages.
  // The fetch handler will cache other assets dynamically.

  // --- ALL game and article JSON data ---
  // This ensures all game content is available offline immediately.
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
  '/data/spinn-flasken-ekte.json',
  '/data/spinn-flasken-sannhet.json',
  '/data/spinn-flasken-virtuell.json',
  '/data/utfordringer.json',
  '/data/vorspiel-mix.json',
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching app shell and data');
      return cache.addAll(urlsToCache);
    }).catch(err => console.error("Cache addAll failed:", err))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Serve Next.js internal requests directly from network
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Use different caching strategies for different file types
  if (url.pathname.endsWith('.json')) {
    // For JSON data: Stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else if (/\.(png|jpg|jpeg|svg|webp|gif)$/.test(url.pathname)) {
    // For images and logos: Cache first, fallback to network
    event.respondWith(cacheFirst(request));
  } else {
    // For pages and other requests: Cache first, fallback to network
    event.respondWith(cacheFirst(request));
  }
});


// --- Caching Strategies ---

// Cache First: Great for static assets like the app shell, pages, and images.
// Responds from cache immediately if available, otherwise fetches from network and caches the response.
const cacheFirst = async (request) => {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // console.log(`SW: Serving from cache: ${request.url}`);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    // console.log(`SW: Fetching from network and caching: ${request.url}`);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;

  } catch (error) {
    console.error(`SW: Failed to fetch ${request.url}`, error);
    // Optional: Return a fallback page if network fails
    // const cache = await caches.open(CACHE_NAME);
    // return await cache.match('/offline.html');
  }
};

// Stale-While-Revalidate: Good for data that changes, like our JSON files.
// It serves from cache for speed, but also fetches a fresh version in the background for the next visit.
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const networkFetch = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });

  // Return cached response immediately if available, otherwise wait for the network
  return cachedResponse || networkFetch;
};
