import PhysicsObject from './primitive/PhysicsObject';

const basicForceFieldSprite ='';

export default class ForceField extends PhysicsObject {
    constructor(speed, context) {
        super(basicForceFieldSprite, context);
        this.speed = speed;
    }
}
