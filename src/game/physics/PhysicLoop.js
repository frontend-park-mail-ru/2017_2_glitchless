import * as PIXI from 'pixi.js';
import Alien from './object/Alien';
import Platform from './object/Platform';
import Laser from './object/Laser';
import HealthBlock from './object/HealthBlock';
import SpriteStorage from './delegates/SpriteStorage';
import Constants from '../../utils/Constants';
import utils from '../../utils/GameUtils';
import VectorToPointLoop from './delegates/VectorToPointLoop';
import PhysicVectorLoop from './delegates/PhysicVectorLoop';
import Point from './object/primitive/Point';
import CollisionManager from './CollisionManager';
import { Arc, Circle } from './PhysicPrimitives';
import PlatformCircle from './object/PlatformKirkle';

export default class PhysicLoop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.spriteStorage = new SpriteStorage();
        this.vectorToPointDelegate = new VectorToPointLoop();
        this.physicDelegate = new PhysicVectorLoop();
        this.physicObjects = {'laser': [], 'platform': []};
        this.physicEntities = [];
    }

    initTick(gameManager) {
        console.log('Initializing tick...');
        gameManager.app.ticker.add(this._mainTick, this);
        this.timeSum = -100; // Wait for everything to load properly
        this._firstSetting();

        this.anglePoints = [new Point(0.1, -0.05)]; //, new Point(0, -0.1), new Point(0.05, -0.1), new Point(0.1, -0.1),
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
        this.physicObjects.laser.filter((laser) => laser.forDestroy).forEach((laser) => {
            laser.destroy();
        });
        this.physicObjects.laser = this.physicObjects.laser.filter((laser) => !laser.forDestroy);
        console.assert(this.physicObjects.laser.filter((laser) => laser.forDestroy).length === 0);
    }

    _firstSetting() {
        const center = this._getCenterPoint();
        const alien = new Alien(this, center);
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, this.gameManager);
        this.gameManager.addObject('alien', alien);
        this.spriteStorage.alien = alien;

        const PlatformCircle1 = new PlatformCircle(this, Constants.GAME_CIRCLE1_RADIUS, center, 0);
        this.gameManager.addObject('circle', PlatformCircle1);
        const PlatformCircle2 = new PlatformCircle(this, Constants.GAME_CIRCLE2_RADIUS, center, 1);
        this.gameManager.addObject('circle', PlatformCircle2);
        const PlatformCircle3 = new PlatformCircle(this, Constants.GAME_CIRCLE3_RADIUS, center, 2);
        this.gameManager.addObject('circle', PlatformCircle3);
        for (let i = 0; i < Constants.HP_COUNT * 2; i++) {
            const hpblock = new HealthBlock(this, 
                new Point(center.x + Constants.GAME_CIRCLE1_RADIUS * 1.1, center.y),
                new Circle(Constants.GAME_HP_CIRCLE_RADIUS, center));
            hpblock.setSpriteSize(Constants.GAME_HEALTHBLOCK_SIZE, this.gameManager);
            hpblock.setRotation(i * Constants.FULL_CIRCLE_DEGREES / (Constants.HP_COUNT * 2) + 
                Constants.FULL_CIRCLE_DEGREES / (Constants.HP_COUNT * 2) / 2, this);
            this.gameManager.addObject('hpblock', hpblock);
        }

        for (let i = 0; i < Constants.HP_COUNT * 2; i++) {
            const hpblock = new HealthBlock(this, 
                new Point(center.x + Constants.GAME_CIRCLE1_RADIUS * 1.1, center.y),
                new Circle(Constants.GAME_HP_CIRCLE_RADIUS, center));
            hpblock.setSpriteSize(Constants.GAME_HEALTHBLOCK_SIZE, this.gameManager);
            hpblock.setRotation(i * Constants.FULL_CIRCLE_DEGREES / (Constants.HP_COUNT * 2) + 
                Constants.FULL_CIRCLE_DEGREES / (Constants.HP_COUNT * 2) / 2, this);
            this.gameManager.addObject('hpblock', hpblock);
        }

        const platform = new Platform(this, PlatformCircle1);
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
