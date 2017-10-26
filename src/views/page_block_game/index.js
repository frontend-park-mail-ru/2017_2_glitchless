const EventBusClass = require('../../utils/EventBus.js');
const EventBus = new EventBusClass;
const GameManager = require('../../game/GameManager.js');
const PhysicsObject = require('../../game/PhysicsObject.js');
const PIXI = require('pixi.js');

function init(serviceLocator) {
    let gameField = document.getElementById('game');
    console.log(PIXI);

    let appWidth = window.innerWidth * 0.8;
    let appHeight = Math.round(appWidth * 9.0/16.0);
    if (appHeight > window.innerHeight) {
        appHeight = window.innerHeight * 0.8;
        appWidth = Math.round(appHeight * 16.0/9.0);
    }

    const gameManager = new GameManager;

    gameManager.setGameField(gameField);
    gameManager.setResolution([appWidth, appHeight]);

    gameManager.initiateGame();
    const app = gameManager.app;
    console.log(window.innerWidth, window.innerHeight);
    // Scale mode for all textures, will not retain pixelation
    let sprite = PIXI.Sprite.fromImage('./images/spacestation.png');

    // Set the initial position

    sprite.anchor.set(0.5);
    sprite.x = getCenterX(app);
    sprite.y = getCenterY(app);

    sprite.height = sprite.width = app.renderer.width / 10;

// Opt-in to interactivity
    sprite.interactive = true;

// Shows hand cursor
    sprite.buttonMode = true;

// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
    gameManager.addObject(new PhysicsObject(sprite));
}

function getCenterX(app) {
    return app.renderer.width / 2;
}

function getCenterY(app) {
    return app.renderer.height / 2;
}

module.exports.init = init;
module.exports.EventBus = EventBus;