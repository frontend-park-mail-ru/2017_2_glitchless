export default class Player {
    public health: number;
    public shield: number;
    public maxShield: number;
    public score: number;
    public id: number;

    constructor(id) {
        this.health = 5;
        this.maxShield = 100;
        this.shield = this.maxShield;
        this.score = 0;
        this.id = id;
    }
}
