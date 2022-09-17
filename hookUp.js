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
export function toIObserve(s) {
    const ocoho = '[itemscope]';
    const isProp = s[0] === '.';
    const vft = isProp ? s.substr(1) : s;
    const nudge = true;
    return isProp ? { onSet: vft, vft, ocoho, nudge } : { vft, ocoho, nudge };
}
export async function hookUp(fromParam, self, toParam, noAwait = false, host) {
    const observeParam = (typeof fromParam === 'string') ? toIObserve(fromParam) : fromParam;
    const { getElementToObserve } = await import('./getElementToObserve.js');
    let elementToObserve = await getElementToObserve(self, observeParam, host);
    if (elementToObserve === null) {
        if (observeParam.observeInward !== undefined) {
            const { childrenParsed } = await import('be-a-beacon/childrenParsed.js');
            await childrenParsed(self);
            elementToObserve = self.querySelector(observeParam.observeInward);
        }
    }
    if (elementToObserve === null) {
        console.warn({ msg: '404', observeParam });
        return {
            success: false,
        };
    }
    const { homeInOn: hio } = observeParam;
    if (hio !== undefined) {
        const { homeInOn } = await import('trans-render/lib/homeInOn.js');
        elementToObserve = await homeInOn(elementToObserve, hio);
    }
    return await addListener(elementToObserve, observeParam, toParam, self, noAwait);
}
export async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, ms);
    });
}
