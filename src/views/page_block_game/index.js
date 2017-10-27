const EventBusClass = require('../../utils/EventBus.js');
const GameManager = require('../../game/GameManager.js');
const PIXI = require('pixi.js');

const EventBus = new EventBusClass;

function init(serviceLocator) {
    let gameField = document.getElementById('game');
    console.log(PIXI);

    let appWidth = window.innerWidth * 0.8;
    let appHeight = Math.round(appWidth * 9.0 / 16.0);
    if (appHeight > window.innerHeight) {
        appHeight = window.innerHeight * 0.8;
        appWidth = Math.round(appHeight * 16.0 / 9.0);
    }

    const gameManager = new GameManager;

    gameManager.setGameField(gameField);
    console.log([appWidth, appHeight]);
    gameManager.setResolution([appWidth, appHeight]);

    gameManager.initiateGame();

    console.log(window.innerWidth, window.innerHeight);
}

function getCenterX(app) {
    return app.renderer.width / 2;
}

function getCenterY(app) {
    return app.renderer.height / 2;
}

module.exports.init = init;
module.exports.EventBus = EventBus;