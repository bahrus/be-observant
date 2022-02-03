import {RenderContext, TransformPluginSettings, TransformPluginStates} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
//import {lispToCamel} from 'trans-render/lib/lispToCamel.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beObservantAttribs',
    processor: ({target, val, attrib}: RenderContext) => {
        const ce = customElements.get('be-observant-attribs') as TransformPluginStates<Element, any, any>;
        const params = JSON.parse(attrib);
        for(const propKey in params){
            const parm = params[propKey];
            hookUp(parm, target, propKey, ce);
        }        
    }
}

export function hookUp(fromParam: any, target: Element, toParam: string, ce: TransformPluginStates<Element, any, any>){
    switch(typeof fromParam){
        case 'object':
            if(Array.isArray(fromParam)){
                //assume for now is a string array
                const arr = fromParam as string[];
                if(arr.length !== 1) throw 'NI';
                //assume for now only one element in the array
                //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                (<any>target)[toParam] = fromParam[0];
            }else{
                const observeParams = fromParam as IObserve;
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(elementToObserve === null){
                    console.warn({msg:'404',observeParams});
                    return;
                }
                await addListener(elementToObserve, observeParams, toParam, proxy);
            }
            break;
        case 'string':{
            {
                const ocoho = '[itemscope]';
                const isProp = fromParam[0] === '.';
                const vft = isProp ? fromParam.substr(1) : fromParam;
                const observeParams = isProp ? {onSet: vft, vft, ocoho} as IObserve : {vft, ocoho} as IObserve;
                
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(!elementToObserve){
                    console.warn({msg:'404',observeParams});
                    return;
                }
                await addListener(elementToObserve, observeParams, toParam, proxy);
            }
            break;            
        }
        default:
            (<any>proxy)[toParam] = fromParam;
    
    }
}

register(trPlugin);