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
            const { eventSuggestion, signal, propagator } = res;
            const signalAndElO = {
                ...observedFactor,
                signal
            };
            this.#remoteSignals.set(prop, signalAndElO);
            const ref = signal.deref();
            (propagator || ref)?.addEventListener(eventSuggestion, e => {
                this.#pullInValuesToEnhancedElement(self);
            });
        }
        this.#pullInValuesToEnhancedElement(self);
    }
    async #pullInValuesToEnhancedElement(self) {
        const { setRules, enhancedElement } = self;
        if (this.#remoteSignals.entries.length > 1)
            throw 'NI';
        const { getLocalSignal } = await import('be-linked/defaults.js');
        const vals = [];
        for (const [key, value] of this.#remoteSignals) {
            //console.log({key, value, localSignal});
            const { signal: s, elType, prop: p } = value;
            const remoteRef = s.deref();
            let remoteVal;
            switch (elType) {
                case '|':
                case '#':
                case '@':
                    {
                        const { getSignalVal } = await import('be-linked/getSignalVal.js');
                        remoteVal = getSignalVal(remoteRef);
                    }
                    break;
                case '-':
                case '/':
                    remoteVal = remoteRef[key];
                    break;
                default:
                    throw 'NI';
            }
            vals.push(remoteVal);
        }
        if (setRules === undefined) {
            const localSignal = await getLocalSignal(enhancedElement);
            if (vals.length !== 1)
                throw 'NI';
            //console.log({remoteRef, remoteVal});
            const { prop, signal } = localSignal;
            signal[prop] = vals[0];
            return;
        }
        if (setRules.length === vals.length) {
            for (let i = 0, ii = setRules.length; i < ii; i++) {
                const setRule = setRules[i];
                const val = vals[i];
                const { localPropToSet } = setRule;
                enhancedElement[localPropToSet] = vals[i];
            }
        }
        else {
            throw 'NI';
        }
    }
    #remoteSignals = new Map();
}
export class LoadEvent extends Event {
}
