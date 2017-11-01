const Point = require('../object/primitive/Point.js'); // It's vector
const Constants = require('../../../utils/Constants.js');

class VectorToPointLoop {
    constructor() {

    }

    processVector(objects, elapsedMS) {
        objects.forEach(item => {
            this._processOneEntity(item, elapsedMS);
        });
    }

    _processOneEntity(objectEntity, elapsedMS) {
        const vec = objectEntity.getSpeed();
        const rotationSpeed = objectEntity.getRotationSpeed();
        const deltaX = vec.x * elapsedMS;
        const deltaY = vec.y * elapsedMS;
        const deltaRotation = rotationSpeed * elapsedMS;
        const newPoint = objectEntity.getCoords().apply(deltaX, deltaY);

        objectEntity.setCoords(newPoint);

        objectEntity.setRotation(
            objectEntity.getRotation() + deltaRotation
        );

        /* Destroy?
        if (newPoint.x > Constants.INITIAL_RES[0]
            || newPoint.y > Constants.INITIAL_RES[1]
            || newPoint.x < 0
            || newPoint.y < 0) {
        } */
    }
}


module.exports = VectorToPointLoop;