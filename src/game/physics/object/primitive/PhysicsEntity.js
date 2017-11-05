const PhysicsObject = require('./PhysicsObject');
const Constants = require('../../../../utils/Constants.js');
const Point = require('./Point.js');

class PhysicsEntitiy extends PhysicsObject {
    constructor(sprite, context, coords = new Point(0, 0)) {
        super(sprite, context, coords);
        this.isStatic = false;
        this.rotationSpeed = 0;
        this.speed = new Point(0, 0);
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