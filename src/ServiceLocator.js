const Api = require('./Api.js');
const Router = require('./Router.js');
const UserModel = require('./models/UserModel.js');

/**
 * Holds services. Provides dependency injection pattern.
 */
class ServiceLocator {
    constructor() {
        this.api = new Api('https://glitchless-java.herokuapp.com/api');
        this.router = new Router();
        this.user = UserModel.getAuth();
    }
}

module.exports = ServiceLocator;