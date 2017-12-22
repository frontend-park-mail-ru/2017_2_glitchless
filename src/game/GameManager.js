import * as PIXI from 'pixi.js';
import GameScene from './GameScene';

import PhysicLoop from './physics/PhysicLoop';
import SinglePlayerStrategy from './strategy/SinglePlayerStrategy';
import EventBus from './GameEventBus';
import MultiplayerStrategy from './strategy/MultiplayerStrategy';
import ScoreManager from './ScoreManager';

export default class GameManager {
    constructor(serviceLocator, gameRestartFunc, newWindowSizeCalcFunc) {
        this.serviceLocator = serviceLocator;
        this.scene = new GameScene(this);
        this.eventBus = EventBus;
        this.scoreManager = new ScoreManager(this);
        this.restart = gameRestartFunc;
        this.findNewWindowSize = newWindowSizeCalcFunc;
        // PIXI.settings.RESOLUTION = window.devicePixelRatio;
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
        this.scene.width = resolution[0] / PIXI.settings.RESOLUTION;
        this.scene.height = resolution[1] / PIXI.settings.RESOLUTION;
    }

    initiateGame(data) {

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.app = new PIXI.Application(this.scene.width,
            this.scene.height, {transparent: true});

        this.scene.setRenderer(this.app.renderer);
        this.scene.field.appendChild(this.app.view);
        this.scene.stage = this.app.stage;
        this.scene.initContainer();
        this.scene.initVisualEffectsManager();

        console.log(window.devicePixelRatio);
        this.scene.initBackground(this.app);

        this.loopObj = new PhysicLoop(this);
        this.loopObj.initTick(this);

        this._initStrategy(this.loopObj, data);
        this.gameStrategy.initUI(this.loopObj);

        this.app.ticker.add(this._onTick, this);
        console.log(PIXI.settings.SCALE_MODE);
        console.log(PIXI.settings.RESOLUTION);
    }

    _onTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.app.ticker.speed;
        if (!this.disableResize) {
            const {appWidth, appHeight} = this.findNewWindowSize();
            this.setResolution([appWidth, appHeight]);
            this.app.renderer.resize(appWidth, window.innerHeight);
        }
        this.gameStrategy.gameplayTick(this.loopObj, elapsedMS);
        this.loopObj._mainTick(deltaTime);
        this.scene.tick(deltaTime);
    }

    _initStrategy(physicObject, data) {
        if (data !== null && data.type === 'FullSwapScene') {
            this.gameStrategy = new MultiplayerStrategy(this.scene,
                this.serviceLocator.magicTransport, physicObject,
                data);
        } else {
            this.gameStrategy = new SinglePlayerStrategy(this.scene);
        }

        EventBus.subscribeOn('forcefield_hit', this.gameStrategy.onForceFieldDepletion, this.gameStrategy);
        EventBus.subscribeOn('hpblock_hit', this.gameStrategy.onHpLoss, this.gameStrategy);
        EventBus.subscribeOn('hpblock_hit', this.onHpBlockLoss, this);
        EventBus.subscribeOn('player_won', this.scene.displayEndResult, this.scene);
        EventBus.subscribeOn('player_won', this.onGameEnd, this);
    }

    onHpBlockLoss(blockLaserTuple) {
        const playerNum = blockLaserTuple[0].playerNumber;
        switch (playerNum) {
            case 0:
                this.serviceLocator.eventBus.emitEvent('game_health_block_beat_player_left');
                break;
            case 1:
                this.serviceLocator.eventBus.emitEvent('game_health_block_beat_player_right');
                break;
        }
    }

    onGameEnd() {
        setTimeout(function() {
            this.app.ticker.stop();
            this.restart();
        }.bind(this), 1000);
    }

    destroy() {
        this.gameStrategy.destroy();
        this.app.destroy(true);
    }

    addObject(tag, physicObject) {
        this.loopObj.addObjectToPhysic(tag, physicObject);
        physicObject.initialWidth = this.scene.width;
        physicObject.initialHeight = this.scene.height;
        physicObject.onDraw(this.scene.mainScene);
        physicObject.subscribeToDestroy((item) => {
            item.onDestroy();
        });
    }
}
