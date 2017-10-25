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
        this.sprite.rotate
    }

    setRotation() {

    }

    getRotationSpeed() {

    }

    setRotationSpeed() {

    }
}

module.exports = PhysicsObject;