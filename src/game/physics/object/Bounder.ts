import ktRequire from '../../../ktRequire';
const Circle = ktRequire('ru.glitchless.game.collision.data.Circle');

import * as PIXI from 'pixi.js';
import Constants from '../../../utils/Constants';
import PhysicsObject from './primitive/PhysicsObject';
import Point from './primitive/Point.js';

import * as bounder_png from '../../../ui/images/bounder.png';

const basicBounderTexture = PIXI.Texture.fromImage(bounder_png);

export default class Bounder extends PhysicsObject {
    public circle: Circle;

    constructor(context, coords = new Point(0, 0), alignmentCircle) {
        const basicBounderSprite = new PIXI.Sprite(basicBounderTexture);
        super(basicBounderSprite, context, coords);
        this.circle = alignmentCircle;
    }

    public setRotation(rotation, context) {
        super.setRotation(rotation, context);
        const radius = this.circle.R - Constants.GAME_PLATFORM_SIZE[0] / 4;
        const rotationRadian = rotation / Constants.GAME_ROTATION_COEFFICIENT;
        const deltaX = radius * Math.sin(rotationRadian);
        const deltaY = radius * Math.cos(rotationRadian);

        const tmp = this.circle.center;
        const newPoint = new Point(tmp.x - deltaX, tmp.y + deltaY);
        if (Constants.DEBUG_INPUT_CHECK) {
            if (isNaN(deltaX) || isNaN(deltaY)) {
                throw new TypeError();
            }
        }
        super.setCoords(newPoint, context);
    }

}
