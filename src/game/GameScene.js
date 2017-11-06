const PIXI = require('pixi.js');
const GameUtils = require('../utils/GameUtils.js');
const Constant = require('../utils/Constants.js');
const Point = require('./physics/object/primitive/Point.js');

class GameScene {
    constructor() {
        this.field = null;
        this.stage = null;
    }

    displayWinMessage() {
        let basicText = new PIXI.Text('You win!');
        basicText.x = Constant.WINDOW_TEXT_X;
        basicText.y = Constant.WINDOW_TEXT_Y;
        // this.stage.addChild(basicText);
    }

    initBackground(app) {
        let bgSize = {x: this.width, y: this.height};

        const container = new PIXI.Container();

        app.stage.addChild(container);

        PIXI.loader.add("./images/background.png").load(function () {
            let slide = GameUtils
                .setBackground(bgSize,
                    new PIXI.Sprite.fromImage('./images/background.png'),
                    'cover');
            container.addChild(slide);

        });
    }

    /**
     * Scales length from initial to final resolution, without rounding
     *
     * Coordinates / resolution format: [x, y] / [width, height]
     *
     * @param {Number} length Coordinates to scale
     * @param {Number[]} [initialRes=[1920, 1080]] Initial resolution
     * @return {Number} Scaled length
     */
    scaleLength(length, initialRes = Constant.INITIAL_RES) {
        const scale = this.width / initialRes[0];
        return length * scale;
    }

    /**
     * Scales coordinates from initial to final resolution, rounding to the nearest whole number
     *
     * Coordinates / resolution format: [x, y] / [width, height]
     *
     * @param {Number[]} coords Coordinates to scale
     * @param {Number[]} [initialRes=[1920, 1080]] Initial resolution
     * @return {Number[]} Scaled coordinates
     */
    scaleCoords(coords, initialRes = Constant.INITIAL_RES) {
        const x = coords[0];
        const y = coords[1];

        const xScale = this.width / initialRes[0];
        const yScale = this.height / initialRes[1];

        return [Math.round(x * xScale), Math.round(y * yScale)];
    }

    /**
     * Scales coordinates from initial to final resolution, rounding to the nearest whole number
     *
     * Coordinates / resolution format: [x, y] / [width, height]
     *
     * @param {Point} point Coordinates to scale
     * @param {Number[]} [initialRes=[1920, 1080]] Initial resolution
     * @return {Point} Scaled coordinates
     */
    scalePoint(point, initialRes = Constant.INITIAL_RES) {
        const xScale = this.width / initialRes[0];
        const yScale = this.height / initialRes[1];
        return new Point(Math.round(point.x * xScale), Math.round(point.y * yScale));
    }

    /**
     * Adds a new object to scene
     *
     * Coordinates format: [x, y]
     *
     * @param {Sprite} sprite Object's sprite
     * @param {Number[]} coords Coordinates of the object
     * @return {Number[]} Scaled coordinates
     */
    addObject(sprite, coords = [0, 0]) {
        this.stage.addChild(sprite);
    }
}


module.exports = GameScene;