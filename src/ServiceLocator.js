import Api from './Api';
import Router from './Router';
import EventBus from './utils/EventBus';

/**
 * Holds services. Provides dependency injection pattern.
 */
export default class ServiceLocator {
    constructor() {
        this.api = new Api('https://glitchless-java.herokuapp.com/api');
        this.router = new Router(this);
        this.user = null;
        this.eventBus = new EventBus();
    }
}
