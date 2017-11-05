const PhysicsEntity = require('./primitive/PhysicsEntity.js');
const PIXI = require('pixi.js');
const basicLaserTexture = PIXI.Texture.fromImage('./images/laser.png');

class Laser extends PhysicsEntity {
    constructor(speed, context) {
        const basicLaserSprite = new PIXI.Sprite(basicLaserTexture);
        super(basicLaserSprite, context);
        this.speed = speed;
    }
}

module.exports = Laser;