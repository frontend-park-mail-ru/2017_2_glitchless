const images = [
    '404.png',
    'background.png',
    'bounder.png',
    'energy_block.png',
    'energy_block_gui_cyan.png',
    'energy_block_gui_red.png',
    'energy_block_large.png',
    'game_over_splash_lost.png',
    'game_over_splash_won.png',
    'glitchless.jpg',
    'laser.png',
    'laser_large.png',
    'laser_small.png',
    'photo_2017-11-07_22-25-34.jpg',
    'platform.png',
    'rhythm_blast_v1a.png',
    'shield_cyan.png',
    'shield_gui_background.png',
    'shield_gui_status.png',
    'shield_red.png',
    'spacestation.png',
].map((it) => '/images/' + it);

const cssjs = [
    '/app.css',
    '/app.js',
];

const paths = [
    '/',
    '/play',
    '/lobby',
    '/about',
    '/signup',
    '/login',
    '/leaders',
];

const dataToCache = images.concat(cssjs).concat(paths);

const cacheName = 'v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(dataToCache);
        }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            const isInCache = !!response;
            if (!isInCache) {
                return fetch(event.request);
            }
            return _tryInvalidateCacheRedownload(event).catch(() => {
                return response;
            });
        }),
    );
});

function _tryInvalidateCacheRedownload(event) {
    return fetch(event.request).then((response) => {
        caches.open(cacheName).then((cache) => {
            if (response.bodyUsed) {
                return;
            }
            cache.put(event.request, response.clone());
        });
        return response;
    });
}
