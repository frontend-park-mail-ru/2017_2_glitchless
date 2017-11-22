import 'babel-polyfill';
import authUser from './authUser';
import ServiceLocator from './ServiceLocator';

window.onload = () => {
    const serviceLocator = new ServiceLocator();

    authUser(serviceLocator);
    serviceLocator.router.init();
    navigator.serviceWorker.register('/sw.js');
};
