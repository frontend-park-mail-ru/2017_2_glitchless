export default class Player {
    public health: number;
    public shield: number;
    public maxShield: number;
    public id: number;

    constructor(id) {
        this.health = 5;
        this.maxShield = 100;
        this.shield = this.maxShield;
        this.id = id;
    }
}
