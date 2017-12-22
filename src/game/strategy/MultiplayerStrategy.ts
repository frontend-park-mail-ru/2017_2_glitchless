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
        this.syncDelegate = new SyncDelegate(this.magicTransport, physicContext, this);
        this.userPlatform = this.currentUserIsLeft
            ? physicContext.spriteStorage.userPlatform
            : physicContext.spriteStorage.enemyPlatform;
        physicContext.spriteStorage.needUpdatePlatorm = [this.userPlatform];

        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.userPlatform, platformLeft);
        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.enemyPlatform, platformRight);
        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.circle, circle);
        this.syncDelegate.applySwapSnapshot(physicContext.spriteStorage.alien, fullSwap.alien);

        const hpBlockArray = fullSwap.hpblock;
        const gameHpArray = physicContext.spriteStorage.sortedHpBlock;

        const fieldBlockArray = fullSwap.forceFields;
        const gameFieldArray = physicContext.spriteStorage.sortedFieldBlock;

        if (hpBlockArray.length !== gameHpArray.length) {
            throw TypeError('Wrong lenght');
        }

        if (fieldBlockArray.length !== gameFieldArray.length) {
            throw TypeError('Wrong lenght');
        }

        for (let i = 0; i < hpBlockArray.length; i++) {
            this.syncDelegate.applySwapSnapshot(gameHpArray[i], hpBlockArray[i]);
        }

        for (let i = 0; i < fieldBlockArray.length; i++) {
            this.syncDelegate.applySwapSnapshot(gameFieldArray[i], fieldBlockArray[i]);
        }

        return;
    }

    public initUI(physicContext) {
        this.drawForceFieldBars(this.scene);
    }

    public gameplayTick(physicContext, elapsedMS) {
        this.processControls();
        this.replenishShields(physicContext, elapsedMS);
    }

    public onHpLoss(hpblock) {
        // TODO
        return;
    }

    public setShield(physicContext, player, playerNum, newShieldVal) {
        player.shield = newShieldVal < player.maxShield ? newShieldVal : player.maxShield;
        this.updateBar(playerNum, (player.shield / player.maxShield) * 100);
        if (player.shield / player.maxShield > Constants.SHIELD_ACTIVATION_PERCENT / 100) {
            physicContext.physicObjects.forcefield[playerNum].onEnable();
        } else {
            physicContext.physicObjects.forcefield[playerNum].onChargeEnd();
        }
    }

    private processControls() {
        const oldDirection = this.userPlatform.getDirection();
        const newDirection = this.getPlatformDirection();

        this.userPlatform.setMoveDirection(newDirection);

        if (newDirection !== oldDirection) {
            GameEventBus.emitEvent('change_direction', {platform: this.userPlatform, direction: newDirection});
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

    private replenishShields(physicContext, elapsedMS: number) {
        this.players.forEach(function (player, playerNum) {
            const newShieldVal = player.shield + Constants.SHIELD_REGEN_RATIO * elapsedMS / 1000;
            this.setShield(physicContext, player, playerNum, newShieldVal);
        }, this);
    }

    private updateBar(num: number, percent: number) {
        this.forceFieldBars[num].height = this.scene.scaleLength(Constants.GAME_FORCEFIELD_BAR_SIZE[1]) * percent / 100;
    }
}
