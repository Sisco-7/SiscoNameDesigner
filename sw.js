// Cache name
const CACHE_NAME = 'sisco-name-designer-v1';

// Files to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/fontawesome/css/all.min.css',
    '/fontawesome/webfonts/fa-brands-400.ttf',
    '/fontawesome/webfonts/fa-brands-400.woff2',
    '/fontawesome/webfonts/fa-regular-400.ttf',
    '/fontawesome/webfonts/fa-regular-400.woff2',
    '/fontawesome/webfonts/fa-solid-900.ttf',
    '/fontawesome/webfonts/fa-solid-900.woff2',
    '/fontawesome/webfonts/fa-v4-shims.ttf',
    '/fontawesome/webfonts/fa-v4-shims.woff2',
    '/screenshots/screenshot-wide.png',
    '/screenshots/screenshot-narrow.png'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event to serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached response if available
            if (response) {
                return response;
            }
            // Otherwise, fetch from the network
            return fetch(event.request).then((networkResponse) => {
                // Cache the new response for future use
                if (event.request.method === 'GET') {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Fallback if both cache and network fail
                return caches.match('/index.html');
            });
        })
    );
});