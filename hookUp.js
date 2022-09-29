export async function addListener(elementToObserve, observeParams, propKey, target, noAwait = false) {
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
        await setProp(valFT, valFE, propKey, elementToObserve, observeParams, target);
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
                const isConnected = target.isConnected;
            }
            catch (e) {
                return;
            }
            if (target.debug) {
                console.log({ e, valFT, valFE, propKey, observeParams });
            }
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, target, e);
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
        if (target.debug) {
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
            setProp(valFT, valFE, propKey, elementToObserve, observeParams, target);
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
export async function hookUp(fromParam, ref, toParam, noAwait = false, host) {
    const observeParam = (typeof fromParam === 'string') ? toIObserve(fromParam) : fromParam;
    const self = Array.isArray(ref) ? ref[0] : ref;
    let elementToObserve = null;
    const { of } = observeParam;
    if (of !== undefined) {
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        elementToObserve = await findRealm(self, of);
    }
    else {
        const { getElementToObserve } = await import('./getElementToObserve.js');
        elementToObserve = await getElementToObserve(self, observeParam, host);
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
    const target = Array.isArray(ref) ? ref[1] : ref;
    return await addListener(elementToObserve, observeParam, toParam, target, noAwait);
}
export async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, ms);
    });
}
