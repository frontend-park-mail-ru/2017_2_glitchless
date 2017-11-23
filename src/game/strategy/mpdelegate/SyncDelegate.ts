import MagicTransport from '../../io/MagicTransport';
import PhysicsEntity from '../../physics/object/primitive/PhysicsEntity.js';
import PhysicsObject from '../../physics/object/primitive/PhysicsObject.js';
import Point from '../../physics/object/primitive/Point.js';

export default class SyncDelegate {
    private magicTransport: MagicTransport;
    private idToObject = {};
    private physicContext;

    constructor(magicTransport: MagicTransport, physicContext) {
        this.magicTransport = magicTransport;
        this.physicContext = physicContext;
    }

    public onChangeSpeed(object: PhysicsEntity) {
        return;
    }

    public applySwapSnapshot(object: PhysicsObject, swap) {
        object.multiplayerId = swap.objectId;
        this.idToObject[swap.objectId] = object;

        object.setCoords(new Point(swap.coord.posX, swap.coord.posY), this.physicContext);
    }
}
