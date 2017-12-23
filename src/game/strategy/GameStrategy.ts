/* tslint:disable no-empty*/
import Constants from '../../utils/Constants';
import ButtonHandler from '../physics/helpers/ButtonHandler';
import TouchHandler from '../physics/helpers/TouchHandler';
import {Direction} from '../physics/object/Direction';

export default abstract class GameStrategy {
    protected leftButton: ButtonHandler;
    protected rightButton: ButtonHandler;
    protected qButton: ButtonHandler;
    protected eButton: ButtonHandler;
    protected upButton: ButtonHandler;
    protected downButton: ButtonHandler;

    protected touchHandler: TouchHandler;

    protected buttons: ButtonHandler[];

    protected verticalPressed: boolean;

    constructor() {
        this.leftButton = new ButtonHandler(Constants.CONTROL_PLATFORM_LEFT);
        this.rightButton = new ButtonHandler(Constants.CONTROL_PLATFORM_RIGHT);
        this.qButton = new ButtonHandler(Constants.CONTROL_PLATFORM_Q);
        this.eButton = new ButtonHandler(Constants.CONTROL_PLATFORM_E);
        this.upButton = new ButtonHandler(Constants.CONTROL_PLATFORM_UP);
        this.downButton = new ButtonHandler(Constants.CONTROL_PLATFORM_DOWN);

        this.touchHandler = new TouchHandler();

        this.buttons = [this.leftButton, this.rightButton, this.qButton,
            this.eButton, this.upButton, this.downButton];
    }

    public onHealthDepletion(healthBlock) {
    }

    public onForceFieldDepletion(forceField) {
    }

    public onGameEnd(loser) {
    }

    public destroy() {
        this.buttons.forEach((button) => {
            console.log(button);
            console.log(button.destroy);
            button.destroy();
        });

        this.touchHandler.destroy();
    }

    public getPlatformDirection() {
        if (this.leftButton.isDown || this.qButton.isDown
            || this.touchHandler.leftActive && !this.touchHandler.rightActive) {
            return Direction.LEFT;
        } else if (this.rightButton.isDown || this.eButton.isDown
            || this.touchHandler.rightActive && !this.touchHandler.leftActive) {
            return Direction.RIGHT;
        } else {
            return Direction.NONE;
        }
    }

}
