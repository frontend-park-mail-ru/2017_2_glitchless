const GameStrategy = require('GameStrategy');
const EventBus = require('../views/game/index.js').EventBus;
class SinglePlayerStrategy extends GameStrategy {
    constructor() {
        super();
    }

    endGame(result) {
        if (result === 1) {
            EventBus.emitEvent('Win');
        }
    }
}

module.exports = SinglePlayerStrategy;