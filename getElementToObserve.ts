import {getHost} from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import {IObserve} from './types';
export {IObserve} from './types';
declare const appHistory: any;

export function getElementToObserve(self:Element, 
    {observeClosest, observe, observeClosestOrHost, ocoho, observeSelf, observeWinObj, observeInward}: IObserve, host?: Element): Element | null
{
    let elementToObserve: Element | null = null;
    const oc = ocoho || observeClosestOrHost;
    if(oc !== undefined){
        const closest = oc === true ? '[itemscope]' : oc.toString();
        const parent = self.parentElement;
        elementToObserve = parent === null ? null : parent.closest(closest);
        if(elementToObserve === null){
            elementToObserve = host || (<any>self.getRootNode()).host as Element;
        }
    }else if(observeClosest !== undefined){
        elementToObserve = self.closest(observeClosest);
        if(elementToObserve !== null && observe){
            elementToObserve = upSearch(elementToObserve, observe) as Element;
        }
    }else if(observe !== undefined) {
        elementToObserve = upSearch(self, observe) as Element;
    }else if(observeSelf){
        elementToObserve = self;
    }else if (observeInward !== undefined){
        elementToObserve = self.querySelector(observeInward);
    }else if(observeWinObj !== undefined){
        elementToObserve = (<any>window)[observeWinObj];
    }else{
        elementToObserve = host || getHost(self);
    }
    return elementToObserve;
}

