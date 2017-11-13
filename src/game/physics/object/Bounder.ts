import * as PIXI from 'pixi.js';
import Constants from '../../../utils/Constants';
import { Circle } from '../PhysicPrimitives.js';
import PhysicsObject from './primitive/PhysicsObject.js';
import Point from './primitive/Point.js';

const basicBounderTexture = PIXI.Texture.fromImage('./images/bounder.png');

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
