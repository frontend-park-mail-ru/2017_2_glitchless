const PhysicsObject = require('./primitive/PhysicsObject.js');
const PIXI = require('pixi.js');
const Point = require('./primitive/Point.js');
const Constants = require('../../../utils/Constants.js');
const primitives = require('../PhysicPrimitives.js');
const Arc = primitives.Arc;

// const basicHealthBlockTexture = PIXI.Texture.fromImage('./images/HPblock.png');

class HealthBlock extends PhysicsObject {
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