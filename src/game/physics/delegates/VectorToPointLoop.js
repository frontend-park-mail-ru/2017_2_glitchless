const Point = require('../object/primitive/Point.js'); // Ето вектор

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
        const rotationSpeed = objectEntity.getSpeed();
        const deltaX = vec.x * elapsedMS;
        const deltaY = vec.y * elapsedMS;
        const deltaRotation = rotationSpeed * elapsedMS;


    }
}


module.exports = VectorToPointLoop;