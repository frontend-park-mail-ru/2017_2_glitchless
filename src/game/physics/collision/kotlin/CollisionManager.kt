package ru.glitchless.game.collision

import ru.glitchless.game.collision.data.Arc
import ru.glitchless.game.collision.data.Circle
import ru.glitchless.game.collision.data.CollisionPoint
import ru.glitchless.game.collision.data.Line
import ru.glitchless.game.collision.utils.Constant

import kotlin.math.*

/**
 * @param {Line} line
 * @param {Circle} circle
 *
 * @return {Point[]} Points of intersection
 */
fun findIntersection(lineInput: Line, circle: Circle): Array<CollisionPoint> {
    var line = lineInput;
    val endShift = arrayOf(circle.center.x, -circle.center.y);
    val r = circle.radius;
    val EPS = Constant.EPSILON;

    if (line.isVertical) {
        val x0 = line.C;
        if (circle.radius < abs(line.C)) {
            return arrayOf();
        }
        if (abs(abs(line.C) - circle.radius) < EPS) {
            return arrayOf(CollisionPoint(line.C.toFloat(), circle.center.y));
        }
        val tmpSqrt = sqrt(r * r - x0.pow(2));
        val y1 = circle.center.y + tmpSqrt;
        val y2 = circle.center.y - tmpSqrt;
        return arrayOf(CollisionPoint((x0 + endShift[0]).toFloat(), y1.toFloat()),
                CollisionPoint((x0 + endShift[0]).toFloat(), y2.toFloat()));
    }

    if (line.isHorizontal) {
        val y0 = -line.C;
        if (circle.radius < abs(line.C)) {
            return arrayOf();
        }
        if (abs(abs(line.C) - circle.radius) < EPS) {
            return arrayOf(CollisionPoint(line.C.toFloat(), circle.center.x));
        }
        val tmpSqrt = sqrt(r * r - y0.pow(2));
        val x1 = circle.center.x + tmpSqrt;
        val x2 = circle.center.x - tmpSqrt;

        return arrayOf(CollisionPoint(x1.toFloat(), (y0 - endShift[1]).toFloat()), CollisionPoint(x2.toFloat(),
                (y0 - endShift[1]).toFloat()));
    }

    line = Line.normalize(line)!!;
    val a = line.A;
    val b = line.B;
    val c = line.C;

    val x0 = -a * c / (a * a + b * b);
    val y0 = -b * c / (a * a + b * b);
    if (c * c > r * r * (a * a + b * b) + EPS) {
        return arrayOf();
    }
    if (abs(c * c - r * r * (a * a + b * b)) < EPS) {
        return arrayOf(CollisionPoint((x0 + endShift[0]).toFloat(), (y0 - endShift[1]).toFloat()));
    }
    val d = r * r - c * c / (a * a + b * b);
    val mult = sqrt(d / (a * a + b * b));

    val ax = x0 + b * mult;
    val bx = x0 - b * mult;
    val ay = y0 - a * mult;
    val by = y0 + a * mult;
    return arrayOf(CollisionPoint((ax + endShift[0]).toFloat(), (ay - endShift[1]).toFloat()),
            CollisionPoint((bx + endShift[0]).toFloat(), (by - endShift[1]).toFloat()));
}
/* tslint:enable */

/**
 * @param {Point} point
 * @param {Point} vector
 * @param {Arc} arc
 * @param {Number} elapsedMS
 * @param {Boolean} fullCircle whether we should check collision with an arc (default) or with full circle
 * @param {Boolean} isRay whether we should check normal coollision (default) or with a ray starting at point,
 *     in direction of vector
 *
 * @return {[Point, Line] | Boolean} Point of collision and old trajectory line if collision exists, else false
 */
fun checkCollision(point: CollisionPoint, vector: CollisionPoint, arc: Arc, elapsedMS: Double,
                   fullCircle: Boolean = false, isRay: Boolean = false): Array<Any>? {
    val speed = vector.getLength();
    val initialPoint = point.copy();
    val tmpPoint = point.copy();

    val vectorCopy = CollisionPoint(vector.x, vector.y);
    if (!isRay) {
        vectorCopy.mult(elapsedMS.toFloat()).mult(Constant.COLLISION_PRECISION.toFloat());
    } else {
        vectorCopy.mult(1000000F);
    }

    var line = Line.fromPoints(arc.centrate(initialPoint),
            arc.centrate(tmpPoint.apply(vectorCopy.x, vectorCopy.y)), true);

    val intersections = findIntersection(line, arc);

    line = Line.fromPoints(initialPoint, tmpPoint, true);

    if (intersections.isEmpty()) {
        return null;
    }

    val collisions = intersections.filter {
        line.segmentContains(it)!! && (fullCircle || arc.contains(it));
    }

    if (collisions.isEmpty()) {
        return null;
    }

    // There can't be more than 1 collision in our circumstances
    return arrayOf(collisions[0], line);
}

/**
 * @param {Point} point
 * @param {Point} vector
 * @param {Arc} arc
 * @param {Number} elapsedMS
 *
 * @return {[Point, Point] | Boolean} Point of collision and new speed vector if collision exists, else false
 */
fun getReflection(point: CollisionPoint, vector: CollisionPoint, arc: Arc, elapsedMS: Double): Array<CollisionPoint>? {
    val collisionResult = checkCollision(point, vector, arc, elapsedMS) ?: return null;

    val collision: CollisionPoint = collisionResult[0] as CollisionPoint;
    val line: Line = collisionResult[1] as Line;
    val speed = vector.getLength();

    val relativeCollision = arc.centrate(collision);
    val angle = radianLimit(-atan2(relativeCollision.y.toDouble(), relativeCollision.x.toDouble()) + PI / 2);
    var reflectionAngle: Double;

    if (line.isVertical || line.isHorizontal) {
        reflectionAngle = radianLimit(angle + PI);
    } else {
        val tmp = minDist(line.getSlope(), angle)
        val diffAngle = tmp[0];
        val sign = tmp[1];
        // tslint:disable-next-line
        reflectionAngle = radianLimit(angle + PI * sign);
    }

    val resultTrajectory = Line.fromSlopeAndPoint(reflectionAngle, collision);
    return arrayOf(collision, resultTrajectory.getVector(speed.toInt()));
}

fun simpleTest() {
    // let points = [new Point(0, 2), new Point(3, -1), new Point (1, -1)];
    // let points2 = [new Point(1, -2), new Point(1, 2), new Point (3, 0)];

    val points = arrayOf(CollisionPoint(0f, 2f), (CollisionPoint(0f, 5f)), (CollisionPoint(1f, -1f)));
    val points2 = arrayOf(CollisionPoint(-1f, 2f), (CollisionPoint(-0.5f, 3f)), (CollisionPoint(1f, 2f)));

    val arc = Arc.fromPoints(points2[0], points2[1], points2[2]);
    val line = Line.fromPoints(points[0], points[2]);
    println(arc)
    println(line)
    findIntersection(line, arc);
    println(checkCollision(points[0], points[1], arc, 1.0))
}

fun radianLimit(radian: Double): Double {
    if (radian >= 0) {
        if (radian <= PI) {
            return radian;
        }
        return -PI + radian % PI;
    }

    if (radian >= -PI) {
        return radian;
    }
    return PI + radian % PI;
}

fun main(args: Array<String>) {
    simpleTest()
}

fun minDist(radian1: Double, radian2: Double): Array<Double> {
    val sign1 = sign(radian1);
    val sign2 = sign(radian2);
    if (sign(radian1) == sign(radian2)) {
        val diffsign = if (abs(radian2) > abs(radian1)) -1 else 1;
        return arrayOf(abs(radian2 - radian1) % PI, diffsign.toDouble());
    }
    val simpleDiff = abs(radian2 - radian1);
    val reverseDiff = abs(radian1 - sign1 * PI) + abs(radian2 - sign2 * PI);
    if (simpleDiff < reverseDiff) {
        return arrayOf(simpleDiff, sign1);
    }
    return arrayOf(reverseDiff, sign2);
}
