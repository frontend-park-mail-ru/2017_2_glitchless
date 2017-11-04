const PhysicsEntitiy = require('./primitive/PhysicsEntity.js');

const basicLazerSprite ='';
class Laser extends PhysicsEntitiy {
    constructor(speed) {
        super(basicLazerSprite);
        this.speed = speed;
    }
}

module.exports = Laser;