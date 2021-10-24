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

export function getObserve(param: any){
    let observeParams = param as IObserve;
    switch(typeof param){
        case 'string':
            if(param[0] === '.'){
                const vft = param.substr(1);
                observeParams = {'onSet': vft, vft};
            }else{
                observeParams = {vft: param};
            }
    }
    return observeParams;
}