export default class TouchHandler {
    constructor() {
        this._onTouchStartWithContext = this._onTouchStart.bind(this);
        this._onTouchMoveWithContext = this._onTouchMove.bind(this);
        this._onTouchEndWithContext = this._onTouchEnd.bind(this);

        this.leftTouches = new Set();
        this.rightTouches = new Set();

        document.addEventListener('touchstart', this._onTouchStartWithContext, false);
        document.addEventListener('touchmove', this._onTouchMoveWithContext, false);
        document.addEventListener('touchend', this._onTouchEndWithContext, false);
    }

    _onTouchStart(event) {
        Array.prototype.forEach.call(event.changedTouches, function(touch) {
            const touchX = touch.clientX;
            const width = window.innerWidth;
            if (touchX < width / 2) {
                this.leftTouches.add(touch.identifier);
                this.leftActive = true;
            } else {
                this.rightTouches.add(touch.identifier);
                this.rightActive = true;
            }
        }.bind(this));
    }

    _onTouchMove(event) {
        Array.prototype.forEach.call(event.changedTouches, function(touch) {
            const touchX = touch.clientX;
            const width = window.innerWidth;
            if (touchX < width / 2) {
                this.rightTouches.delete(touch.identifier);
                this.leftTouches.add(touch.identifier);
                this.leftActive = true;
                if (this.rightTouches.size === 0) {
                    this.rightActive = false;
                }
            } else {
                this.leftTouches.delete(touch.identifier);
                this.rightTouches.add(touch.identifier);
                this.rightActive = true;
                if (this.leftTouches.size === 0) {
                    this.leftActive = false;
                }
            }
        }.bind(this));
    }

    _onTouchEnd(event) {
        Array.prototype.forEach.call(event.changedTouches, function(touch) {
            const touchX = touch.clientX;
            const width = window.innerWidth;
            if (touchX < width / 2) {
                this.leftTouches.delete(touch.identifier);
                if (this.leftTouches.size === 0) {
                    this.leftActive = false;
                }
            } else {
                this.rightTouches.delete(touch.identifier);
                if (this.rightTouches.size === 0) {
                    this.rightActive = false;
                }
            }
        }.bind(this));
    }

    destroy() {
        document.removeEventListener('touchstart', this._onTouchStartWithContext, false);
        document.removeEventListener('touchmove', this._onTouchMoveWithContext, false);
        document.removeEventListener('touchend', this._onTouchEndWithContext, false);
    }
}
