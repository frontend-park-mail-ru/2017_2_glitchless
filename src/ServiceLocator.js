const Api = require('./Api.js');
const Router = require('./Router.js');

/**
 * Holds services. Provides dependency injection pattern.
 */
class ServiceLocator {
    constructor() {
        this.api = new Api('https://glitchless-java.herokuapp.com/api');
        this.router = new Router();
        this.user = null;
    }
}

module.exports = ServiceLocator;