import PhysicsObject from './primitive/PhysicsObject';
import * as PIXI from 'pixi.js';
import Point from './primitive/Point.js';
import Constants from '../../../utils/Constants';
import { Arc, Circle } from '../PhysicPrimitives.js';
import EventBus from '../../GameEventBus';

const cyanForceFieldTexture = PIXI.Texture.fromImage('./images/shield_cyan.png');
const redForceFieldTexture = PIXI.Texture.fromImage('./images/shield_red.png');
const basicForceFieldTextures = [cyanForceFieldTexture, redForceFieldTexture];
export default class ForceField extends PhysicsObject {
    constructor(context, coords = new Point(0, 0), alignmentCircle, id) {
        const basicForceFieldSprite = new PIXI.Sprite(basicForceFieldTextures[id]);
        super(basicForceFieldSprite, context, coords);
        this.playerNumber = id;
        this.circle = alignmentCircle;
        this.collisionArc = Arc.fromPoints(...this.getEdgePoints(), this.getCoords());
        this.off = false;
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angle = 0.79; //empric number
        const lengthHypotenuse = Math.sqrt(Math.pow(Constants.GAME_FORCEFIELD_SIZE[0], 2)
         + Math.pow(Constants.GAME_FORCEFIELD_SIZE[1], 2)) / 2.15; //empiric coefficient

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

    onCollision(collision) {
        EventBus.emitEvent('forcefield_hit', this);
    }

    onChargeEnd() {
        this.off = true;
        this.sprite.alpha = 0;
    }

    onEnable() {
        this.off = false;
        this.sprite.alpha = 1;
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
