const PhysicsEntitiy = require('./primitive/PhysicsEntity.js');
const PIXI = require('pixi.js');
const Constants = require('../../../utils/Constants.js');
const Point = require('./primitive/Point.js');


const basicPlatformTexture = PIXI.Texture.fromImage('./images/platform.png');

class Platform extends PhysicsEntitiy {
    constructor(context) {
        const basicPlatformSprite = new PIXI.Sprite(basicPlatformTexture);
        super(basicPlatformSprite, context);
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angel = 0.5;
        const lengthHypotenuse = Constants.GAME_PLATFORM_SIZE[0] / 2;
        const deltaXLeft = lengthHypotenuse * Math.cos(rotation + angel);
        const deltaYLeft = lengthHypotenuse * Math.sin(rotation + angel);
        const deltaXRight = lengthHypotenuse * Math.cos(rotation - angel);
        const deltaYRight = lengthHypotenuse * Math.sin(rotation - angel);

        const pointLeft = new Point(coord.x - deltaXLeft,
            coord.y - deltaYLeft);
        const pointRight = new Point(coord.x + deltaXRight,
            coord.y + deltaYRight);

        return [pointLeft, pointRight];
    }
}

module.exports = Platform;