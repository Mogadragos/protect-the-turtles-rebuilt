export type Callback = (data: unknown) => void;

export class PubSub {
    events: { [key: string]: Callback[] };

    constructor() {
        this.events = {};
    }

    subscribe(event: string, handler: Callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);
    }

    unsubscribe(event: string, handler: Callback) {
        if (this.events[event]) {
            const index = this.events[event].findIndex(
                (item) => item === handler
            );
            this.events[event].splice(index, 1);
        }
    }

    publish(event: string, data?: unknown) {
        if (this.events[event]) {
            this.events[event].forEach((handler) => handler(data));
        }
    }
}
