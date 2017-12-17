self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(ENV_SW_CACHE_NAME).then((cache) => {
            return cache.addAll(ENV_SW_ASSETS);
        }),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            const cachesToRemove = cacheNames.filter((cacheName) => cacheName !== ENV_SW_CACHE_NAME);
            return Promise.all(
                cachesToRemove.map((cacheName) => caches.delete(cacheName)),
            );
        }),
    );
});

const htmlPaths = [
    '/',
    '/play',
    '/lobby',
    '/about',
    '/signup',
    '/login',
    '/leaders',
];

self.addEventListener('fetch', (event) => {
    let cacheQuery = event.request;

    const path = /\/\/(.+?)(\/.+?$)/.exec(event.request.url)[2];
    const isHtmlPathFetch = htmlPaths.indexOf(path) !== -1;
    if (isHtmlPathFetch) {
        cacheQuery = '/index.html';
    }

    event.respondWith(
        caches.match(cacheQuery).then((response) => {
            return response || fetch(event.request);
        }),
    );
});
