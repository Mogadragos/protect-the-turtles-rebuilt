import Braconnier_1 from "../_assets/sprites/Braconnier_1.png";
import Braconnier_2 from "../_assets/sprites/Braconnier_2.png";
import Braconnier_3 from "../_assets/sprites/Braconnier_3.png";
import Braconnier_4 from "../_assets/sprites/Braconnier_4.png";
import Flame_1 from "../_assets/sprites/Flame_1.png";
import Flame_2 from "../_assets/sprites/Flame_2.png";
import Flame_3 from "../_assets/sprites/Flame_3.png";
import Flame_4 from "../_assets/sprites/Flame_4.png";
import Flame_5 from "../_assets/sprites/Flame_5.png";
import Flame_6 from "../_assets/sprites/Flame_6.png";
import Police_1 from "../_assets/sprites/Police_1.png";
import Police_2 from "../_assets/sprites/Police_2.png";
import Seashepherd_1 from "../_assets/sprites/Seashepherd_1.png";
import Seashepherd_2 from "../_assets/sprites/Seashepherd_2.png";
import Tortue_1 from "../_assets/sprites/Tortue_1.png";
import Tortue_2 from "../_assets/sprites/Tortue_2.png";
import Tortue_3 from "../_assets/sprites/Tortue_3.png";
import Tortue_4 from "../_assets/sprites/Tortue_4.png";
import Tortue_dos_1 from "../_assets/sprites/Tortue_dos_1.png";
import Tortue_dos_2 from "../_assets/sprites/Tortue_dos_2.png";

export type AnimationData = {
    name: string;
    sprites: string[];
};

export const animationsJSON: AnimationData[] = [
    {
        name: "enemy",
        sprites: [Braconnier_1, Braconnier_2, Braconnier_3, Braconnier_4],
    },
    {
        name: "campfire",
        sprites: [Flame_1, Flame_2, Flame_3, Flame_4, Flame_5, Flame_6],
    },
    {
        name: "policemanIdle",
        sprites: [Police_1],
    },
    {
        name: "policemanShot",
        sprites: [Police_2],
    },
    {
        name: "volunteerIdle",
        sprites: [Seashepherd_1],
    },
    {
        name: "volunteerShot",
        sprites: [Seashepherd_2],
    },
    {
        name: "turtleIdle",
        sprites: [Tortue_1],
    },
    {
        name: "turtleGrabbed",
        sprites: [Tortue_1, Tortue_2, Tortue_3, Tortue_4],
    },
    {
        name: "turtleDropped",
        sprites: [Tortue_dos_1, Tortue_dos_2],
    },
];
