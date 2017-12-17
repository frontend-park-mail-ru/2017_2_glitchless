import * as PIXI from 'pixi.js';
import PhysicsEntitiy from './primitive/PhysicsEntity';
import Constants from '../../../utils/Constants';
import Point from './primitive/Point';

import platform_png from '../../../ui/images/platform.png';
import {Direction} from './Direction';

const basicPlatformTexture = PIXI.Texture.fromImage(platform_png);

export default class Platform extends PhysicsEntitiy {
    constructor(context, circle, playerNum) {
        const basicPlatformSprite = new PIXI.Sprite(basicPlatformTexture);
        super(basicPlatformSprite, context);
        this.circle = circle;
        this.direction = 0;
        this.playerNum = playerNum;
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
        const centralX = coord.x - (lengthHypotenuse / 4) * Math.sin(rotation);
        const centralY = coord.y + (lengthHypotenuse / 4) * Math.cos(rotation);

        const pointLeft = new Point(centralX - deltaXLeft,
            centralY - deltaYLeft);
        const pointRight = new Point(centralX + deltaXRight,
            centralY + deltaYRight);
        const pointCentral = new Point(centralX, centralY);

        return [pointLeft, pointRight, pointCentral];
    }

    getCircle() {
        return this.circle;
    }

    setCircle(circle, context) {
        this.circle = circle;
        this.setRotation(this.getRotation(), context);
    }

    setMoveDirection(direction) {
        if (direction === Direction.RIGHT) {
            this.direction = -1;
            return;
        }
        if (direction === Direction.LEFT) {
            this.direction = +1;
            return;
        }
        if (direction === Direction.NONE) {
            this.direction = 0;
            return;
        }
        throw new TypeError(direction);
    }

    getDirection() {
        return this.direction;
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
