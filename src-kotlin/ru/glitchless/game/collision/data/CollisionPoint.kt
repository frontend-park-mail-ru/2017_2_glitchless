package ru.glitchless.game.collision.data

import kotlin.math.*

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
    @JsName("apply")
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
    @JsName("mult")
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
    @JsName("devide")
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
    @JsName("getLength")
    fun getLength(): Float {
        return sqrt((this.x * this.x + this.y * this.y).toDouble()).toFloat();
    }
}