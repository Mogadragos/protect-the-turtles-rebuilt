import { AnimationData } from "../datas/animations";

export class ImageController {
    animations: { [key: string]: ImageBitmap[] };

    constructor() {
        this.animations = {};
    }

    async init(animations: AnimationData[]) {
        const promises = [];
        for (const animation of animations) {
            promises.push(
                new Promise<void>(async (resolve) => {
                    const anim = (this.animations[animation.name] =
                        []) as ImageBitmap[];
                    for (const sprite of animation.sprites) {
                        const bitmap = (await this.loadImage(
                            sprite
                        )) as ImageBitmap;
                        if (bitmap) anim.push(bitmap);
                    }
                    resolve();
                })
            );
        }
        return Promise.all(promises);
    }

    loadImage(image_url: string): Promise<void | ImageBitmap> {
        return new Promise((resolve) => {
            var request = new XMLHttpRequest();
            request.open("GET", image_url, true);
            request.responseType = "blob";

            // Decode asynchronously
            request.onload = () => {
                if (request.status == 200) {
                    resolve(createImageBitmap(request.response));
                } else {
                    console.error(
                        "Image didn't load successfully; error code: " +
                            request.statusText
                    );
                    resolve();
                }
            };
            request.send();
        });
    }
}
