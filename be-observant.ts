import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP} from './types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';
import {getRemoteProp} from 'be-linked/defaults.js';
import { Specifier } from 'trans-render/dss/types';

class BeObservant extends BE implements Actions {
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> = {
    }

    async noAttrs(self: this){
        const {enhancedElement} = self;
        const observedFactor: Specifier = {
            s: '/',
            elS: '*',
            dss: '^',
            scopeS: '[itemscope]',
            rec: true,
            rnf: true,
            prop: getRemoteProp(enhancedElement),
            host: true
        }
        return {
            observedFactors: [observedFactor],
        }
    }
}

interface BeObservant extends AP{}

await BeObservant.bootUp();

export {BeObservant}