import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ObserveRule, LifecycleEvent, IObserveRules} from './types';
import {register} from 'be-hive/register.js';
import {getRemoteProp} from 'be-linked/defaults.js';
import {hydrateObserve, evalObserveRules} from './hydrateObserve.js';

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
        const {observeRules} = self;
        for(const observe of observeRules!){
            await hydrateObserve(self, observe, this.#abortControllers)
        }
        evalObserveRules(self, 'init');
        return {
            resolved: true,
        }
    }
}


export interface BeObservant extends AllProps{}

const tagName = 'be-observant';
const ifWantsToBe = 'observant';
const upgrade = '*';

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
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: 'observeRules'            
        }
    },
    superclass: BeObservant
});

register(ifWantsToBe, upgrade, tagName);