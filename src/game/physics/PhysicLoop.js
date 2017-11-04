const PIXI = require('pixi.js');
const Alien = require('./object/Alien.js');
const SpriteStorage = require('./delegates/SpriteStorage.js');
const Constants = require('../../utils/Constants.js');
const VectorToPointLoop = require('./delegates/VectorToPointLoop.js');
const PhysicVectorLoop = require('./delegates/PhysicVectorLoop.js');
const Platform = require('./object/Platform.js');
const Point = require('./object/primitive/Point.js');
const CollisionManager = require('./CollisionManager.js');
const primitives = require('./PhysicPrimitives.js');

const Circle = primitives.Circle;

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
        for(let i = 0; i < 60; i++) {
            if (i===1) {
                console.log('it works');
            }
            CollisionManager.simpleTest();
        }
        const platform = this.physicObjects['platform'][0];
        const platformCircle = Circle.fromPoints(platform.getCoords(),...platform.getEdgePoints());
        //DebugOnly
        const graphics = this.graphics;
        graphics.clear();
        graphics.lineStyle(4, 0xffd900, 1);

        platform.getEdgePoints().forEach(function(point) {
            graphics.drawCircle(point.x, point.y, 3);
        });

        graphics.lineStyle(4, 0xfdd999, 1);
        graphics.drawCircle(platformCircle.center.x, platformCircle.center.y, platformCircle.R);
        this.gameManager.scene.stage.addChild(graphics);
        console.log(platformCircle);
        //*DebugOnly
        this.vectorToPointDelegate.processVector(this.physicEntities, elapsedMS);
        this.physicDelegate.processPhysicLoop(this.spriteStorage, elapsedMS);
    }

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