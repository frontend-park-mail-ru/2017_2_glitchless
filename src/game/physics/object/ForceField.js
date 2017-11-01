const PhysicsObject = require('./primitive/PhysicsObject.js');

const basicForceFieldSprite ='';
class ForceField extends PhysicsObject {
    constructor(speed) {
        super(basicForceFieldSprite);
        this.speed = speed;
    }
}

module.exports = ForceField;