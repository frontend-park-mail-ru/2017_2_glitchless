package ru.glitchless.game.collision.data

import ru.glitchless.game.collision.utils.Constant
import kotlin.math.*

open class Circle(public val radius: Double,
                  public val center: CollisionPoint) {

    /**
     * @param {Point} point
     *
     * @return {Point} point position relative to the center of circle
     */
    fun centrate(point: CollisionPoint): CollisionPoint {
        return CollisionPoint(point.x - this.center.x, point.y - this.center.y);
    }

    /**
     * @see {@link http://algolist.manual.ru/maths/geom/equation/circle.php}
     *
     * @param {Point} point1
     * @param {Point} point2
     * @param {Point} point3
     *
     * @return {Circle} Circle, passing through point1, point2, point3
     */
    companion object {
        fun fromPoints(pointFirst: CollisionPoint, pointSecond: CollisionPoint, pointThirdy: CollisionPoint): Circle {
            var point1 = pointFirst;
            var point2 = pointSecond;
            var point3 = pointThirdy;

            //To prevent cases where ma == 0
            if (abs(point2.y - point1.y) < Constant.EPSILON) {
                point3 = point2.also { point2 = point3 }
            }

            //To prevent cases where ma == Infinity or mb == Infinity
            if (abs(point3.x - point2.x) < Constant.EPSILON) {
                point2 = point1.also { point1 = point2 }
            } else if (abs(point2.x - point1.x) < Constant.EPSILON) {
                point2 = point3.also { point3 = point2 }
            }
            val ma = (point2.y - point1.y) / (point2.x - point1.x);
            val mb = (point3.y - point2.y) / (point3.x - point2.x);
            val centerX = (ma * mb * (point1.y - point3.y) + mb * (point1.x + point2.x) -
                    ma * (point2.x + point3.x)) / (2.0 * (mb - ma));
            val centerY = (-centerX + (point1.x + point2.x) / 2.0) / ma + (point1.y + point2.y) / 2;

            val radius = sqrt((centerX - point1.x).pow(2.0) + (centerY - point1.y).pow(2));
            return Circle(radius.toDouble(), CollisionPoint(centerX.toFloat(), centerY.toFloat()));
        }
    }
}