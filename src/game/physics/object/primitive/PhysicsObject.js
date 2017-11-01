const utils = require('../../../../utils/GameUtils.js');
const Constants = require('../../../../utils/Constants.js');

class PhysicsObject {
    /**
     * @param {PIXI.Sprite} sprite The sprite with which the object will be rendered.
     * @param coords
     */
    constructor(sprite, coords = [0, 0]) {
        if (new.target === PhysicsObject) {
            throw new TypeError("Cannot construct abstract instances directly");
        }
        this.sprite = sprite;
        this.speed = 0;
        this.sprite.anchor.set(0.5);
        this.rotationSpeed = 0;
        this.setCoords(coords);
        this.isStatic = true;
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

    getRotation() {
        return this.sprite.rotation * Constants.GAME_ROTATION_FULL_CIRCLE;
    }

    setRotation(rotation) {
        this.sprite.rotation = rotation / Constants.GAME_ROTATION_FULL_CIRCLE;
    }
}

module.exports = PhysicsObject;