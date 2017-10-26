const utils = require('../utils/GameUtils.js');

class PhysicsObject {
    /**
     * @param {PIXI.Sprite} sprite The sprite with which the object will be rendered.
     */
    constructor (sprite) {
        if (new.target === PhysicsObject) {
            throw new TypeError("Cannot construct abstract instances directly");
        }
        this.sprite = sprite;
        this.speed = 0;
        this.rotationSpeed = 0;
    }

    /**
     * @return {Number[]} Coordinates [x, y] of the object's sprite center.
     */
    getCoords() {
        return [this.sprite.x, this.sprite.y];
    }

    /**
     * Sets sprite's position
     *
     * @param {Number[]} coords New coordinates [x, y] of the object's sprite center.
     */
    setCoords(coords) {
        this.sprite.x = coords[0];
        this.sprite.y = coords[1];
    }


    getSpeed() {
        return this.speed;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getRotation() {
        return this.sprite.rotation * 360.0;
    }

    setRotation(rotation) {
        this.sprite.rotation = rotation / 360.0;
    }

    getRotationSpeed() {
        return this.sprite.rotationSpeed * 360.0;
    }

    setRotationSpeed(rotationSpeed) {
        return this.sprite.rotationSpeed / 360.0;
    }
}

module.exports = PhysicsObject;