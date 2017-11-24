import 'babel-polyfill';
import authUser from './authUser';
import ServiceLocator from './ServiceLocator';

window.onload = () => {
    const serviceLocator = new ServiceLocator();

    authUser(serviceLocator);
    serviceLocator.router.init();
    serviceLocator.leaderboard.sync();

    if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker.register('/sw.js');
    }
};
