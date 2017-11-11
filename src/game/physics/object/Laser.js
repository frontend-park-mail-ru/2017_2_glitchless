const PhysicsEntity = require('./primitive/PhysicsEntity.js');
const PIXI = require('pixi.js');
const Constants = require('../../../utils/Constants.js');
const utils = require('../../../utils/GameUtils.js');

const basicLaserTexture = PIXI.Texture.fromImage('./images/laser.png');


class Laser extends PhysicsEntity {
    constructor(speed, context) {
        const basicLaserSprite = new PIXI.Sprite(basicLaserTexture);
        super(basicLaserSprite, context);
        this.setSpeed(speed);
    }

    onCollision(collision) {
        this.setSpeed(collision[1].copy());
        this.reflected = true;
    }

    onDraw(stage) {
        super.onDraw(stage);
    }

    setSpeed(speed) {
        super.setSpeed(speed);
        this.setRotation(utils.degrees(Math.atan2(speed.y, speed.x)));
    }
}

module.exports = Laser;