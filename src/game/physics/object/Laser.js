import * as PIXI from 'pixi.js';
import PhysicsEntity from './primitive/PhysicsEntity';
import utils from '../../../utils/GameUtils';
import * as kt from 'kotlinApp';
const CollisionPoint = kt.ru.glitchless.game.collision.data.CollisionPoint;

import laser_small_png from '../../../ui/images/laser_small.png';

const basicLaserTexture = PIXI.Texture.fromImage(laser_small_png);

export default class Laser extends PhysicsEntity {
    constructor(context) {
        const basicLaserSprite = new PIXI.Sprite(basicLaserTexture);
        super(basicLaserSprite, context);
    }

    onCollision(collision, platform) {
        this.setSpeed(collision[1].copy());
        this.reflected = true;
        this.lastReflectedBy = platform.playerNum;
    }

    setSpeed(speed) {
        super.setSpeed(new CollisionPoint(speed.x, speed.y));
        this.setRotation(utils.degrees(Math.atan2(speed.y, speed.x)));
    }
}
