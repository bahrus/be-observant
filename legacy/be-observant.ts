import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig, EnhancementInfo} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP} from './types';
import {getRemoteProp} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';

export class BeObservant extends BE<AP, Actions> implements Actions{
    //#abortControllers: Array<AbortController>  = [];
    detach(): void {
        //TODO  cancel all the observers
        // for(const ac of this.#abortControllers){
        //     ac.abort();
        // }
    }
    #ifWantsToBe: string | undefined;
    async attach(enhancedElement: Element, enhancementInfo: EnhancementInfo): Promise<void> {
        super.attach(enhancedElement, enhancementInfo);
        this.#ifWantsToBe = enhancementInfo.ifWantsToBe;
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
        const observedFactor: Specifier = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        }
        return {
            observedFactors: [observedFactor],
        }
    }
    
    async onCamelized(self: this) {
        const {of, Of, Set} = self;
        let parsedOf: PAP = {};
        if(of !== undefined || Of !== undefined){
            const {prsOf} = await import('./prsOf.js');
            parsedOf = await prsOf(self);
        }
        let parsedSet: PAP = {};
        if(Set !== undefined){
            const {prsSet} = await import('./prsSet.js');
        
            // const parsedSet = structuredClone(prsSet(self));
            // const parsedOf = structuredClone(prsOf(self));
            parsedSet = prsSet(self);
        }
        
        
        return {...parsedSet, ...parsedOf, };
    }


    async hydrate(self: this){
        const {Observer} = await import('./Observer.js');
        const obs = new Observer(self, this.#ifWantsToBe!);
        //TODO:  put in broader scope so detach can detach
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
