class GameStrategy {
    constructor () {
        if (new.target === GameStrategy) {
            throw new TypeError("Cannot construct abstract instances directly");
        }
    }

    onGameEnd(...args) {

    }
}

module.exports = GameStrategy;