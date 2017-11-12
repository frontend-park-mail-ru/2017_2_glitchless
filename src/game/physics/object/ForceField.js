import PhysicsObject from './primitive/PhysicsObject';

const basicForceFieldTexture = '';
export default class ForceField extends PhysicsObject {
    constructor(context, coords = new Point(0, 0), alignmentCircle) {
        const basicForceFieldSprite = new PIXI.Sprite(basicForceFieldTexture);
        super(basicForceFieldSprite, context, coords);
        this.collisionArc = Arc.fromPoints(...this.getEdgePoints(), this.getCoords());
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angle = 0.15;
        const lengthHypotenuse = Constants.GAME_FORCEFIELD_SIZE[0] / 2;
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

    refreshCollisionArc() {
        this.collisionArc = Arc.fromPoints(...this.getEdgePoints(), this.getCoords());
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
