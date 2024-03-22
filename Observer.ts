import { loadEventName } from '../mount-observer/types.js';
import {WatchSeeker} from './WatchSeeker.js';
import { AP, EventForObserver, ObserverEventModel, SignalAndElO } from './types';
import {SignalRefType} from 'be-linked/types';

export class Observer{
    constructor(self: AP, public enh: string){
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
        const factors: {[key: string] : any} = {};
        const refs: {[key: string]: SignalRefType} = {};
        for(const [key, value] of this.#remoteSignals){
            //console.log({key, value, localSignal});
            const {signal: s, elType, prop: p, subProp} = value;
            const remoteRef = s!.deref();
            if(remoteRef === undefined) {
                this.#remoteSignals.delete(key);
                continue;
            }
            refs[key] = remoteRef;
            let remoteVal: any;
            switch(elType){
                case '|':
                case '#':
                case '@':{
                    const {getSignalVal} = await import('be-linked/getSignalVal.js');
                    remoteVal = getSignalVal(remoteRef);
                }
                break;
                case '-':
                case '/':
                    remoteVal = (<any>remoteRef)[key];
                    break;
                case '~':
                    if(subProp !== undefined){
                        const substr = subProp.substring(1)
                        if(substr.includes('.') || substr.includes('|')){
                            throw 'NI'
                        }else{
                            remoteVal = (<any>remoteRef)[substr];
                        }
                    }
                    break;
                default:
                    throw 'NI';
            }
            factors[key] = remoteVal;
            vals.push(remoteVal);
            
        }
        const hasOnload = !!(enhancedElement as HTMLElement).onload;
        if(hasOnload){
            const o: ObserverEventModel = {
                factors,
                vals
            }
            const loadEvent = new LoadEvent(o, this.enh);
            enhancedElement.dispatchEvent(loadEvent);
            if(o.setProps !== undefined){
                Object.assign(enhancedElement, o.setProps);
            }
        }
        if(setRules === undefined){
            if(hasOnload) return;
            const localSignal = await getLocalSignal(enhancedElement);
            if(vals.length !== 1) throw 'NI';
            //console.log({remoteRef, remoteVal});
            const {prop, signal} = localSignal;
            const head = prop![0];
            if(head === '.' || head === '+'){
                const {setEnhProp} = await import('trans-render/lib/setEnhProp.js');
                setEnhProp(<any>signal, prop!, vals[0]);
            }else{
                (<any>signal)[prop!] = vals[0];
            }
            
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
            const head = localPropToSet![0];
            if(head === '.' || head === '+'){
                const {setEnhProp} = await import('trans-render/lib/setEnhProp.js');
                setEnhProp(enhancedElement, localPropToSet!, val);
            }else{
                (<any>enhancedElement)[localPropToSet!] = val;
            }
            
        }
            
    }

    #remoteSignals: Map<string, SignalAndElO> = new Map();
}

export class LoadEvent extends Event implements EventForObserver {
    static EventName: loadEventName = 'load';

    constructor(
        public o: ObserverEventModel,
        public enh: string,
    ){
        super(LoadEvent.EventName);
    }
}