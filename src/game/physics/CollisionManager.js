const primitives = require('./PhysicPrimitives.js');
const Point = require('./object/primitive/Point.js');
const Constants = require('../../utils/Constants.js');
const utils = require('../../utils/GameUtils.js');

const Line = primitives.Line;
const Circle = primitives.Circle;
const Arc = primitives.Arc;

/**
 * @param {Line} line
 * @param {Circle} circle
 *
 * @return {Point[]} Points of intersection
 */
function findIntersection(line, circle) {
    const endShift = [circle.center.x, circle.center.y / line.B];
    const r = circle.R;
    const EPS = Number.EPSILON;

    if (line.isVertical) {
        const x0 = line.C;
        if (circle.R < Math.abs(circle.center.x - line.C)){
            return [];
        }
        if (Math.abs(Math.abs(circle.center.x - line.C) - circle.R) < EPS) {
            return [new Point(line.C, circle.center.y)];
        }
        const tmpSqrt = Math.sqrt(r*r - Math.pow((x0 - circle.center.x), 2));
        const y1 = circle.center.y + tmpSqrt;
        const y2 = circle.center.y - tmpSqrt;
        return [new Point(x0, y1), new Point(x0,y2)];
    }

    line = Line.normalize(line);
    const [a, b, c] = [line.A, line.B, line.C - circle.center.y + circle.center.x];

    let x0 = -a * c / (a * a + b * b), y0 = -b * c / (a * a + b * b);
    if (c * c > r * r * (a * a + b * b) + EPS) {
        return [];
    }
    if (Math.abs(c * c - r * r * (a * a + b * b)) < EPS) {
        return [x0 + endShift[0], y0 - endShift[1]];
    }
    const d = r * r - c * c / (a * a + b * b);
    const mult = Math.sqrt(d / (a * a + b * b));

    const ax = x0 + b * mult;
    const bx = x0 - b * mult;
    const ay = y0 - a * mult;
    const by = y0 + a * mult;
    return [new Point(ax + endShift[0], ay - endShift[1]), new Point(bx + endShift[0], by - endShift[1])];
}

/**
 * @param {Point} point
 * @param {Point} vector
 * @param {Arc} arc
 * @param {Number} elapsedMS
 *
 * @return {[Point, Point] | Boolean} Point of collision and new speed vector if collision exists, else false
 */
function checkCollision(point, vector, arc, elapsedMS) {
    const speed = vector.getLength();
    const initialPoint = point.copy();
    const tmpPoint = point.copy();

    const vectorCopy = new Point(vector.x, vector.y);
    vectorCopy.mult(elapsedMS);

    const line = Line.fromPoints(initialPoint, tmpPoint.apply(vectorCopy.x, vectorCopy.y), true);

    const intersections = findIntersection(line, arc);

    if (intersections.length === 0) {
        return null;
    }
    const collisions = intersections.map(function (intersectionPoint) {
        if (!line.segmentContains(intersectionPoint)) {
            return;
        }
        if (!arc.contains(intersectionPoint)) {
            return;
        }
        return intersectionPoint;
    });

    const collision = collisions.filter(Boolean)[0]; // There can't be more than 1 collision in our circumstances

    if (!collision) {
        return false;
    }

    const relativeCollision = arc.centrate(collision);
    const angle = utils.radianLimit(-Math.atan2(relativeCollision.y, relativeCollision.x) + Math.PI/2);
    const reflectionAngle = utils.radianLimit((angle - utils.minDist(line.getSlope(), angle)) + Math.PI);
    const resultTrajectory = Line.fromSlopeAndPoint(reflectionAngle, collision);
    if (Constants.COLLISION_DEBUG) {
        console.log('inittraj');
        console.log(line.getSlope());
        console.log(line);
        console.log('angle ' + angle);
        console.log('restraj');
        console.log(resultTrajectory);

        console.log('angle ' + angle);
        console.log('slope ' + line.getSlope());
        console.log(reflectionAngle);
        console.log(utils.minDist(line.getSlope(), angle));
    }

    return [collision, resultTrajectory.getVector(speed)];
}


function simpleTest() {
    // let points = [new Point(0, 2), new Point(3, -1), new Point (1, -1)];
    // let points2 = [new Point(1, -2), new Point(1, 2), new Point (3, 0)];

    let points = [new Point(Math.random(), 2), new Point(3, Math.random()), new Point (1, -1)];
    let points2 = [new Point(1, Math.random()), new Point(Math.random(), 2), new Point (3, 0)];

    const arc = Arc.fromPoints(...points2);
    const line = Line.fromPoints(...points.slice(0,2));
    //
    // console.log(arc);
    // console.log(line);
    // findIntersection(line, arc);
    checkCollision(points[0], new Point(3, -3), arc, 1);
}

module.exports = {
    findIntersection,
    checkCollision,
    simpleTest
};