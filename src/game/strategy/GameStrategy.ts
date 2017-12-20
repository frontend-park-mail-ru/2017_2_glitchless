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
    protected buttons: ButtonHandler[];
    protected verticalPressed: boolean;

    constructor() {
        this.leftButton = new ButtonHandler(Constants.CONTROL_PLATFORM_LEFT);
        this.rightButton = new ButtonHandler(Constants.CONTROL_PLATFORM_RIGHT);
        this.qButton = new ButtonHandler(Constants.CONTROL_PLATFORM_Q);
        this.eButton = new ButtonHandler(Constants.CONTROL_PLATFORM_E);
        this.upButton = new ButtonHandler(Constants.CONTROL_PLATFORM_UP);
        this.downButton = new ButtonHandler(Constants.CONTROL_PLATFORM_DOWN);
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
    }
}
