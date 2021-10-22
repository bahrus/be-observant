import { define } from 'be-decorated/be-decorated.js';
import { getElementToObserve } from './getElementToObserve.js';
import { addListener } from './addListener.js';
import { register } from "be-hive/register.js";
export class BeObservantController {
    intro(proxy, target, beDecorProps) {
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe));
        for (const propKey in params) {
            const parm = params[propKey];
            const observeParams = ((typeof parm === 'string') ? { vft: parm } : parm);
            const elementToObserve = getElementToObserve(proxy, observeParams);
            if (elementToObserve === null) {
                console.warn({ msg: '404', observeParams });
                continue;
            }
            addListener(elementToObserve, observeParams, propKey, proxy);
        }
    }
    finale(proxy, target) {
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}
const tagName = 'be-observant';
const ifWantsToBe = 'observant';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            noParse: true,
            forceVisible: true,
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults: {
        controller: BeObservantController
    }
});
register(ifWantsToBe, upgrade, tagName);
function getHost(self) {
    let host = self.getRootNode().host;
    if (host === undefined) {
        host = self.parentElement;
        while (host && !host.localName.includes('-')) {
            host = host.parentElement;
        }
    }
    return host;
}
