const PhysicsObject = require('./PhysicsObject');
const Constants = require('../../../../utils/Constants.js');
const Point = require('./Point.js');

class PhysicsEntitiy extends PhysicsObject {
    constructor(sprite, coords = new Point(0, 0)) {
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
        return this.rotationSpeed;
    }

    setRotationSpeed(rotationSpeed) {
        this.rotationSpeed = rotationSpeed;
    }
}

module.exports = PhysicsEntitiy;