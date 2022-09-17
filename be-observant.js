import { define } from 'be-decorated/be-decorated.js';
import { register } from "be-hive/register.js";
export class BeObservant extends EventTarget {
    #controllers = [];
    async toIObserve(s) {
        const { toIObserve } = await import('./hookUp.js');
        return toIObserve(s);
    }
    async onProps({ props, proxy }) {
        this.#disconnect();
        const { hookUp } = await import('./hookUp.js');
        if (Array.isArray(props)) {
            for (const parm of props) {
                await this.#doParams(parm, hookUp, proxy);
            }
        }
        else {
            await this.#doParams(props, hookUp, proxy);
        }
        proxy.resolved = true;
    }
    async #doParams(params, hookUp, proxy) {
        let lastKey = '';
        for (const propKey in params) {
            let parm = params[propKey];
            if (typeof parm === 'string')
                parm = await this.toIObserve(parm);
            const startsWithHat = propKey[0] === '^';
            const key = startsWithHat ? lastKey : propKey;
            const info = await hookUp(parm, proxy, key);
            this.#controllers.push(info.controller);
            if (!startsWithHat)
                lastKey = propKey;
        }
    }
    #disconnect() {
        for (const c of this.#controllers) {
            c.abort();
        }
    }
    async finale(proxy, target) {
        this.#disconnect();
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
    complexPropDefaults: {
        controller: BeObservant
    }
});
register(ifWantsToBe, upgrade, tagName);
