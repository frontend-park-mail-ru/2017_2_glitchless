import MagicTransport from '../../io/MagicTransport';
import PhysicsEntity from '../../physics/object/primitive/PhysicsObject';

export default class SyncDelegate {
    private magicTransport: MagicTransport;

    constructor(magicTransport: MagicTransport) {
        this.magicTransport = magicTransport;
    }

    public onChangeSpeed(object: PhysicsEntity) {
        return;
    }
}
