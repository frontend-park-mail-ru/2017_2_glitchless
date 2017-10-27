const PIXI = require('pixi.js');
const GameUtils = require('../utils/GameUtils.js');

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

    initBackground(app) {
        let bgSize = {x: this.width, y: this.height};

        const container = new PIXI.Container();

        app.stage.addChild(container);

        PIXI.loader.add("./images/background.png").load(function () {
            let slide = GameUtils
                .setBackground(bgSize,
                    new PIXI.Sprite.fromImage('./images/background.png'),
                    'cover');
            container.addChild(slide);

        });
    }
}


module.exports = GameScene;