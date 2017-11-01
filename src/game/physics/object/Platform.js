const PhysicsEntitiy = require('./primitive/PhysicsEntitiy.js');
const PIXI = require('pixi.js');

const basicPlatformSprite = PIXI.Sprite.fromImage('./images/platform.png');

class Platform extends PhysicsEntitiy {
    constructor() {
        super(basicPlatformSprite);
    }
}

module.exports = Platform;