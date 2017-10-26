const PIXI = require('pixi.js');

class GameScene {
    constructor() {
        this.field = null;
        this.stage = null;
    }

    displayWinMessage() {
        let basicText = new PIXI.Text('You win!');
        basicText.x = 30;
        basicText.y = 90;
        // this.stage.addChild(basicText);
    }
}

module.exports = GameScene;