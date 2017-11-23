import * as PIXI from 'pixi.js';
import GameScene from './GameScene';

import PhysicLoop from './physics/PhysicLoop';
import SinglePlayerStrategy from './strategy/SinglePlayerStrategy';
import EventBus from './GameEventBus';
import MultiplayerStrategy from "./strategy/MultiplayerStrategy";

export default class GameManager {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
        this.scene = new GameScene();
        this.eventBus = EventBus;
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

    initiateGame(data) {
        this.app = new PIXI.Application(this.scene.width, this.scene.height, {backgroundColor: 0xFFFFFF});
        this.scene.field.appendChild(this.app.view);
        this.scene.stage = this.app.stage;

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        this.scene.initBackground(this.app);

        this.loopObj = new PhysicLoop(this);
        this.loopObj.initTick(this);

        this._initStrategy(this.loopObj, data);
        this.gameStrategy.initUI();

        this.app.ticker.add(this._onTick, this);
    }

    _onTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.app.ticker.speed;
        this.gameStrategy.gameplayTick(this.loopObj, elapsedMS);
        this.loopObj._mainTick(deltaTime);
    }

    _initStrategy(physicObject, data) {
        if (data !== null && data.type === 'FullSwapScene') {
            this.gameStrategy = new MultiplayerStrategy(this.scene, this.serviceLocator.magicTransport, physicObject, data);
        } else {
            this.gameStrategy = new SinglePlayerStrategy(this.scene);
        }

        EventBus.subscribeOn('forcefield_hit', this.gameStrategy.onForceFieldDepletion, this.gameStrategy);
        EventBus.subscribeOn('hpblock_hit', this.gameStrategy.onHpLoss, this.gameStrategy);
        EventBus.subscribeOn('player_won', this.scene.displayEndResult, this.scene);
        EventBus.subscribeOn('player_won', this.onGameEnd, this);
    }

    onGameEnd() {
        setTimeout(function () {
            this.app.ticker.stop();
        }.bind(this), 1000);
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
