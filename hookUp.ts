import {setProp} from './setProp.js';
import {getProxy} from "./getProxy.js";
import {IObserve} from './types';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import {nudge} from 'trans-render/lib/nudge.js';
import {getElementToObserve} from './getElementToObserve.js';

const propSubscribers = new WeakMap<Element, {[key: string]: {observeParams: IObserve, propKey: string}[]}>();

export async function addListener(elementToObserve: Element, observeParams: IObserve, propKey: string, self: Element){
    const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy} = observeParams;
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
            if((<any>self).debug){
                console.log({e, valFT, valFE, propKey, observeParams});
            }
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self, e);
        }
        elementToObserve.addEventListener(onz, fn);
        if((<any>self).debug){
            console.log({onz, elementToObserve, fn});
        }
        if((<any>self).eventHandlers === undefined) (<any>self).eventHandlers = [];
        (<any>self).eventHandlers.push({onz, elementToObserve, fn});
        nudge(elementToObserve);
    }else if(onSet !== undefined){
        if(!propSubscribers.has(elementToObserve)){
            propSubscribers.set(elementToObserve, {
            });
        }
        const subscribers = propSubscribers.get(elementToObserve)!;
        if(subscribers[onSet] === undefined){
            subscribers[onSet] = [{observeParams, propKey}];     
            let proto = elementToObserve;
            let prop: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(proto, onSet);
            while(proto && !prop){
                proto = Object.getPrototypeOf(proto);
                prop = Object.getOwnPropertyDescriptor(proto, onSet);
            }
            if(prop === undefined){
                throw {elementToObserve, onSet, message: "Can't find property."};
            }
            const setter = prop.set!.bind(elementToObserve);
            const getter = prop.get!.bind(elementToObserve);
            Object.defineProperty(elementToObserve, onSet!, {
                get(){
                    return getter();
                },
                set(nv){
                    setter(nv);
                    // const event = {
                    //     target: this
                    // } as Event;
                    if(observeParams.debug) debugger;
                    const observers = propSubscribers.get(elementToObserve)![onSet!];
                    for(const observer of observers){
                        
                        const {vft, valFromTarget, valFromEvent, vfe} = observer.observeParams;
                        const valFT = vft || valFromTarget;
                        const valFE = vfe || valFromEvent;
                        //console.log({observer, valFE, event);
                        setProp(valFT, valFE, observer.propKey, elementToObserve, observer.observeParams, self);
                    }
                    //setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
                },
                enumerable: true,
                configurable: true,
            });
            
        }else{
            //console.log({elementToObserve, observeParams, propKey});
            const subscriberSeq = propSubscribers.get(elementToObserve)![onSet!];
            subscriberSeq.push({observeParams, propKey});
        }
        

        
    }else{
        throw 'NI'; // not implemented
    }
}

export async function hookUp(fromParam: any, proxy: any, toParam: string){
    switch(typeof fromParam){
        case 'object':{
                if(Array.isArray(fromParam)){
                    //assume for now is a string array
                    const arr = fromParam as string[];
                    if(arr.length !== 1) throw 'NI';
                    //assume for now only one element in the array
                    //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                    proxy[toParam] = fromParam;
                }else{
                    const observeParams = fromParam as IObserve;
                    const elementToObserve = getElementToObserve(proxy, observeParams);
                    if(elementToObserve === null){
                        console.warn({msg:'404',observeParams});
                        return;
                    }
                    await addListener(elementToObserve, observeParams, toParam, proxy);
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
                    return;
                }
                await addListener(elementToObserve, observeParams, toParam, proxy);
            }
            break;
        default:
            proxy[toParam] = fromParam;
    }
}