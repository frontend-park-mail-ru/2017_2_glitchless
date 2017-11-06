const PIXI = require('pixi.js');
const GameScene = require('./GameScene.js');

const PhysicLoop = require('./physics/PhysicLoop.js');

class GameManager {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
        this.scene = new GameScene();
        this.serviceLocator.eventBus.subscribeOn('Win', this.scene.displayWinMessage.bind(this.scene));
    }

    /**
     * @param {Element} field The field in which the game will be rendered.
     */
    setGameField(field) {
        this.scene.field = field;
    }

    /**
     * @param {Number[]} resolution Resolution in which the game will be rendered.
     */
    setResolution(resolution) {
        this.scene.width = resolution[0];
        this.scene.height = resolution[1];
    }

    initiateGame() {
        this.app = new PIXI.Application(this.scene.width, this.scene.height, {backgroundColor: 0xFFFFFF});
        this.scene.field.appendChild(this.app.view);
        this.scene.stage = this.app.stage;

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        this.scene.initBackground(this.app);

        //setTimeout(EventBus.emitEvent.bind(EventBus, 'Win'), 500);
        this.loopObj = new PhysicLoop(this);
        this.loopObj.initTick(this);
    }

    destroy() {
        this.app.destroy(true);
    }

    addObject(tag, physicObject) {
        this.loopObj.addObjectToPhysic(tag, physicObject);
        physicObject.onDraw(this.app.stage);
        physicObject.subscribeToDestroy((item) => {
            item.onDestroy();
        });
    }
}

module.exports = GameManager;