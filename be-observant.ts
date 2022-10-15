import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, IObserve, VirtualProps, HookUpInfo, PP, Proxy} from './types';
import {register} from "be-hive/register.js";

export {IObserve} from './types';

export class BeObservant extends EventTarget implements Actions {
    #controllers: AbortController[] = [];

    async toIObserve(s: string){
        const {toIObserve} = await import('./hookUp.js');
        return toIObserve(s);
    }

    async onProps({props, proxy}: PP) {
        this.#disconnect();
        const {hookUp} = await import('./hookUp.js');
        if(Array.isArray(props)){
            for(const parm of props){
                await this.#doParams(parm, hookUp, proxy);
            }
        }else{
            await this.#doParams(props, hookUp, proxy);
        }
        proxy.resolved = true;
    }
    async #doParams(params: any, hookUp: (fromParam: any, proxy: Proxy, toParam: string, noAwait?: boolean, host?: Element) => Promise<void | HookUpInfo>, proxy: Proxy){
        let lastKey = '';
        for(const propKey in params){
            let parm = params[propKey] as string | IObserve | (string | IObserve)[];
            if(typeof parm === 'string') parm = await this.toIObserve(parm);
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            const info = await hookUp(parm, proxy, key);
            if(info) this.#controllers.push(info.controller!);
            if(!startsWithHat) lastKey = propKey;
        }  
    }
    #disconnect(){
        for(const c of this.#controllers){
            c.abort();
        }
    }
    async finale(proxy: Proxy, target:Element){
        this.#disconnect();
    }
}


const tagName = 'be-observant';

const ifWantsToBe = 'observant';

const upgrade = '*';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: ['template', 'script', 'style'],
            finale: 'finale',
            virtualProps: ['props'],
            primaryProp: 'props',
            primaryPropReq: true,
        },
        actions: {
            onProps: 'props',
        }
    },
    complexPropDefaults:{
        controller: BeObservant
    }
});

register(ifWantsToBe, upgrade, tagName);
