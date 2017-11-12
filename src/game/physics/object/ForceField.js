import PhysicsObject from './primitive/PhysicsObject';

const basicForceFieldTexture ='';
export default class ForceField extends PhysicsObject {
    constructor(context, coords = new Point(0, 0)) {
		const basicForceFieldSprite = new PIXI.Sprite(basicForceFieldTexture);
        super(basicForceFieldSprite, context, coords);
        this.collisionCircle = Arc.fromPoints(...this.getEdgePoints(), this.getCoords());
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angle = 0.5;
        const lengthHypotenuse = Constants.GAME_FORCEFIELD_SIZE[1] / 2;
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
