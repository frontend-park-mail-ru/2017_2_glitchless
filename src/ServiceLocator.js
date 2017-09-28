const Api = require('./Api.js');

/**
 * Holds services. Provides dependency injection pattern.
 */
class ServiceLocator {
    constructor() {
        this.api = new Api('http://localhost:8080/api');
    }
}

module.exports = ServiceLocator;