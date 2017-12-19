import * as kt from 'kotlinApp';
const Circle = kt.ru.glitchless.game.collision.data.Circle;

import * as PIXI from 'pixi.js';
import PhysicsObject from './primitive/PhysicsObject';
import Point from './primitive/Point';
import Constants from '../../../utils/Constants';

import spacestation_png from '../../../ui/images/spacestation.png';

const basicAlienTexture = PIXI.Texture.fromImage(spacestation_png);

export default class Alien extends PhysicsObject {
    constructor(context, coords = new Point(0, 0)) {
        super(new PIXI.Sprite(basicAlienTexture), context, coords);
        this.collisionCircle = new Circle(Constants.GAME_ALIEN_SIZE[0] / 2, coords.copy());
    }
}
