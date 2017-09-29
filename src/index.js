const ServiceLocator = require('./ServiceLocator.js');
const initViews = require('./views/index.js');
const UserModel = require('./models/UserModel.js');

window.onload = () => {
    const serviceLocator = new ServiceLocator();
    initViews(serviceLocator);
    UserModel.loadCurrent().then((user) => {
        serviceLocator.eventBus.emitEvent("auth", user);
    });
    serviceLocator.router.init();
};
