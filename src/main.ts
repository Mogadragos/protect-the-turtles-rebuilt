import "./_styles/style.css";
import "./_styles/menu.css";
import "./_styles/levelSelection.css";
import "./_styles/settings.css";
import "./_styles/credits.css";
import "./_styles/game.css";
import "./_styles/hud.css";
import "./_styles/variables.css";

import "./_assets/fonts/BaksoSapi.otf";

import { AudioController } from "./controller/AudioController.ts";
import { GameController } from "./controller/GameController.ts";
import { UIController } from "./controller/UIController.ts";
import { ImageController } from "./controller/ImageController.ts";
import { Level } from "./model/Level.ts";
import { Road } from "./model/Road.ts";
import { Spot } from "./model/Spot.ts";
import { Wave } from "./model/Wave.ts";
import { levelsJSON } from "./datas/levels.ts";
import { animationsJSON } from "./datas/animations.ts";
import { soundsJSON } from "./datas/sounds.ts";
import { Constants } from "./utils/Constants.ts";
import { PubSub } from "./utils/PubSub.ts";

declare global {
    interface Window {
        imageController: ImageController;
    }
}

interface Canvases {
    [key: string]: HTMLCanvasElement;
}

function resizeCanvases(canvases: Canvases) {
    for (const id in canvases) {
        const canvas = canvases[id];
        canvas.width = Constants.width;
        canvas.height = Constants.height;
    }
}

function loadLevels(canvases: Canvases) {
    let levels = [];

    //Chargement des données depuis le JSON
    const levelsJSONCopy: typeof levelsJSON = JSON.parse(
        JSON.stringify(levelsJSON)
    );

    for (let index in levelsJSONCopy) {
        let levelImage = levelsJSONCopy[index].image;
        let levelRoads = levelsJSONCopy[index].roads.map((road: any) => {
            return new Road(road);
        });
        let levelSpots = levelsJSON[index].spots.map((spot) => {
            return new Spot(canvases.spots.getContext("2d")!, spot.x, spot.y);
        });
        let levelWaves = levelsJSONCopy[index].waves.map((wave) => {
            return new Wave(wave.timing, wave.enemies);
        });
        let nbTurtles = levelsJSON[index].nbTurtles;
        let startingGoldAmount = levelsJSON[index].startingGoldAmount;

        levels.push(
            new Level(
                levelImage,
                levelRoads,
                levelSpots,
                levelWaves,
                nbTurtles,
                startingGoldAmount
            )
        );
    }

    return levels;
}

function getCanvases(): Canvases {
    const roads = document.getElementById("roads") as HTMLCanvasElement;
    const spots = document.getElementById("spots") as HTMLCanvasElement;
    const enemies = document.getElementById("enemies") as HTMLCanvasElement;
    const towers = document.getElementById("towers") as HTMLCanvasElement;
    return { roads, spots, enemies, towers };
}

const pubSub = new PubSub();

const audioController = new AudioController(pubSub);

window.imageController = new ImageController(pubSub);

async function init() {
    const promises = [];
    promises.push(audioController.init(soundsJSON, "menu"));
    promises.push(window.imageController.init(animationsJSON));

    await Promise.all(promises);
}

window.onload = () => {
    const canvases = getCanvases();
    resizeCanvases(canvases);

    const levels = loadLevels(canvases);

    const gameController = new GameController(pubSub, levels, canvases);

    const uiController = new UIController(pubSub, gameController);

    uiController.init();
    init();
};
