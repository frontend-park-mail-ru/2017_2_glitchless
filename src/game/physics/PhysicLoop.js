const PIXI = require('pixi.js');
const Alien = require('./object/Alien.js');
const GameUtils = require('../../utils/GameUtils.js');
const Constants = require('../../utils/Constants.js');
const VectorToPointLoop = require('./delegates/VectorToPointLoop.js');
const PhysicsEntitiy = require('./object/primitive/PhysicsEntitiy.js');
const Point = require('./object/primitive/Point.js');

class PhysicLoop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.vectorToPointDelegate = new VectorToPointLoop();
        this.physicObjects = {};
        this.phisicEntities = [];
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

        this.vectorToPointDelegate.processVector(this.phisicEntities, elapsedMS);
    }

    _firstSetting() {
        let alien = new Alien(this._getCenterPoint());
        GameUtils.resizeSprite(alien.sprite, this.gameManager.scene.scaleCoords(Constants.GAME_LASER_SIZE));
        this.gameManager.addObject('alien', alien);
    }

    _getCenterPoint() {
        return new Point(this.gameManager.app.renderer.width / 2,
            this.gameManager.app.renderer.height / 2);
    }

    addObjectToPhysic(tag, physicObject) {
        if (!Array.isArray(this.physicObjects[tag])) {
            this.physicObjects[tag] = [];
        }

        this.physicObjects[tag].push(physicObject);

        if (!physicObject.isStatic) {
            this.phisicEntities.push(physicObject);
        }
    }
}


module.exports = PhysicLoop;