const GameStrategy = require('./GameStrategy.js');
const Player = require('./Player.js');
const Constants = require('../utils/Constants.js');
const Point = require('./physics/object/primitive/Point.js');

const forceFieldBarTexture = PIXI.Texture.fromImage('./images/laser_large.png');
class SinglePlayerStrategy extends GameStrategy { 
    constructor() {
    	super();
    	this.players = [new Player(0), new Player(1)];
        const marginX = 100;
        const marginY = 500;

    	const forceFieldBarPos1 = new Point(marginX, marginY);
    	const forceFieldBarPos2 = new Point(Constants.INITIAL_RES[0] - marginX + Constants.GAME_FORCEFIELD_BAR_SIZE[0], Constants.INITIAL_RES[1] 
            - marginY + Constants.GAME_FORCEFIELD_BAR_SIZE[1]);

        this.forceFieldBarPos = [forceFieldBarPos1, forceFieldBarPos2];
        this.forceFieldBars = [];
    }

    initUI(scene) {
    	this._drawForceFieldBars(scene);
    }

    updateBar(number, percent) {
        this.forceFieldBars[number].height = Constants.GAME_FORCEFIELD_BAR_SIZE[1] * percent / 100;
    }

    _drawForceFieldBars(scene) {
        this.forceFieldBarPos.forEach(function (position) {
            const forceFieldBar = new PIXI.Sprite(forceFieldBarTexture);
            forceFieldBar.anchor.set(1);
            this.forceFieldBars.push(forceFieldBar);
            scene.setSize(forceFieldBar, Constants.GAME_FORCEFIELD_BAR_SIZE);
            scene.setCoords(forceFieldBar, position);
            scene.addObject(forceFieldBar);
        }.bind(this));
    }
}

module.exports = SinglePlayerStrategy;
