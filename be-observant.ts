import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ObserveRule, LifecycleEvent, IObserveRules} from './types';
import {getRemoteProp} from 'be-linked/defaults.js';
import { ElO } from 'trans-render/lib/prs/types';

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
        const observedFactor: ElO = {
            elType: '/',
            prop: getRemoteProp(enhancedElement),
        }
        // const observeRule: ObserveRule = {
        //     //TODO:  move this evaluation to be-linked -- shared with be-elevating, be-bound
        //     //Also, support for space delimited itemprop
        //     remoteProp: getRemoteProp(enhancedElement),
        //     remoteType: '/'
        // };
        // return {
        //     observeRules: [observeRule]
        // };
        return {
            observedFactors: [observedFactor],
        }
    }
    
    async onCamelized(self: this) {
        const {prsSet} = await import('./prsSet.js');
        const {prsOf} = await import('./prsOf.js');
        // const parsedSet = structuredClone(prsSet(self));
        // const parsedOf = structuredClone(prsOf(self));
        const parsedSet = prsSet(self);
        const parsedOf = prsOf(self);
        return {...parsedOf, ...parsedSet};
    }


    async hydrate(self: this){
        const {Observer} = await import('./Observer.js');
        const obs = new Observer(self);

        return {
            resolved: true,
        }
    }
}


export interface BeObservant extends AllProps{}

export const tagName = 'be-observant';


const xe = new XE<AP, Actions>({
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
                ifAtLeastOneOf: ['of', 'Of', 'Set']
            },
            hydrate: {
                ifAllOf: ['isParsed', 'observedFactors']
            }          
        }
    },
    superclass: BeObservant
});
