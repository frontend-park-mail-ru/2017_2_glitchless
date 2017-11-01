const utils = require('../../../../utils/GameUtils.js');
const Constants = require('../../../../utils/Constants.js');
const Point = require('./Point.js');

class PhysicsObject {
    /**
     * @param {PIXI.Sprite} sprite The sprite with which the object will be rendered.
     * @param coords
     */
    constructor(sprite, coords = new Point(0, 0)) {
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
     * @return {Point} Coordinates [x, y] of the object's sprite center.
     */
    getCoords() {
        return new Point(this.sprite.x, this.sprite.y);
    }

    /**
     * Sets sprite's position
     *
     * @param {Number[]} point New coordinates {x, y} of the object's sprite center.
     */
    setCoords(point) {
        this.sprite.x = point.x;
        this.sprite.y = point.y;
    }

    getRotation() {
        return this.sprite.rotation * Constants.GAME_ROTATION_FULL_CIRCLE;
    }

    setRotation(rotation) {
        this.sprite.rotation = rotation / Constants.GAME_ROTATION_FULL_CIRCLE;
    }
}

module.exports = PhysicsObject;