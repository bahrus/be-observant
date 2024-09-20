// @ts-check
/** @import {Handlers} from './ts-refs/be-hive/types' */
/** @import {SharingObject, AbsorbingObject} from './ts-refs/trans-render/asmr/types' */

/**
 * @implements {EventListenerObject}
 */
export class ASMRHandler{
    /**
     * @type {Handlers}
     */
    #self

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
     * 
     * @param {Handlers} self 
     * @param {SharingObject} localSharingObject 
     * @param {{[key: string] : AbsorbingObject}} propToAO 
     */
    constructor(self, localSharingObject, propToAO){
        this.#self = self;
        this.#localSharingObject = localSharingObject;
        this.#propToAO = propToAO;
        const ac = this.#ac =  new AbortController;
        const aos = Object.values(propToAO);
        for(const ao of aos){
            ao.addEventListener('.', this, {signal: ac.signal})
        }
        this.handleEvent();
    }



    handleEvent() {
        throw new Error("Method not implemented.");
    }

}
