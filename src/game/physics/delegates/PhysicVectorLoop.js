const ButtonHandler = require('../helpers/ButtonHandler.js');
const Constants = require('../../../utils/Constants.js');
const CollisionManager = require('../CollisionManager.js');
const primitives = require('../PhysicPrimitives.js');
const PIXI = require('pixi.js');

const Arc = primitives.Arc;

class PhysicVectorLoop {
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
        this._processPlatformLogic(context.spriteStorage.userPlatform);
        this._processCollisions(context, elapsedMS);
    }

    _processPlatformLogic(platform) {
        if (this.leftButton.isDown || this.upButton.isDown || this.qButton.isDown) {
            platform.setRotationSpeed(Constants.GAME_PLATFORM_CONTROL_SPEED);
        } else if (this.rightButton.isDown || this.downButton.isDown || this.eButton.isDown) {
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
                const collision = CollisionManager.checkCollision(laser.getCoords(),
                    laser.getSpeed(), platformArc, elapsedMS);
                if (collision) {
                    console.log('collided', collision);
                    laser.onCollision(collision);
                }
            });
        });
        if (Constants.COLLISION_DEBUG) {
            context.gameManager.scene.stage.addChild(graphics);
        }
    }
}


module.exports = PhysicVectorLoop;