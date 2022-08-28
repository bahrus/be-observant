import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {register} from "be-hive/register.js";

export {IObserve} from './types';

export class BeObservantController extends EventTarget {
    async intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe!)!);
        const {hookUp} = await import('./hookUp.js');
        if(Array.isArray(params)){
            for(const parm of params){
                await this.#doParams(parm, hookUp, proxy);
            }
        }else{
            await this.#doParams(params, hookUp, proxy);
        }
        proxy.resolved = true;
    }
    async #doParams(params: any, hookUp: any, proxy: Element & BeObservantVirtualProps){
        let lastKey = '';
        for(const propKey in params){
            const parm = params[propKey];
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            await hookUp(parm, proxy, key);
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
            intro: 'intro',
            noParse: true,
            forceVisible: ['template', 'script', 'style'],
            finale: 'finale',
            virtualProps: ['eventHandlers', 'subscriptions']
        }
    },
    complexPropDefaults:{
        controller: BeObservantController
    }
});

register(ifWantsToBe, upgrade, tagName);
