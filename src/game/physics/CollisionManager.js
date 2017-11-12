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
    const endShift = [circle.center.x, -circle.center.y];
    const r = circle.R;
    const EPS = Number.EPSILON;

    if (line.isVertical) {
        if (Constants.COLLISION_DEBUG) {
            console.log('vertical');
        }
        const x0 = line.C;
        if (circle.R < Math.abs(line.C)) {
            return [];
        }
        if (Math.abs(Math.abs(line.C) - circle.R) < EPS) {
            return [new Point(line.C, circle.center.y)];
        }
        const tmpSqrt = Math.sqrt(r*r - Math.pow((x0), 2));
        const y1 = circle.center.y + tmpSqrt;
        const y2 = circle.center.y - tmpSqrt;
        if (Constants.COLLISION_DEBUG) {
            console.log('tmpSqrt');
            console.log(tmpSqrt);
        }
        return [new Point(x0 + endShift[0], y1), new Point(x0 + endShift[0], y2)];
    }

    if(line.isHorizontal) {
        if (Constants.COLLISION_DEBUG) {
            console.log('horizontal');
        }
        const y0 = -line.C;
        if (circle.R < Math.abs(line.C)) {
            return [];
        }
        if (Math.abs(Math.abs(line.C) - circle.R) < EPS) {
            return [new Point(line.C, circle.center.x)];
        }
        const tmpSqrt = Math.sqrt(r*r - Math.pow((y0), 2));
        const x1 = circle.center.x + tmpSqrt;
        const x2 = circle.center.x - tmpSqrt;
        if (Constants.COLLISION_DEBUG) {
            console.log('tmpSqrt');
            console.log(tmpSqrt);
        }
        return [new Point(x1, y0 - endShift[1]), new Point(x2, y0 - endShift[1])];
    }

    line = Line.normalize(line);
    const [a, b, c] = [line.A, line.B, line.C];

    const x0 = -a * c / (a * a + b * b);
    const y0 = -b * c / (a * a + b * b);
    if (c * c > r * r * (a * a + b * b) + EPS) {
        if (Constants.COLLISION_DEBUG) {
            console.log('case1');
            console.log([a, b, c]);
            console.log(c * c);
            console.log(r * r * (a * a + b * b));
            console.log(line);
        }
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
 * @param {Boolean} fullCircle
 *
 * @return {[Point, Line] | Boolean} Point of collision and old trajectory line if collision exists, else false
 */
function checkCollision(point, vector, arc, elapsedMS, fullCircle=false) {
    const speed = vector.getLength();
    const initialPoint = point.copy();
    const tmpPoint = point.copy();

    const vectorCopy = new Point(vector.x, vector.y);
    vectorCopy.mult(elapsedMS).mult(Constants.COLLISION_PRECISION);

    if (Constants.COLLISION_DEBUG) {
        console.log('collision inputs', point, vector, arc, elapsedMS);
        console.log('vectCopy', vectorCopy);
    }

    let line = Line.fromPoints(arc.centrate(initialPoint), 
                               arc.centrate(tmpPoint.apply(vectorCopy.x, vectorCopy.y)), true);

    const intersections = findIntersection(line, arc);

    line = Line.fromPoints(initialPoint, tmpPoint, true);

    if (Constants.COLLISION_DEBUG) {
        console.log('potential collisions1', intersections);
    }

    if (intersections.length === 0) {
        return null;
    }

    const collisions = intersections.filter(function (intersectionPoint) {
        return line.segmentContains(intersectionPoint) && (fullCircle || arc.contains(intersectionPoint));
    });

    if (collisions.length === 0) {
        return false;
    }

    // There can't be more than 1 collision in our circumstances
    return [collisions[0], line];
}


/**
 * @param {Point} point
 * @param {Point} vector
 * @param {Arc} arc
 * @param {Number} elapsedMS
 *
 * @return {[Point, Point] | Boolean} Point of collision and new speed vector if collision exists, else false
 */
function getReflection(point, vector, arc, elapsedMS) {
    const collisionResult = checkCollision(point, vector, arc, elapsedMS);

    if (!collisionResult) {
        return false;
    }

    const [collision, line] = collisionResult;
    const speed = vector.getLength();

    const relativeCollision = arc.centrate(collision);
    const angle = utils.radianLimit(-Math.atan2(relativeCollision.y, relativeCollision.x) + Math.PI/2);
    let reflectionAngle;

    if (line.isVertical || line.isHorizontal) {
        reflectionAngle = utils.radianLimit(angle + Math.PI);
    } else {
        const [diffAngle, sign] = utils.minDist(line.getSlope(), angle);
        reflectionAngle = utils.radianLimit((angle - diffAngle * sign, angle) + Math.PI * sign);
    }

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

    let points = [new Point(0, 2), new Point(0, 5), new Point (1, -1)];
    let points2 = [new Point(-1, 2), new Point(-0.5,3), new Point (1, 2)];

    const arc = Arc.fromPoints(...points2);
    const line = Line.fromPoints(...points.slice(0,2));
    console.log(arc);
    console.log(line);
    findIntersection(line, arc);
    console.log(checkCollision(points[0], points[1], arc, 1));
}

module.exports = {
    findIntersection,
    checkCollision,
    getReflection,
    simpleTest
};
