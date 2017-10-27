const EventBusClass = require('../../utils/EventBus.js');
const Constants = require('../../utils/Constants.js');

const GameManager = require('../../game/GameManager.js');
const PIXI = require('pixi.js');

const EventBus = new EventBusClass;

function init(serviceLocator) {
    let gameField = document.getElementById('game');
    console.log(PIXI);

    let appWidth = window.innerWidth * Constants.WINDOW_SCALE;
    let appHeight = Math.round(appWidth * Constants.WINDOW_HD_RATIO_INVERSE);
    if (appHeight > window.innerHeight) {
        appHeight = window.innerHeight * Constants.WINDOW_SCALE;
        appWidth = Math.round(appHeight * Constants.WINDOW_HD_RATIO);
    }

    const gameManager = new GameManager;

    gameManager.setGameField(gameField);
    console.log([appWidth, appHeight]);
    gameManager.setResolution([appWidth, appHeight]);

    gameManager.initiateGame();

    console.log(window.innerWidth, window.innerHeight);
}

module.exports.init = init;
module.exports.EventBus = EventBus;