import * as PIXI from 'pixi.js';
import PhysicsObject from './primitive/PhysicsObject';
import Constants from '../../../utils/Constants';

export default class PlatformKirkle extends PhysicsObject {
    constructor(context, radius, coord, level) {
        super(new PIXI.Graphics(), context);
        this.radius = radius;
        this.setCoords(coord, context);
        this.level = level;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    getRadius() {
        return this.radius;
    }

    setCoords(point, context) {
        super.setCoords(point, context);
        if (this.radius === null) {
            return;
        }
        this.sprite.clear();
        this.sprite.lineStyle(2, Constants.GAME_CIRCLE_COLOR);
        this.sprite.drawCircle(0, 0, context.gameManager.scene.scaleCoords([0, this.radius])[1]);
    }

}
