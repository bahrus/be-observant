import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP} from './types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

export class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
    }
}

export interface BeObservant extends AP{}