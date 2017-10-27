const PhysicsObject = require('../../PhysicsObject.js');
const PIXI = require('pixi.js');

const basicAlienSprite = PIXI.Sprite.fromImage('./images/spacestation.png');
class Alien extends PhysicsObject {
    constructor(coords = [0, 0]) {
        super(basicAlienSprite, coords);
    }
}

module.exports = Alien;