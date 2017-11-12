import * as PIXI from 'pixi.js';
import PhysicsObject from './primitive/PhysicsObject';
import Point from './primitive/Point';
import Constants from '../../../utils/Constants';
import { Circle } from '../PhysicPrimitives';

const basicAlienSprite = PIXI.Sprite.fromImage('./images/spacestation.png');

export default class Alien extends PhysicsObject {
    constructor(context, coords = new Point(0, 0)) {
        super(basicAlienSprite, context, coords);
        this.collisionCircle = new Circle(Constants.GAME_ALIEN_SIZE[0] / 2, coords.copy());
    }

    onDraw(stage) {
        super.onDraw(stage);
    }
}
