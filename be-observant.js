import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
import { getRemoteProp } from 'be-linked/defaults.js';
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
        const { parsedStatements } = self;
        console.log({ parsedStatements });
        for (const parsedStatement of parsedStatements) {
        }
        return {
            resolved: true,
        };
    }
}
await BeObservant.bootUp();
export { BeObservant };
