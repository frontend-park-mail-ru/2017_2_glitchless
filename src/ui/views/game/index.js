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

        document.body.style.overflow = '';
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
        gameFieldWrapper.style.position = 'relative';
        gameFieldWrapper.style.width = '100%';
        gameFieldWrapper.style.height = '100%';
        this.root.appendChild(gameFieldWrapper);

        const background = document.createElement('div');
        background.classList.add('game-background');
        background.classList.add('fullscreen');
        background.style.position = 'absolute';
        background.style.top = '0';
        background.style.left = '0';
        background.style.background = `url(${background_jpg})`;
        background.style.width = '100%';
        background.style.height = '100%';
        this._background = background;
        this._moveBackgroundAngle = 1.2;
        this._moveBackground();
        gameFieldWrapper.appendChild(background);

        const versionNumber = 'v0.8.2'; //change this if you're not sure if your changes are passing through
        const versionDisplay = document.createElement('div');
        versionDisplay.style.position = 'fixed';
        versionDisplay.style.zIndex = '10';
        versionDisplay.style.left = '5px';
        versionDisplay.style.bottom = '0';
        versionDisplay.style.userSelect = 'none';
        versionDisplay.innerHTML = versionNumber;
        gameFieldWrapper.appendChild(versionDisplay);

        const gameField = document.createElement('div');
        gameField.style.height = '100vh';
        gameField.classList.add('fullscreen');
        gameFieldWrapper.appendChild(gameField);

        const glow = document.createElement('div');
        glow.classList.add('fullscreen');
        glow.style.position = 'absolute';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.background = 'linear-gradient(90deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 50%)';
        glow.style.width = '100%';
        glow.style.height = '100%';
        this._glow = glow;
        this._glowProgress = -200;
        this._doGlow('0');
        this.serviceLocator.eventBus.subscribeOn('game_health_block_beat_player_left',
            () => this._startGlow('90'), this);
        this.serviceLocator.eventBus.subscribeOn('game_health_block_beat_player_right',
            () => this._startGlow('-90'), this);
        gameFieldWrapper.appendChild(glow);

        const scrollHolder = document.createElement('div');
        scrollHolder.style.width = '0';
        scrollHolder.style.height = '110%';
        gameFieldWrapper.appendChild(scrollHolder);

        setTimeout(function() { window.scrollTo(0, 1); }, 100);

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
            this._background.style.backgroundSize = `${backgroundWidth}px ${backgroundHeight}px`;

            this._background.style.backgroundPositionX = `${Math.cos(this._moveBackgroundAngle) * 150 - 150}px`;
            this._background.style.backgroundPositionY = `${-Math.sin(this._moveBackgroundAngle) * 150 - 150}px`;

            this._moveBackgroundAngle += 0.005;
            if (this._moveBackgroundAngle > 6.28) {
                this._moveBackgroundAngle = 0;
            }
            this._moveBackground();
        }, 25);
    }

    _startGlow(deg) {
        this._glowProgress = -150;
        this._doGlow(deg);
    }

    _doGlow(deg) {
        clearTimeout(this._glowTimeout);
        this._glowTimeout = setTimeout(() => {
            this._glow.style.background = `linear-gradient(${deg}deg,
                                                           rgba(160, 255, 255, 0),
                                                           rgba(160, 255, 255, 0) ${this._glowProgress}%,
                                                           rgba(160, 255, 255, 0.2) ${this._glowProgress + 50}%,
                                                           rgba(160, 255, 255, 0.2) ${this._glowProgress + 100}%,
                                                           rgba(160, 255, 255, 0) ${this._glowProgress + 150}%)`;

            this._glowProgress += 10;
            if (this._glowProgress > 300) {
                this._glowProgress = -150;
                return;
            }
            this._doGlow(deg);
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
