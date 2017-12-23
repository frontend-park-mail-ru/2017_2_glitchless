export default class SpriteStorage {
    constructor() {
        this.alien = null;
        this.userPlatform = null;
        this.enemyPlatform = null;
        this.circle = null;
        this.needUpdatePlatorm = [];

        this.sortedHpBlock = [];
        this.sortedFieldBlock = [];
    }

    setHpBlockArray(hpBlockArray) {
        this.sortedHpBlock = hpBlockArray.sort((a, b) => {
            return a.getRotation() - b.getRotation();
        });
    }

    setFieldArrayBlock(fieldBlockArray) {
        this.sortedFieldBlock = fieldBlockArray.sort((a, b) => {
            return a.getRotation() - b.getRotation();
        });
    }
}
