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
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement, any>}
     */
    static config = {

    }

    async handleEvent() {
    }
}

await BeObservant.bootUp();
export {BeObservant}

