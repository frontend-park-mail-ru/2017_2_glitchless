import * as PIXI from 'pixi.js';

export default class GameUtils {
    /**
     *  PixiJS Background Cover/Contain Script.
     *
     *  @param bgSize Object with x and y representing the width and height of background. Example: {x:1280,y:720}
     *  @param inputSprite Pixi Sprite containing a loaded image or other asset.
     *                     Make sure you preload assets into this sprite.
     *  @param type String either "cover" or "contain".
     *  @param forceSize Optional object containing the width and height of the source sprite, example: {x:1280,y:720}
     *  @returns PixiJS Container
     */
    static makeBackgroundCoverWithSprite(bgSize, inputSprite, type, forceSize) {
        const bgContainer = new PIXI.Container();

        const mask = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0, 0, bgSize.x, bgSize.y).endFill();
        bgContainer.mask = mask;
        bgContainer.addChild(mask);
        bgContainer.addChild(inputSprite);

        const sp = forceSize ? forceSize : {x: inputSprite.width, y: inputSprite.height};

        const winratio = bgSize.x / bgSize.y;
        const spratio = sp.x / sp.y;
        let scale = 1;
        let pos = new PIXI.Point(0, 0);
        if (type === 'cover' ? (winratio > spratio) : (winratio < spratio)) {
            // photo is wider than background
            scale = bgSize.x / sp.x;
            pos.y = -((sp.y * scale) - bgSize.y) / 2;
        } else {
            // photo is taller than background
            scale = bgSize.y / sp.y;
            pos.x = -((sp.x * scale) - bgSize.x) / 2;
        }

        inputSprite.scale = new PIXI.Point(scale, scale);
        inputSprite.position = pos;

        return bgContainer;
    }

    static resizeSprite(inputSprite, newResolution) {
        inputSprite.scale.x = newResolution[0] / inputSprite.width;
        inputSprite.scale.y = newResolution[1] / inputSprite.height;
    }

    static radianLimit(radian) {
        if (radian >= 0) {
            if (radian <= Math.PI) {
                return radian;
            }
            return -Math.PI + radian % Math.PI;
        }

        if (radian >= -Math.PI) {
            return radian;
        }
        return Math.PI + radian % Math.PI;
    }

    static minDist(radian1, radian2) {
        const sign1 = Math.sign(radian1);
        const sign2 = Math.sign(radian2);
        if (Math.sign(radian1) === Math.sign(radian2)) {
            const diffsign = Math.abs(radian2) > Math.abs(radian1) ? -1 : 1;
            return [Math.abs(radian2 - radian1) % Math.PI, diffsign];
        }
        const simpleDiff = Math.abs(radian2 - radian1);
        const reverseDiff = Math.abs(radian1 - sign1 * Math.PI) + Math.abs(radian2 - sign2 * Math.PI);
        if (simpleDiff < reverseDiff) {
            return [simpleDiff, sign1];
        }
        return [reverseDiff, sign2];
    }

    static degrees(radians) {
        return radians * 180 / Math.PI + 180;
    }
}
