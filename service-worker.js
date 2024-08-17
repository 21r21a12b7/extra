self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // You can add caching logic here if needed
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    event.respondWith(fetch(event.request));
});
