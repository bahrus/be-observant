// @ts-check
/** @import {Handlers} from './ts-refs/be-hive/types' */
/** @import {SharingObject, AbsorbingObject} from './ts-refs/trans-render/asmr/types' */

/**
 * @implements {EventListenerObject}
 */
export class ASMRHandler{
    /**
     * 
     * @param {Handlers} self 
     * @param {SharingObject} localSharingObject 
     * @param {{[key: string] : AbsorbingObject}} propToAO 
     */
    constructor(self, localSharingObject, propToAO){

    }

    handleEvent() {
        throw new Error("Method not implemented.");
    }

}
