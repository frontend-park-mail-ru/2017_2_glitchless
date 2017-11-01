const PhysicsEntitiy = require('./primitive/PhysicsEntitiy.js');

const basicPlatformSprite ='';
class Platform extends PhysicsEntitiy {
    constructor() {
        super(basicPlatformSprite);
    }
}

module.exports = Platform;