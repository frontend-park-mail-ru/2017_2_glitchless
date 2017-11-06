const PhysicsObject = require('./primitive/PhysicsObject.js');
const PIXI = require('pixi.js');
const Constants = require('../../../utils/Constants.js');

const circleSprite = new PIXI.Graphics();

class PlatformKirkle extends PhysicsObject {
    constructor(context, radius, coord) {
        super(circleSprite, context);
        this.radius = radius;
        this.setCoords(coord, context);
    }

    setRadius(radius) {
        this.radius = radius;
    }

    getRadius() {
        return this.radius;
    }

    setCoords(point, context) {
        super.setCoords(point, context);
        if (this.radius === null) {
            return;
        }
        circleSprite.clear();
        circleSprite.lineStyle(2, Constants.GAME_CIRCLE_COLOR);
        circleSprite.drawCircle(0, 0, context.gameManager.scene.scaleCoords([0, this.radius])[1]);
    }

}

module.exports = PlatformKirkle;