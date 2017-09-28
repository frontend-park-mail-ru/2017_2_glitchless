const Api = require('./Api.js');
const Router = require('./Router.js');
const UserModel = require('./models/UserModel.js');
const EventBus = require('./utils/EventBus.js');

/**
 * Holds services. Provides dependency injection pattern.
 */
class ServiceLocator {
    constructor() {
        this.api = new Api('https://glitchless-java.herokuapp.com/api');
        this.router = new Router();
        this.user = UserModel.getAuth();
        this.eventBus = new EventBus();
    }
}

module.exports = ServiceLocator;