export default class ButtonOnKeyboard {
    constructor(keyCode) {
        this.code = keyCode;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;

        this._downHandlerWithContext = this._downHandler.bind(this);
        document.addEventListener(
            'keydown', this._downHandlerWithContext, false,
        );

        this._upHandlerWithContext = this._upHandler.bind(this);
        document.addEventListener(
            'keyup', this._upHandlerWithContext, false,
        );

        this.destroy = this.destroy.bind(this);
    }

    _downHandler(event) {
        if (event.keyCode === this.code) {
            if (this.isUp && this.press) {
                this.press();
            }
            this.isDown = true;
            this.isUp = false;
            event.preventDefault();
        }
    }

    _upHandler(event) {
        if (event.keyCode === this.code) {
            if (this.isDown && this.release) {
                this.release();
            }
            this.isDown = false;
            this.isUp = true;
            event.preventDefault();
        }
    }

    destroy() {
        document.removeEventListener(
            'keydown', this._downHandlerWithContext, false,
        );

        document.removeEventListener(
            'keyup', this._upHandlerWithContext, false,
        );
    }
}
