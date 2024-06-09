import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { getRemoteProp } from 'be-linked/defaults.js';
export class BeObservant extends BE {
    //#abortControllers: Array<AbortController>  = [];
    detach() {
        //TODO  cancel all the observers
        // for(const ac of this.#abortControllers){
        //     ac.abort();
        // }
    }
    #ifWantsToBe;
    async attach(enhancedElement, enhancementInfo) {
        super.attach(enhancedElement, enhancementInfo);
        this.#ifWantsToBe = enhancementInfo.ifWantsToBe;
    }
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
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
    async onCamelized(self) {
        const { of, Of, Set } = self;
        let parsedOf = {};
        if (of !== undefined || Of !== undefined) {
            const { prsOf } = await import('./prsOf.js');
            parsedOf = await prsOf(self);
        }
        let parsedSet = {};
        if (Set !== undefined) {
            const { prsSet } = await import('./prsSet.js');
            // const parsedSet = structuredClone(prsSet(self));
            // const parsedOf = structuredClone(prsOf(self));
            parsedSet = prsSet(self);
        }
        return { ...parsedSet, ...parsedOf, };
    }
    async hydrate(self) {
        const { Observer } = await import('../Observer.js');
        const obs = new Observer(self, this.#ifWantsToBe);
        //TODO:  put in broader scope so detach can detach
        return {
            resolved: true,
        };
    }
}
export const tagName = 'be-observant';
const xe = new XE({
    config: {
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
