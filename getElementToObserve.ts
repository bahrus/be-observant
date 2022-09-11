import {getHost} from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import {IObserve} from './types';
export {IObserve} from './types';

export async function getElementToObserve(self:Element, 
    {
        observeClosest, oc, 
        observe, o, 
        observeClosestOrHost, ocoho, 
        observeSelf, os, 
        observeWinObj, owo, 
        observeInward, oi, 
        observeHostProp, ohop
    }: IObserve, host?: Element): Promise<Element | null>
{
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
    const c = oc || observeClosest;
    if(c !== undefined){
        elementToObserve = self.closest(c);
        if(elementToObserve !== null && observe){
            elementToObserve = upSearch(elementToObserve, observe) as Element;
        }
        return elementToObserve;
    }
    const _ = o || observe;
    if(_ !== undefined){
        return upSearch(self, _) as Element;
    }
    const s = os || observeSelf;
    if(s){
        return self;
    }
    const i = oi || observeInward;
    if(i !== undefined){
        //TODO: beacon
        return self.querySelector(i);
    }
    const wo = owo || observeWinObj;
    if(wo !== undefined){
        return (<any>window)[wo];
    }
    const hop = ohop || observeHostProp;
    if(hop !== undefined){
        const {getElementWithProp} = await import('./getElementWithProp.js');
        return await getElementWithProp(self, hop);
    }
    return host || getHost(self);
    
}

