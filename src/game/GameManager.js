const PIXI = require('pixi.js');

let instance;

class GameManager {
    constructor() {
        if(!instance){
            this._init();
            instance = this;
        }
        return instance;
    }


    _init() {

    }

    /**
     * @param {Element} field The field in which the game will be rendered.
     */
    setGameField(field) {
        this.field = field;
    }

    /**
     * @param {Number[]} resolution Resolution in which the game will be rendered.
     */
    setResolution(resolution) {
        this.width = resolution[0];
        this.height = resolution[1];
    }

    initiateGame() {
        this.app = new PIXI.Application(this.width, this.height, { backgroundColor: 0x1099bb });
        this.field.appendChild(this.app.view);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    }
}

module.exports = GameManager;