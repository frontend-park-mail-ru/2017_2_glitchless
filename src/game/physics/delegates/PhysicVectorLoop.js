import * as PIXI from 'pixi.js';
import ButtonHandler from '../helpers/ButtonHandler';
import Constants from '../../../utils/Constants';
import CollisionManager from '../CollisionManager';
import { Arc, Circle } from '../PhysicPrimitives';


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
        this._processPlatformLogic(context.spriteStorage.userPlatform, context);
        this._processCollisions(context, elapsedMS);
    }

    _processPlatformLogic(platform, context) {
        if (this.downButton.isUp && this.upButton.isUp) {
            this.verticalPressed = false;
        }

        if (!this.verticalPressed && this.downButton.isDown) {
            this.verticalPressed = true;
            platform.circleLevel = (platform.circleLevel - 1) >= 0 ? platform.circleLevel - 1 : 2;
            platform.setCircle(context.physicObjects['circle'][platform.circleLevel], context);
        } else {
            if (!this.verticalPressed && this.upButton.isDown) {
                this.verticalPressed = true;
                platform.circleLevel = (platform.circleLevel + 1) % 3;
                platform.setCircle(context.physicObjects['circle'][platform.circleLevel], context);
            }
        }

        if (this.leftButton.isDown || this.qButton.isDown) {
            platform.setRotationSpeed(Constants.GAME_PLATFORM_CONTROL_SPEED);
        } else if (this.rightButton.isDown || this.eButton.isDown) {
            platform.setRotationSpeed(-Constants.GAME_PLATFORM_CONTROL_SPEED);
        } else {
            platform.setRotationSpeed(0);
        }
    }

    _processCollisions(context, elapsedMS) {
        if (Constants.COLLISION_DEBUG) {
            var graphics = this.graphics;
            graphics.clear();
        }

        //Reflecting lasers
        context.physicObjects['platform'].forEach((platform) => {
            const platformArc = Arc.fromPoints(...(platform.getEdgePoints()), platform.getCoords());

            if (Constants.COLLISION_DEBUG) {
                const points = [...platform.getEdgePoints(), platform.getCoords()];
                graphics.lineStyle(2, Constants.GAME_CIRCLE_COLOR);
                points.forEach(function(physicPoint) {
                    var point = this.gameManager.scene.scalePoint(physicPoint);
                    graphics.drawCircle(point.x, point.y, 3);
                }.bind(context));
            }

            context.physicObjects['laser'].forEach((laser) => {
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
        if (Constants.COLLISION_DEBUG) {
            context.gameManager.scene.stage.addChild(graphics);
        }

        const alien = context.physicObjects['alien'][0];
        context.physicObjects['laser'].forEach((laser) => {
            if (!laser.reflected) {
                return;
            }

            const collision = CollisionManager.checkCollision(laser.getCoords(),
                    laser.getSpeed(), alien.collisionCircle , elapsedMS, true);
            if (collision) {
                laser.forDestroy = true;
            }
        });
    }
}
