import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import { hookUp } from './hookUp.js';
import { VirtualProps } from './types.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beObservantAttribs',
    ready: true,
    processor: async ({target, val, attrib, host}: RenderContext) => {
        const params = JSON.parse(val!);
        const fulfilled = [];
        const unfulfilled = [];
        for(const propKey in params){
            const parm = params[propKey];
            if(await hookUp(parm, target! as Element & VirtualProps, propKey, true, host)){
                fulfilled.push(propKey);
            }else{
                unfulfilled.push(propKey);
            }
        }
        if(unfulfilled.length === 0){
            target!.setAttribute(attrib!.replace('be-', 'is-'), val!);
            target!.removeAttribute(attrib!);
        }else{
            const isObj = {} as any;
            const beObj = {} as any;
            for(const propKey of fulfilled){
                isObj[propKey] = params[propKey];
            }
            for(const propKey of unfulfilled){
                beObj[propKey] = params[propKey];
            }
            target!.setAttribute(attrib!, JSON.stringify(beObj));
            target!.setAttribute(attrib!.replace('be-', 'is-'), JSON.stringify(isObj));
        }        
    }
}

register(trPlugin);