import { TowerWithTarget } from "../model/TowerWithTarget.js";
import { Campfire } from "../model/Campfire.js";
import { GameController } from "./GameController.js";
import { Spot } from "../model/Spot.js";
import { Constants } from "../utils/Constants.js";
import { AbstractController } from "./AbstractController.js";
import { PubSub } from "../utils/PubSub.js";

export class UIController extends AbstractController {
    gameController: GameController;
    menuOpened: boolean;
    currentSelectedSpot: Spot | null;

    constructor(pubSub: PubSub, gameController: GameController) {
        super(pubSub);

        this.menuOpened = true;
        this.gameController = gameController;
        this.currentSelectedSpot = null;
    }

    init() {
        this.initMenu();

        //#region HUD
        document.getElementById("resume")!.onclick = () => {
            this.pubSub.publish("click");
            document.getElementById("pause")!.style.display = "";
            document.getElementById("golds")!.style.display = "";
            document.getElementById("pauseMenu")!.style.display = "none";
            document.getElementById("hud")!.style.display = "none";
            this.resume();
        };

        document.getElementById("exit")!.onclick = () => {
            this.pubSub.publish("click");
            document.getElementById("pause")!.style.display = "none";
            document.getElementById("golds")!.style.display = "none";
            document.getElementById("pauseMenu")!.style.display = "none";
            document.getElementById("hud")!.style.display = "none";
            document.getElementById("menu")!.style.display = "";
            this.quit();
        };

        document.getElementById("pause")!.onclick = () => {
            this.pubSub.publish("click");
            document.getElementById("pause")!.style.display = "none";
            document.getElementById("golds")!.style.display = "none";
            document.getElementById("pauseMenu")!.style.display = "";
            document.getElementById("hud")!.style.display = "";
            this.pause();
        };
        //#endregion

        //#region hud menus
        document.getElementById("closeBuyMenu")!.onclick = () => {
            this.pubSub.publish("click");
            this.closeBuyMenu();
        };
        document.getElementById("closeUpgradeMenu")!.onclick = () => {
            this.pubSub.publish("click");
            this.closeUpgradeMenu();
        };
        //#endregion

        //#region Buy menu
        document.getElementById("volunteer")!.onclick = () => {
            if (
                this.currentSelectedSpot &&
                this.gameController.level.golds >= 50
            ) {
                this.pubSub.publish("buy");
                this.gameController.level.golds -= 50;
                this.updateGoldAmount();
                const width = 80;
                let newTower = new TowerWithTarget(
                    this.gameController,
                    this.gameController.canvasesDict.towers.getContext("2d")!,
                    this.currentSelectedSpot.x,
                    this.currentSelectedSpot.y,
                    width,
                    (width * 181) / 120,
                    300,
                    4,
                    0.5,
                    [
                        window.imageController.animations.volunteerIdle,
                        window.imageController.animations.volunteerShot,
                    ]
                );

                this.currentSelectedSpot.tower = newTower;
                this.gameController.addTower(newTower);
                this.closeBuyMenu();
            } else {
                this.pubSub.publish("refuse_action");
            }
        };

        document.getElementById("campfire")!.onclick = () => {
            if (
                this.currentSelectedSpot &&
                this.gameController.level.golds >= 100
            ) {
                this.pubSub.publish("buy");
                this.gameController.level.golds -= 100;
                this.updateGoldAmount();
                let newTower = new Campfire(
                    this.gameController,
                    this.gameController.canvasesDict.towers.getContext("2d")!,
                    this.currentSelectedSpot.x,
                    this.currentSelectedSpot.y
                );

                this.currentSelectedSpot.tower = newTower;
                this.gameController.addTower(newTower);
                this.closeBuyMenu();
            } else {
                this.pubSub.publish("refuse_action");
            }
        };

        document.getElementById("policeman")!.onclick = () => {
            if (
                this.currentSelectedSpot &&
                this.gameController.level.golds >= 200
            ) {
                this.pubSub.publish("buy");
                this.gameController.level.golds -= 200;
                this.updateGoldAmount();
                const width = 80;
                let newTower = new TowerWithTarget(
                    this.gameController,
                    this.gameController.canvasesDict.towers.getContext("2d")!,
                    this.currentSelectedSpot.x,
                    this.currentSelectedSpot.y,
                    width,
                    (width * 231) / 120,
                    600,
                    15,
                    1.2,
                    [
                        window.imageController.animations.policemanIdle,
                        window.imageController.animations.policemanShot,
                    ]
                );

                this.currentSelectedSpot.tower = newTower;
                this.gameController.addTower(newTower);
                this.closeBuyMenu();
            } else {
                this.pubSub.publish("refuse_action");
            }
        };

        //#endregion

        //#region Upgrade menu
        document.getElementById("sell")!.onclick = () => {
            //remove tower from the game controller towers
            let index = this.gameController.towers.indexOf(
                this.currentSelectedSpot!.tower!
            );
            if (index > -1) {
                this.gameController.towers.splice(index, 1);

                //remove the reference of the spot
                this.currentSelectedSpot!.tower = null;
                //play sound
                this.pubSub.publish("buy");
                //close menu
                this.closeUpgradeMenu();

                //Add golds & update
                this.gameController.level.golds += 10;
                this.updateGoldAmount();
            }
        };
        //#endregion

        //#region Spot click
        document.getElementById("towers")!.onclick = (e) => {
            for (const spot of this.gameController.level.spots) {
                let canvasWidth = document.getElementById("roads")!.offsetWidth;
                let canvasHeight =
                    document.getElementById("roads")!.offsetHeight;

                let x = e.clientX - (window.innerWidth - canvasWidth) / 2;
                let y = e.clientY - (window.innerHeight - canvasHeight) / 2;

                let distance = distanceBetween(
                    {
                        x: (x / canvasWidth) * Constants.width,
                        y: (y / canvasHeight) * Constants.height,
                    },
                    {
                        x: spot.x,
                        y: spot.y,
                    }
                );

                if (distance < spot.radius) {
                    this.pubSub.publish("click");
                    this.currentSelectedSpot = spot;
                    document.getElementById("hud")!.style.display = "";

                    if (!spot.tower) {
                        //Open buy menu
                        document
                            .getElementById("buyMenu")!
                            .classList.remove("hidden");
                    } else {
                        //Open upgrade menu
                        document
                            .getElementById("upgradeMenu")!
                            .classList.remove("hidden");
                    }
                }
            }
        };
        //#endregion
    }

    initMenu() {
        for (let btn of document.getElementsByClassName(
            "navBtn"
        ) as HTMLCollectionOf<HTMLButtonElement>) {
            btn.onclick = (e) => {
                this.pubSub.publish("click");
                this.navigate((e.target as HTMLElement).dataset.to!);
            };
        }

        for (let btn of document.getElementsByClassName(
            "levelBtn"
        ) as HTMLCollectionOf<HTMLButtonElement>) {
            btn.onclick = (e) => {
                this.pubSub.publish("click");
                document.getElementById("game")!.style.display = "";
                document.getElementById("pause")!.style.display = "";
                document.getElementById("golds")!.style.display = "";
                document.getElementById("levelSelection")!.style.display =
                    "none";
                document.getElementById("menu")!.style.display = "none";
                this.startLevel(
                    (e.target as HTMLElement).dataset.level as unknown as number
                );
            };
        }
    }

    navigate(destination: string) {
        const screens = document.getElementsByClassName(
            "screen"
        ) as HTMLCollectionOf<HTMLElement>;

        for (let screen of screens) {
            screen.style.display = "none";
            if (destination == screen.id) screen.style.display = "";
        }
    }

    startLevel(index: number) {
        this.gameController.setLevel(index);
        this.resume();
        this.pubSub.publish("screen_game");
    }

    pause() {
        this.gameController.pause();
    }

    resume() {
        this.gameController.play();
    }

    quit() {
        this.pause();
        this.navigate("main");
        this.pubSub.publish("screen_menu");
    }

    closeBuyMenu() {
        document.getElementById("buyMenu")!.classList.add("hidden");
        document.getElementById("hud")!.style.display = "none";
    }

    closeUpgradeMenu() {
        document.getElementById("upgradeMenu")!.classList.add("hidden");
        document.getElementById("hud")!.style.display = "none";
    }

    updateGoldAmount() {
        document.getElementById("goldAmount")!.innerHTML =
            this.gameController.level.golds.toString();
    }
}

function distanceBetween(
    from: { x: number; y: number },
    to: { x: number; y: number }
) {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
}
