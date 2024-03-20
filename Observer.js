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
            this.#remoteSignals.set(prop, signal);
            const ref = signal.deref();
            ref?.addEventListener(eventSuggestion, e => {
                this.#pullInValuesToEnhancedElement(self);
            });
        }
        this.#pullInValuesToEnhancedElement(self);
    }
    async #pullInValuesToEnhancedElement(self) {
        const { setRules, enhancedElement } = self;
        if (setRules === undefined) {
            if (this.#remoteSignals.entries.length > 1)
                throw 'NI';
            const { getLocalSignal } = await import('be-linked/defaults.js');
            const localSignal = await getLocalSignal(enhancedElement);
            for (const [key, value] of this.#remoteSignals) {
                console.log({ key, value, localSignal });
                const remoteRef = value.deref();
                const remoteVal = remoteRef[key];
                console.log({ remoteRef, remoteVal });
                const { prop, signal } = localSignal;
                signal[prop] = remoteVal;
            }
        }
    }
    #remoteSignals = new Map();
}
export class LoadEvent extends Event {
}
