import { Enemy } from "../model/Enemy.js";
import { Level } from "../model/Level.js";
import { Tower } from "../model/Tower.js";
import { Turtle } from "../model/Turtle.js";
import { PubSub } from "../utils/PubSub.js";
import { AbstractController } from "./AbstractController.js";

interface Canvases {
    [key: string]: HTMLCanvasElement;
}

export class GameController extends AbstractController {
    // FPS
    then: DOMHighResTimeStamp;
    interval: number;
    delta: number;

    // Execution
    paused: boolean;

    // Level
    levels: Level[];
    level!: Level;

    // Entities
    enemies: Enemy[];
    towers: Tower[];
    turtles: Turtle[];
    indexBaseTurtle: number;

    // DOM
    canvasesDict: Canvases;
    canvases: HTMLCanvasElement[];
    dynamicCanvases: HTMLCanvasElement[];

    goldAmoundDOM: HTMLParagraphElement;

    constructor(pubSub: PubSub, levels: Level[], canvases: Canvases) {
        super(pubSub);

        // FPS
        const fps = 60;
        this.then = 0;
        this.interval = 1000 / fps;
        this.delta = 0;

        this.levels = levels;
        this.enemies = [];
        this.towers = [];
        this.turtles = [];
        this.indexBaseTurtle = 0;

        this.canvasesDict = canvases;
        this.canvases = Object.values(canvases);
        this.dynamicCanvases = [canvases.enemies, canvases.towers];

        this.goldAmoundDOM = document.getElementById(
            "goldAmount"
        )! as HTMLParagraphElement;

        this.paused = false;
    }

    setLevel(index: number) {
        this.reset();
        this.level = this.levels[index];
        this.level.init();

        let firstRoad = this.level.roads[0],
            { x4, y4 } = firstRoad.curves[firstRoad.lastCurveIndex],
            turtleCtx = this.canvasesDict.enemies.getContext("2d")!;
        for (let i = 0; i < this.level.nbTurtles; i++) {
            this.turtles.push(new Turtle(turtleCtx, x4, y4));
        }
    }

    clearCanvases(canvases: HTMLCanvasElement[]) {
        // Canvases
        for (const canvas of canvases) {
            const ctx = canvas.getContext("2d")!;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    reset() {
        this.clearCanvases(this.canvases);
        // Entities
        this.enemies = [];
        this.towers = [];
        this.indexBaseTurtle = 0;
        this.turtles = [];
    }

    play() {
        this.paused = false;
        this.then = performance.now();
        this.loop();
    }

    pause() {
        this.paused = true;
    }

    loop() {
        if (this.paused) return;
        requestAnimationFrame(() => this.loop());

        const now = performance.now();
        this.delta = now - this.then;

        if (this.delta > this.interval) {
            this.then = now - (this.delta % this.interval);

            this.update();
            this.clearCanvases(this.dynamicCanvases);
            this.render();
        }
    }

    addTower(tower: Tower) {
        this.towers.push(tower);
    }

    /**
     * Calculate data of each entity
     */
    update() {
        const dt = this.delta / 1000 / 2;
        const temp_enemies = this.level.update(dt);
        if (temp_enemies) this.enemies = this.enemies.concat(temp_enemies);

        for (const tower of this.towers) {
            tower.update(dt);
        }

        let enemy_index = this.enemies.length;
        while (enemy_index--) {
            const enemy = this.enemies[enemy_index];
            if (enemy.killed) {
                if (enemy.health <= 0) {
                    this.level.golds += this.enemies[enemy_index].gold;
                    this.goldAmoundDOM.innerHTML = this.level.golds.toString();
                }

                this.enemies.splice(enemy_index, 1);
            }
            enemy.update(dt);
            if (enemy.tryGetTurtle) {
                if (this.indexBaseTurtle < this.turtles.length) {
                    this.pubSub.publish("catch_turtle");
                    enemy.setTurtle(this.turtles[this.indexBaseTurtle++]);
                }
                enemy.tryGetTurtle = false;
            }
        }

        let turtles_index = this.turtles.length;
        while (turtles_index--) {
            const turtle = this.turtles[turtles_index];
            if (turtle.killed) {
                this.turtles.splice(turtles_index, 1);
            }
        }
    }

    /**
     * Render each entity
     */
    render() {
        let enemy_index = this.enemies.length;
        while (enemy_index--) {
            this.enemies[enemy_index].render();
        }
        for (const tower of this.towers) {
            tower.render();
        }
        for (const turtle of this.turtles) {
            turtle.render();
        }
    }
}
