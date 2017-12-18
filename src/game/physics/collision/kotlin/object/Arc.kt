package ru.glitchless.game.collision.`object`
import kotlin.js.Math;

class Arc(radius: Double,
          private val boundingPoints: Array<CollisionPoint>,
          center: CollisionPoint = CollisionPoint(0.0f, 0.0f)) : Circle(radius, center) {

    private val bound1 = boundingPoints[0];
    private val bound2 = boundingPoints[1];
    private val midPoint = boundingPoints[2];
    private var angleMidPoint: Double;
    private var angleBound1: Double;
    private var angleBound2: Double;
    private var reversed: Boolean;


    /**
     * @param {Number} radius Radius of the circle, on which arc is located
     * @param {Point[]} boundingPoints Two points (number 0, 1 in array) that limit the arc on the circle,
     *      one point (number 3 in array) that is located between those points and decides in which direction
     *      of those 2 points arc is located
     * @todo consider reworking point 3 to direction (clockwise/counter-clockwise)
     * @param {Point} center Circle center
     *
     * @return {Arc}
     */
    init {
        //relative coordinates
        val relBound1 = this.centrate(this.bound1);
        val relBound2 = this.centrate(this.bound2);
        val relMidPoint = this.centrate(this.midPoint);

        val angleBound1 = Math.atan2(relBound1.y.toDouble(), relBound1.x.toDouble());
        val angleBound2 = Math.atan2(relBound2.y.toDouble(), relBound2.x.toDouble());
        this.angleMidPoint = Math.atan2(relMidPoint.y.toDouble(), relMidPoint.x.toDouble());

        this.angleBound1 = Math.min(angleBound1, angleBound2);
        this.angleBound2 = Math.max(angleBound1, angleBound2);

        this.reversed = !(this.angleMidPoint > this.angleBound1 && this.angleMidPoint < this.angleBound2);

    }


    /**
     * @param {Point} point
     *
     * @return {Boolean}
     */
    fun contains(point: CollisionPoint): Boolean {
        val relPoint = this.centrate(point);
        val anglePoint = Math.atan2(relPoint.y.toDouble(), relPoint.x.toDouble());
        if (!this.reversed) {
            return this.angleBound1 < anglePoint && this.angleBound2 > anglePoint;
        }
        return this.angleBound2 < anglePoint || this.angleBound1 > anglePoint;
    }

    companion object {

        /**
         * @param {Point} boundingPoint1
         * @param {Point} boundingPoint2
         * @param {Point} midPoint
         *
         * For details on parameters @see {@link Arc#constructor}
         *
         * @return {Arc}
         */
        fun fromPoints(boundingPoint1: CollisionPoint, boundingPoint2: CollisionPoint, midPoint: CollisionPoint): Arc {
            val circle = Circle.fromPoints(boundingPoint1, boundingPoint2, midPoint);
            return Arc.fromCircle(circle, arrayOf(boundingPoint1, boundingPoint2, midPoint));
        }

        /**
         * @param {Circle} circle
         * @param {Point[]} boundingPoints
         *
         * For details on parameters @see {@link Arc#constructor}
         *
         * @return {Arc}
         */
        fun fromCircle(circle: Circle, boundingPoints: Array<CollisionPoint>): Arc {
            return Arc(circle.radius, boundingPoints, circle.center);
        }
    }

}