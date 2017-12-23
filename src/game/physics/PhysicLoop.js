import * as PIXI from 'pixi.js';

import SpriteStorage from './delegates/SpriteStorage';
import Constants from '../../utils/Constants';

import VectorToPointLoop from './delegates/VectorToPointLoop';
import PhysicVectorLoop from './delegates/PhysicVectorLoop';

import Point from './object/primitive/Point';

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
        this._firstSetting();

        this.timeSum = -100; // Wait for everything to load properly

        this.anglePoints = [new Point(0.1, -0.05), new Point(0, -0.1), new Point(0.05, -0.1), new Point(0.1, -0.1),
            new Point(0.1, -0.05), new Point(0.1, 0), new Point(0.1, 0.05), new Point(0.1, 0.1)];
        this.angleCounter = 0;
    }

    _mainTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.gameManager.app.ticker.speed;

        this.physicDelegate.processPhysicLoop(this, elapsedMS);
        this.vectorToPointDelegate.processVector(this.physicEntities, this, elapsedMS);
        this.physicObjects.laser.filter((laser) => laser.forDestroy).forEach((laser) => {
            laser.destroy();
        });
        this.physicObjects.laser = this.physicObjects.laser.filter((laser) => (!laser.forDestroy));
        console.assert(this.physicObjects.laser.filter((laser) => laser.forDestroy).length === 0);
    }

    _firstSetting() {
        this.gameManager.scene.initField(this);
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
