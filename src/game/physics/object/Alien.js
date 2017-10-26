const PhysicsObject = require('../../PhysicsObject.js');

const basicAlienSprite ='';
class Laser extends PhysicsObject {
    constructor(speed) {
        super(basicAlienSprite);
        this.speed = speed;
    }
}