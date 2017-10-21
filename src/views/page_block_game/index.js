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
    sprite.x = app.renderer.width / 2;
    sprite.y = app.renderer.height / 2;

    sprite.height = sprite.width = app.renderer.width / 10;

// Opt-in to interactivity
    sprite.interactive = true;

// Shows hand cursor
    sprite.buttonMode = true;

// Pointers normalize touch and mouse
    sprite.on('pointerdown', onClick);

// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
// sprite.on('tap', onClick); // touch-only

    app.stage.addChild(sprite);

    function onClick () {
        sprite.scale.x *= 1.25;
        sprite.scale.y *= 1.25;
    }
}

module.exports = init;