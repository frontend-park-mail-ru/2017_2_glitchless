const EventBusClass = require('../../utils/EventBus.js');
const EventBus = new EventBusClass;
const GameManager = require('../../game/GameManager.js');
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

    // const app = new PIXI.Application(appWidth, appHeight, { backgroundColor: 0x1099bb });
    // gameField.appendChild(app.view);
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

// Pointers normalize touch and mouse
//     console.error(EventBus.proxy('pointerdown', onClick, sprite));
    console.error(sprite.on('pointerdown', EventBus.proxy(onClick, sprite)));

// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only

    app.stage.addChild(sprite);

    function onClick () {
        // console.log(args);
        // console.log(this);
        sprite.scale.x *= 1.25;
        sprite.scale.y *= 1.25;
    }
}

function getCenterX(app) {
    return app.renderer.width / 2;
}

function getCenterY(app) {
    return app.renderer.height / 2;
}

module.exports = init;