import { getHost } from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
export async function getElementToObserve(self, { observeClosest, oc, observe, o, observeClosestOrHost, ocoho, observeSelf, os, observeWinObj, owo, observeInward, oi, observeHostProp, ohop }, host) {
    let elementToObserve = null;
    const coho = ocoho || observeClosestOrHost;
    if (coho !== undefined) {
        const closest = coho === true ? '[itemscope]' : coho.toString();
        const parent = self.parentElement;
        elementToObserve = parent === null ? null : parent.closest(closest);
        if (elementToObserve === null) {
            elementToObserve = host || self.getRootNode().host;
        }
        return elementToObserve;
    }
    const c = oc || observeClosest;
    if (c !== undefined) {
        elementToObserve = self.closest(c);
        if (elementToObserve !== null && observe) {
            elementToObserve = upSearch(elementToObserve, observe);
        }
        return elementToObserve;
    }
    const _ = o || observe;
    if (_ !== undefined) {
        return upSearch(self, _);
    }
    const s = os || observeSelf;
    if (s) {
        return self;
    }
    const i = oi || observeInward;
    if (i !== undefined) {
        //TODO: beacon
        return self.querySelector(i);
    }
    const wo = owo || observeWinObj;
    if (wo !== undefined) {
        return window[wo];
    }
    const hop = ohop || observeHostProp;
    if (hop !== undefined) {
        const { getElementWithProp } = await import('./getElementWithProp.js');
        return await getElementWithProp(self, hop);
    }
    return host || getHost(self);
}
