const ButtonHandler = require('../helpers/ButtonHandler.js');
const Constants = require('../../../utils/Constants.js');

class PhysicVectorLoop {
    constructor() {
        this.leftButton = new ButtonHandler(Constants.CONTROL_PLATFORM_LEFT);
        this.upButton = new ButtonHandler(Constants.CONTROL_PLATFORM_UP);
        this.qButton = new ButtonHandler(Constants.CONTROL_PLATFORM_Q);
        this.eButton = new ButtonHandler(Constants.CONTROL_PLATFORM_E);
        this.rightButton = new ButtonHandler(Constants.CONTROL_PLATFORM_RIGHT);
        this.downButton = new ButtonHandler(Constants.CONTROL_PLATFORM_DOWN);
    }

    processPhysicLoop(context, elapsedMS) {
        this._processPlatformLogic(context.spriteStorage.userPlatform);
    }

    _processPlatformLogic(platform) {
        if (this.leftButton.isDown || this.upButton.isDown || this.qButton.isDown) {
            platform.setRotationSpeed(Constants.GAME_PLATFORM_CONTROL_SPEED);
        } else if (this.rightButton.isDown || this.downButton.isDown || this.eButton.isDown) {
            platform.setRotationSpeed(-Constants.GAME_PLATFORM_CONTROL_SPEED);
        } else {
            platform.setRotationSpeed(0);
        }
    }
}


module.exports = PhysicVectorLoop;