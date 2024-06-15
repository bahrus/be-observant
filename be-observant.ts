import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, EndPoints, ObservingParameters, PAP} from './types';
import {IEnhancement,  BEAllProps, EnhancementInfo, EMC} from 'trans-render/be/types';
import {getRemoteProp, getLocalSignal} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';
import { LocalSignal, SignalAndEvent } from 'be-linked/types';
import {Seeker} from 'be-linked/Seeker.js';
import {getObsVal} from 'be-linked/getObsVal.js';

class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
        propDefaults:{},
        propInfo: {
            ...beCnfg.propInfo,
            parsedStatements: {},
            bindings: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            seek: {
                ifAtLeastOneOf: ['parsedStatements']
            },
            hydrate:{
                ifAllOf: ['bindings']
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
        if(!this.#hasOnload){
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
        const parsedStatement : ObservingParameters = {
            remoteSpecifiers: [specifier],
            aggregateRemoteVals: 'Union'
        };
        return {
            parsedStatements: [parsedStatement]
        } as PAP
    }

    async seek(self: this){
        const {parsedStatements, enhancedElement} = self;
        console.log({parsedStatements});
        const bindings: Array<EndPoints> = [];
        for(const ps of parsedStatements!){
            const {localPropToSet, remoteSpecifiers} = ps;
            const localSignal = //localPropToSet === 
                //undefined ? 
                this.#localSignal || await getLocalSignal(enhancedElement);
            const remoteSignalAndEvents: Array<SignalAndEvent> = [];
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
        if(this.#hasOnload){
            throw 'NI';
        }
        for(const endPoints of bindings!){
            await this.#pullInValue(self, endPoints);
            this.#scheduleUpdates(self, endPoints);
            console.log({endPoint: endPoints})
        }
        return {
            resolved: true
        } as PAP
    }

    async #pullInValue(self: this, endPoints: EndPoints){
        const {enhancedElement} = this;
        const {remoteSignalAndEvents, remoteSpecifiers, localSignal, aggregateRemoteVals} = endPoints;
        console.log({aggregateRemoteVals});
        const {prop, signal: localHardRef} = localSignal!;
        const remove: SignalAndEvent[] = [];
        let i = 0;
        for(const rse of remoteSignalAndEvents){
            const {signal} = rse;
            const hardRef = signal?.deref();
            if(hardRef === undefined){
                remove.push(rse);
                i++;
                continue;
            }
            const remoteVal = await getObsVal(hardRef, remoteSpecifiers[i], enhancedElement);
            console.log({localSignal, remoteVal});
            (<any>localHardRef)[prop!] = remoteVal;
            i++;
        }
    }

    async #scheduleUpdates(self: this, emitters: EndPoints){

    }
}



interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}