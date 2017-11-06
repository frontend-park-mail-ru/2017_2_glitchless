const PIXI = require('pixi.js');

const View = require('../View.js');
const TemplatedViewMixin = require('../TemplatedViewMixin.js');
const template = require('./template.pug');
const GameManager = require('../../game/GameManager.js');


class GameView extends View {
    open(root) {
        const gameField = document.getElementById('game');

        let appWidth = window.innerWidth * 0.8;
        let appHeight = Math.round(appWidth * 9.0 / 16.0);
        if (appHeight > window.innerHeight) {
            appHeight = window.innerHeight * 0.8;
            appWidth = Math.round(appHeight * 16.0 / 9.0);
        }

        const gameManager = new GameManager;

        gameManager.setGameField(gameField);
        gameManager.setResolution([appWidth, appHeight]);

        gameManager.initiateGame();
        const app = gameManager.app;
        console.log(window.innerWidth, window.innerHeight);
        // Scale mode for all textures, will not retain pixelation
        const sprite = PIXI.Sprite.fromImage('./images/spacestation.png');

// Set the initial position
        sprite.anchor.set(0.5);
        sprite.x = this._getCenterX(app);
        sprite.y = this._getCenterY(app);

        sprite.height = sprite.width = app.renderer.width / 10;

// Opt-in to interactivity
        sprite.interactive = true;

// Shows hand cursor
        sprite.buttonMode = true;

// Pointers normalize touch and mouse
//     console.error(EventBus.proxy('pointerdown', onClick, sprite));
        console.error(sprite.on('pointerdown', this.serviceLocator.eventBus.proxy(this._onSpriteClick, sprite)));

// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only

        app.stage.addChild(sprite);
    }

    get template() {
        return template;
    }

    _onSpriteClick(sprite) {
        // console.log(args);
        // console.log(this);
        sprite.scale.x *= 1.25;
        sprite.scale.y *= 1.25;
        sprite.rotation += 0.1;
    }

    _getCenterX(app) {
        return app.renderer.width / 2;
    }

    _getCenterY(app) {
        return app.renderer.height / 2;
    }
}

module.exports = TemplatedViewMixin(GameView);
