import Constants from '../../../utils/Constants';
import GameEventBus from '../../GameEventBus';
import MagicTransport from '../../io/MagicTransport';
import {Direction} from '../../physics/object/Direction';
import Platform from '../../physics/object/Platform';
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
        GameEventBus.subscribeOn('change_direction', (data) => {
            this.onChangeDirection(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('ServerSnapMessage', (data) => {
            this.applyServerSwapCommit(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('LightServerSnapMessage', (data) => {
            this.applyLightServerSwapCommit(data);
        }, this);
    }

    public onChangeDirection(platformDirectionSnap) {
        const platform: Platform = platformDirectionSnap.platform;
        const direction: Direction = platformDirectionSnap.direction;

        const speed = direction * Constants.GAME_PLATFORM_CONTROL_SPEED;

        this.pendingProcessToSend[platform.multiplayerId] = new Point(speed, 0);
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
            timestamp_end: currentTime,
            timestamp_start: lastCommitTmp.timestamp_start,
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
        object.setRotation(swap.rotation, this.physicContext);

        if (object.isStatic) {
            return;
        }

        if (swap.speed !== null) {
            object.setSpeed(swap.speed);
        }

        object.setRotationSpeed(swap.rotationspeed);
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

    /**
     * Мы храним на клиенте все отправленные коммиты (на самом деле, нет, но будет проще считать что все).
     * Само сохранение коммита выглядит так:
     * Commit {
     *   commitId: number; // Уникальный порядковый номер коммита. Считаем, что если этот id больше => коммит был позже.
     *   speed: Speed; // Скорость, которую сервер у себя сеттит.
     *   timestamp_start; // Когда было изменение
     *   timestamp_end; // Когда следующее изменение произошло.
     * }
     * Как только сервер присылает аппрув коммита #3 (а у нас последний коммит #5) с координатами мы делаем следующее:
     * - Принимаем координаты #3
     * - Вычисляем diffX, diffY через #4.diffTimestamp * #4.speed
     * - Добавляем эти коорды к объекту
     * - Вычисляем diffX, diffY через (perfomance.now - #5.timestamp_start) * #5.speed
     * - Добавляем коорды
     * @param objectId
     * @param speed
     */
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
            object.setRotation(object.getRotation() + diff, this.physicContext);
        }
    }

}
