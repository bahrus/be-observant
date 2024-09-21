// @ts-check
/** @import {StringWithAutocompleteOptions} from './ts-refs/trans-render/types' */
/** @import {aggKeys, Handlers} from './ts-refs/be-hive/types' */
/** @import {SharingObject, AbsorbingObject} from './ts-refs/trans-render/asmr/types' */
/** @import {BEAllProps, EventListenerOrFn} from './ts-refs/trans-render/be/types' */
/**
 * @implements {EventListenerObject}
 */
export class ASMRHandler{


    /**
     * @type {EventListenerOrFn}
     */
    #handlerObj;


    /**
     * @type {SharingObject}
     */
    #localSharingObject;

    /**
     * @type {{[key: string] : AbsorbingObject}}
     */
    #propToAO;

    /**
     * @type {AbortController | undefined}
     */
    #ac;

    /**
     * @param {Handlers & BEAllProps} self
     * @param {aggKeys} aggKey 
     * @param {SharingObject} localSharingObject 
     * @param {{[key: string] : AbsorbingObject}} propToAO 
     */
    constructor(self, aggKey, localSharingObject, propToAO){
        //this.#aggKey = aggKey;
        const sch = self.scopedCustomHandlers;
        if(sch !== undefined){
            const possibleHandlers = sch.get(aggKey);
            
        }
        this.#localSharingObject = localSharingObject;
        this.#propToAO = propToAO;
        const ac = this.#ac =  new AbortController;
        const aos = Object.values(propToAO);
        for(const ao of aos){
            ao.addEventListener('.', this, {signal: ac.signal})
        }
        this.handleEvent();
    }



    async handleEvent() {
        const obj = {};
        const args = [];
        const propToAO = this.#propToAO;
        for(const prop in propToAO){
            const ao = propToAO[prop];
            const val = await ao.getValue();
            args.push(val)
            obj[prop] = val;
        }
    }

}


