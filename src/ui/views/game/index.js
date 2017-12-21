import View from '../View';
import GameManager from '../../../game/GameManager';
import Constants from '../../../utils/Constants';

import './style.scss';
import background_jpg from '../../images/background.jpg';

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
        this.root.classList.add('fullscreen');

        const gameFieldWrapper = document.createElement('div');
        gameFieldWrapper.style.width = '' + window.innerWidth;
        gameFieldWrapper.style.height = '100vh';
        // gameFieldWrapper.style.backgroundColor = 'black';
        this.root.appendChild(gameFieldWrapper);

        const gameField = document.createElement('div');
        gameField.style.height = '100vh';
        gameField.classList.add('game-background');
        gameField.classList.add('fullscreen');
        this._moveBackgroundAngle = 1.2;
        this._moveBackground();
        gameField.style.backgroundImage = 'url(' + background_jpg + ')';
        gameFieldWrapper.appendChild(gameField);

        this.gameField = gameField;
        return gameField;
    }

    _moveBackground() {
        setTimeout(() => {
            let backgroundWidth = window.innerWidth + 300;
            const backgroundHeight = window.innerHeight + 300;
            if (backgroundHeight > backgroundWidth) {
                backgroundWidth = backgroundHeight / 800 * 1280;
            }
            this.gameField.style.backgroundSize = `${backgroundWidth}px ${backgroundHeight}px`;

            this.gameField.style.backgroundPositionX = `${Math.cos(this._moveBackgroundAngle) * 150 - 150}px`;
            this.gameField.style.backgroundPositionY = `${-Math.sin(this._moveBackgroundAngle) * 150 - 150}px`;

            this._moveBackgroundAngle += 0.005;
            if (this._moveBackgroundAngle > 6.28) {
                this._moveBackgroundAngle = 0;
            }
            this._moveBackground();
        }, 25);
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
