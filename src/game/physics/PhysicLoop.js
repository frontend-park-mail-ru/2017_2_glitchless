class PhysicLoop {

    initTick(gameManager) {
        if (this.loopId !== 0 && this.loopId !== null) {
            console.log("Previously remove current loop");
            return;
        }
        this.loopId = setInterval(this._mainTick, 40, gameManager);
    }

    _mainTick(gameManager) {

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