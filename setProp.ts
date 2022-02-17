import { splitExt } from 'on-to-me/prop-mixin.js';
import {IObserve} from './types';
declare function structuredClone(val: any): any;

export async function setProp(valFT: string | undefined, valFE: string | undefined, propKey: string, observedElement: Element, 
    {parseValAs, clone, as, trueVal, falseVal, fromProxy, fire, translate}: IObserve, self: Element, event?: Event){
    if(event === undefined && valFE !== undefined) return;
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if(valPath === undefined) throw 'NI';//not implemented;
    const split = splitExt(valPath);
    let src: any = valFE !== undefined ? ( event ? event : observedElement) : observedElement;
    let val: any;
    const {getProp} = await import('trans-render/lib/getProp.js');
    if(fromProxy === undefined){
        val = getProp(src, split);
        if((<any>self).debug){
            console.log({val, split, observedElement});
        }
    }else{
        const {getProxy} = await import('./getProxy.js');
        const proxy = await getProxy(observedElement, fromProxy);
        if(proxy !== undefined) val = getProp(proxy, split, proxy);
        if((<any>self).debug){
            console.log({
                val, split, proxy, fromProxy, observedElement
            });
        }
    }
    if(val === undefined) return;
    if(clone) val = structuredClone(val);
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