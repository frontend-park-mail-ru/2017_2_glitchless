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

const Circle = primitives.Circle;
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
        const graphics = this.graphics;
        graphics.clear();
        const platform = this.physicObjects['platform'][0];
        const platformArc = Arc.fromPoints(...platform.getEdgePoints(), platform.getCoords());

        this.physicObjects['laser'].forEach((laser) => {
            const collision = CollisionManager.checkCollision(laser.getCoords(),
                laser.getSpeed(), platformArc, elapsedMS);
            const laserPos = laser.getCoords().copy();
            const laserSpd = laser.getSpeed();
            const laserShifted = laserPos.apply(laserSpd.x, laserSpd.y);
            console.log(laserShifted);
            if (Constants.GAME_DEBUG) {
                const laserGraph = this.gameManager.scene.scalePoint(laserShifted);
                graphics.lineStyle(4, 0xffd900, 1);
            }


            if (collision) {
                if (Constants.COLLISION_DEBUG) {
                    console.log('collided');
                    console.log(collision);
                }
                laser.setSpeed(collision[1]);
            }
        });

        if (Constants.GAME_DEBUG) {
            platform.getEdgePoints().forEach(function (point) {
                const graphicPoint = this.gameManager.scene.scalePoint(point);
                graphics.lineStyle(4, 0xffd900, 1);
                graphics.drawCircle(graphicPoint.x, graphicPoint.y, 3);
                graphics.lineStyle(4, 0xaaff00, 4);

                // console.log(arcStart, arcEnd);
            }.bind(this));

            const visiblePlatformArc = Arc.fromPoints(
                ...platform.getEdgePoints().map(function (point) {
                    return this.gameManager.scene.scalePoint(point);
                }.bind(this)),
                this.gameManager.scene.scalePoint(platform.getCoords())
            );

            const arcCenter = visiblePlatformArc.center;
            const arcRadius = visiblePlatformArc.R;
            const counterclockwise = visiblePlatformArc.reversed;
            graphics.arc(arcCenter.x, arcCenter.y, arcRadius, visiblePlatformArc.angleBound1, visiblePlatformArc.angleBound2, counterclockwise);
            this.gameManager.scene.stage.addChild(graphics);
        }

        this.vectorToPointDelegate.processVector(this.physicEntities, this, elapsedMS);
        this.physicDelegate.processPhysicLoop(this.spriteStorage, elapsedMS);
    }

    //
    _firstSetting() {
        const alien = new Alien(this, this._getCenterPoint());
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, this.gameManager);
        this.gameManager.addObject('alien', alien);
        this.spriteStorage.alien = alien;

        const platform = new Platform(this);
        platform.setCoords(new Point(200, 200), this);
        platform.setSpeed(new Point(0, 0));
        platform.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform.setRotation(180);
        this.gameManager.addObject('platform', platform);
        this.spriteStorage.userPlatform = platform;
        
        const platform2 = new Platform(this);
        platform2.setCoords(new Point(400, 200), this);
        platform2.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform2.setRotationSpeed(0.1);
        this.gameManager.addObject('platform', platform2);

        const laser = new Laser(new Point(-0.1, -0.1), this);
        laser.setCoords(new Point(400, 400), this);
        laser.setSpriteSize(Constants.GAME_LASER_SIZE, this.gameManager);
        this.gameManager.addObject('laser', laser);

        const laser2 = new Laser(new Point(-0.1, -0.1), this);
        laser2.setCoords(new Point(375, 400), this);
        laser2.setSpriteSize(Constants.GAME_LASER_SIZE, this.gameManager);
        this.gameManager.addObject('laser', laser2);

        //DebugOnly
        this.graphics = new PIXI.Graphics();
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