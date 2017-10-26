const PhysicsObject = require('../PhysicsObject.js');
const PIXI = require('pixi.js');

const basicAlienSprite = PIXI.Sprite.fromImage('./images/spacestation.png');
class Alien extends PhysicsObject {
    constructor(speed) {
        super(basicAlienSprite);
        this.speed = speed;
    }
}