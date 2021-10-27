import { getHost } from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
export function getElementToObserve(self, { observeClosest, observe, observeClosestOrHost, ocoho }) {
    let elementToObserve = null;
    const oc = ocoho || observeClosestOrHost;
    if (oc !== undefined) {
        elementToObserve = self.closest(oc);
        if (elementToObserve === null) {
            elementToObserve = self.getRootNode().host;
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
    else {
        elementToObserve = getHost(self);
    }
    return elementToObserve;
}
