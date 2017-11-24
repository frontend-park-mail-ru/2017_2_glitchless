import PhysicsObject from './primitive/PhysicsObject.js';
import * as PIXI from 'pixi.js';
import Point from './primitive/Point.js';
import Constants from '../../../utils/Constants';
import { Arc, Circle } from '../PhysicPrimitives.js';
import EventBus from '../../GameEventBus';

const basicHealthBlockTexture = PIXI.Texture.fromImage('./images/energy_block.png');

export default class HealthBlock extends PhysicsObject {
    constructor(context, coords = new Point(0, 0), alignmentCircle, id) {
        const basicHealthBlockSprite = new PIXI.Sprite(basicHealthBlockTexture);
        super(basicHealthBlockSprite, context, coords);
        this.circle = alignmentCircle;
        this.playerNumber = id;
    }

    refreshCollisionArc() {
        this.collisionArc = Arc.fromPoints(...this.getEdgePoints(), this.getCoords());
    }

    onCollision(laser) {
        EventBus.emitEvent('hpblock_hit', [this, laser]);
        this.destroy();
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angle = 0.15;
        const lengthHypotenuse = Constants.GAME_HEALTHBLOCK_SIZE[0] / 2;
        const deltaXLeft = lengthHypotenuse * Math.cos(rotation + angle);
        const deltaYLeft = lengthHypotenuse * Math.sin(rotation + angle);
        const deltaXRight = lengthHypotenuse * Math.cos(rotation - angle);
        const deltaYRight = lengthHypotenuse * Math.sin(rotation - angle);

        const pointLeft = new Point(coord.x - deltaXLeft,
            coord.y - deltaYLeft);
        const pointRight = new Point(coord.x + deltaXRight,
            coord.y + deltaYRight);

        return [pointLeft, pointRight];
    }

    setRotation(rotation, context) {
        super.setRotation(rotation, context);
        const radius = this.circle.R - Constants.GAME_PLATFORM_SIZE[0] / 4;
        const rotationRadian = rotation / Constants.GAME_ROTATION_COEFFICIENT;
        const deltaX = radius * Math.sin(rotationRadian);
        const deltaY = radius * Math.cos(rotationRadian);

        const tmp = this.circle.center;
        const newPoint = new Point(tmp.x - deltaX, tmp.y + deltaY);
        if (Constants.DEBUG_INPUT_CHECK) {
            if (isNaN(deltaX) || isNaN(deltaY)) {
                throw new TypeError(deltaX, deltaY);
            }
        }
        this.setCoords(newPoint, context);
        this.refreshCollisionArc();
    }

}
