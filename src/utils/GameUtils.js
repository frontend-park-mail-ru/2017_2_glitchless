const PIXI = require('pixi.js');

class GameUtils {

    /*
     *  PixiJS Background Cover/Contain Script
     *  Returns PixiJS Container
     *  ARGS:
     *  bgSize: Object with x and y representing the width and height of background. Example: {x:1280,y:720}
     *  inputSprite: Pixi Sprite containing a loaded image or other asset.
     *  Make sure you preload assets into this sprite.
     *  type: String, either "cover" or "contain".
     *  forceSize: Optional object containing the width and height of the source sprite, example:  {x:1280,y:720}
     */
    static setBackground(bgSize, inputSprite, type, forceSize) {
        console.log(bgSize);
        const sprite = inputSprite;
        const bgContainer = new PIXI.Container();
        const mask = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0, 0, bgSize.x, bgSize.y).endFill();
        bgContainer.mask = mask;
        bgContainer.addChild(mask);
        bgContainer.addChild(sprite);

        const sp = forceSize ? forceSize : {x: sprite.width, y: sprite.height};

        const winratio = bgSize.x / bgSize.y;
        const spratio = sp.x / sp.y;
        let scale = 1;
        let pos = new PIXI.Point(0, 0);
        if (type === 'cover' ? (winratio > spratio) : (winratio < spratio)) {
            //photo is wider than background
            scale = bgSize.x / sp.x;
            pos.y = -((sp.y * scale) - bgSize.y) / 2;
        } else {
            //photo is taller than background
            scale = bgSize.y / sp.y;
            pos.x = -((sp.x * scale) - bgSize.x) / 2;
        }

        sprite.scale = new PIXI.Point(scale, scale);
        sprite.position = pos;

        return bgContainer;
    }

    static resizeSprite(inputSprite, newResolution) {
        inputSprite.scale.x = newResolution[0] / inputSprite.width;
        inputSprite.scale.y = newResolution[1] / inputSprite.height;
    }
}

module.exports = GameUtils;