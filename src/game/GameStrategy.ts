/* tslint:disable no-empty*/
import ButtonHandler from './physics/helpers/ButtonHandler';
import Constants from '../utils/Constants';
export default abstract class GameStrategy {
    leftButton: ButtonHandler;
    rightButton: ButtonHandler;
    qButton: ButtonHandler;
    eButton: ButtonHandler;
    upButton: ButtonHandler;
    downButton: ButtonHandler;
    verticalPressed: Boolean;
    constructor() {
        this.leftButton = new ButtonHandler(Constants.CONTROL_PLATFORM_LEFT);
        this.rightButton = new ButtonHandler(Constants.CONTROL_PLATFORM_RIGHT);
        this.qButton = new ButtonHandler(Constants.CONTROL_PLATFORM_Q);
        this.eButton = new ButtonHandler(Constants.CONTROL_PLATFORM_E);
        this.upButton = new ButtonHandler(Constants.CONTROL_PLATFORM_UP);
        this.downButton = new ButtonHandler(Constants.CONTROL_PLATFORM_DOWN);
    }

    public onHealthDepletion(healthBlock) {
    }

    public onForceFieldDepletion(forceField) {
    }

    public onGameEnd(loser) {
    }
}
