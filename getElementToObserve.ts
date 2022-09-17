import {getHost} from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import {IObserve} from './types';
export {IObserve} from './types';

export async function getElementToObserve(self:Element, observeParam:IObserve, host?: Element): Promise<Element | null>
{
    const {observeClosestOrHost, ocoho} = observeParam;
    let elementToObserve: Element | null = null;
    const coho = ocoho || observeClosestOrHost;
    if(coho !== undefined){
        const closest = coho === true ? '[itemscope]' : coho.toString();
        const parent = self.parentElement;
        elementToObserve = parent === null ? null : parent.closest(closest);
        if(elementToObserve === null){
            elementToObserve = host || (<any>self.getRootNode()).host as Element;
        }
        return elementToObserve;
    }
    const {observeClosest, oc, observe, o} = observeParam;
    const _ = o || observe;
    const c = oc || observeClosest;
    if(c !== undefined){
        elementToObserve = self.closest(c);
        if(elementToObserve !== null && _){
            elementToObserve = upSearch(elementToObserve, _) as Element;
        }
        return elementToObserve;
    }
    if(_ !== undefined){
        return upSearch(self, _) as Element;
    }
    const {observeSelf, os} = observeParam;
    const s = os || observeSelf;
    if(s){
        return self;
    }
    const {observeInward, oi} = observeParam;
    const i = oi || observeInward;
    if(i !== undefined){
        //TODO: beacon
        return self.querySelector(i);
    }
    const {observeWinObj, owo} = observeParam;
    const wo = owo || observeWinObj;
    if(wo !== undefined){
        return (<any>window)[wo];
    }
    const {observeHostProp, ohop} = observeParam;
    const hop = ohop || observeHostProp;
    if(hop !== undefined){
        const {getElementWithProp} = await import('./getElementWithProp.js');
        return await getElementWithProp(self, hop);
    }
    return host || getHost(self);
    
}

