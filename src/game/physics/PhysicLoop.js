const PIXI = require('pixi.js');
const Alien = require('./object/Alien.js');
const SpriteStorage = require('./delegates/SpriteStorage.js');
const Constants = require('../../utils/Constants.js');
const VectorToPointLoop = require('./delegates/VectorToPointLoop.js');
const PhysicVectorLoop = require('./delegates/PhysicVectorLoop.js');
const Platform = require('./object/Platform.js');
const Point = require('./object/primitive/Point.js');

class PhysicLoop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.spriteStorage = new SpriteStorage();
        this.vectorToPointDelegate = new VectorToPointLoop();
        this.physicDelegate = new PhysicVectorLoop();
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
        this.physicDelegate.processPhysicLoop(this.spriteStorage, elapsedMS);
    }

    _firstSetting() {
        const alien = new Alien(this._getCenterPoint());
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, this.gameManager);
        this.gameManager.addObject('alien', alien);
        this.spriteStorage.alien = alien;

        const platform = new Platform();
        platform.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform.setSpeed(new Point(0.1, 0.01));
        platform.setRotationSpeed(0.1);
        this.gameManager.addObject('platform', platform);
        this.spriteStorage.userPlatform = platform;
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

        physicObject.subscribeToDestroy((item) => {
            const pos = this.physicObjects[tag].indexOf(item);
            if (pos > -1) {
                this.physicObjects[tag].splice(pos, 1);
            }
        });

        if (!physicObject.isStatic) {
            this.phisicEntities.push(physicObject);
            physicObject.subscribeToDestroy((item) => {
                const pos = this.phisicEntities.indexOf(item);
                if (pos > -1) {
                    this.phisicEntities.splice(pos, 1);
                }
            });
        }
    }
}


module.exports = PhysicLoop;