const EventBusClass = require('../../utils/EventBus.js');
const EventBus = new EventBusClass;
function init(serviceLocator) {
    let gameField = document.getElementById('game');
    const PIXI = require('pixi.js');
    console.log(PIXI);
    let app = new PIXI.Application(window.innerWidth, window.innerHeight * 0.89, { backgroundColor: 0x1099bb });
    gameField.appendChild(app.view);
    console.log(window.innerWidth, window.innerHeight);
// Scale mode for all textures, will not retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
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
// sprite.on('tap', onClick); // touch-only

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