import * as PIXI from 'pixi.js';
import ButtonHandler from '../helpers/ButtonHandler';
import Constants from '../../../utils/Constants';
import CollisionManager from '../CollisionManager';
import {Arc} from '../PhysicPrimitives';

export default class PhysicVectorLoop {
    constructor() {
        this.leftButton = new ButtonHandler(Constants.CONTROL_PLATFORM_LEFT);
        this.qButton = new ButtonHandler(Constants.CONTROL_PLATFORM_Q);
        this.eButton = new ButtonHandler(Constants.CONTROL_PLATFORM_E);
        this.rightButton = new ButtonHandler(Constants.CONTROL_PLATFORM_RIGHT);
        if (Constants.COLLISION_DEBUG) {
            this.graphics = new PIXI.Graphics();
        }
    }

    processPhysicLoop(context, elapsedMS) {
        context.spriteStorage.needUpdatePlatorm.forEach(
            (item) => this._processPlatformLogic(item),
        );
        this._processCollisions(context, elapsedMS);
    }

    _processPlatformLogic(platform) {
        const currentSpeed = platform.getRotationSpeed();
        let newRotationSpeed;
        if (platform.direction === 0) {
            if (currentSpeed > Constants.GAME_PLATFROM_MIN_SPEED) {
                newRotationSpeed = Math.max(
                    currentSpeed - (currentSpeed * Constants.GAME_PLATFORM_INERTION_COEFFICIENT), 0);
            } else if (currentSpeed < Constants.GAME_PLATFROM_MIN_SPEED) {
                newRotationSpeed = Math.min(
                    currentSpeed + Math.abs(currentSpeed * Constants.GAME_PLATFORM_INERTION_COEFFICIENT), 0);
            } else {
                newRotationSpeed = 0;
            }
        } else {
            newRotationSpeed = Constants.GAME_PLATFORM_CONTROL_SPEED * platform.direction;
        }

        platform.setRotationSpeed(newRotationSpeed);
    }

    _processCollisions(context, elapsedMS) {
        const graphics = this.graphics;
        if (Constants.COLLISION_DEBUG) {
            graphics.clear();
        }

        //Reflecting lasers from platform
        context.physicObjects.platform.forEach((platform) => {
            const platformArc = Arc.fromPoints(...platform.getEdgePoints());

            if (Constants.COLLISION_DEBUG) {
                const points = platform.getEdgePoints();
                graphics.lineStyle(2, Constants.GAME_CIRCLE_COLOR);
                points.forEach(function(physicPoint) {
                    const point = this.gameManager.scene.scalePoint(physicPoint);
                    graphics.drawCircle(point.x, point.y, 3);
                }.bind(context));
            }

            context.physicObjects.laser.forEach((laser) => {
                if (Constants.COLLISION_DEBUG) {
                    console.log('laser');
                    const speed = laser.getSpeed().copy();
                    console.log(speed);
                }
                const collision = CollisionManager.getReflection(laser.getCoords(),
                    laser.getSpeed(), platformArc, elapsedMS);
                if (collision) {
                    laser.onCollision(collision, platform);
                }
            });
        });

        //Absorbing lasers that hit alien/turret
        const alien = context.physicObjects.alien[0];
        context.physicObjects.laser.forEach((laser) => {
            if (!laser.reflected) {
                return;
            }

            const collision = CollisionManager.checkCollision(laser.getCoords(),
                laser.getSpeed(), alien.collisionCircle, elapsedMS, true);
            if (collision) {
                laser.forDestroy = true;
            }
        });

        //TODO: Absorbing lasers that hit forcefields, depleting forcefields
        context.physicObjects.forcefield.forEach((forcefield) => {
            if (forcefield.off) {
                return;
            }
            context.physicObjects.laser.forEach((laser) => {
                const collision = CollisionManager.checkCollision(laser.getCoords(),
                    laser.getSpeed(), forcefield.collisionArc, elapsedMS);
                if (collision) {
                    laser.forDestroy = true;
                    forcefield.onCollision(collision);
                }
            });

            if (Constants.COLLISION_DEBUG) {
                const points = forcefield.getEdgePoints();
                graphics.lineStyle(2, Constants.GAME_CIRCLE_COLOR);
                points.forEach(function(physicPoint) {
                    const point = this.gameManager.scene.scalePoint(physicPoint);
                    graphics.drawCircle(point.x, point.y, 3);
                }.bind(context));
            }
        });
        //TODO: depleting health
        context.physicObjects.hpblock.forEach((hpblock) => {
            context.physicObjects.laser.forEach((laser) => {
                const collision = CollisionManager.checkCollision(laser.getCoords(),
                    laser.getSpeed(), hpblock.collisionArc, elapsedMS);
                if (collision) {
                    laser.forDestroy = true;
                    hpblock.onCollision(laser);
                }
            });

            if (Constants.COLLISION_DEBUG) {
                const points = hpblock.getEdgePoints();
                graphics.lineStyle(2, Constants.GAME_CIRCLE_COLOR);
                points.forEach(function(physicPoint) {
                    const point = this.gameManager.scene.scalePoint(physicPoint);
                    graphics.drawCircle(point.x, point.y, 3);
                }.bind(context));
            }
        });

        if (Constants.COLLISION_DEBUG) {
            context.gameManager.scene.stage.addChild(graphics);

        }
    }
}
