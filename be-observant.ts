import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP} from './types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
    }
}

interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}