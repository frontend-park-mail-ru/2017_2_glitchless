import * as PIXI from 'pixi.js';
import PhysicsEntity from './primitive/PhysicsEntity';
import Constants from '../../../utils/Constants';
import utils from '../../../utils/GameUtils';

const basicLaserTexture = PIXI.Texture.fromImage('./images/laser_small.png');

export default class Laser extends PhysicsEntity {
    constructor(speed, context) {
        const basicLaserSprite = new PIXI.Sprite(basicLaserTexture);
        super(basicLaserSprite, context);
        this.setSpeed(speed);
    }

    onCollision(collision, platform) {
        this.setSpeed(collision[1].copy());
        this.reflected = true;
        this.lastReflectedBy = platform.playerNum;
    }

    setSpeed(speed) {
        super.setSpeed(speed);
        this.setRotation(utils.degrees(Math.atan2(speed.y, speed.x)));
    }
}
