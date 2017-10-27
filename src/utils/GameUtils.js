const PIXI = require('pixi.js');

class GameUtils {
    /**
     * Scales coordinates from initial to final resolution, rounding to the nearest whole number
     *
     * Coordinates / resolution format: [x, y] / [width, height]
     *
     * @param {Number[]} coords Coordinates to scale
     * @param {Number[]} finalRes Final resolution
     * @param {Number[]} [initialRes=[1920, 1080]] Initial resolution
     * @return {Number[]} Scaled coordinates
     */
    scaleCoords(coords, finalRes, initialRes = [1920, 1080]) {
        const x = coords[0];
        const y = coords[1];

        const xScale = finalRes[0] / initialRes[0];
        const yScale = finalRes[1] / initialRes[1];

        return [Math.round(x * xScale), Math.round(y * yScale)];
    }

    hitTestRectangle(r1, r2) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        hit = false;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            hit = Math.abs(vy) < combinedHalfHeights;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }


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

        let sp = {x: sprite.width, y: sprite.height};
        if (forceSize) {
            sp = forceSize;
        }
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
}

module.exports = GameUtils;