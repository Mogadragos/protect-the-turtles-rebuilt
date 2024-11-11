import { EnemiesData } from "../datas/levels";

export class Wave {
    timing: number;
    enemies: EnemiesData;

    constructor(timing: number, enemies: EnemiesData) {
        this.timing = timing;
        this.enemies = enemies;
    }
}
