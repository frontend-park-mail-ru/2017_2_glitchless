const PhysicsEntity = require('./primitive/PhysicsEntity.js');

const basicLaserTexture = PIXI.Texture.fromImage('./images/laser.png');;
class Laser extends PhysicsEntity {
    constructor(speed) {
    	const basicLaserSprite = new PIXI.Sprite(basicLaserTexture);
        super(basicLaserSprite);
        this.speed = speed;
    }
}

module.exports = Laser;