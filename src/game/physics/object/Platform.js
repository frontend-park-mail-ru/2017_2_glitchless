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
        const lengthHypotenuse = this.sprite.width / 2;
        const deltaX = lengthHypotenuse * Math.cos(rotation);
        const deltaY = lengthHypotenuse * Math.sin(rotation);

        const pointLeft = new Point(coord.x - deltaX,
            coord.y - deltaY);
        const pointRight = new Point(coord.x + deltaX,
            coord.y + deltaY);

        return [pointLeft, pointRight];
    }

    setRotation(rotation) {
        super.setRotation(rotation);
        console.log(this.getEdgePoints());
    }
}

module.exports = Platform;