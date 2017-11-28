import Api from './Api';
import Router from './Router';
import EventBus from './EventBus';
import MagicTransport from '../game/io/MagicTransport';
import LeaderboardModel from '../models/LeaderboardModel';

/**
 * Holds services. Provides dependency injection pattern.
 */
const BASE_URL = 'localhost:8081';
//const BASE_URL = "glitchless-java.herokuapp.com";

export default class ServiceLocator {
    constructor() {
        this.api = new Api('http://' + BASE_URL + '/api');
        this.stubApi = new Api('/api');
        this.magicTransport = new MagicTransport("ws://" + BASE_URL + "/game");
        this.router = new Router(this);
        this.eventBus = new EventBus();
        this.user = null;
        this.leaderboard = new LeaderboardModel(this);

        window.serviceLocator = this;
    }
}
