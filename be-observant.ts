import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {getVal} from 'be-decorated/upgrade.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {register} from "be-hive/register.js";

export {IObserve} from './types';

export class BeObservantController {
    async intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        let params: any;
        if(beDecorProps.virtualPropsMap.has(target) !== undefined){
            params = beDecorProps.virtualPropsMap.get(target);
        }
        if(params === undefined){
            const val = getVal(target, beDecorProps.ifWantsToBe);
            const attr = val[0]!;
            params = JSON.parse(attr);
            beDecorProps.virtualPropsMap.set(target, params);
        }
        const {hookUp} = await import('./hookUp.js');
        for(const propKey in params){
            const parm = params[propKey];
            hookUp(parm, proxy, propKey);
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
