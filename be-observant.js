import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from './hookUp.js';
import { register } from "be-hive/register.js";
import { unsubscribe } from 'trans-render/lib/subscribe.js';
export class BeObservantController {
    intro(proxy, target, beDecorProps) {
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe));
        for (const propKey in params) {
            const parm = params[propKey];
            hookUp(parm, proxy, propKey);
        }
    }
    finale(proxy, target) {
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
            unsubscribe(eh.elementToObserve);
        }
        const subscriptions = proxy.subscriptions;
        if (subscriptions !== undefined) {
            for (const el of subscriptions) {
                unsubscribe(el);
            }
        }
        unsubscribe(target);
        unsubscribe(proxy);
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
            forceVisible: ['template', 'script', 'style'],
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['eventHandlers', 'subscriptions']
        }
    },
    complexPropDefaults: {
        controller: BeObservantController
    }
});
register(ifWantsToBe, upgrade, tagName);
