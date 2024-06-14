import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
import { getRemoteProp, getLocalSignal } from 'be-linked/defaults.js';
import { Seeker } from 'be-linked/Seeker.js';
class BeObservant extends BE {
    static config = {
        propDefaults: {},
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
    };
    #emc;
    #hasOnload;
    #localSignal;
    async attach(el, enhancementInfo) {
        const { mountCnfg } = enhancementInfo;
        this.#emc = mountCnfg;
        this.#hasOnload = !!el.onload;
        if (this.#hasOnload) {
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
    async hydrate(self) {
        const { parsedStatements, enhancedElement } = self;
        console.log({ parsedStatements });
        const emitters = [];
        for (const ps of parsedStatements) {
            const { localPropToSet, remoteSpecifiers } = ps;
            const localSignal = localPropToSet ===
                undefined ? this.#localSignal : await getLocalSignal(enhancedElement);
            const remoteSignalAndEvents = [];
            for (const remoteSpecifier of remoteSpecifiers) {
                const seeker = new Seeker(remoteSpecifier, false);
                const res = await seeker.do(self, undefined, enhancedElement);
                remoteSignalAndEvents.push(res);
            }
            const emitters = {
                ...ps,
                remoteSignalAndEvents,
                localSignal
            };
        }
        return {
            resolved: true,
            emitters
        };
    }
}
await BeObservant.bootUp();
export { BeObservant };
