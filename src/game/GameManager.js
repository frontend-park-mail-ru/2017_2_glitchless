import * as PIXI from 'pixi.js';
import GameScene from './GameScene';

import PhysicLoop from './physics/PhysicLoop';
import SinglePlayerStrategy from './SinglePlayerStrategy';
import EventBus from '../utils/EventBus';

export default class GameManager {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
        this.scene = new GameScene();
        // this.serviceLocator.eventBus.subscribeOn('Win', this.scene.displayWinMessage.bind(this.scene));
        this.eventBus = new EventBus();
        this.gameStrategy = new SinglePlayerStrategy();
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
        this.gameStrategy.initUI(this.scene);

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
