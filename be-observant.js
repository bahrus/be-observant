import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { getRemoteEl } from 'be-linked/getRemoteEl.js';
import { getLocalSignal, getRemoteProp } from 'be-linked/defaults.js';
import { getSignalVal } from 'be-linked/getSignalVal.js';
export class BeObservant extends BE {
    #abortControllers = [];
    detach() {
        for (const ac of this.#abortControllers) {
            ac.abort();
        }
    }
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
    }
    async noAttrs(self) {
        const { enhancedElement } = self;
        const observeRule = {
            //TODO:  move this evaluation to be-linked -- shared with be-elevating, be-bound
            //Also, support for space delimited itemprop
            remoteProp: getRemoteProp(enhancedElement),
            remoteType: '/'
        };
        return {
            observeRules: [observeRule]
        };
    }
    async onCamelized(self) {
        const { of, Of } = self;
        let observeRules = [];
        if ((of || Of) !== undefined) {
            const { prsOf } = await import('./prsOf.js');
            observeRules = prsOf(self);
        }
        return {
            observeRules
        };
    }
    async hydrate(self) {
        const { enhancedElement, observeRules } = self;
        for (const observe of observeRules) {
            //console.log({observe});
            const { remoteProp, remoteType, localProp } = observe;
            if (localProp === undefined) {
                const signal = await getLocalSignal(enhancedElement);
                observe.localProp = signal.prop;
                observe.localSignal = signal.signal;
            }
            else {
                observe.localSignal = enhancedElement;
            }
            //similar code as be-pute/be-switched, be-bound -- share somehow?
            const el = await getRemoteEl(enhancedElement, remoteType, remoteProp);
            const stInput = () => {
                observe.remoteSignal = new WeakRef(el);
                const ab = new AbortController();
                this.#abortControllers.push(ab);
                el.addEventListener('input', async (e) => {
                    await evalObserveRules(self, 'update');
                }, { signal: ab.signal });
            };
            switch (remoteType) {
                case '/': {
                    const { doPG } = await import('be-linked/doPG.js');
                    await doPG(self, el, observe, 'remoteSignal', remoteProp, this.#abortControllers, evalObserveRules, 'remote');
                    break;
                }
                case '#':
                case '@': {
                    stInput();
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
                    this.#abortControllers.push(ab);
                    signal.addEventListener('value-changed', async () => {
                        await evalObserveRules(self, 'update');
                    }, { signal: ab.signal });
                    break;
                }
                default: {
                    throw 'NI';
                }
            }
        }
        evalObserveRules(self, 'init');
        return {
            resolved: true,
        };
    }
}
function evalObserveRules(self, lifecycleEvent) {
    //console.log('evalObserveRules');
    const { observeRules } = self;
    for (const observe of observeRules) {
        const { skipInit, remoteSignal } = observe;
        if (skipInit && lifecycleEvent === 'init')
            continue;
        const remoteObj = remoteSignal?.deref();
        if (remoteObj === undefined) {
            console.warn(404);
            continue;
        }
        const { localProp, localSignal, splitLocalProp, negate, mathEnd, mathOp } = observe;
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
        if (splitLocalProp !== undefined) {
            setVal(localSignal, splitLocalProp, val);
        }
        else {
            localSignal[localProp] = val;
        }
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
const tagName = 'be-observant';
const ifWantsToBe = 'observant';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
        },
        actions: {
            noAttrs: {
                ifAllOf: ['isParsed'],
                ifNoneOf: ['of', 'Of']
            },
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['of', 'Of']
            },
            hydrate: 'observeRules'
        }
    },
    superclass: BeObservant
});
register(ifWantsToBe, upgrade, tagName);
