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
        const winText = new PIXI.Sprite.fromImage('./images/game_over_splash_won.png');
        this.prepareCentralText(winText);
        this.addObject(winText);
    }

    prepareCentralText(textSprite) {
        textSprite.anchor.set(0.5);
        const textSize = this.scaleCoords(Constant.GAME_TEXT_SIZE);
        textSprite.width = textSize[0];
        textSprite.height = textSize[1];
        const center = this.getCenterPoint();
        textSprite.x = center.x;
        textSprite.y = center.y;
    }

    initBackground(app) {
        const bgSize = {x: this.width, y: this.height};

        const container = new PIXI.Container();

        app.stage.addChild(container);

        PIXI.loader.add("./images/background.png").load(function () {
            const slide = GameUtils.makeBackgroundCoverWithSprite(
                bgSize, new PIXI.Sprite.fromImage('./images/background.png'), 'cover');
            container.addChild(slide);
        });
    }

    setCoords(sprite, point) {
        const scenePoint = this.scalePoint(point);
        [sprite.x, sprite.y] = [scenePoint.x, scenePoint.y];
    }

    setSize(sprite, coords) {
        const sceneCoords = this.scaleCoords(coords);
        [sprite.width, sprite.height] = sceneCoords;
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
        const scale = this.height / initialRes[1];
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

    getCenterPoint() {
        return new Point(this.width / 2, this.height / 2);
    }

    /**
     * Adds a new object to scene
     *
     * @param {Sprite} sprite Object's sprite
     */
    addObject(sprite) {
        this.stage.addChild(sprite);
    }
}

module.exports = GameScene;
