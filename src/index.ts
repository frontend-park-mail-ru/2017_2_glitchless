import 'babel-polyfill';

import './ui/global.scss';

import ServiceLocator from './services/ServiceLocator';

import authUser from './initializers/authUser';
import leaderboardInit from './initializers/leaderboard';
import routerInit from './initializers/router';
import serviceWorkerInit from './initializers/serviceWorker';

window.onload = () => {
    const serviceLocator = new ServiceLocator();

    routerInit(serviceLocator);
    serviceWorkerInit(serviceLocator);

    setTimeout(() => {
        authUser(serviceLocator);
        leaderboardInit(serviceLocator);
    }, 0);
};
