import * as kt from 'kotlinApp';
import * as PIXI from 'pixi.js';

import Alien from './physics/object/Alien';
import Platform from './physics/object/Platform';
import HealthBlock from './physics/object/HealthBlock';
import ForceField from './physics/object/ForceField';
import Bounder from './physics/object/Bounder';
import PlatformCircle from './physics/object/PlatformKirkle';

import Constants from '../utils/Constants';
import Point from './physics/object/primitive/Point';

import VisualEffectsManager from './VisualEffectsManager';

import game_over_splash_lost_png from '../ui/images/game_over_splash_lost.png';
import game_over_splash_won_png from '../ui/images/game_over_splash_won.png';

const Circle = kt.ru.glitchless.game.collision.data.Circle;

const loseText = new PIXI.Sprite.fromImage(game_over_splash_lost_png);
const winText = new PIXI.Sprite.fromImage(game_over_splash_won_png);

export default class GameScene {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.field = null;
        this.stage = null;
        this.fontStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
            strokeThickness: 5,
        });
        this.scoreMarginX = 100;
        this.scoreMarginY = 100;
        this.loader = new PIXI.loaders.Loader();
        this.visualEffectsManager = new VisualEffectsManager();
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    displayEndResult(winner) {
        console.log(winner);
        if (winner === 0) {
            this.displayWinMessage();
        } else {
            this.displayLoseMessage();
        }
    }

    displayWinMessage() {
        this.prepareCentralText(winText);
        this.addObject(winText);
    }

    displayLoseMessage() {
        this.prepareCentralText(loseText);
        this.addObject(loseText);
    }

    prepareCentralText(textSprite) {
        textSprite.anchor.set(0.5);
        const textSize = this.scaleCoords(Constants.GAME_TEXT_SIZE);
        textSprite.width = textSize[0];
        textSprite.height = textSize[1];
        const center = this.getCenterPoint();
        textSprite.x = center.x;
        textSprite.y = center.y;
    }

    initContainer() {
        this.container = new PIXI.Container();
        this.visualEffectsManager.initContainer(this.container);
        this.stage.addChild(this.container);
        this.mainScene = this.container;
    }

    initVisualEffectsManager() {
        this.visualEffectsManager.initHealthStatusFunc(() => {
            const player = this.gameManager.gameStrategy.players[0];
            const healthCoef = player.health / 5;
            const shieldCoef = player.shield / player.maxShield;
            return (3 * healthCoef + shieldCoef) / 4;
        });
    }

    initBackground(app) {
        this.initialWidth = this.oldWidth = this.width;
        this.initialHeight = this.oldHeight = this.height;
    }

    tick(dt) {
        this.container.scale.x *= this.height / this.oldHeight;
        this.container.scale.y *= this.width / this.oldWidth;
        this.container.y = (this.renderer.height - this.container.height) / 2;
        this.oldWidth = this.width;
        this.oldHeight = this.height;
        this.visualEffectsManager.tick(dt);
    }

    initField(physicContext) {
        const center = physicContext._getCenterPoint();

        const alien = new Alien(physicContext, center);
        alien.setSpriteSize(Constants.GAME_ALIEN_SIZE, physicContext.gameManager);
        physicContext.spriteStorage.alien = alien;
        physicContext.gameManager.addObject('alien', alien);

        const PlatformCircle1 = new PlatformCircle(physicContext, Constants.GAME_CIRCLE1_RADIUS, center, 0);
        physicContext.gameManager.addObject('circle', PlatformCircle1);
        physicContext.spriteStorage.circle = PlatformCircle1;

        let hpBlockArray = [];

        for (let i = 0; i < Constants.HP_COUNT * 2; i++) {
            const playerNum = i < Constants.HP_COUNT ? 0 : 1;
            const hpblock = new HealthBlock(physicContext,
                new Point(0, 0),
                new Circle(Constants.GAME_HP_CIRCLE_RADIUS, center), playerNum);
            hpblock.setSpriteSize(Constants.GAME_HEALTHBLOCK_SIZE, physicContext.gameManager);
            hpblock.setRotation(i * Constants.FULL_CIRCLE_DEGREES / (Constants.HP_COUNT * 2) +
                Constants.FULL_CIRCLE_DEGREES / (Constants.HP_COUNT * 2) / 2, physicContext);
            hpBlockArray.push(hpblock);
            physicContext.gameManager.addObject('hpblock', hpblock);
        }

        physicContext.spriteStorage.setHpBlockArray(hpBlockArray);
        let fieldArray = [];

        for (let i = 0; i < 2; i++) {
            const forceField = new ForceField(physicContext,
                new Point(center.x + Constants.GAME_CIRCLE1_RADIUS * 1.1, center.y),
                new Circle(Constants.GAME_FORCEFIELD_RADIUS, center), i);
            forceField.setSpriteSize(Constants.GAME_FORCEFIELD_SIZE, physicContext.gameManager);
            forceField.setRotation(90 + i * 180, physicContext);
            const coords = forceField.getCoords();
            forceField.setCoords(new Point(coords.x, coords.y - i), physicContext);
            fieldArray.push(forceField);
            physicContext.gameManager.addObject('forcefield', forceField);
        }

        physicContext.spriteStorage.setFieldArrayBlock(fieldArray);

        for (let i = 0; i < 2; i++) {
            const bounder = new Bounder(physicContext,
                new Point(center.x + Constants.GAME_CIRCLE1_RADIUS * 1.1, center.y),
                new Circle(Constants.GAME_FORCEFIELD_RADIUS, center));
            bounder.setSpriteSize(Constants.GAME_BOUNDER_SIZE, physicContext.gameManager);
            bounder.setRotation(i * 180, physicContext);
            const coords = bounder.getCoords();
            bounder.setCoords(new Point(coords.x, coords.y - i), physicContext);
            physicContext.gameManager.addObject('bounder', bounder);
        }

        for (let i = 0; i < 2; i++) {
            const platform = new Platform(physicContext, PlatformCircle1, i);
            platform.setSpeed(new Point(0, 0));
            platform.setSpriteSize(Constants.GAME_PLATFORM_SIZE, physicContext.gameManager);
            platform.setRotation(90 + i * 180, physicContext);
            physicContext.gameManager.addObject('platform', platform);
            if (i === 0) {
                physicContext.spriteStorage.userPlatform = platform;
            } else {
                physicContext.spriteStorage.enemyPlatform = platform;
            }
        }
    }

    initScores() {
        const score1Display = new PIXI.Text(0, this.fontStyle);
        score1Display.anchor.set(0.5);
        [score1Display.x, score1Display.y] = [this.scaleLength(this.scoreMarginX), this.scaleLength(this.scoreMarginY)];
        const score2Display = new PIXI.Text(0, this.fontStyle);
        score2Display.anchor.set(0.5);
        [score2Display.x, score2Display.y] =
            [this.width - this.scaleLength(this.scoreMarginX), this.scaleLength(this.scoreMarginY)];
        this.addObject(score1Display);
        this.addObject(score2Display);

        this.scoreFields = [score1Display, score2Display];
    }

    setScore(playerNum, score) {
        this.scoreFields[playerNum].text = score;
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
    scaleLength(length, initialRes = Constants.INITIAL_RES) {
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
    scaleCoords(coords, initialRes = Constants.INITIAL_RES) {
        const x = coords[0];
        const y = coords[1];

        const xScale = this.width / initialRes[0];
        const yScale = this.height / initialRes[1];

        return [Math.round(x * xScale), Math.round(y * yScale)];
    }

    scaleStaticCoords(coords, initialRes = Constants.INITIAL_RES) {
        const x = coords[0];
        const y = coords[1];

        const xScale = this.initialWidth / initialRes[0];
        const yScale = this.initialHeight / initialRes[1];

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
    scalePoint(point, initialRes = Constants.INITIAL_RES) {
        const xScale = this.width / initialRes[0];
        const yScale = this.height / initialRes[1];
        return new Point(Math.round(point.x * xScale), Math.round(point.y * yScale));
    }

    scaleStaticPoint(point, initialRes = Constants.INITIAL_RES) {
        const xScale = this.initialWidth / initialRes[0];
        const yScale = this.initialHeight / initialRes[1];
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
        this.mainScene.addChild(sprite);
    }
}
