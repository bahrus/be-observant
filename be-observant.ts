import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP} from './types';
import {IEnhancement,  BEAllProps, EnhancementInfo, EMC} from 'trans-render/be/types';
import {getRemoteProp} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';

class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propDefaults:{},
        propInfo: {
            ...beCnfg.propInfo,
            //observedFactors:{},
            ofStatements: {}
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['observedFactors']
            },
            hydrate: {
                ifAllOf: ['observedFactors']
            }
        }
    }

    #emc: EMC | undefined;
    async attach(el: Element, enhancementInfo: EnhancementInfo) {
        console.log({enhancementInfo});
        const {mountCnfg} = enhancementInfo;
        this.#emc = mountCnfg;
        super.attach(el, enhancementInfo);
    }

    async noAttrs(self: this){
        const {enhancedElement} = self;
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
        return {
            ofStatements:{
                specifiers: [specifier]
            }
            //observedFactors: [observedFactor],
        } as PAP
    }

    async hydrateOfStatements(self: this){
        const {Observer} = await import('./Observer.js');
        const obs = new Observer(self, this.#emc!.enhPropKey);
        //TODO:  put in broader scope so detach can detach
        return {
            resolved: true,
        }
    }
}

interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}