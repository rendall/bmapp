var CACHE_NAME = 'bm-mapp-app';
var urlsToCache = [
    '/',
    '/static/js/main.092e6c7e.js',
    '/js/search-engine-worker.js',
    '/css/style.css',
    '/favicon.ico',
    '/js/fuse.min.js',
    '/js/Rx.min.js',
    '/js/SearchEngine.js',
    '/service-worker.js'
];
self.addEventListener('install', function (event) {
    console.log("service worker install event", event);
    // Perform install steps
    event.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (resp) {
        return resp || fetch(event.request).then(function (response) {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, response.clone());
            });
            return response;
        });
    }).catch(function () {
        return caches.match('/');
    }));
});
self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
        }));
    }));
});
console.info("'BMApp service-worker installed'");