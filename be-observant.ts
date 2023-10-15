import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ObserveRule} from './types';
import {register} from 'be-hive/register.js';
import {getRemoteEl} from 'be-linked/getRemoteEl.js';
import {ElTypes, SignalInfo, SignalContainer} from 'be-linked/types';
import {getLocalSignal, getRemoteProp} from 'be-linked/defaults.js';
import {getSignal} from 'be-linked/getSignal.js';

export class BeObservant extends BE<AP, Actions> implements Actions{
    #abortControllers: Array<AbortController>  = [];
    detach(): void {
        for(const ac of this.#abortControllers){
            ac.abort();
        }
    }
    static override get beConfig(){
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        } as BEConfig;
    } 

    async noAttrs(self: this): ProPAP {
        const {enhancedElement} = self;
        const observeRule: ObserveRule = {
            //TODO:  move this evaluation to be-linked -- shared with be-elevating, be-bound
            //Also, support for space delimited itemprop
            remoteProp: getRemoteProp(enhancedElement),
            remoteType: '/'
        };
        return {
            observeRules: [observeRule]
        };
    }
    
    async onCamelized(self: this) {
        const {of, Of} = self;
        let observeRules: Array<ObserveRule> = [];
        if((of || Of) !== undefined){
            const {prsOf} = await import('./prsOf.js');
            observeRules = prsOf(self);
        }
        return {
            observeRules
        };
    }

    async hydrate(self: this){
        const {enhancedElement, observeRules} = self;
        for(const observe of observeRules!){
            console.log({observe});
            const {remoteProp, remoteType, localProp} = observe;
            if(localProp === undefined){
                const signal = await getLocalSignal(enhancedElement);
                observe.localProp = signal.prop;
                observe.localSignal = signal.signal;
            }else{
                throw 'NI';
            }
            //similar code as be-pute/be-switched, be-bound -- share somehow?
            const el = await getRemoteEl(enhancedElement, remoteType!, remoteProp!);
            const stInput = () => {
                observe.remoteSignal = new WeakRef(el);
                const ab = new AbortController();
                this.#abortControllers.push(ab);
                el.addEventListener('input', async e => {
                    await evalObserveRules(self);
                }, {signal: ab.signal});
            }
            switch(remoteType){
                case '/':{
                    const {doPG} = await import('be-linked/doPG.js');
                    await doPG(self, el, observe as any as SignalContainer, 'remoteSignal', remoteProp!, this.#abortControllers, evalObserveRules as any, 'remote');
                    break;
                }
                case '@':{
                    stInput();
                    break;
                }
                default:{
                    throw 'NI';
                }
            }
        }
        evalObserveRules(self);
        return {
            resolved: true,
        }
    }
}

function evalObserveRules(self: BeObservant){
    console.log('evalObserveRules');
    const {observeRules} = self;
    for(const observe of observeRules!){
        const {localProp, localSignal, remoteProp, remoteSignal, negate} = observe;
        const remoteObj = remoteSignal?.deref();
        if(remoteObj === undefined){
            console.warn(404);
            continue;
        }
        let val = (<any>remoteObj).value;
        if(negate) val = !val;
        (<any>localSignal!)[localProp!] = val;
    }
}

export interface BeObservant extends AllProps{}

const tagName = 'be-observant';
const ifWantsToBe = 'observant';
const upgrade = '*';

const x = new XE<AP, Actions>({
    config:{
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
        },
        actions: {
            noAttrs: {
                ifAllOf: ['isParsed'],
                ifNoneOf: ['of', 'Of']
            },
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: 'observeRules'            
        }
    },
    superclass: BeObservant
});

register(ifWantsToBe, upgrade, tagName);