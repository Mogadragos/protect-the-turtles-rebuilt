import { Entity } from "./Entity.ts";
import { Tower } from "./Tower.ts";

export class Spot extends Entity {
    tower: Tower | null;
    radius: number;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
        super(ctx, x, y, 80, 80);

        this.tower = null;
        this.radius = 80;
    }

    render() {
        this.ctx.fillStyle = "#DDA253";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
