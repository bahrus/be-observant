export async function addListener(elementToObserve, observeParams, propKey, self, noAwait = false) {
    const { on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, nudge, observeHostProp, eventListenerOptions, } = observeParams;
    const valFT = vft || valFromTarget;
    const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
    const onSetX = onSet || observeHostProp;
    const onz = onSetX !== undefined ? undefined :
        on || (valFT ? camelToLisp(valFT) + '-changed' : undefined);
    const valFE = vfe || valFromEvent;
    const { setProp } = await import('./setProp.js');
    if (valFT !== undefined && !skipInit) {
        if (observeParams.debug)
            debugger;
        await setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    const controller = new AbortController;
    if (onz !== undefined) {
        const fn = async (e) => {
            const { eventFilter, stopPropagation } = observeParams;
            if (eventFilter !== undefined) {
                const { isContainedIn } = await import('trans-render/lib/isContainedIn.js');
                if (!isContainedIn(eventFilter, e))
                    return;
            }
            if (stopPropagation)
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
        let options;
        switch (typeof eventListenerOptions) {
            case 'boolean':
                options = { capture: eventListenerOptions };
                break;
            case 'object':
                options = eventListenerOptions;
                break;
            default:
                options = {};
        }
        options.signal = controller.signal;
        elementToObserve.addEventListener(onz, fn, options);
        if (self.debug) {
            console.log({ onz, elementToObserve, fn });
        }
        if (nudge && elementToObserve.getAttribute !== undefined) {
            const { nudge } = await import('trans-render/lib/nudge.js');
            nudge(elementToObserve);
        }
    }
    else if (onSetX !== undefined) {
        const { bePropagating } = await import('trans-render/lib/bePropagating.js');
        const et = await bePropagating(elementToObserve, onSetX);
        et.addEventListener(onSetX, () => {
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
        }, { signal: controller.signal });
    }
    else {
        throw 'bO.hU.NI'; // not implemented
    }
    return {
        success: true,
        element: elementToObserve,
        controller
    };
}
export async function hookUp(fromParam, proxy, toParam, noAwait = false, host) {
    switch (typeof fromParam) {
        case 'object': {
            if (Array.isArray(fromParam)) {
                //assume for now is a string array
                const arr = fromParam;
                if (arr.length !== 1)
                    throw 'NI';
                //assume for now only one element in the array
                //TODO:  support alternating array with binding instructions in every odd element -- interpolation
                proxy[toParam] = fromParam[0];
                return {
                    success: true,
                };
            }
            else {
                const observeParams = fromParam;
                const { getElementToObserve } = await import('./getElementToObserve.js');
                let elementToObserve = await getElementToObserve(proxy, observeParams, host);
                if (elementToObserve === null) {
                    console.warn({ msg: '404', observeParams });
                    return {
                        success: false,
                    };
                }
                const { homeInOn: hio } = observeParams;
                if (hio !== undefined) {
                    const { homeInOn } = await import('trans-render/lib/homeInOn.js');
                    elementToObserve = await homeInOn(elementToObserve, hio);
                }
                return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
            }
        }
        case 'string': {
            const ocoho = '[itemscope]';
            const isProp = fromParam[0] === '.';
            const vft = isProp ? fromParam.substr(1) : fromParam;
            const nudge = true;
            const observeParams = isProp ? { onSet: vft, vft, ocoho, nudge } : { vft, ocoho, nudge };
            const { getElementToObserve } = await import('./getElementToObserve.js');
            let elementToObserve = await getElementToObserve(proxy, observeParams, host);
            if (elementToObserve === null && observeParams.observeInward !== undefined) {
                //wait for element to fill up hopefully
                await sleep(50);
                elementToObserve = proxy.querySelector(observeParams.observeInward);
            }
            if (!elementToObserve) {
                console.warn({ msg: '404', observeParams });
                return {
                    success: false,
                };
            }
            return await addListener(elementToObserve, observeParams, toParam, proxy, noAwait);
        }
        default:
            proxy[toParam] = fromParam;
            return {
                success: true,
            };
    }
}
export async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, ms);
    });
}
