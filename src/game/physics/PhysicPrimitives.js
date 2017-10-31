// const PIXI = require('pixi.js');

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

    /**
     * @link http://algolist.manual.ru/maths/geom/equation/circle.php
     *
     * @param {Point} point1
     * @param {Point} point2
     * @param {Point} point3
     *
     * @return {Line} Line, passing through point1 and point2
     */
    static fromPoints(point1, point2, point3) {
        //To prevent cases where ma == 0
        if (Math.abs(point2.y - point1.y) < Number.EPSILON) {
            [point3, point2] = [point2, point3];
        }
        //To prevent cases where ma == Infinity or mb == Infinity
        if (Math.abs(point3.x - point2.x) < Number.EPSILON) {
            [point2, point1] = [point1, point2];
        } else if(Math.abs(point2.x - point1.x) < Number.EPSILON) {
            [point2, point3] = [point3, point2];
        }
        const ma = (point2.y - point1.y) / (point2.x - point1.x);
        const mb = (point3.y - point2.y) / (point3.x - point2.x);
        const centerX = (ma * mb * (point1.y - point3.y) + mb * (point1.x + point2.x) + ma * (point2.x + point3.x))
            / (2 * (mb - ma));
        const centerY = (-centerX + (point1.x + point2.x) / 2) / ma + (point1.y + point2.y) / 2;
        // console.log(centerY);
        const R = Math.sqrt(Math.pow(centerX - point1.x, 2)) + Math.sqrt(Math.pow(centerY - point1.y, 2));
        return new Circle(R, new Point(centerX, centerY));
    }
}

class Arc extends Circle {
    constructor(radius, boundingPoints, center=new Point(0,0)) {
        super(radius, center);
        this.bound1 = boundingPoints[0];
        this.bound2 = boundingPoints[1];
    }

    static fromPoints(point1, point2, point3) {
        const circle = super.fromPoints(point1, point2, point3);
        const arc = Arc.fromCircle(circle, [point1, point2]);
        return arc;
    }

    static fromCircle(circle, boundingPoints) {
        return new Arc(circle.R, boundingPoints, circle.center);
    }
}

class Line {
    constructor(A, B, C=0) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.vertical = false;
    }

    static createVertical(C) {
        const line = new Line(0, 0, C);
        line.vertical = true;
        return line;
    }

    isVertical() {
        return this.vertical;
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

    /**
     * @param {Point} point1
     * @param {Point} point2
     *
     * @return {Line} Line, passing through point1 and point2
     */
    static fromPoints(point1, point2) {
        if (Math.abs(point2.y - point1.y) < Number.EPSILON) {
            return new Line(0, 0, point1.y, true);
        }
        const A = 1;
        const B = (point1.x - point2.x) / (point2.y - point1.y);
        const C = point1.y * (point2.x - point1.x) / (point2.y - point1.y) - point1.x;
        return new Line(A, B, C);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * @param {Line} line
 * @param {Circle} circle
 *
 * @return {[Number, Point[]]} Number of intersections and points of intersection
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
            return [0];
        }
        if (Math.abs(Math.abs(circle.center.x - line.C) - circle.R) < EPS) {
            return[1, [new Point(line.C, circle.center.y)]];
        }
        const tmpSqrt = Math.sqrt(r*r - Math.pow((x0 - circle.center.x), 2));
        console.log(tmpSqrt);
        const y1 = circle.center.y + tmpSqrt;
        const y2 = circle.center.y - tmpSqrt;
        return [2, [new Point(x0, y1), new Point(x0,y2)]];
    }

    line = Line.normalize(line);
    const [a, b, c] = [line.A, line.B, line.C - circle.center.y + circle.center.x];

    let x0 = -a * c / (a * a + b * b), y0 = -b * c / (a * a + b * b);
    if (c * c > r * r * (a * a + b * b) + EPS) {
        return [0];
    }
    if (Math.abs(c * c - r * r * (a * a + b * b)) < EPS) {
        return [1, [[x0 + endShift[0], y0 + endShift[1]]]];
    }
    const d = r * r - c * c / (a * a + b * b);
    const mult = Math.sqrt(d / (a * a + b * b));

    const ax = x0 + b * mult;
    const bx = x0 - b * mult;
    const ay = y0 - a * mult;
    const by = y0 + a * mult;
    return [2, [new Point(ax + endShift[0], ay + endShift[1]), new Point(bx + endShift[0], by + endShift[1])]];
}

/**
 * @param {Point[]} lineSegment segment of a line, bounded by 2 points
 * @param {Circle} circle
 *
 * @return {[Number, Point[]]} Number of intersections and points of intersection
 */
function checkCollision(lineSegment, circle) {

}


module.exports = {
    Point,
    Line,
    Circle,
    findIntersection
};
