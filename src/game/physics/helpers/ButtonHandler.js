export default class ButtonOnKeyboard {
    constructor(keyCode) {
        this.code = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;

        window.addEventListener(
            "keydown", this._downHandler.bind(this), false
        );

        window.addEventListener(
            "keyup", this._upHandler.bind(this), false
        );
    }

    _downHandler(event) {
        if (event.keyCode === this.code) {
            if (this.isUp && this.press) {
                this.press();
            }
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    }

    _upHandler(event) {
        if (event.keyCode === this.code) {
            if (this.isDown && this.release) {
                this.release();
            }
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    }
}
