import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { getRemoteProp } from 'be-linked/defaults.js';
export class BeObservant extends BE {
    #abortControllers = [];
    detach() {
        for (const ac of this.#abortControllers) {
            ac.abort();
        }
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
        const observeRule = {
            //TODO:  move this evaluation to be-linked -- shared with be-elevating, be-bound
            //Also, support for space delimited itemprop
            remoteProp: getRemoteProp(enhancedElement),
            remoteType: '/'
        };
        return {
            observeRules: [observeRule]
        };
    }
    async onCamelized(self) {
        const { prsOf } = await import('./prsOf.js');
        const parsed = prsOf(self);
        return structuredClone(parsed);
    }
    async hydrate(self) {
        const { Observer } = await import('./Observer.js');
        const obs = new Observer(self);
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
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: {
                ifAllOf: ['isParsed', 'observedFactors']
            }
        }
    },
    superclass: BeObservant
});
