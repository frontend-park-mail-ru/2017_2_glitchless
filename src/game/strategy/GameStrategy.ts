/* tslint:disable no-empty*/
import Constants from '../../utils/Constants';
import ButtonHandler from '../physics/helpers/ButtonHandler';

export default abstract class GameStrategy {
    protected leftButton: ButtonHandler;
    protected rightButton: ButtonHandler;
    protected qButton: ButtonHandler;
    protected eButton: ButtonHandler;
    protected upButton: ButtonHandler;
    protected downButton: ButtonHandler;
    protected verticalPressed: boolean;

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