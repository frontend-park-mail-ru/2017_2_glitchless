package ru.glitchless.game.collision.`object`
import kotlin.js.Math;
class CollisionPoint(public var x: Float,
                     public var y: Float) {
    fun copy(): CollisionPoint {
        return CollisionPoint(this.x, this.y);
    }

    /**
     * Moves the point by given shift coordinates
     * @param {Number} deltaX
     * @param {Number} deltaY
     *
     * @return {Point}
     */
    fun apply(deltaX: Float, deltaY: Float): CollisionPoint {
        this.x += deltaX;
        this.y += deltaY;
        return this;
    }

    /**
     * Multiplies the point coordinates by multiplier
     * @param {Number} multiplier
     *
     * @return {Point}
     */
    fun mult(multiplier: Float): CollisionPoint {
        this.x *= multiplier;
        this.y *= multiplier;
        return this;
    }

    /**
     * Divides the point coordinates by divider
     * @param {Number} divider
     *
     * @return {Point}
     */
    fun divide(divider: Float): CollisionPoint {
        this.x /= divider;
        this.y /= divider;
        return this;
    }

    /**
     * Returns the length of a vector represented by a point
     *
     * @return {Point}
     */
    fun getLength(): Float {
        return Math.sqrt((this.x * this.x + this.y * this.y).toDouble()).toFloat();
    }
}