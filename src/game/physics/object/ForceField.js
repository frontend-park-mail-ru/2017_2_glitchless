const PhysicsObject = require('./primitive/PhysicsObject.js');

const basicForceFieldSprite ='';
class ForceField extends PhysicsObject {
    constructor(speed, context) {
        super(basicForceFieldSprite, context);
        this.speed = speed;
    }
}

module.exports = ForceField;