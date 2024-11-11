import { GameController } from "../controller/GameController.ts";
import { Tower } from "./Tower.ts";

export class Campfire extends Tower {
    maxRangeFullDamage;
    damageMaxRange;

    constructor(
        gameController: GameController,
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number
    ) {
        const range = 300;
        const damage = 0.8;
        super(
            gameController,
            ctx,
            x,
            y,
            90,
            123,
            0,
            range,
            damage,
            0.4,
            [window.imageController.animations.campfire],
            0.1
        );

        this.maxRangeFullDamage = 0.25 * range;
        this.damageMaxRange = 0.25 * damage;
    }

    mapDamage(distance: number) {
        return (
            this.damage +
            ((this.damageMaxRange - this.damage) *
                (distance - this.maxRangeFullDamage)) /
                (this.range - this.maxRangeFullDamage)
        );
    }

    update(dt: number) {
        super.update(dt);
        if (this.shootReady) {
            for (const enemy of this.gameController.enemies) {
                const distance = this.getDistance(enemy);
                if (distance < this.range) {
                    // Coef d'amenuisement selon distance
                    if (distance < this.maxRangeFullDamage)
                        enemy.takeDamage(this.damage);
                    else enemy.takeDamage(this.mapDamage(distance));
                }
            }
            this.shootReady = false;
            this.time = 0;
        }
    }
}
