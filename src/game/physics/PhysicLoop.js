const PIXI = require('pixi.js');
const Alien = require('./object/Alien.js');
const SpriteStorage = require('./delegates/SpriteStorage.js');
const Constants = require('../../utils/Constants.js');
const VectorToPointLoop = require('./delegates/VectorToPointLoop.js');
const PhysicVectorLoop = require('./delegates/PhysicVectorLoop.js');
const Platform = require('./object/Platform.js');
const Laser = require('./object/Laser.js');
const Point = require('./object/primitive/Point.js');
const CollisionManager = require('./CollisionManager.js');
const primitives = require('./PhysicPrimitives.js');

const Circle = require('./object/PlatformKirkle.js');
const Arc = primitives.Arc;

class PhysicLoop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.spriteStorage = new SpriteStorage();
        this.vectorToPointDelegate = new VectorToPointLoop();
        this.physicDelegate = new PhysicVectorLoop();
        this.physicObjects = {};
        this.physicEntities = [];
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

        this.vectorToPointDelegate.processVector(this.physicEntities, this, elapsedMS);
        this.physicDelegate.processPhysicLoop(this, elapsedMS);
    }

    //
    _firstSetting() {
        const alien = new Alien(this, this._getCenterPoint());
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, this.gameManager);
        this.gameManager.addObject('alien', alien);
        this.spriteStorage.alien = alien;

        const circle = new Circle(this, Constants.GAME_CIRCLE_RADIUS, this._getCenterPoint());
        this.gameManager.addObject('circle', circle);

        const platform = new Platform(this, circle);
        platform.setCoords(new Point(200, 200), this);
        platform.setSpeed(new Point(0, 0));
        platform.setRotationSpeed(0.1);
        platform.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform.setRotation(90, this);
        this.gameManager.addObject('platform', platform);
        this.spriteStorage.userPlatform = platform;

    }

    _getCenterPoint() {
        return new Point(Constants.INITIAL_RES[0] / 2,
            Constants.INITIAL_RES[1] / 2);
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
            this.physicEntities.push(physicObject);
            physicObject.subscribeToDestroy((item) => {
                const pos = this.physicEntities.indexOf(item);
                if (pos > -1) {
                    this.physicEntities.splice(pos, 1);
                }
            });
        }
    }
}


module.exports = PhysicLoop;