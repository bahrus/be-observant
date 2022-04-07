import { define } from 'be-decorated/be-decorated.js';
import { doParse } from 'be-decorated/doParse.js';
import { register } from "be-hive/register.js";
export class BeObservantController {
    async intro(proxy, target, beDecorProps) {
        const params = doParse(target, beDecorProps);
        const { hookUp } = await import('./hookUp.js');
        for (const propKey in params) {
            const parm = params[propKey];
            hookUp(parm, proxy, propKey);
        }
    }
    async finale(proxy, target) {
        const eventHandlers = proxy.eventHandlers;
        const { unsubscribe } = await import('trans-render/lib/subscribe.js');
        if (eventHandlers !== undefined) {
            for (const eh of eventHandlers) {
                eh.elementToObserve.removeEventListener(eh.on, eh.fn);
                unsubscribe(eh.elementToObserve);
            }
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
