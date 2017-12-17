import UserModel from '../../models/UserModel.js';
import Constants from '../../utils/Constants';
import GameEventBus from '../GameEventBus';
import GameScene from '../GameScene';
import MagicTransport from '../io/MagicTransport';
import Platform from '../physics/object/Platform';
import Point from '../physics/object/primitive/Point';
import Player from '../Player';
import GameStrategy from './GameStrategy';
import SyncDelegate from './mpdelegate/SyncDelegate';

import * as shield_gui_background_png from '../../ui/images/shield_gui_background.png';
import * as shield_gui_status_png from '../../ui/images/shield_gui_status.png';
import {Direction} from '../physics/object/Direction';

const forceFieldBarTexture = PIXI.Texture.fromImage(shield_gui_status_png);
const forceFieldBarBackgroundTexture = PIXI.Texture.fromImage(shield_gui_background_png);

export default class MultiplayerStrategy extends GameStrategy {
    public players: Player[];
    public forceFieldBarPos: Point[];
    public forceFieldBars: PIXI.Sprite[];
    private laserDamage: number;
    private scene: GameScene;
    private syncDelegate: SyncDelegate;
    private magicTransport: MagicTransport;
    private currentUserIsLeft: boolean;
    private userPlatform: Platform;

    public constructor(scene, magicTransport, physicContext, fullSwap) {
        super();
        this.magicTransport = magicTransport;
        this.players = [];
        const marginX = 100;
        const marginY = Constants.INITIAL_RES[1] / 2 + Constants.GAME_FORCEFIELD_BAR_SIZE[1] / 2;

        const forceFieldBarPos1 = new Point(marginX, marginY);
        const forceFieldBarPos2 = new Point(Constants.INITIAL_RES[0] - marginX + Constants.GAME_FORCEFIELD_BAR_SIZE[0],
            marginY);

        this.forceFieldBarPos = [forceFieldBarPos1, forceFieldBarPos2];
        this.forceFieldBars = [];
        this.laserDamage = 20;

        this.commitFullSwap(physicContext, fullSwap);
        this.scene = scene;
    }

    public commitFullSwap(physicContext, fullSwap) {
        this.players = [new Player(0), new Player(1)];
        const circle = fullSwap.kirkle;
        const platformLeft = fullSwap.platform_1;
        const platformRight = fullSwap.platform_2;

        this.currentUserIsLeft = platformLeft.data === UserModel.loadCurrentSyncronized().login;
        this.syncDelegate = new SyncDelegate(this.magicTransport, physicContext);
        this.userPlatform = this.currentUserIsLeft
            ? physicContext.spriteStorage.userPlatform
            : physicContext.spriteStorage.enemyPlatform;
        physicContext.spriteStorage.needUpdatePlatorm = [this.userPlatform];

        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.userPlatform, platformLeft);
        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.enemyPlatform, platformRight);
        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.circle, circle);

        return;
    }

    public initUI(physicContext) {
        this.drawForceFieldBars(this.scene);
    }

    public gameplayTick(physicContext, elapsedMS) {
        this.processControls();
        this.syncDelegate.sync();
    }

    public onHpLoss(hpblock) {
        // TODO
        return;
    }

    private processControls() {
        const oldDirection = this.userPlatform.getDirection();
        let newDirection = Direction.NONE;

        if (this.leftButton.isDown || this.qButton.isDown) {
            newDirection = Direction.LEFT;
        } else if (this.rightButton.isDown || this.eButton.isDown) {
            newDirection = Direction.RIGHT;
        } else {
            newDirection = Direction.NONE;
        }

        this.userPlatform.setMoveDirection(newDirection);

        if (newDirection !== oldDirection) {
            GameEventBus.emitEvent('change_direction', [this.userPlatform, newDirection]);
        }
    }

    private drawForceFieldBars(scene) {
        this.forceFieldBarPos.forEach(function (position) {
            const forceFieldBar = new PIXI.Sprite(forceFieldBarTexture);
            const forceFieldBarBackground = new PIXI.Sprite(forceFieldBarBackgroundTexture);
            forceFieldBar.anchor.set(1);
            forceFieldBarBackground.anchor.set(1);

            scene.addObject(forceFieldBarBackground);
            scene.setSize(forceFieldBarBackground, Constants.GAME_FORCEFIELD_BAR_SIZE);
            scene.setCoords(forceFieldBarBackground, position);

            scene.setSize(forceFieldBar, Constants.GAME_FORCEFIELD_BAR_SIZE);
            scene.setCoords(forceFieldBar, position);
            scene.addObject(forceFieldBar);
            this.forceFieldBars.push(forceFieldBar);
        }, this);
    }
}
