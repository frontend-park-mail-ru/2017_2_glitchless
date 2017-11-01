const PhysicsObject = require('./PhysicsObject');
const Constants = require('../../../../utils/Constants.js');

class PhysicsEntitiy extends PhysicsObject {
    constructor(sprite, coords = [0, 0]) {
        super(sprite, coords);
        this.isStatic = false;
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getRotationSpeed() {
        return this.sprite.rotationSpeed * Constants.GAME_ROTATION_FULL_CIRCLE;
    }

    setRotationSpeed(rotationSpeed) {
        return this.sprite.rotationSpeed / Constants.GAME_ROTATION_FULL_CIRCLE;
    }
}

module.exports = PhysicsEntitiy;