import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {getElementToObserve} from './getElementToObserve.js';
import {addListener} from './addListener.js';
import {register} from "be-hive/register.js";

export {IObserve} from './types';

export class BeObservantController {
    intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe!)!);
        for(const propKey in params){
            const parm = params[propKey];
            const observeParams = ((typeof parm === 'string') ? {vft: parm} : parm) as IObserve;
            const elementToObserve = getElementToObserve(proxy, observeParams);
            if(elementToObserve === null){
                console.warn({msg:'404',observeParams});
                continue;
            }
            addListener(elementToObserve, observeParams, propKey, proxy);
            
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









function getHost(self:Element): HTMLElement{
    let host = (<any>self.getRootNode()).host;
    if(host === undefined){
        host = self.parentElement;
        while(host && !host.localName.includes('-')){
            host = host.parentElement;
        }
    }
    return host;
}