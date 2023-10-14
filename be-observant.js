import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
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
    async onCamelized(self) {
        const { of, Of } = self;
        let observeRules = [];
        if ((of || Of) !== undefined) {
            const { prsOf } = await import('./prsOf.js');
            observeRules = prsOf(self);
        }
        return {
            observeRules
        };
    }
    async hydrate(self) {
        const { enhancedElement, observeRules } = self;
        for (const observe of observeRules) {
            const { remoteProp, remoteType } = observe;
        }
        return {
            resolved: true,
        };
    }
}
const tagName = 'be-observant';
const ifWantsToBe = 'observant';
const upgrade = '*';
const x = new XE({
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
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: 'observeRules'
        }
    },
    superclass: BeObservant
});
register(ifWantsToBe, upgrade, tagName);
