const PhysicsObject = require('./primitive/PhysicsObject.js');
const PIXI = require('pixi.js');
const Point = require('./primitive/Point.js');

const basicAlienSprite = PIXI.Sprite.fromImage('./images/spacestation.png');

class Alien extends PhysicsObject {
    constructor(context, coords = new Point(0, 0)) {
        super(basicAlienSprite, context, coords);
    }

    onDraw(stage) {
    	super.onDraw(stage);
    	this.sprite.zOrder = 100;
    }
}

module.exports = Alien;