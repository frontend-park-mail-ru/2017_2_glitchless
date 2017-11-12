export default class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Point(this.x, this.y);
    }

    /**
     * Moves the point by given shift coordinates
     * @param {Number} deltaX
     * @param {Number} deltaY
     *
     * @return {Point}
     */
    apply(deltaX, deltaY) {
        this.x += deltaX;
        this.y += deltaY;
        return this;
    }

    /**
     * Multiplies the point coordinates by multiplier
     * @param {Number} multiplier
     *
     * @return {Point}
     */
    mult(multiplier) {
        this.x *= multiplier;
        this.y *= multiplier;
        return this;
    }

    /**
     * Divides the point coordinates by divider
     * @param {Number} divider
     *
     * @return {Point}
     */
    divide(divider) {
        this.x /= divider;
        this.y /= divider;
        return this;
    }

    /**
     * Returns the length of a vector represented by a point
     *
     * @return {Point}
     */
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
