export async function addListener(elementToObserve, observeParams, propKey, self, noAwait = false) {
    const { on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy, nudge, observeHostProp } = observeParams;
    if (noAwait && fromProxy)
        return {
            success: false,
        };
    const valFT = vft || valFromTarget;
    const { camelToLisp } = await import('trans-render/lib/camelToLisp.js');
    const onSetX = onSet || observeHostProp;
    const onz = onSetX !== undefined ? undefined :
        on || (valFT ? (fromProxy ? fromProxy + '::' : '') + camelToLisp(valFT) + '-changed' : undefined);
    const valFE = vfe || valFromEvent;
    const { setProp } = await import('./setProp.js');
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
        if (nudge && elementToObserve.getAttribute !== undefined) {
            const { nudge } = await import('trans-render/lib/nudge.js');
            nudge(elementToObserve);
        }
    }
    else if (onSetX !== undefined) {
        const { subscribe, tooSoon } = await import('trans-render/lib/subscribe.js');
        if (noAwait && tooSoon(elementToObserve))
            return {
                success: false
            };
        if (self.subscriptions === undefined)
            self.subscriptions = [];
        self.subscriptions.push(elementToObserve);
        subscribe(elementToObserve, onSetX, (el, propName, nv) => {
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
    return {
        success: true,
        element: elementToObserve,
    };
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
                    return {
                        success: true,
                    };
                }
                else {
                    const observeParams = fromParam;
                    const { getElementToObserve } = await import('./getElementToObserve.js');
                    const elementToObserve = await getElementToObserve(proxy, observeParams, host);
                    if (elementToObserve === null) {
                        console.warn({ msg: '404', observeParams });
                        return {
                            success: false,
                        };
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
            break;
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
