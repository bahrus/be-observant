import { define } from 'be-decorated/be-decorated.js';
import { nudge } from 'trans-render/lib/nudge.js';
import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { structuralClone } from 'trans-render/lib/structuralClone.js';
export class BeObservantController {
    intro(proxy, target, beDecorProps) {
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe));
        for (const propKey in params) {
            const parm = params[propKey];
            const observeParams = ((typeof parm === 'string') ? { vft: parm } : parm);
            const elementToObserve = getElementToObserve(proxy, observeParams);
            if (elementToObserve === null) {
                console.warn({ msg: '404', observeParams });
                continue;
            }
            addListener(elementToObserve, observeParams, propKey, proxy);
        }
    }
    finale(proxy, target) {
        const eventHandlers = proxy.eventHandlers;
        for (const eh of eventHandlers) {
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}
const tagName = 'be-observant';
const ifWantsToBe = 'observant';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'observant',
            noParse: true,
            forceVisible: true,
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults: {
        controller: BeObservantController
    }
});
const beHive = document.querySelector('be-hive');
if (beHive !== null) {
    customElements.whenDefined(beHive.localName).then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: tagName,
        });
    });
}
else {
    document.head.appendChild(document.createElement(tagName));
}
export function getElementToObserve(self, { observeClosest, observe }) {
    let elementToObserve = null;
    if (observeClosest !== undefined) {
        elementToObserve = self.closest(observeClosest);
        if (elementToObserve !== null && observe) {
            elementToObserve = upSearch(elementToObserve, observe);
        }
    }
    else if (observe !== undefined) {
        elementToObserve = upSearch(self, observe);
    }
    else {
        elementToObserve = getHost(self);
    }
    return elementToObserve;
}
export function addListener(elementToObserve, observeParams, propKey, self) {
    const { on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet } = observeParams;
    const valFT = vft || valFromTarget;
    const onz = onSet !== undefined ? undefined :
        on || (valFT ? camelToLisp(valFT) + '-changed' : undefined);
    const valFE = vfe || valFromEvent;
    if (valFT !== undefined && !skipInit) {
        setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    if (onz !== undefined) {
        const fn = (e) => {
            e.stopPropagation();
            setProp(valFT, valFE, propKey, e.target, observeParams, self, e);
        };
        elementToObserve.addEventListener(onz, fn);
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
export function setProp(valFT, valFE, propKey, observedElement, { parseValAs, clone, as, trueVal, falseVal }, self, event) {
    if (event === undefined && valFE !== undefined)
        return;
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if (valPath === undefined)
        throw 'NI'; //not implemented;
    const split = splitExt(valPath);
    let src = valFE !== undefined ? (event ? event : observedElement) : observedElement;
    let val = getProp(src, split, observedElement);
    if (val === undefined)
        return;
    if (clone)
        val = structuralClone(val);
    if (parseValAs !== undefined) {
        val = convert(val, parseValAs);
    }
    if (trueVal && val) {
        val = trueVal;
    }
    else if (falseVal && !val) {
        val = falseVal;
    }
    if (as !== undefined) {
        //const propKeyLispCase = camelToLisp(propKey);
        switch (as) {
            case 'str-attr':
                self.setAttribute(propKey, val.toString());
                break;
            case 'obj-attr':
                self.setAttribute(propKey, JSON.stringify(val));
                break;
            case 'bool-attr':
                if (val) {
                    self.setAttribute(propKey, '');
                }
                else {
                    self.removeAttribute(propKey);
                }
                break;
            // default:
            //     if(toProp === '...'){
            //         Object.assign(subMatch, val);
            //     }else{
            //         (<any>subMatch)[toProp] = val;
            //     }
        }
    }
    else {
        self[propKey] = val;
    }
}
function getHost(self) {
    let host = self.getRootNode().host;
    if (host === undefined) {
        host = self.parentElement;
        while (host && !host.localName.includes('-')) {
            host = host.parentElement;
        }
    }
    return host;
}
