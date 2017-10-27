const GameStrategy = require('GameStrategy');
const EventBus = require('../views/page_block_game/index.js').EventBus;
const Constants = require('../utils/Constants.js');

class SinglePlayerStrategy extends GameStrategy {
    constructor() {
        super();
    }

    endGame(result) {
        if (result === Constants.GAME_STATE_WIN) {
            EventBus.emitEvent('Win');
        }
    }
}

module.exports = SinglePlayerStrategy;