import {getHost} from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import {IObserve} from './types';
export {IObserve} from './types';

export function getElementToObserve(self:Element, 
    {observeClosest, observe}: IObserve)
{
    let elementToObserve: Element | null = null;
    if(observeClosest !== undefined){
        elementToObserve = self.closest(observeClosest);
        if(elementToObserve !== null && observe){
            elementToObserve = upSearch(elementToObserve, observe) as Element;
        }
    }else if(observe !== undefined) {
        elementToObserve = upSearch(self, observe) as Element;
    }else{
        elementToObserve = getHost(self);
    }
    return elementToObserve;
}