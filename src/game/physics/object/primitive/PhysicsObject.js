const utils = require('../../../../utils/GameUtils.js');
const Constants = require('../../../../utils/Constants.js');
const Point = require('./Point.js');

class PhysicsObject {
    /**
     * @param {PIXI.Sprite} sprite The sprite with which the object will be rendered.
     * @param {PhysicLoop} context  object
     * @param coords
     */
    constructor(sprite, context, coords = new Point(0, 0)) {
        if (new.target === PhysicsObject) {
            throw new TypeError("Cannot construct abstract instances directly");
        }
        this.sprite = sprite;
        if (this.sprite.anchor != undefined) {
            this.sprite.anchor.set(0.5);
        }
        this.setCoords(coords, context);
        this.isStatic = true;
        this.destroyListeners = [];
    }

    onDraw(stage) {
        stage.addChild(this.sprite);
    }

    onDestroy() {
        this.sprite.parent.removeChild(this.sprite);
    }

    /**
     * @return {Point} Coordinates [x, y] of the object's sprite center.
     */
    getCoords() {
        return this.physicCoords;
    }

    /**
     * Sets sprite's position
     *
     * @param {Point} point New coordinates {x, y} of the object's sprite center.
     * @param {PhysicLoop} context
     */
    setCoords(point, context) {
        if (Constants.DEBUG_INPUT_CHECK) {
            if (isNaN(point.x) || isNaN(point.y)) {
                throw new TypeError;
            }
        }
        this.physicCoords = point;
        const newPoint = context.gameManager.scene.scalePoint(point);
        this.sprite.x = newPoint.x;
        this.sprite.y = newPoint.y;
    }

    getRotation() {
        return this.sprite.rotation * Constants.GAME_ROTATION_COEFFICIENT;
    }

    setRotation(rotation, context) {
        if (rotation > 360) {
            rotation = rotation - 360;
        }
        if (rotation < 0) {
            rotation = 360 - rotation;
        }
        this.sprite.rotation = rotation / Constants.GAME_ROTATION_COEFFICIENT;
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