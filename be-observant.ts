import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {register} from "be-hive/register.js";

export {IObserve} from './types';

export class BeObservantController {
    async intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe!)!);
        const {hookUp} = await import('./hookUp.js');
        if(Array.isArray(params)){
            for(const parm of params){
                this.#doParams(parm, hookUp, proxy);
            }
        }else{
            this.#doParams(params, hookUp, proxy);
        }
      
    }
    #doParams(params: any, hookUp: any, proxy: Element & BeObservantVirtualProps){
        let lastKey = '';
        for(const propKey in params){
            const parm = params[propKey];
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            hookUp(parm, proxy, key);
            if(!startsWithHat) lastKey = propKey;
        }  
    }
    async finale(proxy: Element & BeObservantVirtualProps, target:Element){
        const eventHandlers = proxy.eventHandlers!;
        const {unsubscribe} = await import('trans-render/lib/subscribe.js');
        if(eventHandlers !== undefined){
            for(const eh of eventHandlers){
                eh.elementToObserve.removeEventListener(eh.on, eh.fn);
                unsubscribe(eh.elementToObserve);
            }
        }
        const subscriptions = proxy.subscriptions;
        if(subscriptions !== undefined){
            for(const el of subscriptions){
                unsubscribe(el);
            }
        }
        unsubscribe(target);
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
