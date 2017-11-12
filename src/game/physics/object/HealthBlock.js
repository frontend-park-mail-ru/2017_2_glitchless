import PhysicsObject from './primitive/PhysicsObject.js';
import * as PIXI from 'pixi.js';
import Point from './primitive/Point.js';
import Constants from '../../../utils/Constants';
import { Arc } from '../PhysicPrimitives.js';

const basicHealthBlockTexture = PIXI.Texture.fromImage('./images/energy_block.png');

export default class HealthBlock extends PhysicsObject {
    constructor(context, coords = new Point(0, 0)) {
        const basicHealthBlockSprite = new PIXI.Sprite(basicHealthBlockTexture);
        super(basicHealthBlockSprite, context, coords);
        this.collisionCircle = Arc.fromPoints(...this.getEdgePoints(), this.getCoords());
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angle = 0.5;
        const lengthHypotenuse = Constants.GAME_HEALTHBLOCK_SIZE[1] / 2;
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
}
