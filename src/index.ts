import 'babel-polyfill';

import './ui/global.scss';

import ServiceLocator from './services/ServiceLocator';

import authUser from './initializers/authUser';
import leaderboardInit from './initializers/leaderboard';
import routerInit from './initializers/router';
import serviceWorkerInit from './initializers/serviceWorker';

function runLater(func) {
    setTimeout(func, 0);
}

window.onload = () => {
    const serviceLocator = new ServiceLocator();

    runLater(() => authUser(serviceLocator));
    leaderboardInit(serviceLocator);
    serviceWorkerInit(serviceLocator);
    routerInit(serviceLocator);
};
