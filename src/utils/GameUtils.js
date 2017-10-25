class GameUtils {
    /**
     * Scales coordinates from initial to final resolution, rounding to the nearest whole number
     *
     * Coordinates / resolution format: [x, y] / [width, height]
     *
     * @param {Number[]} coords Coordinates to scale
     * @param {Number[]} finalRes Final resolution
     * @param {Number[]} [initialRes=[1920, 1080]] Initial resolution
     * @return {Number[]} Scaled coordinates
     */
    scaleCoords(coords, finalRes, initialRes = [1920, 1080]) {
        const x = coords[0];
        const y = coords[1];

        const xScale = finalRes[0]/initialRes[0];
        const yScale = finalRes[1]/initialRes[1];

        return [Math.round(x * xScale), Math.round(y * yScale)];
    }
}

module.exports = GameUtils;