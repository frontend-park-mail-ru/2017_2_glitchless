export default class Player {
    health: number;
    shield: number;
    id: number;
    
    constructor(id) {
        this.health = 3;
        this.shield = 100;
        this.id = id;
    }
}
