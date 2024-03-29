export async function setProp(valFT, valFE, propKey, observedElement, observeConfig, target, event) {
    if (event === undefined && valFE !== undefined)
        return;
    let valPath = event !== undefined && valFE ? valFE : valFT;
    if (valPath === undefined)
        throw 'bO.sP.NI'; //not implemented;
    const { valPathSubstitutions, vps } = observeConfig;
    const substitutions = vps || valPathSubstitutions;
    if (substitutions !== undefined) {
        const { substValPath } = await import('./substValPath.js');
        valPath = await substValPath(substitutions, valPath, target);
    }
    const { splitExt } = await import('trans-render/lib/splitExt.js');
    const split = splitExt(valPath);
    let src = valFE !== undefined ? (event ? event : observedElement) : observedElement;
    let val;
    const { getProp } = await import('trans-render/lib/getProp.js');
    val = await getProp(src, split);
    if (target.debug) {
        console.log({ val, split, observedElement });
    }
    if (val === undefined)
        return;
    const { parseValAs, clone, as, trueVal, falseVal, fire, translate, asWeakRef } = observeConfig;
    if (clone) {
        val = structuredClone(val);
    }
    else if (asWeakRef) {
        val = new WeakRef(val);
    }
    if (parseValAs !== undefined) {
        const { convert } = await import('trans-render/lib/convert.js');
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
    if (as !== undefined && target instanceof Element) {
        const { setAttr } = await import('./setAttr.js');
        setAttr(target, propKey, as, val);
    }
    else {
        if (propKey[0] === '.') {
            const { setProp } = await import('trans-render/lib/setProp.js');
            await setProp(target, propKey, val);
        }
        else {
            target[propKey] = val;
        }
    }
    if (fire !== undefined) {
        target.dispatchEvent(new CustomEvent(fire.type, fire.init));
    }
}
