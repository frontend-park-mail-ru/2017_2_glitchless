export default function() {
    if (!('serviceWorker' in window.navigator)) {
        return;
    }

    window.navigator.serviceWorker.register('/sw.js');
}