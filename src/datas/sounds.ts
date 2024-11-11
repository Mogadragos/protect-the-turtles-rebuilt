import Menu from "../_assets/sounds/Menu.mp3";
import BGM from "../_assets/sounds/BGM.mp3";
import SFX_1 from "../_assets/sounds/SFX_1.mp3";
import SFX_2 from "../_assets/sounds/SFX_2.mp3";
import SFX_3 from "../_assets/sounds/SFX_3.mp3";
import SFX_4 from "../_assets/sounds/SFX_4.mp3";
import SFX_5 from "../_assets/sounds/SFX_5.mp3";
import SFX_6 from "../_assets/sounds/SFX_6.mp3";

export type SoundData = {
    name: string;
    url: string;
    loop?: boolean;
    sound?: boolean;
};

export const soundsJSON: SoundData[] = [
    {
        name: "menu",
        url: Menu,
        loop: true,
    },
    {
        name: "ambient",
        url: BGM,
        loop: true,
    },
    {
        name: "buy_sell",
        url: SFX_1,
        sound: true,
    },
    {
        name: "click",
        url: SFX_2,
        sound: true,
    },
    {
        name: "error",
        url: SFX_3,
        sound: true,
    },
    {
        name: "upgrade",
        url: SFX_4,
        sound: true,
    },
    {
        name: "lose",
        url: SFX_5,
        sound: true,
    },
    {
        name: "alarm",
        url: SFX_6,
        loop: true,
        sound: true,
    },
];
