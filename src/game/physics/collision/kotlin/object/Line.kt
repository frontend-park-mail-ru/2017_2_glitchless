package ru.glitchless.game.collision.`object`
import kotlin.js.Math;
import ru.glitchless.game.collision.utils.Constant

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
class Line(val A: Double,
           val B: Double,
           val C: Double = 0.0,
           private var bounds: Array<CollisionPoint> = arrayOf(),
           private val isVector: Boolean = false,
           private val nocheck: Boolean = false
) {
    private var vectorDirectionByY: Boolean = false;
    private var vectorDirectionByX: Boolean = false;
    private lateinit var sortedBounds: Array<Array<Float>>;
    public var isVertical: Boolean = false;
    public var isHorizontal: Boolean = false;

    init {
        if (bounds.isNotEmpty() && bounds.size != 2) {
            throw RuntimeException("Lines must be either non-bounded, or bounded by 2 points");
        }

        if (isVector && bounds.isEmpty()) {
            throw RuntimeException("Cannot construct non-bounded vectors");
        }

        setBounds(bounds);

        if (isVector && !nocheck) {
            this.vectorDirectionByY = bounds[1].y > bounds[0].y;
            this.vectorDirectionByX = bounds[1].x > bounds[0].x;
        }
    }


    /**
     * @param {Point} point
     *
     * @return {Boolean | undefined} True if point is located inside segment, defined by bounds,
     *   false if it is not, undefined if bounds are not defined
     */
    fun segmentContains(point: CollisionPoint): Boolean? {
        if (this.bounds.isEmpty()) {
            return null;
        }
        val sb = this.sortedBounds;
        return point.x >= sb[0][0] && point.x <= sb[1][0] && point.y >= sb[0][1] && point.y <= sb[1][1];
    }

    /**
     * @return {Boolean} true if Line equation is A-normalized, else false
     */
    fun isNormalized(): Boolean {
        return this.A == 1.0;
    }


    /**
     * @param {Point[]} bounds Bounds of line segment
     * @param {Boolean} isVector
     */
    fun setBounds(bounds: Array<CollisionPoint>) {
        this.bounds = bounds;

        val minX = Math.min(bounds[0].x, bounds[1].x);
        val maxX = Math.max(bounds[0].x, bounds[1].x);

        val minY = Math.min(bounds[0].y, bounds[1].y);
        val maxY = Math.max(bounds[0].y, bounds[1].y);

        this.sortedBounds = arrayOf(arrayOf(minX, minY),
                arrayOf(maxX, maxY));
    }

    fun getYByX(x: Float): Double {
        //TODO: add strictly-vertical handling
        return -(this.A * x + this.C) / this.B;
    }

    fun getXByY(y: Float): Double {
        //TODO: add strictly-vertical handling
        return -(this.B * y + this.C) / this.A;
    }

    /**
     * @return {Number} Angular representation (from -PI to +PI) of line's slope
     */
    fun getSlope(): Double {
        if (this.isVertical) {
            return 0.0;
        }
        return Math.atan2(-this.A, this.B);
    }

    fun getPointByDist(dist: Int): CollisionPoint {
        return this.getVector(dist)
                .apply(this.bounds[0].x, this.bounds[0].y);
    }

    fun getVector(length: Int): CollisionPoint {
        if (!this.isVector) {
            throw RuntimeException("Ambiguous without direction");
        }
        val point = CollisionPoint(this.bounds[1].x - this.bounds[0].x, this.bounds[1].y - this.bounds[0].y);
        point.divide(point.getLength());
        return point.mult(length.toFloat());
    }

    companion object {
        /**
         * @param {Number} C Coefficient C of equation x=C
         * @param {Point[]} bounds Bounds of line segment
         * @param {Boolean} isVector
         *
         * @return {Line}
         */
        fun createVertical(C: Double, bounds: Array<CollisionPoint> = arrayOf(), isVector: Boolean = false): Line {
            val line = Line(0.0, 0.0, C, bounds, isVector);
            line.isVertical = true;
            return line;
        }

        /**
         * @param {Number} C Coefficient C of equation y=C
         * @param {Point[]} bounds Bounds of line segment
         * @param {Boolean} isVector
         *
         * @return {Line}
         */
        fun createHorizontal(C: Double, bounds: Array<CollisionPoint>, isVector: Boolean = false): Line {
            val line = Line(0.0, 0.0, C, bounds, isVector);
            line.isHorizontal = true;
            return line;
        }

        /**
         * @param {Line} line
         *
         * @return {Boolean|Line} A-normalized equation of @param line if line is not vertical, else false
         */
        fun normalize(line: Line): Line? {
            if (line.isVertical) {
                return null;
            }
            if (line.isNormalized()) {
                return line;
            }
            return Line(1.0, line.B / line.A, line.C / line.A);
        }

        /**
         * @param {Point} point1
         * @param {Point} point2
         * @param {Boolean} isVector Whether the line
         *
         * @return {Line} Line, passing through point1 and point2
         */
        fun fromPoints(point1: CollisionPoint, point2: CollisionPoint, isVector: Boolean = false): Line {
            if (Math.abs(point2.x - point1.x) < Constant.EPSILON * Constant.FLOAT_PRECISION) {
                return Line.createVertical(point1.x.toDouble(), arrayOf(point1, point2), isVector);
            }

            if (Math.abs(point2.y - point1.y) < Constant.EPSILON * Constant.FLOAT_PRECISION) {
                return Line.createHorizontal((-point1.y).toDouble(), arrayOf(point1, point2), isVector);
            }

            val A = 1;
            val B = (point1.x - point2.x) / (point2.y - point1.y);
            val C = point1.y * (point2.x - point1.x) / (point2.y - point1.y) - point1.x;
            return Line(A.toDouble(), B.toDouble(), C.toDouble(), arrayOf(point1, point2), isVector);
        }

        fun fromSlopeAndPoint(slope: Double, point: CollisionPoint, isVector: Boolean = true): Line {
            val A = 1.0;
            val B = -1 / Math.tan(slope);
            val C = -(point.x + B * point.y);
            var vectorDirectionByX: Boolean = false;
            var vectorDirectionByY: Boolean = false;

            if (isVector) {
                vectorDirectionByX = slope >= 0;
                vectorDirectionByY = slope >= -Math.PI / 2 && slope < Math.PI / 2;
            }

            var incrementX: Int;
            if (vectorDirectionByX) {
                incrementX = 1;
            } else {
                incrementX = -1;
            }

            return Line(A, B, C, arrayOf(point, CollisionPoint(point.x + incrementX, (point.y - B * incrementX).toFloat())), isVector);
        }
    }
}