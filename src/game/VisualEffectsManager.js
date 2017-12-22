import {RGBSplitFilter} from 'pixi-filters';

export default class VisualEffectsManager {
    constructor() {
        this.rgbFilter = new RGBSplitFilter([3, -2], [0, 0], [3, 2]);
        this.pixiContainer = null;
        this.healthStatusFunc = null;
        this.flickerTicks = 0;
        this.ticksToSuperFlicker = -1;
    }

    initContainer(pixiContainer) {
        this.pixiContainer = pixiContainer;
        this.pixiContainer.filters = [this.rgbFilter];
    }

    initHealthStatusFunc(func) {
        this.healthStatusFunc = func;
    }

    doSuperFlicker() {
        this.ticksToSuperFlicker = 15;
    }

    tick(dt) {
        if (!this.pixiContainer) {
            return;
        }
        if (!this.healthStatusFunc) {
            return;
        }

        this.flickerTicks++;
        if (this.flickerTicks < 3) {
            return;
        }
        this.flickerTicks = 0;

        if (this.ticksToSuperFlicker > 0) {
            this.ticksToSuperFlicker--;
        }

        const additionalShift = Math.pow(1.8, (1 - this.healthStatusFunc()) * 4.2);
        let amplitude = 1 + (1 - this.healthStatusFunc()) * 2;
        if (this.ticksToSuperFlicker > 0) {
            amplitude += this.ticksToSuperFlicker * 2;
        }
        this.rgbFilter.red[0] = Math.random() * amplitude + additionalShift;
        this.rgbFilter.red[1] = -2 - additionalShift / 2;
        this.rgbFilter.blue[0] = Math.random() * -amplitude - additionalShift / 2;
        this.rgbFilter.blue[1] = 2 + additionalShift / 4;
    }
}
