import {getHost} from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import {IObserve} from './types';
export {IObserve} from './types';
declare const appHistory: any;

export function getElementToObserve(self:Element, 
    {observeClosest, observe, observeClosestOrHost, ocoho, observeSelf, observeAppHistory}: IObserve)
{
    let elementToObserve: Element | null = null;
    const oc = ocoho || observeClosestOrHost;
    if(oc !== undefined){
        const closest = oc === true ? '[itemscope]' : oc.toString();
        const parent = self.parentElement;
        elementToObserve = parent === null ? null : parent.closest(closest);
        if(elementToObserve === null){
            elementToObserve = (<any>self.getRootNode()).host as Element;
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
    }else if(observeAppHistory){
        elementToObserve = appHistory;
    }else{
        elementToObserve = getHost(self);
    }
    return elementToObserve;
}

