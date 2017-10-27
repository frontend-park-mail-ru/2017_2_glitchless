const PIXI = require('pixi.js');

class PhysicLoop {

    initTick(gameManager) {
        if (this.loopId !== 0 && this.loopId !== undefined) {
            console.log("Previously remove current loop");
            return;
        }
        this.gameManager = gameManager;
        console.log("Initializing tick...");
        gameManager.app.ticker.add(this._mainTick, this);
    }

    _mainTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.gameManager.app.ticker.speed;
        //console.log("Frame per second: " + (1000 / elapsedMS));
    }

    clearTick() {
        if (this.loopId === 0 || this.loopId === null) {
            console.log("Previously add loop");
            return;
        }
        clearInterval(this.loopId);
        this.loopId = 0;
    }
}

function sleep(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */
    }
}


module.exports = PhysicLoop;