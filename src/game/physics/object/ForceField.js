const PhysicsObject = require('../../PhysicsObject.js');

const basicForceFieldSprite ='';
class ForceField extends PhysicsObject {
    constructor(speed) {
        super(basicForceFieldSprite);
        this.speed = speed;
    }
}