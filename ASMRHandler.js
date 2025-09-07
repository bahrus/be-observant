// @ts-check
/** @import {BAP, ObservantParameters} from './ts-refs/be-observant/types' */
/** @import {AbsorbingObject} from './ts-refs/trans-render/asmr/types' */
/**
 * @implements {EventListenerObject}
 */
export class ASMRHandler extends EventTarget {
    /** @type {AbsorbingObject} */
    #ao;
    /** @type {WeakRef<Element>} */
    #ref;
    /** @type {string} */
    #datasetName;
    /**
     * @param {BAP} self
     * @param {AbsorbingObject} ao
     * @param {string} datasetName
     */
    constructor(
        self,
        ao,
        datasetName
    ){
        super();
        this.#ao = ao;
        this.#ref = new WeakRef(self.enhancedElement);
        this.#datasetName = datasetName;
        ao.addEventListener('.', this);
        this.handleEvent();
    }
    async handleEvent(){
        const val = await this.#ao.getValue();
        const dsName = this.#datasetName;
        const enhancedElement = this.#ref.deref();
        if(enhancedElement === undefined) return;
        if(val === undefined || val === null){
            delete enhancedElement[dsName];
        }else{
            enhancedElement.dataset[dsName] = val.toString();
        }
    }
}