import { loadEventName } from '../../mount-observer/types.js';
//import {WatchSeeker} from './WatchSeeker.js';
import {Seeker} from 'be-linked/Seeker.js';
import { AP, EventForObserver, ObserverEventModel, SignalAndElO } from '../types.js';
import {LocalSignal, SignalRefType} from 'be-linked/types';
import { Specifier } from '../../trans-render/dss/types.js';

export class Observer{
    constructor(enhancedElement: Element, public specifiers: Array<Specifier>, public enh: string){
        this.do(enhancedElement);
    }

    async do(enhancedElement: Element){
        const {specifiers} = this;
        if(specifiers === undefined) throw 'NI';
        for(const observedFactor of specifiers){
            const {prop} = observedFactor;
            //const watchSeeker = new WatchSeeker<AP, any>(observedFactor, false);
            const seeker = new Seeker<AP, any>(observedFactor, false);
            const res = await seeker.do(self, undefined, enhancedElement);
            const {eventSuggestion, signal, propagator} = res!;
            const signalAndElO : SignalAndElO = {
                ...observedFactor,
                signal
            }
            this.#remoteSignals.set(prop!, signalAndElO);
            const ref =signal!.deref();
            (propagator || ref)?.addEventListener(eventSuggestion!, e => {
                this.#pullInValuesToEnhancedElement(enhancedElement);
            });
        }
        this.#pullInValuesToEnhancedElement(enhancedElement);
    }
    #localSignal: LocalSignal | undefined;
    async #pullInValuesToEnhancedElement(enhancedElement: Element){
        
        if(this.#remoteSignals.entries.length > 1) throw 'NI';
        const {getLocalSignal} = await import('be-linked/defaults.js');
        const {getObsVal} = await import('be-linked/getObsVal.js');
        const vals = [];
        const factors: {[key: string] : any} = {};
        const refs: {[key: string]: SignalRefType} = {};
        for(const [key, value] of this.#remoteSignals){
            const {signal: s, s: elType, prop: p} = value;
            const remoteRef = s!.deref();
            if(remoteRef === undefined) {
                this.#remoteSignals.delete(key);
                continue;
            }
            refs[key] = remoteRef;
            //console.log({p, key});
            let remoteVal = await getObsVal(remoteRef, value, enhancedElement);
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
            //TODO:  cache local Signal somewhere?
            const localSignal = this.#localSignal || await getLocalSignal(enhancedElement);
            this.#localSignal = localSignal;
            //console.log({localSignal});
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
        // for(let i = 0, ii = setRules.length; i < ii; i++){
        //     const setRule = setRules[i];
        //     const {localPropToSet, to} = setRule;
        //     let val: any;
        //     if(to === '$i'){
        //         val = vals[i];
        //     }else{
        //         const toHead = to[0];
        //         if(toHead === '$'){
        //             const idx = Number(to.substring(1)) - 1;
        //             val = vals[idx];
        //         }
        //     }
        //     const head = localPropToSet![0];
        //     if(head === '.' || head === '+'){
        //         const {setEnhProp} = await import('trans-render/lib/setEnhProp.js');
        //         setEnhProp(enhancedElement, localPropToSet!, val);
        //     }else{
        //         (<any>enhancedElement)[localPropToSet!] = val;
        //     }
            
        // }
            
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