import {IObserve, VirtualProps, HookUpInfo} from './types';


export async function addListener(elementToObserve: Element, observeParams: IObserve, propKey: string, self: Element & VirtualProps, noAwait = false): Promise<HookUpInfo>{
    const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, nudge, observeHostProp, eventListenerOptions,} = observeParams;
    const valFT = vft || valFromTarget;
    const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
    const onSetX = onSet || observeHostProp;
    const onz = onSetX !== undefined ? undefined :
         on || (valFT ? camelToLisp(valFT) + '-changed' : undefined); 
    const valFE = vfe || valFromEvent;
    const {setProp} = await import('./setProp.js');
    if(valFT !== undefined && !skipInit){
        if(observeParams.debug) debugger;
        await setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    const controller = new AbortController;
    if(onz !== undefined){
        const fn = async (e: Event) => {
            const { eventFilter, stopPropagation} = observeParams;
            if(eventFilter !== undefined){
                const {isContainedIn} = await import('trans-render/lib/isContainedIn.js');
                if(!isContainedIn(eventFilter, e)) return;
            }
            if(stopPropagation) e.stopPropagation();
            try{
                const isConnected = self.isConnected;
            }catch(e){
                return;
            }
            if((<any>self).debug){
                console.log({e, valFT, valFE, propKey, observeParams});
            }
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self, e);
        }
        let options: AddEventListenerOptions | undefined;
        switch(typeof eventListenerOptions){
            case 'boolean':
                options = {capture: eventListenerOptions}
                break;
            case 'object':
                options = eventListenerOptions;
                break;
            default:
                options = {}
        } 
        options.signal = controller.signal;
        elementToObserve.addEventListener(onz, fn, options);
        if((<any>self).debug){
            console.log({onz, elementToObserve, fn});
        }
        if(nudge && elementToObserve.getAttribute !== undefined) {
            const {nudge} = await import('trans-render/lib/nudge.js');
            nudge(elementToObserve);
        }
    }else if(onSetX !== undefined){
        const {bePropagating} = await import('trans-render/lib/bePropagating.js');
        const et = await bePropagating(elementToObserve, onSetX);
        et.addEventListener(onSetX, () => {
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
        }, {signal: controller.signal});
    }else{
        throw 'bO.hU.NI'; // not implemented
    }
    return {
        success: true,
        element: elementToObserve,
        controller
    };
}

export function toIObserve(s: string): IObserve{
    const ocoho = '[itemscope]';
    const isProp = s[0] === '.';
    const vft = isProp ? s.substr(1) : s;
    const nudge = true;
    return isProp ? {onSet: vft, vft, ocoho, nudge} as IObserve : {vft, ocoho, nudge} as IObserve;
}

export async function hookUp(fromParam: string | IObserve | (string | IObserve)[], proxy: Element & VirtualProps, toParam: string, noAwait = false, host?: Element): Promise<HookUpInfo>{
    const observeParam = (typeof fromParam === 'string') ? toIObserve(fromParam) : fromParam;
    if(Array.isArray(observeParam)){
        //assume for now is a string array
        const arr = fromParam as string[];
        if(arr.length !== 1) throw 'bO.hp.NI';
        //assume for now only one element in the array
        //TODO:  support alternating array with binding instructions in every odd element -- interpolation
        (<any>proxy)[toParam] = arr[0];
        return {
            success: true,
        };
    }else{
        const {getElementToObserve} = await import('./getElementToObserve.js');
        let elementToObserve = await getElementToObserve(proxy, observeParam, host);
        if(elementToObserve === null){
            if(observeParam.observeInward !== undefined){
                const {childrenParsed} = await import ('be-a-beacon/childrenParsed.js');
                await childrenParsed(proxy.self);
                elementToObserve = proxy.querySelector(observeParam.observeInward);
            }
  
        }
        if(elementToObserve === null){
            console.warn({msg:'404',observeParam});
            return {
                success: false,
            };
        }
        const {homeInOn: hio} = observeParam;
        if(hio !== undefined){
            const {homeInOn} = await import('trans-render/lib/homeInOn.js');
            elementToObserve = await homeInOn(elementToObserve, hio) as Element;
        }
        return await addListener(elementToObserve, observeParam, toParam, proxy, noAwait);
    }
    // switch(typeof fromParam){
    //     case 'object':{


    //     }
    //     case 'string':{
    //         const ocoho = '[itemscope]';
    //         const isProp = fromParam[0] === '.';
    //         const vft = isProp ? fromParam.substr(1) : fromParam;
    //         const nudge = true;
    //         const observeParams = isProp ? {onSet: vft, vft, ocoho, nudge} as IObserve : {vft, ocoho, nudge} as IObserve;
    //         const {getElementToObserve} = await import('./getElementToObserve.js');
    //         let elementToObserve = await getElementToObserve(proxy, observeParams, host);
    //         if(elementToObserve === null && observeParams.observeInward !== undefined){
    //             //wait for element to fill up hopefully
    //             await sleep(50);
    //             elementToObserve = proxy.querySelector(observeParams.observeInward);
    //         }
    //         if(!elementToObserve){
    //             console.warn({msg:'404',observeParams});
    //             return {
    //                 success: false,
    //             };
    //         }
    //         return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
    //     }
    //     default:
    //         (<any>proxy)[toParam] = fromParam;
    //         return {
    //             success: true,
    //         };
    // }
}

export async function sleep(ms: number): Promise<void>{
    return new Promise(resolve => {
        setTimeout(() => { resolve() }, ms);
    })
}