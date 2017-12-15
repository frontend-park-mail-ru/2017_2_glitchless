import Api from './Api';
import Router from './Router';
import EventBus from './EventBus';
import MagicTransport from '../game/io/MagicTransport';
import LeaderboardModel from '../models/LeaderboardModel';

/**
 * Holds services. Provides dependency injection pattern.
 */

export default class ServiceLocator {
    constructor() {
        this.api = new Api(ENV_API_URL);
        this.magicTransport = new MagicTransport(ENV_WS_URL, {debug: false});

        this.router = new Router(this);
        this.eventBus = new EventBus();
        this.user = null;
        this.leaderboard = new LeaderboardModel(this);

        window.serviceLocator = this;
    }
}
