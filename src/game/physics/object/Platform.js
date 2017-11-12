import * as PIXI from 'pixi.js';
import PhysicsEntitiy from './primitive/PhysicsEntity';
import Constants from '../../../utils/Constants';
import Point from './primitive/Point';


const basicPlatformTexture = PIXI.Texture.fromImage('./images/platform.png');

export default class Platform extends PhysicsEntitiy {
    constructor(context, circle) {
        const basicPlatformSprite = new PIXI.Sprite(basicPlatformTexture);
        super(basicPlatformSprite, context);
        this.circle = circle;
        this.circleLevel = 0;
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angle = 0.5;
        const lengthHypotenuse = Constants.GAME_PLATFORM_SIZE[0] / 2;
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

    getCircle() {
        return this.circle;
    }

    setCircle(circle, context) {
        this.circle = circle;
        this.setRotation(this.getRotation(), context);
    }

    getRotation() {
        return super.getRotation();
    }

    setRotation(rotation, context) {

        super.setRotation(rotation, context);
        const radius = this.circle.radius - Constants.GAME_PLATFORM_SIZE[0] / 4;
        const rotationRadian = rotation / Constants.GAME_ROTATION_COEFFICIENT;
        const deltaX = radius * Math.sin(rotationRadian);
        const deltaY = radius * Math.cos(rotationRadian);

        const tmp = this.circle.getCoords();
        const newPoint = new Point(tmp.x - deltaX, tmp.y + deltaY);
        if (Constants.DEBUG_INPUT_CHECK) {
            if (isNaN(deltaX) || isNaN(deltaY)) {
                throw new TypeError(deltaX, deltaY);
            }
        }
        this.setCoords(newPoint, context);
    }
}
