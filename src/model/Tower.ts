import { GameController } from "../controller/GameController.ts";
import { Enemy } from "./Enemy.ts";
import { Entity } from "./Entity.ts";

export class Tower extends Entity {
    gameController: GameController;
    range: number;
    damage: number;
    reloadTime: number;
    time: number;
    shootReady: boolean;

    constructor(
        gameController: GameController,
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        initialRotation: number,
        range: number,
        damage: number,
        reloadTime: number,
        allAnimations: ImageBitmap[][],
        spriteTime = 0
    ) {
        super(
            ctx,
            x,
            y,
            width,
            height,
            initialRotation,
            allAnimations,
            spriteTime
        );

        this.gameController = gameController;
        this.range = range;
        this.damage = damage;
        this.time = this.reloadTime = reloadTime;
        this.shootReady = true;
    }

    getDistance(entity: Enemy) {
        const x = this.x - entity.x;
        const y = this.y - entity.y;
        return Math.sqrt(x * x + y * y);
    }

    update(dt: number) {
        super.update(dt);
        if (!this.shootReady) {
            this.time += dt;
            if (!(this.time < this.reloadTime)) this.shootReady = true;
        }
    }

    render() {
        super.render();

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
