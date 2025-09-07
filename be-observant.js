// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
import { lispToCamel } from 'trans-render/lib/lispToCamel.js';
import {ASMRHandler} from './ASMRHandler.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-observant/types' */;

/**
 * @implements {Actions}
 * 
 */
class BeObservant extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement, HTMLElement>}
     */
    static config = {
        propInfo:{
            ...propInfo,
            parsedStatements: {},
            rawStatements: {},
        },
        positractions: [resolved, rejected],
        compacts: {
            when_parsedStatements_changes_call_hydrate: 0,
        }
    };

    de = de;

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        const {parsedStatements, enhancedElement} = self;
        const {find} = await import('trans-render/dss/find.js');
        const {ASMR} = await import('trans-render/asmr/asmr.js');
        const {ASMRHandler} = await import('./ASMRHandler.js');
        for(const statement of parsedStatements){
            const {remoteSpecifiers} = statement;
            for(const remoteSpecifier of remoteSpecifiers){
                const remoteEl = await find(enhancedElement, remoteSpecifier);
                if(!(remoteEl instanceof EventTarget)) throw 404;
                const {prop} = remoteSpecifier;
                let datasetName = prop;
                if(prop === undefined){
                    if(!(remoteEl instanceof HTMLElement)) throw 'NI';
                    const remoteIDSrcName = remoteEl.dataset.id || remoteEl.id;
                    if(!remoteIDSrcName) throw 'NI';
                    datasetName = lispToCamel(remoteIDSrcName);
                }
                if(datasetName === undefined) throw 500;
                const {path, as, evtName} = remoteSpecifier;
                const ao = await ASMR.getAO(remoteEl, {
                    evt: evtName || 'input',
                    propToAbsorb: path !== undefined ? `?.${prop}?.${path}` : prop,
                    as
                });
                new ASMRHandler(self, ao, datasetName);
            }

        }
        return /** @type {PAP} */({
            resolved: true,
        });
    }
}

await BeObservant.bootUp();
export {BeObservant};