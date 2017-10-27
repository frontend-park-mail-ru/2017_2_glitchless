const PIXI = require('pixi.js');
const Alien = require('./object/Alien.js');
const GameUtils = require('../../utils/GameUtils.js');

class PhysicLoop {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    initTick(gameManager) {
        console.log("Initializing tick...");
        gameManager.app.ticker.add(this._mainTick, this);
        this._firstSetting();
    }

    _mainTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.gameManager.app.ticker.speed;
        //console.log("Frame per second: " + (1000 / elapsedMS));
    }

    _firstSetting() {
        let alien = new Alien([this._getCenterX(), this._getCenterY()]);
        GameUtils.resizeSprite(alien.sprite, this.gameManager.scene.scaleCoords([100, 100]));
        this.gameManager.addObject('alien', alien);
    }

    _getCenterX() {
        return this.gameManager.app.renderer.width / 2;
    }

    _getCenterY() {
        return this.gameManager.app.renderer.height / 2;
    }
}


module.exports = PhysicLoop;