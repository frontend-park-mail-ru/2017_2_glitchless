import View from '../View';
import GameManager from '../../game/GameManager';
import Constants from '../../utils/Constants';

export default class GameView extends View {
    open(root) {
        this.root = root;

        const {appWidth, appHeight} = this._findAppWidthHeight();
        const gameField = this._setupAppCanvas(appWidth, appHeight);
        this._setupGameManager(gameField, appWidth, appHeight);

        this.gameManager.initiateGame();
    }

    close() {
        location.reload();
    }

    _findAppWidthHeight() {
        let appWidth = window.innerWidth * Constants.WINDOW_SCALE;
        let appHeight = Math.round(appWidth * Constants.WINDOW_HD_RATIO_INVERSE);
        if (appHeight > window.innerHeight) {
            appHeight = window.innerHeight * Constants.WINDOW_SCALE;
            appWidth = Math.round(appHeight * Constants.WINDOW_HD_RATIO);
        }
        return {appWidth, appHeight};
    }

    _setupAppCanvas(appWidth, appHeight) {
        this.root.innerHTML = '';

        const gameFieldWrapper = document.createElement('div');
        gameFieldWrapper.style.width = '100%';
        gameFieldWrapper.style.height = '100%';
        gameFieldWrapper.style.backgroundColor = 'black';
        this.root.appendChild(gameFieldWrapper);

        const gameField = document.createElement('div');
        gameField.style.position = 'absolute';
        gameField.style.top = '50%';
        gameField.style.left = '50%';
        gameField.style.marginTop = (-appHeight / 2) + 'px';
        gameField.style.marginLeft = (-appWidth / 2) + 'px';
        gameField.style.width = appWidth + 'px';
        gameField.style.height = appHeight + 'px';
        gameFieldWrapper.appendChild(gameField);

        return gameField;
    }

    _setupGameManager(gameField, appWidth, appHeight) {
        this.gameManager = new GameManager(this.serviceLocator);
        this.gameManager.setGameField(gameField);
        this.gameManager.setResolution([appWidth, appHeight]);
    }
}
