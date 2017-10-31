// const PIXI = require('pixi.js');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Circle {
    /**
     * @param {Number} radius Circle radius
     * @param {Point} center Circle center
     *
     * @return {Line} A-normalized equation of @param line
     */
    constructor(radius, center=new Point(0,0)) {
        this.R = radius;
        this.center = center;
    }

    centrate(point) {
        return new Point(point.x - this.center.x, point.y - this.center.y);
    }

    /**
     * @link http://algolist.manual.ru/maths/geom/equation/circle.php
     *
     * @param {Point} point1
     * @param {Point} point2
     * @param {Point} point3
     *
     * @return {Circle} Circle, passing through point1, point2, point3
     */
    static fromPoints(point1, point2, point3) {
        //To prevent cases where ma == 0
        if (Math.abs(point2.y - point1.y) < Number.EPSILON) {
            console.log('1');
            [point3, point2] = [point2, point3];
        }
        //To prevent cases where ma == Infinity or mb == Infinity
        if (Math.abs(point3.x - point2.x) < Number.EPSILON) {
            console.log('2');
            [point2, point1] = [point1, point2];
        } else if(Math.abs(point2.x - point1.x) < Number.EPSILON) {
            console.log('3');
            [point2, point3] = [point3, point2];
        }
        const ma = (point2.y - point1.y) / (point2.x - point1.x);
        const mb = (point3.y - point2.y) / (point3.x - point2.x);
        const centerX = (ma * mb * (point1.y - point3.y) + mb * (point1.x + point2.x) - ma * (point2.x + point3.x))
            / (2 * (mb - ma));
        const centerY = (-centerX + (point1.x + point2.x) / 2) / ma + (point1.y + point2.y) / 2;
        console.log([centerX,centerY]);
        const R = Math.sqrt(Math.pow(centerX - point1.x, 2)) + Math.sqrt(Math.pow(centerY - point1.y, 2));
        return new Circle(R, new Point(centerX, centerY));
    }
}

class Arc extends Circle {
    constructor(radius, boundingPoints, center=new Point(0,0)) {
        super(radius, center);
        this.bound1 = boundingPoints[0];
        this.bound2 = boundingPoints[1];

        //relative coordinates
        const bound1X = this.bound1.x - center.x;
        const bound1Y = this.bound1.y - center.y;
        const bound2X = this.bound2.x - center.x;
        const bound2Y = this.bound2.y - center.y;

        const angleBound1 = Math.atan2(bound1Y, bound1X);
        const angleBound2 = Math.atan2(bound2Y, bound2X);

        this.angleBound1 = Math.min(angleBound1, angleBound2);
        this.angleBound2 = Math.max(angleBound1, angleBound2);
    }

    static fromPoints(point1, point2, point3) {
        const circle = super.fromPoints(point1, point2, point3);
        const arc = Arc.fromCircle(circle, [point1, point2]);
        return arc;
    }

    static fromCircle(circle, boundingPoints) {
        return new Arc(circle.R, boundingPoints, circle.center);
    }

    contains(point) {
        const relPoint = this.centrate(point);
        const anglePoint = Math.atan2(relPoint.y, relPoint.x);
        console.log('agpoint' + anglePoint);
        return this.angleBound1 < anglePoint && this.angleBound2 > anglePoint;
    }
}

class Line {
    constructor(A, B, C=0, bounds=[]) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.vertical = false;
        if (bounds.length > 0) {
            this.setBounds(bounds);
        }
    }

    static createVertical(C, bounds) {
        const line = new Line(0, 0, C, bounds);
        line.vertical = true;
        return line;
    }

    isVertical() {
        return this.vertical;
    }

    segmentContains(point) {
        if (!this.bounds) {
            return;
        }
        const sb = this.sortedBounds;
        return point.x >= sb[0][0] && point.x <= sb[1][0] && point.y >= sb[0][1] && point.y <= sb[1][1];
    }

    /**
     * @return {Boolean} true if Line equation is A-normalized, else false
     */
    isNormalized() {
        return this.A === 1;
    }

    /**
     * @param {Line} line
     *
     * @return {Boolean|Line} A-normalized equation of @param line if line is not vertical, else false
     */
    static normalize(line) {
        if (line.vertical) {
            return false;
        }
        if (line.isNormalized()) {
            return line;
        }
        return new Line(1, line.B / line.A, line.C / line.A);
    }

    setBounds(bounds) {
        this.bounds = bounds;

        const minX = Math.min(bounds[0].x, bounds[1].x);
        const maxX = Math.max(bounds[0].x, bounds[1].x);

        const minY = Math.min(bounds[0].y, bounds[1].y);
        const maxY = Math.max(bounds[0].y, bounds[1].y);

        this.sortedBounds = [[minX, minY], [maxX, maxY]];
    }

    /**
     * @param {Point} point1
     * @param {Point} point2
     *
     * @return {Line} Line, passing through point1 and point2
     */
    static fromPoints(point1, point2) {
        if (Math.abs(point2.y - point1.y) < Number.EPSILON) {
            return Line.createVertical(point1.x);
        }
        const A = 1;
        const B = (point1.x - point2.x) / (point2.y - point1.y);
        const C = point1.y * (point2.x - point1.x) / (point2.y - point1.y) - point1.x;
        return new Line(A, B, C, [point1, point2]);
    }

    getRadian() {
        if (this.vertical) {
            return Math.PI / 2;
        }
        return Math.atan2(-this.A, this.B);
    }
}

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

    if (line.isVertical()) {
        console.log('vertical');
        const x0 = line.C;
        console.log(circle.center.x - line.C);
        if (circle.R < Math.abs(circle.center.x - line.C)){
            return [];
        }
        if (Math.abs(Math.abs(circle.center.x - line.C) - circle.R) < EPS) {
            return [new Point(line.C, circle.center.y)];
        }
        const tmpSqrt = Math.sqrt(r*r - Math.pow((x0 - circle.center.x), 2));
        console.log(tmpSqrt);
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
        return [x0 + endShift[0], y0 + endShift[1]];
    }
    const d = r * r - c * c / (a * a + b * b);
    const mult = Math.sqrt(d / (a * a + b * b));

    const ax = x0 + b * mult;
    const bx = x0 - b * mult;
    const ay = y0 - a * mult;
    const by = y0 + a * mult;
    return [new Point(ax + endShift[0], ay + endShift[1]), new Point(bx + endShift[0], by + endShift[1])];
}

/**
 * @param {Point[]} lineSegmentPoints 2 points defining a line segment
 * @param {Arc} arc
 *
 * @return {Point[] | Boolean} Point of collision, if it exists, else false
 */
function checkCollision(lineSegmentPoints, arc) {
    const line = Line.fromPoints(...lineSegmentPoints);

    const intersections = findIntersection(line, arc);
    if (intersections.length === 0) {
        return null;
    }
    const collisions = intersections.map(function (intersectionPoint) {
        if (!line.segmentContains(intersectionPoint)) {
            console.log(line);
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
    console.log(line.getRadian());

    const relativeCollision = arc.centrate(collision);
    const angle = Math.atan2(relativeCollision.y, relativeCollision.x);

    const reflectionAngle = angle + (angle - line.getRadian());//TODO: check whether this is right
    return [collision, reflectionAngle];
}

// let points = [new Point(0, 2), new Point(3, -1), new Point (1, -1)];
// let points2 = [new Point(1, -2), new Point(1, 2), new Point (3, 0)];
// const arc = Arc.fromPoints(...points2);
// const line = Line.fromPoints(...points.slice(0,2));

// console.log(arc);
// console.log(line);
// console.log(findIntersection(line, arc));
// console.log(checkCollision(points.slice(0,2), arc));

module.exports = {
    Point,
    Line,
    Circle,
    findIntersection
};
