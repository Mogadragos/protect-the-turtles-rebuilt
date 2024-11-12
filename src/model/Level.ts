import { Enemy } from "./Enemy.ts";
import { DrawPath } from "./PathDrawer.ts";
import { Road } from "./Road.ts";
import { Spot } from "./Spot.ts";
import { Wave } from "./Wave.ts";

import Chemin_texture from "../_assets/textures/Chemin_texture.png";

export class Level {
    background: string;
    roads: Road[];
    spots: Spot[];
    waves: Wave[];
    golds: number;

    enemiesCtx: CanvasRenderingContext2D;
    time: number;

    cooldown: number;

    nbEnemies: number;
    nbTurtles: number;

    constructor(
        background: string,
        roads: Road[],
        spots: Spot[],
        waves: Wave[],
        nbTurtles: number,
        startingGoldAmount: number
    ) {
        this.background = background;
        this.roads = roads;
        this.spots = spots;
        this.waves = waves;
        this.golds = startingGoldAmount;

        this.enemiesCtx = (
            document.getElementById("enemies") as HTMLCanvasElement
        ).getContext("2d")!;
        this.time = 0;

        this.reset();
        this.cooldown = 0;

        this.nbEnemies = 0;
        this.nbTurtles = nbTurtles;
    }

    reset() {
        this.nbEnemies = 0;

        for (let spot of this.spots) {
            spot.tower = null;
        }
    }

    init() {
        this.reset();

        (document.getElementById("background") as HTMLImageElement).src =
            this.background;

        const ctxRoads = (
            document.getElementById("roads") as HTMLCanvasElement
        ).getContext("2d")!;

        ctxRoads.strokeStyle = "#a3a2af";
        ctxRoads.lineWidth = 50;
        ctxRoads.lineCap = "round";

        for (const road of this.roads) {
            for (const curve of road.curves) {
                DrawPath(ctxRoads, curve, Chemin_texture);
            }
        }

        for (const spot of this.spots) {
            spot.render();
        }

        document.getElementById("goldAmount")!.innerHTML =
            this.golds.toString();
    }

    update(dt: number) {
        if (this.waves.length) {
            if (this.time > this.waves[0].timing) {
                this.cooldown -= dt;
                if (this.waves[0].enemies.number > 0) {
                    if (this.cooldown <= 0) {
                        this.cooldown = this.waves[0].enemies.cooldown;
                        this.waves[0].enemies.number--;

                        return new Enemy(
                            this.enemiesCtx,
                            this.roads[0],
                            this.waves[0].enemies.health,
                            this.waves[0].enemies.speed,
                            this.waves[0].enemies.gold
                        );
                    }
                } else {
                    this.waves.shift();
                }
            }
        }

        this.time += dt;

        return;
    }
}
