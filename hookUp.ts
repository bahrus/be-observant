import {IObserve, BeObservantVirtualProps, HookUpInfo} from './types';


export async function addListener(elementToObserve: Element, observeParams: IObserve, propKey: string, self: Element & BeObservantVirtualProps, noAwait = false): Promise<HookUpInfo>{
    const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy, nudge} = observeParams;
    if(noAwait && fromProxy) return {
        success: false,
    };
    const valFT = vft || valFromTarget;
    const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
    const onz = onSet !== undefined ? undefined :
         on || (valFT ? (fromProxy ? fromProxy + '::'  : '') + camelToLisp(valFT) + '-changed' : undefined); 
    const valFE = vfe || valFromEvent;
    const {setProp} = await import('./setProp.js');
    if(valFT !== undefined && !skipInit){
        if(observeParams.debug) debugger;
        await setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    if(onz !== undefined){
        const fn = (e: Event) => {
            e.stopPropagation();
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
        elementToObserve.addEventListener(onz, fn);
        if((<any>self).debug){
            console.log({onz, elementToObserve, fn});
        }
        if(self.eventHandlers === undefined) self.eventHandlers = [];
        self.eventHandlers!.push({on: onz, elementToObserve, fn});
        if(nudge && elementToObserve.getAttribute !== undefined) {
            const {nudge} = await import('trans-render/lib/nudge.js');
            nudge(elementToObserve);
        }
    }else if(onSet !== undefined){
        const {subscribe, tooSoon} = await import('trans-render/lib/subscribe.js');
        if(noAwait && tooSoon(elementToObserve)) return {
            success: false
        };
        if(self.subscriptions === undefined) self.subscriptions = [];
        self.subscriptions.push(elementToObserve);
        subscribe(elementToObserve, onSet, (el: Element, propName, nv) => {
            try{
                const isConnected = self.isConnected;
            }catch(e){
                return;
            }
            const valFT = vft || valFromTarget;
            const valFE = vfe || valFromEvent;
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
        });
    }else{
        throw 'NI'; // not implemented
    }
    return {
        success: true,
        element: elementToObserve,
    };
}

export async function hookUp(fromParam: any, proxy: Element & BeObservantVirtualProps, toParam: string, noAwait = false, host?: Element): Promise<HookUpInfo>{
    switch(typeof fromParam){
        case 'object':{
                if(Array.isArray(fromParam)){
                    //assume for now is a string array
                    const arr = fromParam as string[];
                    if(arr.length !== 1) throw 'NI';
                    //assume for now only one element in the array
                    //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                    (<any>proxy)[toParam] = fromParam[0];
                    return {
                        success: true,
                    };
                }else{
                    const observeParams = fromParam as IObserve;
                    const {getElementToObserve} = await import('./getElementToObserve.js');
                    const elementToObserve = getElementToObserve(proxy, observeParams, host);
                    if(elementToObserve === null){
                        console.warn({msg:'404',observeParams});
                        return {
                            success: false,
                        };
                    }
                    return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
                }

            }
            break;
        case 'string':
            {
                const ocoho = '[itemscope]';
                const isProp = fromParam[0] === '.';
                const vft = isProp ? fromParam.substr(1) : fromParam;
                const nudge = true;
                const observeParams = isProp ? {onSet: vft, vft, ocoho, nudge} as IObserve : {vft, ocoho, nudge} as IObserve;
                const {getElementToObserve} = await import('./getElementToObserve.js');
                let elementToObserve = getElementToObserve(proxy, observeParams, host);
                if(elementToObserve === null && observeParams.observeInward !== undefined){
                    //wait for element to fill up hopefully
                    await sleep(50);
                    elementToObserve = proxy.querySelector(observeParams.observeInward);
                }
                if(!elementToObserve){
                    console.warn({msg:'404',observeParams});
                    return {
                        success: false,
                    };
                }
                return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
            }
            break;
        default:
            (<any>proxy)[toParam] = fromParam;
            return {
                success: true,
            };
    }
}

export async function sleep(ms: number): Promise<void>{
    return new Promise(resolve => {
        setTimeout(() => { resolve() }, ms);
    })
}