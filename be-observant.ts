import {XtalDecor, XtalDecorCore} from 'xtal-decor/xtal-decor.js';
import { XtalDecorProps } from 'xtal-decor/types';
import {CE} from 'trans-render/lib/CE.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { IObserve } from './types';
import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import { structuralClone } from 'trans-render/lib/structuralClone.js';
import { upSearch } from 'trans-render/lib/upSearch.js';

const ce = new CE<XtalDecorCore<Element>>({
    config:{
        tagName: 'be-observant',
        propDefaults:{
            upgrade: '*',
            ifWantsToBe: 'observant',
            noParse: true,
            forceVisible: true,
        }
    },
    complexPropDefaults:{
        actions:[],
        on:{},
        init: (self: Element, decor: XtalDecorProps<Element>) => {
            const params = JSON.parse(self.getAttribute('is-' + decor.ifWantsToBe!)!);
            for(const propKey in params){
                const parm = params[propKey];
                const observeParams = ((typeof parm === 'string') ? {vft: parm} : parm) as IObserve;
                const elementToObserve = getElementToObserve(self, observeParams);
                if(elementToObserve === null){
                    console.warn({msg:'404',observeParams});
                    continue;
                }
                const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onProp} = observeParams;
                const valFT = vft || valFromTarget;
                const onz = onProp !== undefined ? undefined :
                     on || (valFT ? camelToLisp(valFT) + '-changed' : undefined); 
                const valFE = vfe || valFromEvent;
                if(valFT !== undefined && !skipInit){
                    setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
                }
                if(onz !== undefined){
                    elementToObserve.addEventListener(onz, e => {
                        e.stopPropagation();
                        setProp(valFT, valFE, propKey, e.target! as Element, observeParams, self, e);
                    });
                    nudge(elementToObserve);
                }else if(onProp !== undefined){
                    let proto = elementToObserve;
                    let prop: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(proto, onProp);
                    while(proto && !prop){
                        proto = Object.getPrototypeOf(proto);
                        prop = Object.getOwnPropertyDescriptor(proto, onProp);
                    }
                    if(prop === undefined){
                        throw {elementToObserve, onProp, message: "Can't find property."};
                    }
                    const setter = prop.set!.bind(elementToObserve);
                    const getter = prop.get!.bind(elementToObserve);
                    Object.defineProperty(elementToObserve, onProp!, {
                        get(){
                            return getter();
                        },
                        set(nv){
                            setter(nv);
                            const event = {
                                target: this
                            };
                            setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
                        },
                        enumerable: true,
                        configurable: true,
                    });     
                }else{
                    throw 'NI'; // not implemented
                }
                
            }
        }
    },
    superclass: XtalDecor
});
function getElementToObserve(self:Element, 
    {observeClosest, observe}: IObserve)
{
    let elementToObserve: Element | null = null;
    if(observeClosest !== undefined){
        elementToObserve = self.closest(observeClosest);
        if(elementToObserve !== null && observe){
            elementToObserve = upSearch(elementToObserve, observe) as Element;
        }
    }else if(observe !== undefined) {
        elementToObserve = upSearch(self, observe) as Element;
    }else{
        elementToObserve = getHost(self);
    }
    return elementToObserve;
}
function setProp(valFT: string | undefined, valFE: string | undefined, propKey: string, observedElement: Element, 
    {parseValAs, clone, as, trueVal, falseVal}: IObserve, self: Element, event?: Event){
    if(event === undefined && valFE !== undefined) return;
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if(valPath === undefined) throw 'NI';//not implemented;
    const split = splitExt(valPath);
    let src: any = valFE !== undefined ? ( event ? event : observedElement) : observedElement; 
    let val = getProp(src, split, observedElement);
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


}
function getHost(self:Element): HTMLElement{
    let host = (<any>self.getRootNode()).host;
    if(host === undefined){
        host = self.parentElement;
        while(host && !host.localName.includes('-')){
            host = host.parentElement;
        }
    }
    return host;
}



// /**
// * get previous sibling
// */
// function getPreviousSib(self: Element, observe: string) : Element | null{
//     let prevSib: Element | null = self;
//     while(prevSib && !prevSib.matches(observe)){
//         const nextPrevSib: Element | null = prevSib.previousElementSibling || prevSib.parentElement;
//         prevSib = nextPrevSib;
//     }
//     return prevSib;
//  }

 /**
 * Decrement "disabled" counter, remove when reaches 0
 * @param prevSib 
 */
function nudge(prevSib: Element) {
    const da = prevSib.getAttribute('disabled');
    if (da !== null) {
        if (da.length === 0 || da === "1") {
            prevSib.removeAttribute('disabled');
            (<any>prevSib).disabled = false;
        }
        else {
            prevSib.setAttribute('disabled', (parseInt(da) - 1).toString());
        }
    }
}
document.head.appendChild(document.createElement('be-observant'));
