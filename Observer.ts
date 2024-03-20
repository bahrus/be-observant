import {WatchSeeker} from './WatchSeeker.js';
import { AP } from './types';
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
            const {eventSuggestion, signal} = res!;
            this.#signals.set(prop!, signal!);
            const ref =signal!.deref();
            ref?.addEventListener(eventSuggestion!, e => {
                this.#invokeLoadEvent(self);
            });
        }
        this.#invokeLoadEvent(self);
    }

    async #invokeLoadEvent(self: AP){
        
    }

    #signals: Map<string, WeakRef<SignalRefType>> = new Map();
}

export class LoadEvent extends Event implements EventForObserver {
    
}