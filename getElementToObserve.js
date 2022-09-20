export async function getElementToObserve(self, observeParam, host) {
    const { observeClosestOrHost, ocoho } = observeParam;
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
    const { observeClosest, oc, observe, o } = observeParam;
    const _ = o || observe;
    const c = oc || observeClosest;
    if (c !== undefined) {
        elementToObserve = self.closest(c);
        if (elementToObserve !== null && _) {
            const { upSearch } = await import('trans-render/lib/upSearch.js');
            elementToObserve = upSearch(elementToObserve, _);
        }
        return elementToObserve;
    }
    if (_ !== undefined) {
        const { upSearch } = await import('trans-render/lib/upSearch.js');
        return upSearch(self, _);
    }
    const { observeSelf, os } = observeParam;
    const s = os || observeSelf;
    if (s) {
        return self;
    }
    const { observeInward, oi } = observeParam;
    const i = oi || observeInward;
    if (i !== undefined) {
        //TODO: beacon
        return self.querySelector(i);
    }
    const { observeWinObj, owo } = observeParam;
    const wo = owo || observeWinObj;
    if (wo !== undefined) {
        return window[wo];
    }
    const { observeHostProp, ohop } = observeParam;
    const hop = ohop || observeHostProp;
    if (hop !== undefined) {
        const { getElementWithProp } = await import('./getElementWithProp.js');
        return await getElementWithProp(self, hop);
    }
    const { observeName, ona } = observeParam;
    const nm = ona || observeName;
    if (nm !== undefined) {
        const form = self.closest('form');
        if (form !== null) {
            const el = form.elements[nm];
            if (el)
                return el;
        }
        const { upSearch } = await import('trans-render/lib/upSearch.js');
        return upSearch(self, `[name="${nm}"]`, true);
    }
    const { getHost } = await import('trans-render/lib/getHost.js');
    return host || getHost(self);
}
