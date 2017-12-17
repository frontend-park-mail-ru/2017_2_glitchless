import View from '../View';
import GameManager from '../../../game/GameManager';
import Constants from '../../../utils/Constants';
import Router from '../../../services/Router';

import './style.scss';
import background_png from '../../images/background.png';

export default class GameView extends View {
    open(root, data = null) {
        this.root = root;

        const {appWidth, appHeight} = this._findAppWidthHeight();
        const gameField = this._setupAppCanvas(appWidth, appHeight);
        this._setupGameManager(gameField, appWidth, appHeight);
        this.gameManager.initiateGame(data);
        document.body.style.overflow = 'hidden';
    }

    close() {
        document.body.style.overflow = 'auto';
        this.gameManager.destroy();
        this.gameManager = null;
        delete this;
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

    _findAppWidthHeightInner() {
        return;
    }

    _setupAppCanvas(appWidth, appHeight) {
        this.root.innerHTML = '';

        const gameFieldWrapper = document.createElement('div');
        gameFieldWrapper.style.width = '100%';
        gameFieldWrapper.style.height = '100%';
        // gameFieldWrapper.style.backgroundColor = 'black';
        this.root.appendChild(gameFieldWrapper);

        const gameField = document.createElement('div');
        gameField.classList.add('game-background');
        // gameField.style.position = 'absolute';
        // gameField.style.top = '50%';
        // gameField.style.left = '50%';
        // gameField.style.marginTop = (-appHeight / 2) + 'px';
        // gameField.style.marginLeft = (-appWidth / 2) + 'px';
        // gameField.style.width = appWidth + 'px';
        // gameField.style.height = appHeight + 'px';
        gameField.style.backgroundImage = 'url(' + background_png + ')';
        gameFieldWrapper.appendChild(gameField);

        return gameField;
    }

    _setupGameManager(gameField, appWidth, appHeight) {
        this.gameManager = new GameManager(this.serviceLocator, this.addRestartButton.bind(this),
            this._findAppWidthHeight);
        this.gameManager.setGameField(gameField);
        this.gameManager.setResolution([appWidth, appHeight]);
    }

    refresh() {
        if (!this.serviceLocator.gameRefreshed) {
            const currentUrlPath = location.pathname;
            console.log(currentUrlPath);
            serviceLocator.router.changePage('/');
            this.serviceLocator.router.changePage(currentUrlPath);
        } else {
            location.reload();
        }

        this.serviceLocator.gameRefreshed = !this.serviceLocator.gameRefreshed;
    }

    addRestartButton() {
        const restartButton = document.createElement('button');
        restartButton.innerHTML = 'Restart the game';
        restartButton.classList.add('restart-button');
        restartButton.onclick = this.refresh.bind(this);
        restartButton.style.position = 'absolute';
        restartButton.style.top = '70%';
        document.body.appendChild(restartButton);
    }
}
