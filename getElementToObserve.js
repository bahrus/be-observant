import { getHost } from 'trans-render/lib/getHost.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
export function getElementToObserve(self, { observeClosest, observe }) {
    let elementToObserve = null;
    if (observeClosest !== undefined) {
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
export function getObserve(param) {
    let observeParams = param;
    switch (typeof param) {
        case 'string':
            if (param.startsWith('.')) {
                const vft = param.substr(1);
                observeParams = { 'onSet': vft, vft };
            }
            else {
                observeParams = { vft: param };
            }
    }
    return observeParams;
}
