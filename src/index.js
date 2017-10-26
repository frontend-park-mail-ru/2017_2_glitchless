const ServiceLocator = require('./ServiceLocator.js');
const authUser = require('./authUser.js');


window.onload = () => {
    const serviceLocator = new ServiceLocator();

    authUser(serviceLocator);
    serviceLocator.router.init();
};
