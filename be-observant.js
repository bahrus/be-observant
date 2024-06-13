import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
import { getRemoteProp } from 'be-linked/defaults.js';
class BeObservant extends BE {
    static config = {
        propDefaults: {},
        propInfo: {
            ...beCnfg.propInfo,
            observedFactors: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['observedFactors']
            },
            hydrate: {
                ifAllOf: ['observedFactors']
            }
        }
    };
    #emc;
    async attach(el, enhancementInfo) {
        console.log({ enhancementInfo });
        const { mountCnfg } = enhancementInfo;
        this.#emc = mountCnfg;
        super.attach(el, enhancementInfo);
    }
    async noAttrs(self) {
        const { enhancedElement } = self;
        const observedFactor = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        };
        return {
            observedFactors: [observedFactor],
        };
    }
    async hydrate(self) {
        const { Observer } = await import('./Observer.js');
        const obs = new Observer(self, this.#emc.enhPropKey);
        //TODO:  put in broader scope so detach can detach
        return {
            resolved: true,
        };
    }
}
await BeObservant.bootUp();
export { BeObservant };
