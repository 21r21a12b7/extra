// Define the cache name
const CACHE_NAME = 'pwa-cache-v1';

// Specify files to cache
const CACHE_FILES = [
    '/',
    '/index.html',
    '/pwaInstallation/install.html',
    '/pwaInstallation/help.html',
    '/manifest.json',
    '/icons/icon.png',
    '/service-worker.js'
];

// Install event: Cache files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');

    // Pre-cache the specified files
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(CACHE_FILES);
            })
            .catch((error) => {
                console.error('Failed to cache during install:', error);
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );

    return self.clients.claim();
});

// Fetch event: Serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached file or fetch from network
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Cache the fetched response if it's not already cached
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // Fallback if both cache and network fail
            if (event.request.destination === 'document') {
                return caches.match('/pwaInstallation/help.html');
            }
        })
    );
});

// Optional: Skip waiting phase (auto-activate new service worker)
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
