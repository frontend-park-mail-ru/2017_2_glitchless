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
        console.log('elapsed '+elapsedMS);
        // for(let i = 0; i < 60; i++) {
        //     if (i===1) {
        //         console.log('it works');
        //     }
        //     CollisionManager.simpleTest();
        // }
        const graphics = this.graphics;
        graphics.clear();
        const platform = this.physicObjects['platform'][0];
        const platformArc = Arc.fromPoints(...platform.getEdgePoints(), platform.getCoords());
        this.physicObjects['laser'].forEach((laser) => {
            const collision = CollisionManager.checkCollision(laser.getCoords(), laser.getSpeed(), platformArc, elapsedMS);
            if (collision) {
                const laserPos = laser.getCoords();
                const laserSpd = laser.getSpeed();
                graphics.drawCircle(laserPos.x + laserSpd.x, laserPos.y + laserSpd.y, 3);
                console.log(collision[0]);
                debugger;
                laser.setSpeed(collision[1]);
            }
        });
        //DebugOnly

        platform.getEdgePoints().forEach(function(point) {
            graphics.lineStyle(4, 0xffd900, 1);
            graphics.drawCircle(point.x, point.y, 3);
            graphics.lineStyle(4, 0xaaff00, 4);
            const arcStart = platformArc.bound1;
            const arcEnd = platformArc.bound2;
            // graphics.arcTo(arcStart.x, arcStart.y, arcEnd.x, arcEnd.y, platformCircle.R);
            const counterclockwise = platformArc.reversed;
            graphics.arc(platformArc.center.x, platformArc.center.y, platformArc.R,
                platformArc.angleBound1, platformArc.angleBound2, counterclockwise);
            // console.log(arcStart, arcEnd);
        });

        // graphics.lineStyle(4, 0xfdd999, 1);
        // graphics.drawCircle(platformCircle.center.x, platformCircle.center.y, platformCircle.R);
        this.gameManager.scene.stage.addChild(graphics);
        // console.log(platformCircle);
        //*DebugOnly
        this.vectorToPointDelegate.processVector(this.physicEntities, elapsedMS);
        this.physicDelegate.processPhysicLoop(this.spriteStorage, elapsedMS);
    }
    //
    _firstSetting() {
        const alien = new Alien(this._getCenterPoint());
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, this.gameManager);
        this.gameManager.addObject('alien', alien);
        this.spriteStorage.alien = alien;

        const platform = new Platform();
        platform.setCoords(new Point(200,200));
        platform.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform.setRotationSpeed(0.1);
        this.gameManager.addObject('platform', platform);
        this.spriteStorage.userPlatform = platform;

        const platform2 = new Platform();
        platform2.setCoords(new Point(400,200));
        platform2.setSpriteSize(Constants.GAME_PLATFORM_SIZE, this.gameManager);
        platform2.setRotationSpeed(0.1);
        this.gameManager.addObject('platform', platform2);

        const laser = new Laser(new Point(-0.1, -0.1));
        laser.setCoords(new Point(400,400));
        laser.setSpriteSize(Constants.GAME_LASER_SIZE, this.gameManager);
        this.gameManager.addObject('laser', laser);
        
        //DebugOnly
        this.graphics = new PIXI.Graphics();
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