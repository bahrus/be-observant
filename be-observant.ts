import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, ObserveAndSetStatement, PAP} from './types';
import {IEnhancement,  BEAllProps, EnhancementInfo, EMC} from 'trans-render/be/types';
import {getRemoteProp} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';
import { LocalSignal } from 'be-linked/types';

class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propDefaults:{},
        propInfo: {
            ...beCnfg.propInfo,
            //observedFactors:{},
            parsedStatements: {}
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            hydrate: {
                ifAtLeastOneOf: ['parsedStatements']
            }
        }
    }

    #emc: EMC | undefined;
    #hasOnload: boolean | undefined;
    #localSignal: LocalSignal | undefined;
    async attach(el: Element, enhancementInfo: EnhancementInfo) {
        const {mountCnfg} = enhancementInfo;
        this.#emc = mountCnfg;
        this.#hasOnload = !!(el as HTMLElement).onload;
        if(this.#hasOnload){
            const {getLocalSignal} = await import('be-linked/defaults.js');
            this.#localSignal = await getLocalSignal(el);
        }
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
        const parsedStatement : ObserveAndSetStatement = {
            remoteSpecifiers: [specifier]
        };
        return {
            parsedStatements: [parsedStatement]
        } as PAP
    }

    async hydrate(self: this){
        const {parsedStatements} = self;
        console.log({parsedStatements});
        for(const parsedStatement of parsedStatements!){
            
        }
        return {
            resolved: true,
        }
    }
}

interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}