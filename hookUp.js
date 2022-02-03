import { setProp } from './setProp.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { nudge } from 'trans-render/lib/nudge.js';
import { subscribe, tooSoon } from 'trans-render/lib/subscribe.js';
import { getElementToObserve } from './getElementToObserve.js';
export async function addListener(elementToObserve, observeParams, propKey, self, noAwait = false) {
    const { on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy } = observeParams;
    if (noAwait && fromProxy)
        return false;
    const valFT = vft || valFromTarget;
    const onz = onSet !== undefined ? undefined :
        on || (valFT ? (fromProxy ? fromProxy + '::' : '') + camelToLisp(valFT) + '-changed' : undefined);
    const valFE = vfe || valFromEvent;
    if (valFT !== undefined && !skipInit) {
        if (observeParams.debug)
            debugger;
        await setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    if (onz !== undefined) {
        const fn = (e) => {
            e.stopPropagation();
            try {
                const isConnected = self.isConnected;
            }
            catch (e) {
                return;
            }
            if (self.debug) {
                console.log({ e, valFT, valFE, propKey, observeParams });
            }
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self, e);
        };
        elementToObserve.addEventListener(onz, fn);
        if (self.debug) {
            console.log({ onz, elementToObserve, fn });
        }
        if (self.eventHandlers === undefined)
            self.eventHandlers = [];
        self.eventHandlers.push({ on: onz, elementToObserve, fn });
        if (elementToObserve.getAttribute !== undefined)
            nudge(elementToObserve);
    }
    else if (onSet !== undefined) {
        if (noAwait && tooSoon(elementToObserve))
            return false;
        if (self.subscriptions === undefined)
            self.subscriptions = [];
        self.subscriptions.push(elementToObserve);
        subscribe(elementToObserve, onSet, (el, propName, nv) => {
            try {
                const isConnected = self.isConnected;
            }
            catch (e) {
                return;
            }
            const valFT = vft || valFromTarget;
            const valFE = vfe || valFromEvent;
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
        });
    }
    else {
        throw 'NI'; // not implemented
    }
    return true;
}
export async function hookUp(fromParam, proxy, toParam, noAwait = false, host) {
    switch (typeof fromParam) {
        case 'object':
            {
                if (Array.isArray(fromParam)) {
                    //assume for now is a string array
                    const arr = fromParam;
                    if (arr.length !== 1)
                        throw 'NI';
                    //assume for now only one element in the array
                    //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                    proxy[toParam] = fromParam[0];
                    return true;
                }
                else {
                    const observeParams = fromParam;
                    const elementToObserve = getElementToObserve(proxy, observeParams, host);
                    if (elementToObserve === null) {
                        console.warn({ msg: '404', observeParams });
                        return false;
                    }
                    return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
                }
            }
            break;
        case 'string':
            {
                const ocoho = '[itemscope]';
                const isProp = fromParam[0] === '.';
                const vft = isProp ? fromParam.substr(1) : fromParam;
                const observeParams = isProp ? { onSet: vft, vft, ocoho } : { vft, ocoho };
                const elementToObserve = getElementToObserve(proxy, observeParams, host);
                if (!elementToObserve) {
                    console.warn({ msg: '404', observeParams });
                    return false;
                }
                return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
            }
            break;
        default:
            proxy[toParam] = fromParam;
            return true;
    }
}
