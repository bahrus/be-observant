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
            const {upSearch} = await import('trans-render/lib/upSearch.js');
            elementToObserve = upSearch(elementToObserve, _) as Element;
        }
        return elementToObserve;
    }
    if(_ !== undefined){
        const {upSearch} = await import('trans-render/lib/upSearch.js');
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
        elementToObserve = self.querySelector(i);
        if(elementToObserve === null){
            const {childrenParsed} = await import ('be-a-beacon/childrenParsed.js');
            await childrenParsed(self);
            elementToObserve = self.querySelector(i);
        }
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
    const {observeName, ona} = observeParam;
    const nm = ona || observeName;
    if(nm !== undefined){
        const form = self.closest('form');
        if(form !== null){
            const el = form.elements[nm as any as number];
            if(el) return el;
        }
        const {upSearch} = await import('trans-render/lib/upSearch.js');
        return upSearch(self, `[name="${nm}"]`, true);
    }
    const {getHost} = await import('trans-render/lib/getHost.js');
    return (host || getHost(self)) as Element;
    
}

