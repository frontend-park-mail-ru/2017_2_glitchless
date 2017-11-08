const PhysicsEntity = require('./primitive/PhysicsEntity.js');
const PIXI = require('pixi.js');
const Constants = require('../../../utils/Constants.js')

const basicLaserTexture = PIXI.Texture.fromImage('./images/laser.png');


class Laser extends PhysicsEntity {
    constructor(speed, context) {
        const basicLaserSprite = new PIXI.Sprite(basicLaserTexture);
        super(basicLaserSprite, context);
        this.setSpeed(speed);
    }

    onCollision(collision) {
        this.setSpeed(collision[1].copy());
        // this.sprite.rotation = collision[]
    }

    setSpeed(speed) {
        super.setSpeed(speed);
        // if (Math.abs(speed.x) < Math.EPS * Constants.VERTICAL_PRECISION) {
        //     this.vertical = true;
        //     return;
        // }
        // this.vertical = false;
    }
}

module.exports = Laser;