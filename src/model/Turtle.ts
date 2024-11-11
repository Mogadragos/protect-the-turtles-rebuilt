import { Entity } from "./Entity.ts";
import { Road } from "./Road.ts";

export class Turtle extends Entity {
    killed: boolean;
    dropped: boolean;
    positionTime?: number;
    road?: Road;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
        super(ctx, x, y, 100, 100, Math.PI / 2, [
            window.imageController.animations.turtleIdle,
            window.imageController.animations.turtleGrabbed,
            window.imageController.animations.turtleDropped,
        ]);
        this.dropped = false;
        this.killed = false;
        this.rotation = Math.random() * 2 * Math.PI;
    }

    drop(positionTime: number, road: Road) {
        this.dropped = true;

        this.positionTime = positionTime;
        this.road = road;
        // play sound
        this.setAnimation(1, 0);
    }
}
