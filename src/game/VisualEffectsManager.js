import {RGBSplitFilter} from 'pixi-filters';

export default class VisualEffectsManager {
    constructor() {
        this.rgbFilter = new RGBSplitFilter([3, -2], [0, 0], [3, 2]);
        this.pixiContainer = null;
        this.healthStatusFunc = null;
    }

    initContainer(pixiContainer) {
        this.pixiContainer = pixiContainer;
        this.pixiContainer.filters = [this.rgbFilter];
    }

    initHealthStatusFunc(func) {
        this.healthStatusFunc = func;
    }

    tick(dt) {
        if (!this.pixiContainer) {
            return;
        }
        if (!this.healthStatusFunc) {
            return;
        }

        const additionalShift = Math.pow(2, (1 - this.healthStatusFunc()) * 4);
        const amplitude = 1 + (1 - this.healthStatusFunc()) * 7;
        this.rgbFilter.red[0] = Math.random() * amplitude + additionalShift;
        this.rgbFilter.red[1] = -2 - additionalShift / 2;
        this.rgbFilter.blue[0] = Math.random() * -amplitude - additionalShift / 2;
        this.rgbFilter.blue[1] = 2 + additionalShift / 4;
    }
}
