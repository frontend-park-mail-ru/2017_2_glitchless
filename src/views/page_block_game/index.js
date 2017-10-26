const EventBusClass = require('../../utils/EventBus.js');
const EventBus = new EventBusClass;
const GameManager = require('../../game/GameManager.js');
const PhysicsObject = require('../../game/PhysicsObject.js');
const Alien = require('../../game/physics/object/Alien.js');
const PIXI = require('pixi.js');

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

    gameManager.addObject('alien', new Alien());
}

function getCenterX(app) {
    return app.renderer.width / 2;
}

function getCenterY(app) {
    return app.renderer.height / 2;
}

module.exports.init = init;
module.exports.EventBus = EventBus;