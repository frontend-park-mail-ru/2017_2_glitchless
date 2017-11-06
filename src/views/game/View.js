const View = require('../View.js');
const GameManager = require('../../game/GameManager.js');
const Constants = require('../../utils/Constants.js');


class GameView extends View {
    open(root) {
        let appWidth = window.innerWidth * Constants.WINDOW_SCALE;
        let appHeight = Math.round(appWidth * Constants.WINDOW_HD_RATIO_INVERSE);
        if (appHeight > window.innerHeight) {
            appHeight = window.innerHeight * Constants.WINDOW_SCALE;
            appWidth = Math.round(appHeight * Constants.WINDOW_HD_RATIO);
        }

        root.innerHTML = '';

        const gameFieldWrapper = document.createElement('div');
        gameFieldWrapper.style.width = '100%';
        gameFieldWrapper.style.height = '100%';
        gameFieldWrapper.style.backgroundColor = 'black';
        root.appendChild(gameFieldWrapper);

        const gameField = document.createElement('div');
        gameField.style.position = 'absolute';
        gameField.style.top = '50%';
        gameField.style.marginTop = (-appHeight / 2) + 'px';
        gameField.style.width = appWidth + 'px';
        gameField.style.height = appHeight + 'px';
        gameFieldWrapper.appendChild(gameField);

        const gameManager = new GameManager();

        gameManager.setGameField(gameField);
        gameManager.setResolution([appWidth, appHeight]);

        gameManager.initiateGame();
    }

    close() {
        // TODO
    }
}

module.exports = GameView;
