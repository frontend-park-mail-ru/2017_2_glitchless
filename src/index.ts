import ServiceLocator from './ServiceLocator';
import authUser from './authUser';


window.onload = () => {
    const serviceLocator = new ServiceLocator();

    authUser(serviceLocator);
    serviceLocator.router.init();
};
