import {setProp} from './setProp.js';
import {getProxy} from "./getProxy.js";
import {IObserve, BeObservantVirtualProps} from './types';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import {nudge} from 'trans-render/lib/nudge.js';
import {subscribe, tooSoon} from 'trans-render/lib/subscribe.js';
import {getElementToObserve} from './getElementToObserve.js';

export async function addListener(elementToObserve: Element, observeParams: IObserve, propKey: string, self: Element & BeObservantVirtualProps, noAwait = false): Promise<boolean>{
    const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy} = observeParams;
    if(noAwait && fromProxy) return false;
    const valFT = vft || valFromTarget;
    const onz = onSet !== undefined ? undefined :
         on || (valFT ? (fromProxy ? fromProxy + '::'  : '') + camelToLisp(valFT) + '-changed' : undefined); 
    const valFE = vfe || valFromEvent;
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
        if(elementToObserve.getAttribute !== undefined) nudge(elementToObserve);
    }else if(onSet !== undefined){
        if(noAwait && tooSoon(elementToObserve)) return false;
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
    return true;
}

export async function hookUp(fromParam: any, proxy: Element & BeObservantVirtualProps, toParam: string, noAwait = false, host?: Element): Promise<boolean>{
    switch(typeof fromParam){
        case 'object':{
                if(Array.isArray(fromParam)){
                    //assume for now is a string array
                    const arr = fromParam as string[];
                    if(arr.length !== 1) throw 'NI';
                    //assume for now only one element in the array
                    //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                    (<any>proxy)[toParam] = fromParam[0];
                    return true;
                }else{
                    const observeParams = fromParam as IObserve;
                    const elementToObserve = getElementToObserve(proxy, observeParams);
                    if(elementToObserve === null){
                        console.warn({msg:'404',observeParams});
                        return false;
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
                const observeParams = isProp ? {onSet: vft, vft, ocoho} as IObserve : {vft, ocoho} as IObserve;
                
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if(!elementToObserve){
                    console.warn({msg:'404',observeParams});
                    return false;
                }
                return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
            }
            break;
        default:
            (<any>proxy)[toParam] = fromParam;
            return true;
    }
}