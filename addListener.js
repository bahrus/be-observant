import { setProp } from './setProp.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { nudge } from 'trans-render/lib/nudge.js';
export function addListener(elementToObserve, observeParams, propKey, self) {
    const { on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy } = observeParams;
    const valFT = vft || valFromTarget;
    const onz = onSet !== undefined ? undefined :
        on || (valFT ? (fromProxy ? fromProxy + '::' : '') + camelToLisp(valFT) + '-changed' : undefined);
    const valFE = vfe || valFromEvent;
    if (valFT !== undefined && !skipInit) {
        setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    if (onz !== undefined) {
        const fn = (e) => {
            e.stopPropagation();
            if (self.debug) {
                console.log({ e, valFT, valFE, propKey, observeParams });
            }
            //const src = (fromProxy !== undefined ? getProxy(elementToObserve, fromProxy) : e.target!) as Element
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
        let proto = elementToObserve;
        let prop = Object.getOwnPropertyDescriptor(proto, onSet);
        while (proto && !prop) {
            proto = Object.getPrototypeOf(proto);
            prop = Object.getOwnPropertyDescriptor(proto, onSet);
        }
        if (prop === undefined) {
            throw { elementToObserve, onSet, message: "Can't find property." };
        }
        const setter = prop.set.bind(elementToObserve);
        const getter = prop.get.bind(elementToObserve);
        Object.defineProperty(elementToObserve, onSet, {
            get() {
                return getter();
            },
            set(nv) {
                setter(nv);
                const event = {
                    target: this
                };
                setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
            },
            enumerable: true,
            configurable: true,
        });
    }
    else {
        throw 'NI'; // not implemented
    }
}
