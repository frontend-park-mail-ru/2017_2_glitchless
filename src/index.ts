import 'babel-polyfill';
import authUser from './authUser';
import leaderboardInit from './leaderboardInit';
import ServiceLocator from './ServiceLocator';

window.onload = () => {
    const serviceLocator = new ServiceLocator();

    serviceLocator.router.init();

    setTimeout(() => {
        authUser(serviceLocator);
        leaderboardInit(serviceLocator);
    }, 0);

    if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker.register('/sw.js');
    }
};
