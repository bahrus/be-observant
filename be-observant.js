// @ts-check
import { BE } from 'be-enhanced/BE.js';
import { propInfo } from 'be-enhanced/cc.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AP, BAP, ObservingParameters} from './ts-refs/be-observant/types' */
/** @import {Specifier} from  './ts-refs/trans-render/dss/types' */
/** @import {AbsorbingObject} from './ts-refs/trans-render/asmr/types.d.ts' */
/**
 * @implements {Actions}

 * 
 */
class BeObservant extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
     */
    static config = {
        propDefaults: {
            didInferring: false,
        },
        propInfo: {
            ...propInfo,
            parsedStatements: {},
            customHandlers: {},
            scopedCustomHandlers: {},
        },
        actions: {
            noAttrs: {
                ifNoneOf: ['parsedStatements']
            },
            seek: {
                ifAllOf: ['didInferring', 'parsedStatements']
            }
        }
    }

    /**
     * 
     * @param {BAP} self 
     */
    async noAttrs(self){
        const {enhancedElement} = self;
        const {getDefaultRemotePropName} = await import('trans-render/asmr/getDefaultRemotePropName.js');
        /**
         * @type {Specifier}
         */
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
        /**
         * @type {ObservingParameters}
         */
        const parsedStatement = {
            remoteSpecifiers: [specifier],
            aggKey: '&&'
        };
        return /** @type {PAP} */({
            didInferring: true,
            parsedStatements: [parsedStatement]
        });
    }

    /**
     * 
     * @param {BAP} self 
     */
    async seek(self){
        const {parsedStatements, enhancedElement} = self;
        const {find} = await import('trans-render/dss/find.js');
        const {ASMR} = await import('trans-render/asmr/asmr.js');
        const {ASMRHandler} = await import('./ASMRHandler.js');
        const {customHandlers, scopedCustomHandlers} = self;
        for(const statement of parsedStatements){
            /**
             * @type {{[key: string]: AbsorbingObject}}
             */
            const propToAO = {};
            const {remoteSpecifiers, localPropToSet, aggKey} = statement;
            for(const remoteSpecifier of remoteSpecifiers){
                const remoteEl = await find(enhancedElement, remoteSpecifier);
                if(!(remoteEl instanceof Element)) continue;
                const {prop} = remoteSpecifier;
                if(prop === undefined) throw 'NI';
                const ao = await ASMR.getAO(remoteEl, {
                    evt: remoteSpecifier.evt || 'input',
                    selfIsVal: remoteSpecifier.path === '$0',
                });
                propToAO[prop] = ao;
                const so = await ASMR.getSO(enhancedElement, {valueProp: localPropToSet});

                const asmrh = new ASMRHandler(self, aggKey, so, propToAO);
                //TODO: store asmrh for cleanup purposes
            }
        }
        return /** @type {PAP} */({
        });
    }

}

await BeObservant.bootUp();
export {BeObservant}


