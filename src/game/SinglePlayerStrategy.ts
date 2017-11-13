import Constants from '../utils/Constants';
import EventBus from './GameEventBus';
import GameScene from './GameScene';
import GameStrategy from './GameStrategy';
import ForceField from './physics/object/ForceField';
import Point from './physics/object/primitive/Point';
import Player from './Player';

const forceFieldBarTexture = PIXI.Texture.fromImage('./images/shield_gui_status.png');
const forceFieldBarBackgroundTexture = PIXI.Texture.fromImage('./images/shield_gui_background.png');
export default class SinglePlayerStrategy extends GameStrategy {
    public players: Player[];
    public forceFieldBarPos: Point[];
    public forceFieldBars: PIXI.Sprite[];
    private laserDamage: number;
    private scene: GameScene;
    constructor(scene) {
        super();
        this.players = [new Player(0), new Player(1)];
        const marginX = 100;
        const marginY = Constants.INITIAL_RES[1] / 2 + Constants.GAME_FORCEFIELD_BAR_SIZE[1] / 2;

        const forceFieldBarPos1 = new Point(marginX, marginY);
        const forceFieldBarPos2 = new Point(Constants.INITIAL_RES[0] - marginX + Constants.GAME_FORCEFIELD_BAR_SIZE[0],
            marginY);

        this.forceFieldBarPos = [forceFieldBarPos1, forceFieldBarPos2];
        this.forceFieldBars = [];
        this.laserDamage = 20;
        this.scene = scene;
    }

    public initUI(scene) {
        this._drawForceFieldBars(scene);
    }

    public onForceFieldDepletion(forcefield: ForceField) {
        const playerNum = forcefield.playerNumber;
        const player = this.players[playerNum];
        const oldShieldValue = player.shield;

        let newShieldValue = player.shield - this.laserDamage;
        player.shield = newShieldValue;
        if (newShieldValue <= 0) {
            newShieldValue = 0;
            forcefield.onChargeEnd();
        }

        this.updateBar(playerNum, (newShieldValue / player.maxShield) * 100);
    }

    public onHpLoss(hpblock) {
        const playerNum = hpblock.playerNumber;
        console.log(playerNum);
        const player = this.players[playerNum];
        player.health -= 1;
        console.log(player);
        if (player.health === 0) {
            this.onGameEnd(playerNum);
        }
    }

    public updateBar(num, percent) {
        this.forceFieldBars[num].height = this.scene.scaleLength(Constants.GAME_FORCEFIELD_BAR_SIZE[1]) * percent / 100;
    }

    public onGameEnd(loser: number) {
        const winner = (loser + 1) % 1;
        EventBus.emitEvent('player_won', winner);
    }

    private _drawForceFieldBars(scene) {
        this.forceFieldBarPos.forEach(function(position) {
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
        }.bind(this));
    }
}
