// const PIXI = require('pixi.js');

class Circle {
    constructor(radius, shift=[0, 0]) {
        this.R = radius;
        this.x = shift[0];
        this.y = shift[1];
    }

}

class Line {
    constructor(A, B, C=0) {
        this.A = A;
        this.B = B;
        this.C = C;
    }

    isNormalised() {
        return this.A === 1;
    }

    static normalise(line) {
        if (line.A === 1) {
            return line;
        } else {
            return new Line(1, line.B / line.A, line.C / line.A);
        }
    }

    static fromPoints(point1, point2) {
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
 * points return format: Array of 2-element arrays of numbers
 * @return {[Number, points]} Number of intersections and points of intersection
 */
function findIntersection(line, circle) {
    const endShift = [circle.x, circle.y / line.B];

    const EPS = Number.EPSILON;
    const r = circle.R;

    line = Line.normalise(line);

    const [a, b, c] = [line.A, line.B, line.C - circle.y + circle.x];


    // if (circle.y !== 0) {
    //     c -= circle.y;
    // }
    //
    // if (circle.x !== 0) {
    //     c += circle.x;
    // }


    let x0 = -a * c / (a * a + b * b), y0 = -b * c / (a * a + b * b);
    if (c * c > r * r * (a * a + b * b) + EPS) {
        return [0];
    } else if (Math.abs(c * c - r * r * (a * a + b * b)) < EPS) {
        return[1, [[x0 + endShift[0], y0 + endShift[1]]]];
    } else {
        const d = r * r - c * c / (a * a + b * b);
        const mult = Math.sqrt(d / (a * a + b * b));

        const ax = x0 + b * mult;
        const bx = x0 - b * mult;
        const ay = y0 - a * mult;
        const by = y0 + a * mult;
        return[2, [new Point(ax + endShift[0], ay + endShift[1]), new Point(bx + endShift[0], by + endShift[1])]];
    }
}

module.exports = {
    Point,
    Line,
    Circle,
    findIntersection
};
