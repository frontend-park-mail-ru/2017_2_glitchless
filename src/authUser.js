const UserModel = require('./models/UserModel.js');

module.exports = function (serviceLocator) {
    UserModel.loadCurrent().then((user) => {
        serviceLocator.eventBus.emitEvent('auth', user);
    });
};