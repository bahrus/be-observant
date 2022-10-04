import {IObserve, VirtualProps, HookUpInfo} from './types';


export async function addListener(elementToObserve: Element, observeParams: IObserve, propKey: string, target: EventTarget, noAwait = false): Promise<HookUpInfo>{
    const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, nudge, observeHostProp, eventListenerOptions, eval: e} = observeParams;
    const valFT = vft || valFromTarget || e;
    const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
    const onSetX = onSet || observeHostProp;
    const onz = onSetX !== undefined ? undefined :
         on || (e ? camelToLisp(e) : undefined) || (valFT ? camelToLisp(valFT) + '-changed' : undefined); 
    const valFE = vfe || valFromEvent;
    const {setProp} = await import('./setProp.js');
    if(valFT !== undefined && !skipInit){
        if(observeParams.debug) debugger;
        await setProp(valFT, valFE, propKey, elementToObserve, observeParams, target);
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
                const isConnected = (<any>target).isConnected;
            }catch(e){
                return;
            }
            if((<any>target).debug){
                console.log({e, valFT, valFE, propKey, observeParams});
            }
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, target, e);
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
        if((<any>target).debug){
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
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, target);
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

export async function hookUp(fromParam: string | IObserve, ref: Element | [Element, EventTarget], toParam: string, noAwait = false, host?: Element): Promise<HookUpInfo>{
    const observeParam = (typeof fromParam === 'string') ? toIObserve(fromParam) : fromParam;
    const self = Array.isArray(ref) ? ref[0] : ref;
    let elementToObserve: Element | null = null;
    const {of} = observeParam;
    if(of !== undefined){
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        elementToObserve = await findRealm(self, of) as Element;
    }else{
        const {getElementToObserve} = await import('./getElementToObserve.js');
        elementToObserve = await getElementToObserve(self, observeParam, host);
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
    const target = Array.isArray(ref) ? ref[1] : ref;
    return await addListener(elementToObserve, observeParam, toParam, target, noAwait);
}
    


export async function sleep(ms: number): Promise<void>{
    return new Promise(resolve => {
        setTimeout(() => { resolve() }, ms);
    })
}