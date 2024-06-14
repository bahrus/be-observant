import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, Emitters, ObserveAndSetStatement, PAP} from './types';
import {IEnhancement,  BEAllProps, EnhancementInfo, EMC} from 'trans-render/be/types';
import {getRemoteProp, getLocalSignal} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';
import { LocalSignal, SignalAndEvent } from 'be-linked/types';
import {Seeker} from 'be-linked/Seeker.js';

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
        const {parsedStatements, enhancedElement} = self;
        console.log({parsedStatements});
        const emitters: Array<Emitters> = [];
        for(const ps of parsedStatements!){
            const {localPropToSet, remoteSpecifiers} = ps;
            const localSignal = localPropToSet === 
                undefined ? this.#localSignal : await getLocalSignal(enhancedElement);
            const remoteSignalAndEvents: Array<SignalAndEvent> = [];
            for(const remoteSpecifier of remoteSpecifiers){
                const seeker = new Seeker<AP, any>(remoteSpecifier, false);
                const res = await seeker.do(self, undefined, enhancedElement);
                remoteSignalAndEvents.push(res!);
            }
            const emitters: Emitters = {
                ...ps,
                remoteSignalAndEvents,
                localSignal
            } 
        }
       

        return {
            resolved: true,
            emitters
        } as PAP
    }
}

interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}