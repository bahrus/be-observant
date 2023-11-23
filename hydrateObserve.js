import { getLocalSignal } from 'be-linked/defaults.js';
import { getRemoteEl } from 'be-linked/getRemoteEl.js';
import { getSignalVal } from 'be-linked/getSignalVal.js';
export class Observer {
    enhancementInstance;
    observe;
    constructor(enhancementInstance, observe, abortControllers) {
        this.enhancementInstance = enhancementInstance;
        this.observe = observe;
        (async () => {
            const { enhancedElement } = enhancementInstance;
            const { remoteProp, remoteType, localProp, callback } = observe;
            if (callback === undefined) {
                if (localProp === undefined) {
                    const signal = await getLocalSignal(enhancedElement);
                    observe.localProp = signal.prop;
                    observe.localSignal = signal.signal;
                }
                else {
                    observe.localSignal = enhancedElement;
                }
            }
            //similar code as be-pute/be-switched, be-bound -- share somehow?
            const el = await getRemoteEl(enhancedElement, remoteType, remoteProp);
            const stInput = () => {
                observe.remoteSignal = new WeakRef(el);
                const ab = new AbortController();
                abortControllers.push(ab);
                el.addEventListener('input', e => {
                    //await evalObserveRules(enhancementInstance, 'update');
                    evalObserveRule(observe, 'update');
                }, { signal: ab.signal });
            };
            switch (remoteType) {
                case '/': {
                    const { doPG } = await import('be-linked/doPG.js');
                    await doPG(enhancementInstance, el, observe, 'remoteSignal', remoteProp, abortControllers, evalObserveRules, 'remote');
                    break;
                }
                case '#':
                case '@': {
                    stInput();
                    break;
                }
                case '$': {
                    if (el.hasAttribute('contenteditable')) {
                        stInput();
                    }
                    else {
                        console.log(observe);
                        const { doVA } = await import('be-linked/doVA.js');
                        await doVA(enhancementInstance, el, observe, 'remoteSignal', abortControllers, evalObserveRules, 'remote');
                    }
                    break;
                }
                case '-': {
                    //TODO:  share code with similar code in be-bound
                    const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
                    const newRemoteProp = lispToCamel(remoteProp);
                    observe.remoteProp = newRemoteProp;
                    import('be-propagating/be-propagating.js');
                    const bePropagating = await el.beEnhanced.whenResolved('be-propagating');
                    const signal = await bePropagating.getSignal(newRemoteProp);
                    observe.remoteSignal = new WeakRef(signal);
                    const ab = new AbortController();
                    abortControllers.push(ab);
                    signal.addEventListener('value-changed', async () => {
                        //await evalObserveRules(self, 'update');
                        evalObserveRule(observe, 'update');
                    }, { signal: ab.signal });
                    break;
                }
                default: {
                    throw 'NI';
                }
            }
        })();
    }
}
function evalObserveRule(observe, lifecycleEvent) {
    const { skipInit, remoteSignal } = observe;
    if (skipInit && lifecycleEvent === 'init')
        return;
    const remoteObj = remoteSignal?.deref();
    if (remoteObj === undefined) {
        console.warn(404);
        return;
    }
    const { localProp, localSignal, splitLocalProp, negate, mathEnd, mathOp, callback } = observe;
    let val = getSignalVal(remoteObj); // (<any>remoteObj).value;
    if (negate) {
        val = !val;
    }
    else if (typeof mathEnd === 'number') {
        switch (mathOp) {
            case '*':
                val *= mathEnd;
                break;
            case '+':
                val += mathEnd;
                break;
            case '-':
                val -= mathEnd;
                break;
            case '/':
                val /= mathEnd;
                break;
        }
    }
    if (callback !== undefined) {
        callback(observe, val);
        return;
    }
    if (splitLocalProp !== undefined) {
        setVal(localSignal, splitLocalProp, val);
    }
    else {
        localSignal[localProp] = val;
    }
}
export function evalObserveRules(self, lifecycleEvent) {
    const { observeRules } = self;
    for (const observe of observeRules) {
        evalObserveRule(observe, lifecycleEvent);
    }
}
//TODO:  move to be-linked
export function setVal(obj, split, val) {
    let context = obj;
    const len = split.length;
    let cnt = 1;
    for (const token of split) {
        if (cnt === len) {
            context[token] = val;
            return;
        }
        if (context[token] === undefined) {
            context[token] = {};
        }
        context = context[token];
        cnt++;
    }
}
