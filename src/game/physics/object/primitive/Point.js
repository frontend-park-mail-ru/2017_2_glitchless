class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    apply(deltaX, deltaY) {
        this.x += deltaX;
        this.y += deltaY;
        return this;
    }
}

module.exports = Point;