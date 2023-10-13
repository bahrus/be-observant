import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ObserveRule} from './types';
import {register} from 'be-hive/register.js';
import {ElTypes, SignalInfo} from 'be-linked/types';

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
        return {
            resolved: true,
        }
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