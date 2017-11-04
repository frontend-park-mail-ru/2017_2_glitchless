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
        this.sprite.anchor.set(0.5);
        this.setCoords(coords);
        this.isStatic = true;
        this.destroyListeners = [];
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
     * @param {Point} point New coordinates {x, y} of the object's sprite center.
     */
    setCoords(point) {
        this.sprite.x = point.x;
        this.sprite.y = point.y;
    }

    getRotation() {
        return this.sprite.rotation * Constants.GAME_ROTATION_COEFFICIENT;
    }

    setRotation(rotation) {
        if (rotation > 360) {
            rotation = rotation - 360;
        }
        console.log(rotation);
        this.sprite.rotation = rotation / Constants.GAME_ROTATION_COEFFICIENT
    }

    subscribeToDestroy(callback, context = this) {
        this.destroyListeners.push({cb: callback, ctx: context});
    }

    destroy() {
        this.destroyListeners.forEach(emitObject =>
            emitObject.cb.bind(
                emitObject
                    .ctx)(this));
    }

    //TODO сделать метод onMeasure и всю фигню к нему

    setSpriteSize(size, gameManager) {
        this.spriteSize = size;
        utils.resizeSprite(this.sprite, gameManager.scene.scaleCoords(size));
    }

    getSpriteSize() {
        return this.spriteSize;
    }
}

module.exports = PhysicsObject;