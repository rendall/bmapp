var CACHE_NAME = 'bm-mapp-app';
var urlsToCache = [
    '/',
    '/static/js/main.7f4a0538.js',
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
// self.addEventListener('fetch', function (event:any) { //FetchEvent
//     console.log("service worker fetch event", event);
//     event.respondWith(
//         caches.match(event.request)
//             .then(function (response) {
//                 console.log("cache match", response);
//                 if (response) {
//                     return response;
//                 }
//                 // IMPORTANT: Clone the request. A request is a stream and
//                 // can only be consumed once. Since we are consuming this
//                 // once by cache and once by the browser for fetch, we need
//                 // to clone the response.
//                 var fetchRequest = event.request.clone();
//                 return fetch(fetchRequest).then(
//                     function (response) {
//                         const isValid = (response && response.status === 200 && response.type === 'basic');
//                         console.log("response is valid?", isValid, response);
//                         if (!isValid) {
//                             return response;
//                         }
//                         // IMPORTANT: Clone the response. A response is a stream
//                         // and because we want the browser to consume the response
//                         // as well as the cache consuming the response, we need
//                         // to clone it so we have two streams.
//                         var responseToCache = response.clone();
//                         caches.open(CACHE_NAME)
//                             .then(function (cache) {
//                                 console.log("putting in cache", event.request);
//                                 cache.put(event.request, responseToCache);
//                             });
//                         return response;
//                     }
//                 );
//             })
//     );
// });
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
//# sourceMappingURL=service-worker.js.map