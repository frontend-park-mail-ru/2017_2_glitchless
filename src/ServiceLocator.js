import Api from './Api';
import Router from './Router';
import EventBus from './utils/EventBus';
import LeaderboardModel from './models/LeaderboardModel';

/**
 * Holds services. Provides dependency injection pattern.
 */
export default class ServiceLocator {
    constructor() {
        this.api = new Api('https://glitchless-java.herokuapp.com/api');
        this.stubApi = new Api('/api');
        this.router = new Router(this);
        this.eventBus = new EventBus();
        this.user = null;
        this.leaderboard = new LeaderboardModel(this);
    }
}
