import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import {IObserve} from './types';
import { structuralClone } from 'trans-render/lib/structuralClone.js';
import { getProxy } from './getProxy.js';

export async function setProp(valFT: string | undefined, valFE: string | undefined, propKey: string, observedElement: Element, 
    {parseValAs, clone, as, trueVal, falseVal, fromProxy, fire}: IObserve, self: Element, event?: Event){
    if(event === undefined && valFE !== undefined) return;
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if(valPath === undefined) throw 'NI';//not implemented;
    const split = splitExt(valPath);
    let src: any = valFE !== undefined ? ( event ? event : observedElement) : observedElement;
    let val: any;
    if(fromProxy === undefined){
        val = getProp(src, split, observedElement);
        if((<any>self).debug){
            console.log({val, split, observedElement});
        }
    }else{
        const proxy = await getProxy(observedElement, fromProxy);
        if(proxy !== undefined) val = getProp(proxy, split, proxy);
        if((<any>self).debug){
            console.log({
                val, split, proxy, fromProxy, observedElement
            });
        }
    }
    if(val === undefined) return;
    if(clone) val = structuralClone(val);
    if(parseValAs !== undefined){
        val = convert(val, parseValAs);
    }
    if(trueVal && val){
        val = trueVal;
    }else if(falseVal && !val){
        val = falseVal;
    }
    if(as !== undefined){
        //const propKeyLispCase = camelToLisp(propKey);
        switch(as){
            case 'str-attr':
                self.setAttribute(propKey, val.toString());
                break;
            case 'obj-attr':
                self.setAttribute(propKey, JSON.stringify(val));
                break;
            case 'bool-attr':
                if(val) {
                    self.setAttribute(propKey, '');
                }else{
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
    }else{
        (<any>self)[propKey] = val;
    }
    if(fire !== undefined){
        self.dispatchEvent(new CustomEvent(fire.type, fire.init));
    }

}