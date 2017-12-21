import View from '../View';
import GameManager from '../../../game/GameManager';
import Constants from '../../../utils/Constants';

import './style.scss';
import background_png from '../../images/background.png';

export default class GameView extends View {
    open(root, data = null) {
        this.root = root;

        const {appWidth, appHeight} = this._findAppWidthHeight();
        const gameField = this._setupAppCanvas(appWidth, appHeight);
        this._setupGameManager(gameField, appWidth, appHeight);
        this.gameManager.initiateGame(data);

        this.fullScreenOpener = function(e) {
          if (e.keyCode === 70) {
            this.toggleFullScreen();
            e.preventDefault();
          }
        }.bind(this);

        // document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.fullScreenOpener, false);
    }

    close() {
        document.removeEventListener('keydown', this.fullScreenOpener, false);

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
        // this.root.classList.add('fullscreen');

        const gameFieldWrapper = document.createElement('div');
        gameFieldWrapper.style.width = '' + window.innerWidth;
        gameFieldWrapper.style.height = '100vh';
        // gameFieldWrapper.style.backgroundColor = 'black';
        this.root.appendChild(gameFieldWrapper);

        const versionNumber = 'v0.8.1'; //change this if you're not sure if your changes are passing through
        const versionDisplay = document.createElement('div');
        versionDisplay.style.position = 'fixed';
        versionDisplay.style.zIndex = '10';
        versionDisplay.style.left = '5px';
        versionDisplay.style.bottom = '0';
        versionDisplay.innerHTML = versionNumber;

        gameFieldWrapper.appendChild(versionDisplay);
        const gameField = document.createElement('div');
        gameField.style.height = '100vh';
        gameField.classList.add('game-background');
        gameField.classList.add('fullscreen');
        // gameField.style.position = 'absolute';
        // gameField.style.top = '50%';
        // gameField.style.left = '50%';
        // gameField.style.marginTop = (-appHeight / 2) + 'px';
        // gameField.style.marginLeft = (-appWidth / 2) + 'px';
        // gameField.style.width = appWidth + 'px';
        // gameField.style.height = appHeight + 'px';
        gameField.style.backgroundImage = 'url(' + background_png + ')';
        gameFieldWrapper.appendChild(gameField);

        setTimeout(function() { window.scrollTo(0, 1); }, 100);

        this.gameField = gameField;
        return gameField;
    }

    toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
        }
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
