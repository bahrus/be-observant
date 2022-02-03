import { register } from 'trans-render/lib/pluginMgr.js';
import { hookUp } from './hookUp';
export const trPlugin = {
    selector: 'beObservantAttribs',
    processor: async ({ target, val, attrib, host }) => {
        const params = JSON.parse(attrib);
        const fulfilled = [];
        const unfulfilled = [];
        for (const propKey in params) {
            const parm = params[propKey];
            if (await hookUp(parm, target, propKey, true, host)) {
                fulfilled.push(propKey);
            }
            else {
                unfulfilled.push(propKey);
            }
        }
        if (unfulfilled.length === 0) {
            target.setAttribute(attrib.replace('be-', 'is-'), val);
        }
        else {
            const isObj = {};
            const beObj = {};
            for (const propKey of fulfilled) {
                isObj[propKey] = params[propKey];
            }
            for (const propKey of unfulfilled) {
                beObj[propKey] = params[propKey];
            }
            target.setAttribute(attrib, JSON.stringify(beObj));
            target.setAttribute(attrib.replace('be-', 'is-'), JSON.stringify(isObj));
        }
    }
};
register(trPlugin);
