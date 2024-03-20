import {WatchSeeker} from './WatchSeeker.js';
import { AP, EventForObserver } from './types';
import {SignalRefType} from 'be-linked/types';

export class Observer{
    constructor(self: AP){
        this.do(self);
    }

    async do(self: AP){
        const {observedFactors, enhancedElement} = self;
        if(observedFactors === undefined) throw 'NI';
        for(const observedFactor of observedFactors){
            const {prop} = observedFactor;
            const watchSeeker = new WatchSeeker<AP, any>(observedFactor, false);
            const res = await watchSeeker.do(self, undefined, enhancedElement);
            const {eventSuggestion, signal, propagator} = res!;
            this.#remoteSignals.set(prop!, signal!);
            const ref =signal!.deref();
            (propagator || ref)?.addEventListener(eventSuggestion!, e => {
                this.#pullInValuesToEnhancedElement(self);
            });
        }
        this.#pullInValuesToEnhancedElement(self);
    }

    async #pullInValuesToEnhancedElement(self: AP){
        const {setRules, enhancedElement} = self;
        if(setRules === undefined){
            if(this.#remoteSignals.entries.length > 1) throw 'NI';
            const {getLocalSignal} = await import('be-linked/defaults.js');
            const localSignal = await getLocalSignal(enhancedElement);
            for(const [key, value] of this.#remoteSignals){
                console.log({key, value, localSignal});
                const remoteRef = value.deref();
                const remoteVal = (<any>remoteRef)[key];
                console.log({remoteRef, remoteVal});
                const {prop, signal} = localSignal;
                (<any>signal)[prop!] = remoteVal;
            }
            
        }
    }

    #remoteSignals: Map<string, WeakRef<SignalRefType>> = new Map();
}

export class LoadEvent extends Event implements EventForObserver {
    
}