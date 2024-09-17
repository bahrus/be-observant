import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, EndPoints, EventForObserver, LoadEventName, ObservingParameters, PAP} from '../types';
import {IEnhancement,  BEAllProps, EnhancementInfo, EMC} from 'trans-render/be/types';
//import {getRemoteProp, getLocalSignal} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';
import { LocalSignal, WeakEndPoint } from 'be-linked/types';
import {Seeker} from 'be-linked/Seeker.js';
import {getObsVal} from 'be-linked/getObsVal.js';

class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propDefaults:{
            didInferring: false,
        },
        propInfo: {
            ...beCnfg.propInfo,
            parsedStatements: {},
            bindings: {},
            rawStatements: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            infer: {
                ifAllOf: ['parsedStatements'],
                ifNoneOf: ['didInferring']
            },
            seek: {
                ifAllOf: ['didInferring', 'parsedStatements']
            },
            hydrate:{
                ifAllOf: ['bindings']
            },
        },
        positractions: [
            ...beCnfg.positractions!,
            {
                do: 'warn',
                ifAllOf: ['rawStatements'],
                pass: ['`The following statements could not be parsed.`', 'rawStatements']
            }
        ]
    }

    #emc: EMC | undefined;
    #hasOnload: boolean | undefined;
    #localSignal: LocalSignal | undefined;
    warn = console.warn;
    async #getLocalSignal() : Promise<LocalSignal>{
        if(this.#localSignal !== undefined) return this.#localSignal;
        const {getLocalSignal} = await import('be-linked/defaults.js');
        this.#localSignal = await getLocalSignal(this.enhancedElement);
        return this.#localSignal;
    }
    async attach(el: Element, enhancementInfo: EnhancementInfo) {
        const {mountCnfg} = enhancementInfo;
        this.#emc = mountCnfg;
        this.#hasOnload = !!(el as HTMLElement).onload;
        super.attach(el, enhancementInfo);
    }

    async noAttrs(self: this){
        const {enhancedElement} = self;
        const {getRemoteProp} = await import('be-linked/defaults.js');
        const specifier: Specifier = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        }
        const parsedStatement : ObservingParameters = {
            remoteSpecifiers: [specifier],
            aggregateRemoteVals: this.#hasOnload ? 'ObjectAssign' : 'Conjunction'
        };
        return {
            didInferring: true,
            parsedStatements: [parsedStatement]
        } as PAP
    }

    async infer(self: this){
        const {parsedStatements, enhancedElement} = self;
        for(const ps of parsedStatements!){
            const {localPropToSet, remoteSpecifiers} = ps;
            if(localPropToSet !== undefined) continue;
            for(const remoteSpecifier of remoteSpecifiers){
                const {s, prop} = remoteSpecifier;
                switch(s){
                    case '~':
                        if(prop === undefined){
                            const {getRemoteProp} = await import('be-linked/defaults.js');
                            remoteSpecifier.prop = getRemoteProp(enhancedElement);
                        }
                        break;
                }
            }
        }
        return {
            didInferring: true
        } as PAP
    }

    async seek(self: this){
        const {parsedStatements, enhancedElement} = self;
        const bindings: Array<EndPoints> = [];
        for(const ps of parsedStatements!){
            if(ps.aggregateRemoteVals === 'Conjunction' && this.#hasOnload){
                ps.aggregateRemoteVals = 'ObjectAssign';
            }
            const {localPropToSet, remoteSpecifiers} = ps;
            let localSignal: LocalSignal | undefined;
            if(localPropToSet){
                localSignal = {
                    signal: enhancedElement,
                    prop: localPropToSet,
                    type: 'na'
                };
            }else if(!this.#hasOnload){
                localSignal = await this.#getLocalSignal();
            }
                //undefined ? 
            const remoteSignalAndEvents: Array<WeakEndPoint> = [];
            for(const remoteSpecifier of remoteSpecifiers){
                const seeker = new Seeker<AP, any>(remoteSpecifier, false);
                const res = await seeker.do(self, undefined, enhancedElement);
                remoteSignalAndEvents.push(res!);
            }
            const endPoints: EndPoints = {
                ...ps,
                remoteSignalAndEvents,
                localSignal
            } 
            bindings.push(endPoints);
        }

        
       

        return {
            bindings
        } as PAP
    }

    async hydrate(self: this){
        const {bindings} = self;
        for(const endPoints of bindings!){
            await this.#pullInValue(self, endPoints);
            this.#scheduleUpdates(self, endPoints);
        }
        return {
            resolved: true
        } as PAP
    }

    async #pullInValue(self: this, endPoints: EndPoints){
        const {enhancedElement} = this;
        const {remoteSignalAndEvents, remoteSpecifiers, localSignal, aggregateRemoteVals, mappings} = endPoints;
        
        let i = 0;
        let accumulator: any;
        switch(aggregateRemoteVals){
            case 'Sum':
                accumulator = 0;
                break;
            case 'Product':
                accumulator = 1;
                break;
            case 'ObjectAssign':
                accumulator = {};
                break;
            case 'Conjunction':
                accumulator = true;
                break;
            case 'ArrayPush':
                accumulator = [];
        }
        for(const rse of remoteSignalAndEvents){
            const {signal} = rse;
            const hardRef = signal?.deref();
            if(hardRef === undefined){
                rse.isStale = true;
                i++;
                continue;
            }
            const remoteSpecifier = remoteSpecifiers[i];
            let remoteVal = await getObsVal(hardRef, remoteSpecifier, enhancedElement);
            if(mappings !== undefined){
                const remoteValAsString = remoteVal.toString();
                let elseVal: any;
                let foundVal = false;
                for(const mapping of mappings){
                    const {ifCondition, passValue} = mapping;
                    if(ifCondition === undefined){
                        elseVal = passValue;
                        continue;
                    }
                    switch(ifCondition){
                        case 'truthy':
                            if(remoteValAsString){
                                remoteVal = passValue;
                                foundVal = true;
                            }
                            break;
                        case 'falsy':
                            if(!remoteValAsString){
                                remoteVal = passValue;
                                foundVal = true;
                            }
                            break;
                        default:
                            if( ifCondition === remoteValAsString){
                                remoteVal = passValue;
                                foundVal = true;
                                break;
                            }
                    }


                }
                if(!foundVal && elseVal){
                    remoteVal = elseVal;
                }

            }
            switch(aggregateRemoteVals){
                case 'Union':
                    accumulator = accumulator || remoteVal;
                    break;
                case 'Conjunction':
                    accumulator = accumulator && remoteVal;
                    break;
                case 'Sum':
                    accumulator += remoteVal;
                    break;
                case 'Product':
                    accumulator *= remoteVal;
                    break;
                case 'ObjectAssign':
                    accumulator[remoteSpecifier.prop!] = remoteVal;
                    accumulator[i] = remoteVal;
                    break;
                case 'ArrayPush':
                    accumulator.push(remoteVal);
                    break;
            }
            
            i++;
        }
        endPoints.remoteSignalAndEvents = endPoints.remoteSignalAndEvents.filter(x => !x.isStale);
        if(this.#hasOnload){
            const setProps = {};
            const loadEvent = new LoadEvent(
                accumulator as {[key: string | number] : any},
                setProps,
                this.#emc!.enhPropKey
            );
            enhancedElement.dispatchEvent(loadEvent);
            Object.assign(enhancedElement, loadEvent.setProps);
        }else{
            const {prop, signal: localHardRef} = localSignal!;
            (<any>localHardRef)[prop!] = accumulator;
        }
       
        
        //TODO remove
    }

    #ac: AbortController[] = [];
    async #scheduleUpdates(self: this, endPoints: EndPoints){
        const {remoteSignalAndEvents, remoteSpecifiers} = endPoints;
        let i = 0;
        for(const rse of remoteSignalAndEvents){
            const {signal, propagator} = rse;
            const hardRef = signal?.deref();
            if(hardRef === undefined){
                rse.isStale = true;
                i++;
                continue;
            }
            const remoteSpecifier = remoteSpecifiers[i];
            const eventName = remoteSpecifier.evt || rse.eventSuggestion;
            const ac = new AbortController();
            (propagator || hardRef).addEventListener(eventName!, e => {
                this.#pullInValue(self, endPoints);
            }, {signal: ac.signal})
            i++;
        }
    }

}

export class LoadEvent extends Event implements EventForObserver {
    static EventName: LoadEventName = 'load';

    constructor(
        public factors: {[key: string | number] : any},
        public setProps: {[key: string]: any},
        public enh: string,
    ){
        super(LoadEvent.EventName);
    }
}

interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}