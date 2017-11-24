import GameEventBus from '../../GameEventBus';
import MagicTransport from '../../io/MagicTransport';
import Platform from '../../physics/object/Platform';
import PhysicsEntity from '../../physics/object/primitive/PhysicsEntity.js';
import PhysicsObject from '../../physics/object/primitive/PhysicsObject.js';
import Point from '../../physics/object/primitive/Point.js';

export default class SyncDelegate {
    private magicTransport: MagicTransport;
    private idToObject = {};
    private physicContext;
    private pendingProcessToSend = {};

    // Last commit id - counter
    private counter: number = 0;
    private firstExistCommit: number = 0;

    // {'id', 'speed', 'timestamp_start', 'timestamp_end'}
    private commits = {};

    constructor(magicTransport: MagicTransport, physicContext) {
        this.magicTransport = magicTransport;
        this.physicContext = physicContext;
        GameEventBus.subscribeOn('change_platform_speed', (data) => {
            this.onChangeSpeedPlatform(data);
        }, this);
        this.magicTransport.eventBus.subscribeOn('ServerSnapMessage', (data) => {
            this.applyServerSwapCommit(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('LightSnapMessage', (data) => {
            this.applyLightServerSwapCommit(data);
        }, this);
    }

    public onChangeSpeedPlatform(object: Platform) {
        this.pendingProcessToSend[object.multiplayerId] = new Point(object.getRotationSpeed(), 0);
        console.log('Change platform speed');
    }

    public applyServerSwapCommit(data) {
        const object = this.idToObject[data.objectId];
        const newPoint = new Point(data.coord.posX, data.coord.posY);
        object.setCoords(newPoint, this.physicContext);
        object.setRotation(data.rotation, this.physicContext);
        object.setRotationSpeed(data.rotationSpeed);
    }

    public applyLightServerSwapCommit(data) {
        const commitId = Math.max(data.commitId, this.firstExistCommit);
        const object = this.idToObject[data.objectId];
        const newPoint = new Point(data.coord.posX, data.coord.posY);
        object.setCoords(newPoint, this.physicContext);
        object.setRotation(data.rotation, this.physicContext);

        for (let i = commitId; i < this.counter - 1; i++) {
            this.applyToObject(object, this.commits[i]);
        }

        const lastCommitTmp = this.commits[this.counter];
        const currentTime = performance.now();
        const lastCommit = {
                speed: lastCommitTmp.speed,
                timestamp_start: lastCommitTmp.timestamp_start,
                timestamp_end: currentTime
            };
        this.applyToObject(object, lastCommit);
    }

    public sync() {
        this.flushToCommit();
    }

    public applySwapSnapshot(object: PhysicsObject, swap) {
        object.multiplayerId = swap.objectId;
        this.idToObject[swap.objectId] = object;

        object.setCoords(new Point(swap.coord.posX, swap.coord.posY), this.physicContext);
    }

    private flushToCommit() {
        for (const objectId of Object.keys(this.pendingProcessToSend)) {
            const speed = this.pendingProcessToSend[objectId];

            if (speed !== null) {
                this.pendingProcessToSend[objectId] = null;

                this.processObject(objectId, speed);
            }
        }
    }

    private processObject(objectId, speed) {
        const now = performance.now();
        const lastCommit = this.commits[this.counter];

        if (lastCommit) {
            lastCommit.timestamp_end = now;
        }

        this.counter = this.counter + 1;
        const commitId = this.counter;

        this.commits[commitId] = {speed, timestamp_start: now};
        this.magicTransport.send({type: 'ClientCommitMessage', commitNumber: commitId, objectId, speed});
    }


    private applyToObject(object, commit) {
        const diffTime = commit.timestamp_end - commit.timestamp_start;

        if (object instanceof Platform) {
            const diff = commit.speed.x * diffTime;
            object.setRotation(object.getRotation() + diff);
        }
    }

}
