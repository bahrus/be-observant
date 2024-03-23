import { WatchSeeker } from './WatchSeeker.js';
export class Observer {
    enh;
    constructor(self, enh) {
        this.enh = enh;
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
        const factors = {};
        const refs = {};
        for (const [key, value] of this.#remoteSignals) {
            //console.log({key, value, localSignal});
            const { signal: s, elType, prop: p, subProp } = value;
            const remoteRef = s.deref();
            if (remoteRef === undefined) {
                this.#remoteSignals.delete(key);
                continue;
            }
            refs[key] = remoteRef;
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
                case '~':
                    if (subProp !== undefined) {
                        const head = subProp[0];
                        if (head === '.') {
                            throw 'NI';
                        }
                        else {
                            remoteVal = remoteRef[subProp];
                        }
                    }
                    break;
                default:
                    throw 'NI';
            }
            factors[key] = remoteVal;
            vals.push(remoteVal);
        }
        const hasOnload = !!enhancedElement.onload;
        if (hasOnload) {
            const o = {
                factors,
                vals
            };
            const loadEvent = new LoadEvent(o, this.enh);
            enhancedElement.dispatchEvent(loadEvent);
            if (o.setProps !== undefined) {
                Object.assign(enhancedElement, o.setProps);
            }
        }
        if (setRules === undefined) {
            if (hasOnload)
                return;
            const localSignal = await getLocalSignal(enhancedElement);
            if (vals.length !== 1)
                throw 'NI';
            //console.log({remoteRef, remoteVal});
            const { prop, signal } = localSignal;
            const head = prop[0];
            if (head === '.' || head === '+') {
                const { setEnhProp } = await import('trans-render/lib/setEnhProp.js');
                setEnhProp(signal, prop, vals[0]);
            }
            else {
                signal[prop] = vals[0];
            }
            return;
        }
        for (let i = 0, ii = setRules.length; i < ii; i++) {
            const setRule = setRules[i];
            const { localPropToSet, to } = setRule;
            let val;
            if (to === '$i') {
                val = vals[i];
            }
            else {
                const toHead = to[0];
                if (toHead === '$') {
                    const idx = Number(to.substring(1)) - 1;
                    val = vals[idx];
                }
            }
            const head = localPropToSet[0];
            if (head === '.' || head === '+') {
                const { setEnhProp } = await import('trans-render/lib/setEnhProp.js');
                setEnhProp(enhancedElement, localPropToSet, val);
            }
            else {
                enhancedElement[localPropToSet] = val;
            }
        }
    }
    #remoteSignals = new Map();
}
export class LoadEvent extends Event {
    o;
    enh;
    static EventName = 'load';
    constructor(o, enh) {
        super(LoadEvent.EventName);
        this.o = o;
        this.enh = enh;
    }
}
