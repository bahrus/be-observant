import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {hookUp} from './hookUp.js';
import {register} from "be-hive/register.js";

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
        const eventHandlers = proxy.eventHandlers;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
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
            forceVisible: true,
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults:{
        controller: BeObservantController
    }
});

register(ifWantsToBe, upgrade, tagName);
