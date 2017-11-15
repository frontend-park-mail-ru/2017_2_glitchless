import Constants from '../utils/Constants';
import EventBus from './GameEventBus';
import GameScene from './GameScene';
import GameStrategy from './GameStrategy';

import CollisionManager from './physics/CollisionManager';
import ForceField from './physics/object/ForceField';
import Platform from './physics/object/Platform';
import Point from './physics/object/primitive/Point';

import Player from './Player';

const forceFieldBarTexture = PIXI.Texture.fromImage('./images/shield_gui_status.png');
const forceFieldBarBackgroundTexture = PIXI.Texture.fromImage('./images/shield_gui_background.png');
export default class SinglePlayerStrategy extends GameStrategy {
    public players: Player[];
    public forceFieldBarPos: Point[];
    public forceFieldBars: PIXI.Sprite[];
    public botPlatform: Platform;
    private laserDamage: number;
    private scene: GameScene;

    constructor(scene) {
        super();
        this.players = [new Player(0), new Player(1)];
        const marginX = 100;
        const marginY = Constants.INITIAL_RES[1] / 2 + Constants.GAME_FORCEFIELD_BAR_SIZE[1] / 2;

        const forceFieldBarPos1 = new Point(marginX, marginY);
        const forceFieldBarPos2 = new Point(Constants.INITIAL_RES[0] - marginX + Constants.GAME_FORCEFIELD_BAR_SIZE[0],
            marginY);

        this.forceFieldBarPos = [forceFieldBarPos1, forceFieldBarPos2];
        this.forceFieldBars = [];
        this.laserDamage = 20;
        this.scene = scene;
    }

    public initUI() {
        this._drawForceFieldBars(this.scene);
    }

    public gameplayTick(physicContext) {
        this.processBotLogic(physicContext);
        this.processControls(physicContext, physicContext.spriteStorage.userPlatform);
    }

    public onForceFieldDepletion(forcefield: ForceField) {
        const playerNum = forcefield.playerNumber;
        const player = this.players[playerNum];
        const oldShieldValue = player.shield;

        let newShieldValue = player.shield - this.laserDamage;
        player.shield = newShieldValue;
        if (newShieldValue <= 0) {
            newShieldValue = 0;
            forcefield.onChargeEnd();
        }

        this.updateBar(playerNum, (newShieldValue / player.maxShield) * 100);
    }

    public onHpLoss(hpblock) {
        const playerNum = hpblock.playerNumber;
        console.log(playerNum);
        const player = this.players[playerNum];
        player.health -= 1;
        console.log(player);
        if (player.health === 0) {
            this.onGameEnd(playerNum);
        }
    }

    public updateBar(num, percent) {
        this.forceFieldBars[num].height = this.scene.scaleLength(Constants.GAME_FORCEFIELD_BAR_SIZE[1]) * percent / 100;
    }

    public onGameEnd(loser: number) {
        const winner = (loser + 1) % 2;
        console.log(winner);
        EventBus.emitEvent('player_won', winner);
    }

    private _drawForceFieldBars(scene) {
        this.forceFieldBarPos.forEach(function(position) {
            const forceFieldBar = new PIXI.Sprite(forceFieldBarTexture);
            const forceFieldBarBackground = new PIXI.Sprite(forceFieldBarBackgroundTexture);
            forceFieldBar.anchor.set(1);
            forceFieldBarBackground.anchor.set(1);

            scene.addObject(forceFieldBarBackground);
            scene.setSize(forceFieldBarBackground, Constants.GAME_FORCEFIELD_BAR_SIZE);
            scene.setCoords(forceFieldBarBackground, position);

            scene.setSize(forceFieldBar, Constants.GAME_FORCEFIELD_BAR_SIZE);
            scene.setCoords(forceFieldBar, position);
            scene.addObject(forceFieldBar);
            this.forceFieldBars.push(forceFieldBar);
        }.bind(this));
    }

     private processControls(context, platform) {
        if (this.downButton.isUp && this.upButton.isUp) {
            this.verticalPressed = false;
        }

        if (!this.verticalPressed && this.downButton.isDown) {
            this.verticalPressed = true;
            platform.circleLevel = (platform.circleLevel - 1) >= 0 ? platform.circleLevel - 1 : 2;
            platform.setCircle(context.physicObjects.circle[platform.circleLevel], context);
        } else {
            if (!this.verticalPressed && this.upButton.isDown) {
                this.verticalPressed = true;
                platform.circleLevel = (platform.circleLevel + 1) % 3;
                platform.setCircle(context.physicObjects.circle[platform.circleLevel], context);
            }
        }

        if (this.leftButton.isDown || this.qButton.isDown) {
            platform.setMoveDirection('left');
        } else if (this.rightButton.isDown || this.eButton.isDown) {
            platform.setMoveDirection('right');
        } else {
            platform.setMoveDirection('none');
        }
    }

    private processBotLogic(physicContext) {
        const enemyPlatform = physicContext.spriteStorage.enemyPlatform;
        const lasers = physicContext.physicObjects.laser;
        const forcefield = physicContext.physicObjects.forcefield[1];
        const platformCoords = enemyPlatform.getCoords().copy();
        const mapCenter = physicContext._getCenterPoint();
        const platformRotation = enemyPlatform.getRotation();
        if (platformRotation < 90 || platformRotation > 358) {
            enemyPlatform.setMoveDirection('right');
            return;
        }
        if (platformRotation < 181) {
            enemyPlatform.setMoveDirection('left');
            return;
        }

        let minDistance = Infinity;
        let closestLaser;
        let dangerPoint;
        lasers.forEach((laser) => {
            const collision = CollisionManager.checkCollision(
                laser.getCoords(), laser.getSpeed(), forcefield.collisionArc,
                0, false, true);
            if (!collision) {
                return; // Laser is not going to hit our half of the field, no need to worry
            }
            const laserCoords = collision[0];
            const distance = laserCoords.copy()
                .apply(-platformCoords.x, -platformCoords.y)
                .getLength();

            if (distance >= minDistance) {
                return; // We have more sudden threats to worry about
            }

            minDistance = distance;
            closestLaser = laser;
            dangerPoint = collision[0];
        });

        if (!closestLaser) {
            enemyPlatform.setMoveDirection('none');
            return; // No lasers are going for our half of the field, who are we to complain? Just chillax.
        }

        if (dangerPoint.y * 1
            / Math.sin(Constants.GAME_FORCEFIELD_RADIUS / Constants.GAME_CIRCLE1_RADIUS * dangerPoint.y)
            > platformCoords.y) {
            enemyPlatform.setMoveDirection('left');
        } else {
            enemyPlatform.setMoveDirection('right');
        }
    }

}
