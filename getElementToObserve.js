import { getHost } from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
export function getElementToObserve(self, { observeClosest, observe, observeClosestOrHost, ocoho, observeSelf, observeWinObj }, host) {
    let elementToObserve = null;
    const oc = ocoho || observeClosestOrHost;
    if (oc !== undefined) {
        const closest = oc === true ? '[itemscope]' : oc.toString();
        const parent = self.parentElement;
        elementToObserve = parent === null ? null : parent.closest(closest);
        if (elementToObserve === null) {
            elementToObserve = host || self.getRootNode().host;
        }
    }
    else if (observeClosest !== undefined) {
        elementToObserve = self.closest(observeClosest);
        if (elementToObserve !== null && observe) {
            elementToObserve = upSearch(elementToObserve, observe);
        }
    }
    else if (observe !== undefined) {
        elementToObserve = upSearch(self, observe);
    }
    else if (observeSelf) {
        elementToObserve = self;
    }
    else if (observeWinObj !== undefined) {
        elementToObserve = window[observeWinObj];
    }
    else {
        elementToObserve = host || getHost(self);
    }
    return elementToObserve;
}
