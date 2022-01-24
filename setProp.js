import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import { structuralClone } from 'trans-render/lib/structuralClone.js';
import { getProxy } from './getProxy.js';
export async function setProp(valFT, valFE, propKey, observedElement, { parseValAs, clone, as, trueVal, falseVal, fromProxy, fire, translate }, self, event) {
    if (event === undefined && valFE !== undefined)
        return;
    try {
        const isConnected = self.isConnected;
    }
    catch (e) {
        return;
    }
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if (valPath === undefined)
        throw 'NI'; //not implemented;
    const split = splitExt(valPath);
    let src = valFE !== undefined ? (event ? event : observedElement) : observedElement;
    let val;
    if (fromProxy === undefined) {
        val = getProp(src, split, observedElement);
        if (self.debug) {
            console.log({ val, split, observedElement });
        }
    }
    else {
        const proxy = await getProxy(observedElement, fromProxy);
        if (proxy !== undefined)
            val = getProp(proxy, split, proxy);
        if (self.debug) {
            console.log({
                val, split, proxy, fromProxy, observedElement
            });
        }
    }
    if (val === undefined)
        return;
    if (clone)
        val = structuralClone(val);
    if (parseValAs !== undefined) {
        val = convert(val, parseValAs);
    }
    if (typeof val === 'number' && translate !== undefined) {
        val += translate;
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
    if (fire !== undefined) {
        self.dispatchEvent(new CustomEvent(fire.type, fire.init));
    }
}
