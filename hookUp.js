import { setProp } from './setProp.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { nudge } from 'trans-render/lib/nudge.js';
import { subscribe } from 'trans-render/lib/subscribe.js';
import { getElementToObserve } from './getElementToObserve.js';
export async function addListener(elementToObserve, observeParams, propKey, self) {
    const { on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy } = observeParams;
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
        self.eventHandlers.push({ onz, elementToObserve, fn });
        nudge(elementToObserve);
    }
    else if (onSet !== undefined) {
        subscribe(elementToObserve, onSet, (el, propName, nv) => {
            const valFT = vft || valFromTarget;
            const valFE = vfe || valFromEvent;
            setProp(valFT, valFE, propName, elementToObserve, observeParams, self);
        });
    }
    else {
        throw 'NI'; // not implemented
    }
}
export async function hookUp(fromParam, proxy, toParam) {
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
                    proxy[toParam] = fromParam;
                }
                else {
                    const observeParams = fromParam;
                    const elementToObserve = getElementToObserve(proxy, observeParams);
                    if (elementToObserve === null) {
                        console.warn({ msg: '404', observeParams });
                        return;
                    }
                    await addListener(elementToObserve, observeParams, toParam, proxy);
                }
            }
            break;
        case 'string':
            {
                const ocoho = '[itemscope]';
                const isProp = fromParam[0] === '.';
                const vft = isProp ? fromParam.substr(1) : fromParam;
                const observeParams = isProp ? { onSet: vft, vft, ocoho } : { vft, ocoho };
                const elementToObserve = getElementToObserve(proxy, observeParams);
                if (!elementToObserve) {
                    console.warn({ msg: '404', observeParams });
                    return;
                }
                await addListener(elementToObserve, observeParams, toParam, proxy);
            }
            break;
        default:
            proxy[toParam] = fromParam;
    }
}
