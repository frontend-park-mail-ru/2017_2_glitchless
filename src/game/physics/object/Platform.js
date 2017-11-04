const PhysicsEntitiy = require('./primitive/PhysicsEntity.js');
const PIXI = require('pixi.js');
const Constants = require('../../../utils/Constants.js');
const Point = require('./primitive/Point.js');


const basicPlatformSprite = PIXI.Sprite.fromImage('./images/platform.png');

class Platform extends PhysicsEntitiy {
    constructor() {
        super(basicPlatformSprite);
    }

    getEdgePoints() {
        const coord = this.getCoords();
        const rotation = this.sprite.rotation;
        const angel = 0.5;
        const lengthHypotenuse = this.sprite.width / 2;
        const deltaXLeft = lengthHypotenuse * Math.cos(rotation + angel);
        const deltaYLeft = lengthHypotenuse * Math.sin(rotation + angel);
        const deltaXRight = lengthHypotenuse * Math.cos(rotation);
        const deltaYRight = lengthHypotenuse * Math.sin(rotation);

        const pointLeft = new Point(coord.x - deltaXLeft,
            coord.y - deltaYLeft);
        const pointRight = new Point(coord.x + deltaXRight,
            coord.y + deltaYRight);

        return [pointLeft, pointRight];
    }

    setRotation(rotation) {
        super.setRotation(rotation);
        console.log(this.getEdgePoints());
    }
}

module.exports = Platform;