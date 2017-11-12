const PhysicsObject = require('./primitive/PhysicsObject.js');
const PIXI = require('pixi.js');
const Point = require('./primitive/Point.js');
const Constants = require('../../../utils/Constants.js');
const primitives = require('../PhysicPrimitives.js');
const Circle = primitives.Circle;

const basicAlienSprite = PIXI.Sprite.fromImage('./images/spacestation.png');

class Alien extends PhysicsObject {
    constructor(context, coords = new Point(0, 0)) {
        super(basicAlienSprite, context, coords);
        this.collisionCircle = new Circle(Constants.GAME_ALIEN_SIZE[0] / 2, coords.copy());
    }
}

module.exports = Alien;