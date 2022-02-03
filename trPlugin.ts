import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import { hookUp } from './hookUp';
//import {lispToCamel} from 'trans-render/lib/lispToCamel.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beObservantAttribs',
    processor: async ({target, val, attrib, host}: RenderContext) => {
        //const ce = customElements.get('be-observant-attribs') as any as TransformPluginStates<Element, any, any>;
        const params = JSON.parse(attrib!);
        const fulfilled = [];
        for(const propKey in params){
            const parm = params[propKey];
            if(await hookUp(parm, target!, propKey, true, host)){
                fulfilled.push(propKey);
            };
        }
        if(fulfilled.length > 0){
            target?.setAttribute(attrib!.replace('is-', 'be-'), val!);
            
        }else{

        }        
    }
}

// export function hookUp(fromParam: any, target: Element, toParam: string, ce: TransformPluginStates<Element, any, any>){
//     switch(typeof fromParam){
//         case 'object':
//             if(Array.isArray(fromParam)){
//                 //assume for now is a string array
//                 const arr = fromParam as string[];
//                 if(arr.length !== 1) throw 'NI';
//                 //assume for now only one element in the array
//                 //TODO:  support alternating array with binding instructions in every odd element -- interpolation
//                 (<any>target)[toParam] = fromParam[0];
//             }else{
//                 const observeParams = fromParam as IObserve;
//                 const elementToObserve = getElementToObserve(proxy, observeParams);
//                 if(elementToObserve === null){
//                     console.warn({msg:'404',observeParams});
//                     return;
//                 }
//                 await addListener(elementToObserve, observeParams, toParam, proxy);
//             }
//             break;
//         case 'string':{
//             {
//                 const ocoho = '[itemscope]';
//                 const isProp = fromParam[0] === '.';
//                 const vft = isProp ? fromParam.substr(1) : fromParam;
//                 const observeParams = isProp ? {onSet: vft, vft, ocoho} as IObserve : {vft, ocoho} as IObserve;
                
//                 const elementToObserve = getElementToObserve(proxy, observeParams);
//                 if(!elementToObserve){
//                     console.warn({msg:'404',observeParams});
//                     return;
//                 }
//                 await addListener(elementToObserve, observeParams, toParam, proxy);
//             }
//             break;            
//         }
//         default:
//             (<any>proxy)[toParam] = fromParam;
    
//     }
// }

register(trPlugin);