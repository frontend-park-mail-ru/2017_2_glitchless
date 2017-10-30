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
}

/**
 * @param {Line} line
 * @param {Circle} circle
 * points return format: Array of 2-element arrays of numbers
 * @return {[Number, points]} Number of intersections and points of intersection
 */
function findIntersection(line, circle) {
    if (line.A !== 1) {
        [line.A, line.B, line.C] = [1, line.B / line.A, line.C / line.A];
    }

    if (circle.y !== 0) {
        line.C = line.C - circle.y;
    }

    if (circle.x !== 0) {
        line.C = line.C + circle.x;
    }

    const endShift = [circle.x, circle.y / line.B];

    const EPS = Number.EPSILON;
    const r = circle.R;
    const [a, b, c] = [line.A, line.B, line.C]; // входные данные

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
        return[2, [[ax + endShift[0], ay + endShift[1]], [bx + endShift[0], by + endShift[1]]]];
    }
}

module.exports = {
    Line,
    Circle,
    findIntersection
};
