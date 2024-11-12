import { PubSub } from "../utils/PubSub";

export abstract class AbstractController {
    pubSub: PubSub;

    constructor(pubSub: PubSub) {
        this.pubSub = pubSub;
    }
}
