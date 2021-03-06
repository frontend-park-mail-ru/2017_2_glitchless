import UserModel from '../../../models/UserModel.js';
import Constants from '../../../utils/Constants';
import GameEventBus from '../../GameEventBus';
import EventBus from '../../GameEventBus';
import MagicTransport from '../../io/MagicTransport';
import {Direction} from '../../physics/object/Direction';
import ForceField from '../../physics/object/ForceField';
import Laser from '../../physics/object/Laser';
import Platform from '../../physics/object/Platform';
import PhysicsObject from '../../physics/object/primitive/PhysicsObject.js';
import Point from '../../physics/object/primitive/Point.js';
import MultiplayerStrategy from '../MultiplayerStrategy';

export default class SyncDelegate {
    private magicTransport: MagicTransport;
    private idToObject = {};
    private physicContext;
    private pendingProcessToSend = {};
    private strategy: MultiplayerStrategy;

    // Last commit id - counter
    private counter: number = 0;
    private firstExistCommit: number = 0;

    // {'id', 'speed', 'timestamp_start', 'timestamp_end'}
    private commits = {};

    constructor(magicTransport: MagicTransport, physicContext, strategy: MultiplayerStrategy) {
        this.magicTransport = magicTransport;
        this.physicContext = physicContext;
        this.strategy = strategy;

        GameEventBus.subscribeOn('change_direction', (data) => {
            this.onChangeDirection(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('ServerSnapMessage', (data) => {
            this.applyServerSwapCommit(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('LightServerSnapMessage', (data) => {
            this.applyLightServerSwapCommit(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('LaserCreate', (data) => {
            this.onLaserCreate(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('DestroyObject', (data) => {
            this.onDestroyObject(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('SingleSnapObject', (data) => {
            this.applySingleSwap(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('SyncShield', (data) => {
            this.syncShield(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('EndGameMessage', (data) => {
            this.onGameEnd(data);
        }, this);

        this.magicTransport.eventBus.subscribeOn('LaserDump', (data) => {
            this.onLaserChange(data);
        }, this);
    }

    public onLaserCreate(data) {
        const entity = new Laser(this.physicContext);
        entity.setSpriteSize(Constants.GAME_LASER_SIZE, this.physicContext.gameManager);
        this.physicContext.gameManager.addObject('laser', entity);

        entity.multiplayerId = data.objectId;
        this.idToObject[data.objectId] = entity;

        entity.setSpeed(data.speed);
        entity.setCoords(this.physicContext._getCenterPoint(), this.physicContext);
    }

    public onLaserChange(data) {
        const object = this.idToObject[data.objectId];
        const newPoint = new Point(data.coord.posX, data.coord.posY);
        object.setCoords(newPoint, this.physicContext);
        object.setSpeed(data.speed);
    }

    public onChangeDirection(platformDirectionSnap) {
        const platform: Platform = platformDirectionSnap.platform;
        const direction: Direction = platformDirectionSnap.direction;

        const speed = direction * Constants.GAME_PLATFORM_CONTROL_SPEED;

        this.processObject(platform.multiplayerId, new Point(speed, 0));
    }

    public applyServerSwapCommit(data) {
        const object = this.idToObject[data.objectId];
        object.setRotation(data.rotation, this.physicContext);
        object.setRotationSpeed(data.rotationSpeed);
    }

    public syncShield(data) {
        const object: ForceField = this.idToObject[data.objectId];
        const player = this.strategy.players[object.playerNumber];

        this.strategy.setShield(this.physicContext, player, object.playerNumber, data.shieldVal);
    }

    public applyLightServerSwapCommit(data) {
        const commitId = Math.max(data.commitId, this.firstExistCommit);

        const object = this.idToObject[data.objectId];
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

    public applySingleSwap(data) {
        const snap = data.singleSnapObject;

        const object = this.idToObject[snap.objectId];
        if (snap === null) {
            return;
        }

        this.applySwapSnapshot(object, snap);
    }

    public applySwapSnapshot(object: PhysicsObject, swap) {
        object.multiplayerId = swap.objectId;
        this.idToObject[swap.objectId] = object;

        object.setCoords(new Point(swap.coord.posX, swap.coord.posY), this.physicContext);
        object.setRotation(swap.rotation, this.physicContext);

        if (object.isStatic) {
            return;
        }

        object.forDestroy = swap.isDestroyed;

        if (swap.speed !== null) {
            object.setSpeed(swap.speed);
        }

        object.setRotationSpeed(swap.rotationspeed);
    }

    public onGameEnd(data) {
        const currentPlayerWin = data.winnerLogin === UserModel.loadCurrentSyncronized().login;
        // 0 если выйграл
        if (currentPlayerWin) {
            EventBus.emitEvent('player_won', 0);
            return;
        }
        EventBus.emitEvent('player_won', 1);
    }

    public onDestroyObject(data) {
        if (this.idToObject[data.id] === null) {
            return;
        }
        this.idToObject[data.id].destroy();
        this.idToObject[data.id] = null;
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
