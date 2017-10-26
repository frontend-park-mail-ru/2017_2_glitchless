const PhysicsObject = require('../../PhysicsObject.js');

const basicLazerSprite ='';
class Laser extends PhysicsObject {
    constructor(speed) {
        super(basicLazerSprite);
        this.speed = speed;
    }
}