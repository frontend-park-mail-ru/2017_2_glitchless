// const PIXI = require('pixi.js');
const Point = require('./object/primitive/Point.js');

class Circle {
    /**
     * @param {Number} radius Circle radius
     * @param {Point} center Circle center
     *
     * @return {Circle}
     */
    constructor(radius, center = new Point(0, 0)) {
        this.R = radius;
        this.center = center;
    }

    /**
     * @param {Point} point
     *
     * @return {Point} point position relative to the center of circle
     */
    centrate(point) {
        return new Point(point.x - this.center.x, point.y - this.center.y);
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
        } else if (Math.abs(point2.x - point1.x) < Number.EPSILON) {
            console.log('3');
            [point2, point3] = [point3, point2];
        }
        const ma = (point2.y - point1.y) / (point2.x - point1.x);
        const mb = (point3.y - point2.y) / (point3.x - point2.x);
        const centerX = (ma * mb * (point1.y - point3.y) + mb * (point1.x + point2.x) - ma * (point2.x + point3.x))
            / (2 * (mb - ma));
        const centerY = (-centerX + (point1.x + point2.x) / 2) / ma + (point1.y + point2.y) / 2;
        console.log([centerX, centerY]);
        const R = Math.sqrt(Math.pow(centerX - point1.x, 2)) + Math.sqrt(Math.pow(centerY - point1.y, 2));
        return new Circle(R, new Point(centerX, centerY));
    }
}

class Arc extends Circle {
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
    constructor(radius, boundingPoints, center = new Point(0, 0)) {
        super(radius, center);
        this.bound1 = boundingPoints[0];
        this.bound2 = boundingPoints[1];
        this.midPoint = boundingPoints[2];

        //relative coordinates
        const relBound1 = this.centrate(this.bound1);
        const relBound2 = this.centrate(this.bound2);
        const relMidPoint = this.centrate(this.midPoint);

        const angleBound1 = Math.atan2(relBound1.y, relBound1.x);
        const angleBound2 = Math.atan2(relBound2.y, relBound2.x);
        this.angleMidPoint = Math.atan2(relMidPoint.y, relMidPoint.x);

        this.angleBound1 = Math.min(angleBound1, angleBound2);
        this.angleBound2 = Math.max(angleBound1, angleBound2);

        this.reversed = this.angleMidPoint > angleBound1 && this.angleMidPoint < this.angleBound2;
    }

    /**
     * @param {Point} boundingPoint1
     * @param {Point} boundingPoint2
     * @param {Point} midPoint
     *
     * For details on parameters @see {@link Arc#constructor}
     *
     * @return {Arc}
     */
    static fromPoints(boundingPoint1, boundingPoint2, midPoint) {
        const circle = super.fromPoints(boundingPoint1, boundingPoint2, midPoint);
        return Arc.fromCircle(circle, [boundingPoint1, boundingPoint2, midPoint]);
    }

    /**
     * @param {Circle} circle
     * @param {Point[]} boundingPoints
     *
     * For details on parameters @see {@link Arc#constructor}
     *
     * @return {Arc}
     */
    static fromCircle(circle, boundingPoints) {
        return new Arc(circle.R, boundingPoints, circle.center);
    }

    /**
     * @param {Point} point
     *
     * @return {Boolean}
     */
    contains(point) {
        const relPoint = this.centrate(point);
        const anglePoint = Math.atan2(relPoint.y, relPoint.x);
        console.log('agpoint' + anglePoint);
        if (!this.reversed) {
            return this.angleBound1 < anglePoint && this.angleBound2 > anglePoint;
        }
        return this.angleBound2 < anglePoint || this.angleBound1 > anglePoint;
    }
}

class Line {
    /**
     * Creates a line defined by equation Ax + By + C  = 0, where A, B, C are constants, x, y - coordinate variables
     *
     * @param {Number} A Coefficient A of line equation
     * @param {Number} B Coefficient B of line equation
     * @param {Number} C Coefficient C of line equation
     * @param {Boolean} isVector
     *
     * @param {Point[]} bounds Bounds of line segment
     *
     * @return {Line}
     */
    constructor(A, B, C = 0, bounds = [], isVector=false) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.isVertical = false;
        this.isVector = isVector;

        if (bounds.length !== 0 && bounds.length !== 2) {
            throw new Error("Lines must be either non-bounded, or bounded by 2 points");
        }

        if (isVector && bounds.length === 0) {
            throw new Error("Cannot construct non-bounded vectors");
        }

        if (bounds.length > 1) {
            this.setBounds(bounds);
        }

        if (isVector) {
            this.vectorDirectionByY = bounds[1].y > bounds[0].y;
            this.vectorDirectionByX = bounds[1].x > bounds[0].x;
        }
    }

    /**
     * @param {Number} C Coefficient C of equation x=C
     * @param {Point[]} bounds Bounds of line segment
     * @param {Boolean} isVector
     *
     * @return {Line}
     */
    static createVertical(C, bounds = [], isVector=false) {
        const line = new Line(0, 0, C, bounds, isVector);
        line.isVertical = true;
        return line;
    }


    /**
     * @param {Point} point
     *
     * @return {Boolean | undefined} True if point is located inside segment, defined by bounds,
     *   false if it is not, undefined if bounds are not defined
     */
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

    /**
     * @param {Point[]} bounds Bounds of line segment
     * @param {Boolean} isVector
     */
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
     * @param {Boolean} isVector Whether the line
     *
     * @return {Line} Line, passing through point1 and point2
     */
    static fromPoints(point1, point2, isVector=false) {
        if (Math.abs(point2.y - point1.y) < Number.EPSILON) {
            return Line.createVertical(point1.x, [point1, point2], isVector);
        }
        const A = 1;
        const B = (point1.x - point2.x) / (point2.y - point1.y);
        const C = point1.y * (point2.x - point1.x) / (point2.y - point1.y) - point1.x;
        return new Line(A, B, C, [point1, point2], isVector);
    }

    static fromSlopeAndPoint(slope, point, isVector=true) {
        const A = 1;
        const B = -1 / Math.tan(slope);
        const C = -(point.x + B * point.y);
        if (isVector) {
            this.vectorDirectionByY = slope >= -Math.PI / 2 && slope < Math.PI / 2;
            this.vectorDirectionByX = slope >= 0;
        }

        return new Line(A, B, C, [point, new Point(point.x + 1, point.y - B)], isVector);
    }

    getYByX(x) {
        //TODO: add strictly-vertical handling
        return -(this.A  * x + this.C) / this.B;
    }

    getXByY(y) {
        //TODO: add strictly-vertical handling
        return -(this.B  * y + this.C) / this.A;
    }

    /**
     * @return {Number} Angular representation (from -PI to +PI) of line's slope
     */
    getSlope() {
        if (this.vertical) {
            return 0;
        }
        return Math.atan2(-this.A, this.B);
    }

    getPointByDist(dist) {
        return this.getVector(dist)
            .apply(this.bounds[0].x, this.bounds[0].y);
    }

    getVector(length) {
        if (!this.isVector) {
            throw new Error('Ambiguous without direction');
        }
        let point = new Point(this.bounds[1].x - this.bounds[0].x, this.bounds[1].y - this.bounds[0].y);
        point.divide(point.getLength());
        return point.mult(length);
    }
}

// const points = [new Point(1, 0), new Point(3, 2)];
//
// let line = Line.fromPoints(...points, true);
// console.log(line);
// line = Line.fromSlopeAndPoint(line.getSlope(), line.bounds[0]);
// console.log(line);
// console.log(line.getXByY(0));
// console.log(line.getPointByDist());


module.exports = {
    Line,
    Circle,
    Arc
};