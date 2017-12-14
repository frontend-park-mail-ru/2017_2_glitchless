export function unregisterServiceWorkers() {
    return window.navigator.serviceWorker.getRegistrations().then((registrations) => {
        return Promise.all(registrations.map((r) => r.unregister()));
    });
}
