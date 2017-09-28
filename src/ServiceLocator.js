const Api = require('./Api.js');
const Router = require('./Router.js');

/**
 * Holds services. Provides dependency injection pattern.
 */
class ServiceLocator {
    constructor() {
        this.api = new Api('http://localhost:8080/api');
        this.router = new Router();
    }
}

module.exports = ServiceLocator;