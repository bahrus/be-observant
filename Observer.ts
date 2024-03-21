import {WatchSeeker} from './WatchSeeker.js';
import { AP, EventForObserver, SignalAndElO } from './types';
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
            const signalAndElO : SignalAndElO = {
                ...observedFactor,
                signal
            }
            this.#remoteSignals.set(prop!, signalAndElO);
            const ref =signal!.deref();
            (propagator || ref)?.addEventListener(eventSuggestion!, e => {
                this.#pullInValuesToEnhancedElement(self);
            });
        }
        this.#pullInValuesToEnhancedElement(self);
    }

    async #pullInValuesToEnhancedElement(self: AP){
        const {setRules, enhancedElement} = self;
        if(this.#remoteSignals.entries.length > 1) throw 'NI';
        const {getLocalSignal} = await import('be-linked/defaults.js');
        
        const vals = [];
        for(const [key, value] of this.#remoteSignals){
            //console.log({key, value, localSignal});
            const {signal: s, elType, prop: p} = value;
            const remoteRef = s!.deref();
            let remoteVal: any;
            switch(elType){
                case '|':
                case '#':
                case '@':{
                    const {getSignalVal} = await import('be-linked/getSignalVal.js');
                    remoteVal = getSignalVal(remoteRef!);
                }
                break;
                case '-':
                case '/':
                    remoteVal = (<any>remoteRef)[key];
                    break;
                default:
                    throw 'NI';
            }
            vals.push(remoteVal);
            
        }

        if(setRules === undefined){
            const localSignal = await getLocalSignal(enhancedElement);
            if(vals.length !== 1) throw 'NI';
            //console.log({remoteRef, remoteVal});
            const {prop, signal} = localSignal;
            (<any>signal)[prop!] = vals[0];
            return;
        }
        for(let i = 0, ii = setRules.length; i < ii; i++){
            const setRule = setRules[i];
            const {localPropToSet, to} = setRule;
            let val: any;
            if(to === '$i'){
                val = vals[i];
            }else{
                const toHead = to[0];
                if(toHead === '$'){
                    const idx = Number(to.substring(1)) - 1;
                    val = vals[idx];
                }
            }
            (<any>enhancedElement)[localPropToSet!] = val;
        }
            
    }

    #remoteSignals: Map<string, SignalAndElO> = new Map();
}

export class LoadEvent extends Event implements EventForObserver {
    
}