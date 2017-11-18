import * as PIXI from 'pixi.js';
import ButtonHandler from '../helpers/ButtonHandler';
import Constants from '../../../utils/Constants';
import CollisionManager from '../CollisionManager';
import {Arc, Circle} from '../PhysicPrimitives';

export default class PhysicVectorLoop {
    constructor() {
        this.leftButton = new ButtonHandler(Constants.CONTROL_PLATFORM_LEFT);
        this.upButton = new ButtonHandler(Constants.CONTROL_PLATFORM_UP);
        this.qButton = new ButtonHandler(Constants.CONTROL_PLATFORM_Q);
        this.eButton = new ButtonHandler(Constants.CONTROL_PLATFORM_E);
        this.rightButton = new ButtonHandler(Constants.CONTROL_PLATFORM_RIGHT);
        this.downButton = new ButtonHandler(Constants.CONTROL_PLATFORM_DOWN);
        if (Constants.COLLISION_DEBUG) {
            this.graphics = new PIXI.Graphics();
        }
    }

    processPhysicLoop(context, elapsedMS) {
        this._processPlatformLogic(context.physicObjects.platform);
        this._processCollisions(context, elapsedMS);
    }

    _processPlatformLogic(platforms) {
        platforms.forEach((platform) => {
            if (platform.direction === 0) {
                if (platform.getRotationSpeed() > Constants.GAME_PLATFROM_MIN_SPEED) {
                    platform.setRotationSpeed(Math.max(
                        platform.getRotationSpeed()
                        - (platform.getRotationSpeed() * Constants.GAME_PLATFORM_INERTION_COEFFICIENT), 0));
                } else if (platform.getRotationSpeed() < Constants.GAME_PLATFROM_MIN_SPEED) {
                    platform.setRotationSpeed(Math.min(
                        platform.getRotationSpeed()
                        + Math.abs(platform.getRotationSpeed() * Constants.GAME_PLATFORM_INERTION_COEFFICIENT), 0));
                } else {
                    platform.setRotationSpeed(0);
                }
                return;
            }
            platform.setRotationSpeed(Constants.GAME_PLATFORM_CONTROL_SPEED * platform.direction);
        });
    }

    _processCollisions(context, elapsedMS) {
        if (Constants.COLLISION_DEBUG) {
            var graphics = this.graphics;
            graphics.clear();
        }

        //Reflecting lasers from platform
        context.physicObjects.platform.forEach((platform) => {
            const platformArc = Arc.fromPoints(...(platform.getEdgePoints()), platform.getCoords());

            if (Constants.COLLISION_DEBUG) {
                const points = [...platform.getEdgePoints(), platform.getCoords()];
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
                    laser.onCollision(collision);
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
                const points = [...forcefield.getEdgePoints(), forcefield.getCoords()];
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
                    hpblock.onCollision();
                }
            });

            if (Constants.COLLISION_DEBUG) {
                const points = [...hpblock.getEdgePoints(), hpblock.getCoords()];
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
