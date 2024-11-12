import { SoundData } from "../datas/sounds";
import { PubSub } from "../utils/PubSub";
import { AbstractController } from "./AbstractController";

declare global {
    interface Window {
        webkitAudioContext: AudioContext;
    }
}

type Track = SoundData & {
    buffer?: AudioBuffer;
};

interface Tracks {
    [key: string]: Track;
}

export class AudioController extends AbstractController {
    musicOn: boolean;
    soundOn: boolean;

    audioCtx: AudioContext;
    soundCtx: AudioContext;

    audioGain: GainNode;
    soundGain: GainNode;

    tracks: Tracks;

    musicSource?: AudioBufferSourceNode;

    constructor(pubSub: PubSub) {
        super(pubSub);

        this.musicOn =
            (localStorage.getItem("musicOn") as unknown as number) < 1;
        this.soundOn =
            (localStorage.getItem("soundOn") as unknown as number) < 1;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.audioGain = this.audioCtx.createGain();
        this.audioGain.connect(this.audioCtx.destination);
        this.soundCtx = new AudioContext();
        this.soundGain = this.soundCtx.createGain();
        this.soundGain.connect(this.soundCtx.destination);
        this.tracks = {};

        this.toggleMusic();
        this.toggleSound();

        this.pubSub.subscribe("catch_turtle", () => this.play("alarm"));
        this.pubSub.subscribe("buy", () => this.play("buy_sell"));
        this.pubSub.subscribe("click", () => this.play("click"));
        this.pubSub.subscribe("refuse_action", () => this.play("error"));
        this.pubSub.subscribe("screen_game", () => this.play("ambient"));
        this.pubSub.subscribe("screen_menu", () => this.play("menu"));
    }

    async init(tracks: SoundData[], menuMusic: string) {
        const btnMusicToggle = document.getElementById("toggleMusic")!;
        const btnSoundToggle = document.getElementById("toggleSound")!;

        btnMusicToggle.onclick = () => {
            this.pubSub.publish("click");
            this.toggleMusic();
        };
        btnSoundToggle.onclick = () => {
            this.pubSub.publish("click");
            this.toggleSound();
        };

        const promises = [];
        for (const track of tracks) {
            promises.push(this.loadTrack(track));
        }
        return Promise.all(promises).then(() => {
            this.play(menuMusic);
        });
    }

    play(trackName: string) {
        const track = this.tracks[trackName];
        if (track) {
            let source;
            if (track.sound) {
                source = this.soundCtx.createBufferSource();
                source.connect(this.soundGain);
            } else {
                if (this.musicSource) this.musicSource.stop();
                this.musicSource = source = this.audioCtx.createBufferSource();
                source.connect(this.audioGain);
            }
            source.buffer = track.buffer!;
            if (track.loop) source.loop = true;
            source.start();
        } else
            console.warn('[ AudioController ] "' + trackName + '" not found !');
    }

    loadTrack(track: Track): Promise<void> {
        return new Promise((resolve) => {
            var request = new XMLHttpRequest();
            request.open("GET", track.url, true);
            request.responseType = "arraybuffer";

            // Decode asynchronously
            request.onload = () => {
                if (request.status == 200) {
                    this.audioCtx.decodeAudioData(
                        request.response,
                        (buffer) => {
                            track.buffer = buffer;
                            this.tracks[track.name] = track;
                            resolve();
                        },
                        function (e) {
                            console.error(
                                `Error decoding audio data for ${track.url}:`,
                                e
                            );
                            resolve();
                        }
                    );
                } else {
                    console.error(
                        "Audio didn't load successfully; error code: " +
                            request.statusText
                    );
                    resolve();
                }
            };
            request.send();
        });
    }

    toggleMusic() {
        this.musicOn = !this.musicOn;

        if (this.musicOn) {
            document.getElementById("music-off")!.style.display = "none";
            document.getElementById("music-on")!.style.display = "";
            this.audioGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
            localStorage.setItem("musicOn", "1");
        } else {
            document.getElementById("music-on")!.style.display = "none";
            document.getElementById("music-off")!.style.display = "";
            this.audioGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
            localStorage.setItem("musicOn", "0");
        }
    }

    toggleSound() {
        this.soundOn = !this.soundOn;

        if (this.soundOn) {
            document.getElementById("sound-off")!.style.display = "none";
            document.getElementById("sound-on")!.style.display = "";
            this.soundGain.gain.setValueAtTime(1, this.soundCtx.currentTime);
            localStorage.setItem("soundOn", "1");
        } else {
            document.getElementById("sound-on")!.style.display = "none";
            document.getElementById("sound-off")!.style.display = "";
            this.soundGain.gain.setValueAtTime(0, this.soundCtx.currentTime);
            localStorage.setItem("soundOn", "0");
        }
    }
}
