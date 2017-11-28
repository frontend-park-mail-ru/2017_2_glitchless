import { unregisterServiceWorkers } from '../utils/serviceWorker';

export default function() {
    if (!('serviceWorker' in window.navigator)) {
        return;
    }

    // noinspection JSUnresolvedVariable
    if (ENV_PRODUCTION) {
        window.navigator.serviceWorker.register('/sw.js');
    } else {
        unregisterServiceWorkers();
    }
}