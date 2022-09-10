import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {Actions, IObserve, VirtualProps, HookUpInfo} from './types';
import {register} from "be-hive/register.js";

export {IObserve} from './types';

export class BeObservantController extends EventTarget {
    #controllers: AbortController[] | undefined;
    async intro(proxy: Element & VirtualProps, target: Element, beDecorProps: BeDecoratedProps){
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
    async #doParams(params: any, hookUp: (fromParam: any, proxy: Element & VirtualProps, toParam: string, noAwait?: boolean, host?: Element) => Promise<HookUpInfo>, proxy: Element & VirtualProps){
        this.disconnect();
        this.#controllers = [];
        let lastKey = '';

        for(const propKey in params){
            const parm = params[propKey];
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            const info = await hookUp(parm, proxy, key);
            this.#controllers.push(info.controller!);
            if(!startsWithHat) lastKey = propKey;
        }  
    }
    disconnect(){
        if(this.#controllers !== undefined){
            for(const c of this.#controllers){
                c.abort();
            }
        }
    }
    async finale(proxy: Element & VirtualProps, target:Element){
        this.disconnect();
    }
}


const tagName = 'be-observant';

const ifWantsToBe = 'observant';

const upgrade = '*';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            intro: 'intro',
            noParse: true,
            forceVisible: ['template', 'script', 'style'],
            finale: 'finale',
            virtualProps: []
        }
    },
    complexPropDefaults:{
        controller: BeObservantController
    }
});

register(ifWantsToBe, upgrade, tagName);
