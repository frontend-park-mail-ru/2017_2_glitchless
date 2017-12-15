self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            console.log('Deleting all service worker caches:', cacheNames);
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName)),
            );
        }),
    );
});
