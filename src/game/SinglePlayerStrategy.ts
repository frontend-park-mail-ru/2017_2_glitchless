import GameStrategy from './GameStrategy';
import Player from './Player';
import Constants from '../utils/Constants';
import Point from './physics/object/primitive/Point';

const forceFieldBarTexture = PIXI.Texture.fromImage('./images/laser_large.png');
export default class SinglePlayerStrategy extends GameStrategy {
    players: Player[];
    forceFieldBarPos: Point[];
    forceFieldBars: PIXI.Sprite[];
    constructor() {
        super();
        this.players = [new Player(0), new Player(1)];
        const marginX = 100;
        const marginY = 500;

        const forceFieldBarPos1 = new Point(marginX, marginY);
        const forceFieldBarPos2 = new Point(Constants.INITIAL_RES[0] - marginX + Constants.GAME_FORCEFIELD_BAR_SIZE[0],
            Constants.INITIAL_RES[1] - marginY + Constants.GAME_FORCEFIELD_BAR_SIZE[1]);

        this.forceFieldBarPos = [forceFieldBarPos1, forceFieldBarPos2];
        this.forceFieldBars = [];
    }

    initUI(scene) {
        this._drawForceFieldBars(scene);
    }

    updateBar(num, percent) {
        this.forceFieldBars[num].height = Constants.GAME_FORCEFIELD_BAR_SIZE[1] * percent / 100;
    }

    _drawForceFieldBars(scene) {
        this.forceFieldBarPos.forEach(function(position) {
            const forceFieldBar = new PIXI.Sprite(forceFieldBarTexture);
            forceFieldBar.anchor.set(1);
            this.forceFieldBars.push(forceFieldBar);
            scene.setSize(forceFieldBar, Constants.GAME_FORCEFIELD_BAR_SIZE);
            scene.setCoords(forceFieldBar, position);
            scene.addObject(forceFieldBar);
        }.bind(this));
}
}
