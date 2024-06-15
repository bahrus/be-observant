import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
import { getRemoteProp, getLocalSignal } from 'be-linked/defaults.js';
import { Seeker } from 'be-linked/Seeker.js';
import { getObsVal } from 'be-linked/getObsVal.js';
class BeObservant extends BE {
    static config = {
        propDefaults: {},
        propInfo: {
            ...beCnfg.propInfo,
            parsedStatements: {},
            endPoints: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            seek: {
                ifAtLeastOneOf: ['parsedStatements']
            },
            hydrate: {
                ifAllOf: ['endPoints']
            }
        }
    };
    #emc;
    #hasOnload;
    #localSignal;
    async attach(el, enhancementInfo) {
        const { mountCnfg } = enhancementInfo;
        this.#emc = mountCnfg;
        this.#hasOnload = !!el.onload;
        if (!this.#hasOnload) {
            const { getLocalSignal } = await import('be-linked/defaults.js');
            this.#localSignal = await getLocalSignal(el);
        }
        super.attach(el, enhancementInfo);
    }
    async noAttrs(self) {
        const { enhancedElement } = self;
        const specifier = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        };
        const parsedStatement = {
            remoteSpecifiers: [specifier]
        };
        return {
            parsedStatements: [parsedStatement]
        };
    }
    async seek(self) {
        const { parsedStatements, enhancedElement } = self;
        console.log({ parsedStatements });
        const endPoints = [];
        for (const ps of parsedStatements) {
            const { localPropToSet, remoteSpecifiers } = ps;
            const localSignal = //localPropToSet === 
             
            //undefined ? 
            this.#localSignal || await getLocalSignal(enhancedElement);
            const remoteSignalAndEvents = [];
            for (const remoteSpecifier of remoteSpecifiers) {
                const seeker = new Seeker(remoteSpecifier, false);
                const res = await seeker.do(self, undefined, enhancedElement);
                remoteSignalAndEvents.push(res);
            }
            const emitterScenario = {
                ...ps,
                remoteSignalAndEvents,
                localSignal
            };
            endPoints.push(emitterScenario);
        }
        return {
            endPoints
        };
    }
    async hydrate(self) {
        const { endPoints } = self;
        if (this.#hasOnload) {
            throw 'NI';
        }
        for (const endPoint of endPoints) {
            await this.#pullInValue(self, endPoint);
            this.#scheduleUpdates(self, endPoint);
            console.log({ endPoint });
        }
        return {
            resolved: true
        };
    }
    async #pullInValue(self, endPoints) {
        const { enhancedElement } = this;
        const { remoteSignalAndEvents, remoteSpecifiers, localSignal, aggregateRemoteVals } = endPoints;
        console.log({ aggregateRemoteVals });
        const { prop, signal: localHardRef } = localSignal;
        const remove = [];
        let i = 0;
        for (const rse of remoteSignalAndEvents) {
            const { signal } = rse;
            const hardRef = signal?.deref();
            if (hardRef === undefined) {
                remove.push(rse);
                i++;
                continue;
            }
            const remoteVal = await getObsVal(hardRef, remoteSpecifiers[i], enhancedElement);
            console.log({ localSignal, remoteVal });
            localHardRef[prop] = remoteVal;
            i++;
        }
    }
    async #scheduleUpdates(self, emitters) {
    }
}
await BeObservant.bootUp();
export { BeObservant };
