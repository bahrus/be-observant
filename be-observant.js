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
            emitters: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            seek: {
                ifAtLeastOneOf: ['parsedStatements']
            },
            hydrate: {
                ifAllOf: ['emitters']
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
        const emitters = [];
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
            emitters.push(emitterScenario);
        }
        return {
            emitters
        };
    }
    async hydrate(self) {
        const { emitters } = self;
        if (this.#hasOnload) {
            throw 'NI';
        }
        for (const emitter of emitters) {
            await this.#pullInValue(self, emitter);
            console.log({ emitter });
        }
        return {
            resolved: true
        };
    }
    async #pullInValue(self, emitters) {
        const { enhancedElement } = this;
        const { remoteSignalAndEvents, remoteSpecifiers } = emitters;
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
            const removeVal = await getObsVal(hardRef, remoteSpecifiers[i], enhancedElement);
            console.log(removeVal);
            i++;
        }
    }
}
await BeObservant.bootUp();
export { BeObservant };
