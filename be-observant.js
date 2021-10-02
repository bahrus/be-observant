import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { CE } from 'trans-render/lib/CE.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import { structuralClone } from 'trans-render/lib/structuralClone.js';
const ce = new CE({
    config: {
        tagName: 'be-observant',
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'observant',
            noParse: true,
        }
    },
    complexPropDefaults: {
        actions: [],
        on: {},
        init: (self, decor) => {
            console.log({
                self,
                tagName: self.tagName,
                decor,
                decor_ifWantsToBe: decor.ifWantsToBe,
                ifWantsToBe: self.getAttribute('is-' + decor.ifWantsToBe)
            });
            const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe));
            for (const propKey in params) {
                const observeParams = params[propKey];
                const elementToObserve = getElementToObserve(self, observeParams);
                if (elementToObserve === null) {
                    console.warn({ msg: '404', ...observeParams });
                    continue;
                }
                const { on, vft, valFromTarget, valFromEvent, vfe, skipInit } = observeParams;
                const valFT = vft || valFromTarget;
                const onz = on || (valFT ? camelToLisp(valFT) + '-changed' : undefined);
                const valFE = vfe || valFromEvent;
                if (valFT !== undefined && !skipInit) {
                    setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
                }
                if (onz !== undefined) {
                    elementToObserve.addEventListener(onz, e => {
                        setProp(valFT, valFE, propKey, elementToObserve, observeParams, self, e);
                    });
                    nudge(elementToObserve);
                }
            }
        }
    },
    superclass: XtalDecor
});
export function getElementToObserve(self, { observeHost, observeClosest, observe }) {
    let elementToObserve = null;
    if (observeHost) {
        elementToObserve = getHost(self);
    }
    else if (observeClosest !== undefined) {
        elementToObserve = self.closest(observeClosest);
        if (elementToObserve !== null && observe) {
            elementToObserve = getPreviousSib(elementToObserve.previousElementSibling || elementToObserve.parentElement, observe);
        }
    }
    else if (observe !== undefined) {
        elementToObserve = getPreviousSib(self.previousElementSibling || self.parentElement, observe);
    }
    else {
        throw 'NI'; //not implemented
    }
    return elementToObserve;
}
export function setProp(valFT, valFE, propKey, observedElement, { parseValAs, clone }, self, event) {
    if (event === undefined && valFE === undefined)
        return;
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if (valPath === undefined)
        throw 'NI'; //not implemented;
    const split = splitExt(valPath);
    let src = valFE !== undefined ? event ? observedElement :  : ;
    let val = getProp(src, split, observedElement);
    if (val === undefined)
        return;
    if (clone)
        val = structuralClone(val);
    if (parseValAs !== undefined) {
        val = convert(val, parseValAs);
    }
    self[propKey] = val;
}
export function getHost(self) {
    let host = self.getRootNode().host;
    if (host === undefined) {
        host = self.parentElement;
        while (host && !host.localName.includes('-')) {
            host = host.parentElement;
        }
    }
    return host;
}
/**
* get previous sibling
*/
export function getPreviousSib(self, observe) {
    let prevSib = self;
    while (prevSib && !prevSib.matches(observe)) {
        const nextPrevSib = prevSib.previousElementSibling || prevSib.parentElement;
        prevSib = nextPrevSib;
    }
    return prevSib;
}
/**
* Decrement "disabled" counter, remove when reaches 0
* @param prevSib
*/
export function nudge(prevSib) {
    const da = prevSib.getAttribute('disabled');
    if (da !== null) {
        if (da.length === 0 || da === "1") {
            prevSib.removeAttribute('disabled');
            prevSib.disabled = false;
        }
        else {
            prevSib.setAttribute('disabled', (parseInt(da) - 1).toString());
        }
    }
}
document.head.appendChild(document.createElement('be-observant'));
