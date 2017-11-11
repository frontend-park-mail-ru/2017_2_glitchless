const PIXI = require('pixi.js');
const Alien = require('./object/Alien.js');
const SpriteStorage = require('./delegates/SpriteStorage.js');
const Constants = require('../../utils/Constants.js');
const utils = require('../../utils/GameUtils.js');
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
        this.physicObjects = {'laser': [], 'platform': []};
        this.physicEntities = [];
    }

    initTick(gameManager) {
        console.log("Initializing tick...");
        gameManager.app.ticker.add(this._mainTick, this);
        this.timeSum = -100; // Wait for everything to load properly
        this._firstSetting();

        this.anglePoints = [new Point(0.1, -0.05)];//, new Point(0, -0.1), new Point(0.05, -0.1), new Point(0.1, -0.1),
            // new Point(0.1, -0.05), new Point(0.1, 0), new Point(0.1, 0.05), new Point(0.1, 0.1)];
        this.angleCounter = 0;
    } 

    _mainTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.gameManager.app.ticker.speed;
        this.timeSum += deltaTime;
        if (this.timeSum > 100) {
            this.timeSum = 0;
            const laserSpeed = this.anglePoints[this.angleCounter % this.anglePoints.length].mult(1).copy().mult(2);
            const laser = new Laser(laserSpeed, this);
            laser.setCoords(this._getCenterPoint(), this);
            laser.setSpriteSize([10, 10], this.gameManager);
            this.gameManager.addObject('laser', laser);
            this.angleCounter++;
        }

        this.physicDelegate.processPhysicLoop(this, elapsedMS);
        this.vectorToPointDelegate.processVector(this.physicEntities, this, elapsedMS);
        this.physicObjects['laser'].filter((laser) => laser.forDestroy).forEach((laser) => { laser.destroy()});
        this.physicObjects['laser'] = this.physicObjects['laser'].filter((laser) => !laser.forDestroy);
        console.assert(this.physicObjects['laser'].filter((laser)=> laser.forDestroy).length === 0);
    }

    _firstSetting() {
        const alien = new Alien(this, this._getCenterPoint());
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, this.gameManager);
        this.gameManager.addObject('alien', alien);
        this.spriteStorage.alien = alien;

        const circle1 = new Circle(this, Constants.GAME_CIRCLE1_RADIUS, this._getCenterPoint(), 0);
        this.gameManager.addObject('circle', circle1);
        const circle2 = new Circle(this, Constants.GAME_CIRCLE2_RADIUS, this._getCenterPoint(), 1);
        this.gameManager.addObject('circle', circle2);
        const circle3 = new Circle(this, Constants.GAME_CIRCLE3_RADIUS, this._getCenterPoint(), 2);
        this.gameManager.addObject('circle', circle3);

        const platform = new Platform(this, circle1);
        platform.setSpeed(new Point(0, 0));
        platform.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform.setRotation(46, this);
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