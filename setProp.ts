import {IObserve} from './types';
declare function structuredClone(val: any): any;

export async function setProp(valFT: string | undefined, valFE: string | undefined, propKey: string, observedElement: Element, 
    observeConfig: IObserve, target: EventTarget, event?: Event){
    if(event === undefined && valFE !== undefined) return;
    let valPath = event !== undefined && valFE ? valFE : valFT;
    if(valPath === undefined) throw 'bO.sP.NI';//not implemented;
    const {valPathSubstitutions, vps} = observeConfig;
    const substitutions = vps || valPathSubstitutions;
    if(substitutions !== undefined){
        const {substValPath} = await import('./substValPath.js');
        valPath = await substValPath(substitutions, valPath, target as Element);
    }
    const {splitExt} = await import('trans-render/lib/splitExt.js');
    const split = splitExt(valPath);
    let src: any = valFE !== undefined ? ( event ? event : observedElement) : observedElement;
    let val: any;
    const {getProp} = await import('trans-render/lib/getProp.js');
    val = await getProp(src, split);
    if((<any>target).debug){
        console.log({val, split, observedElement});
    }
   
    if(val === undefined) return;
    const {parseValAs, clone, as, trueVal, falseVal, fire, translate, asWeakRef} = observeConfig;
    if(clone){
        val = structuredClone(val);
    }else if(asWeakRef){
        val = new WeakRef(val);
    }
    if(parseValAs !== undefined){
        const {convert} = await import('trans-render/lib/convert.js');
        val = convert(val, parseValAs);
    }
    if(typeof val === 'number' && translate !== undefined){
        val += translate;
    }
    if(trueVal && val){
        val = trueVal;
    }else if(falseVal && !val){
        val = falseVal;
    }
    if(as !== undefined && target instanceof Element){
        const {setAttr} = await import('./setAttr.js');
        setAttr(target, propKey, as, val);
    }else{
        if(propKey[0] === '.'){
            const {setProp} = await import('trans-render/lib/setProp.js');
            await setProp(target, propKey, val);
        }else{
            (<any>target)[propKey] = val;
        }
    }
    if(fire !== undefined){
        target.dispatchEvent(new CustomEvent(fire.type, fire.init));
    }

}