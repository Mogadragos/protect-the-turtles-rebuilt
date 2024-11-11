import { GameController } from "../controller/GameController.ts";
import { Enemy } from "./Enemy.ts";
import { Tower } from "./Tower.ts";

export class TowerWithTarget extends Tower {
    target: Enemy | null;

    constructor(
        gameController: GameController,
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        range: number,
        damage: number,
        reloadTime: number,
        allAnimations: ImageBitmap[][]
    ) {
        super(
            gameController,
            ctx,
            x,
            y,
            width,
            height,
            Math.PI / 2,
            range,
            damage,
            reloadTime,
            allAnimations
        );
        this.target = null;
    }

    getTarget() {
        let target = null;
        let maxAliveTime = 0;
        for (const enemy of this.gameController.enemies) {
            const distance = this.getDistance(enemy);
            if (distance < this.range && maxAliveTime < enemy.aliveTime) {
                maxAliveTime = enemy.aliveTime;
                target = enemy;
            }
        }
        return target;
    }

    update(dt: number) {
        super.update(dt);

        if (
            !this.target ||
            this.target.killed ||
            this.getDistance(this.target) > this.range
        ) {
            this.target = this.getTarget();
            if (!this.target) return;
        }

        this.rotation = Math.atan2(
            this.target.y - this.y,
            this.target.x - this.x
        );

        if (this.shootReady) {
            this.setAnimation(1, 0.05);
            // Attack
            this.target.takeDamage(this.damage);
            this.shootReady = false;
            this.time = 0;
        }
    }
}
