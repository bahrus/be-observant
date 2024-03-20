import { WatchSeeker } from './WatchSeeker.js';
export class Observer {
    constructor(self) {
        this.do(self);
    }
    async do(self) {
        const { observedFactors, enhancedElement } = self;
        if (observedFactors === undefined)
            throw 'NI';
        for (const observedFactor of observedFactors) {
            const { prop } = observedFactor;
            const watchSeeker = new WatchSeeker(observedFactor, false);
            const res = await watchSeeker.do(self, undefined, enhancedElement);
            const { eventSuggestion, signal } = res;
            this.#signals.set(prop, signal);
            const ref = signal.deref();
            ref?.addEventListener(eventSuggestion, e => {
                this.#invokeLoadEvent(self);
            });
        }
        this.#invokeLoadEvent(self);
    }
    async #invokeLoadEvent(self) {
    }
    #signals = new Map();
}
export class LoadEvent extends Event {
}
