// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo } from 'be-enhanced/cc.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AP, BAP} from './ts-refs/be-observant/types' */

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 */
class BeObservant extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults: {
            
        },
        propInfo: {
            ...propInfo,
            parsedStatements: {},
            customHandlers: {},
            scopedCustomHandlers: {},
        }
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async noAttrs(self){
        const {enhancedElement} = self;
        const {getDefaultRemotePropName} = await import('trans-render/asmr/getDefaultRemotePropName.js');
        const specifier = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getDefaultRemotePropName(enhancedElement),
            host: true
        }
        const parsedStatement : ObservingParameters = {
            remoteSpecifiers: [specifier],
            aggregateRemoteVals: this.#hasOnload ? 'ObjectAssign' : 'Conjunction'
        };
        return /** @type {PAP} */({
            didInferring: true,
            parsedStatements: [parsedStatement]
        });
    }

    async handleEvent() {
    }
}

await BeObservant.bootUp();
export {BeObservant}

