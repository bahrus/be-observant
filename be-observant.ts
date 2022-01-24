import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {hookUp} from './hookUp.js';
import {register} from "be-hive/register.js";
import { unsubscribe } from 'trans-render/lib/subscribe.js';

export {IObserve} from './types';

export class BeObservantController {
    intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe!)!);
        for(const propKey in params){
            const parm = params[propKey];
            hookUp(parm, proxy, propKey);
        }        
    }
    finale(proxy: Element & BeObservantVirtualProps, target:Element){
        const eventHandlers = proxy.eventHandlers!;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
            unsubscribe(eh.elementToObserve);
        }
        const subscriptions = proxy.subscriptions;
        if(subscriptions !== undefined){
            for(const el of subscriptions){
                unsubscribe(el);
            }
        }
        unsubscribe(proxy);
    }
}

export interface BeObservantController extends BeObservantProps{}

const tagName = 'be-observant';

const ifWantsToBe = 'observant';

const upgrade = '*';

define<BeObservantProps & BeDecoratedProps<BeObservantProps, BeObservantActions>, BeObservantActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            noParse: true,
            forceVisible: ['template', 'script', 'style'],
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['eventHandlers', 'subscriptions']
        }
    },
    complexPropDefaults:{
        controller: BeObservantController
    }
});

register(ifWantsToBe, upgrade, tagName);
