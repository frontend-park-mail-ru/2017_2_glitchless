const PhysicsObject = require('./primitive/PhysicsObject.js');

const basicLazerSprite ='';
class Laser extends PhysicsObject {
    constructor(speed) {
        super(basicLazerSprite);
        this.speed = speed;
    }
}

module.exports = Laser;