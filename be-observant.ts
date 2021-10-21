import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeObservantProps, BeObservantActions, IObserve, BeObservantVirtualProps} from './types';
import {nudge} from 'trans-render/lib/nudge.js';
import { convert, getProp, splitExt } from 'on-to-me/prop-mixin.js';
import { upSearch } from 'trans-render/lib/upSearch.js';
import { camelToLisp } from 'trans-render/lib/camelToLisp.js';
import { structuralClone } from 'trans-render/lib/structuralClone.js';

export {IObserve} from './types';

export class BeObservantController {
    intro(proxy: Element & BeObservantVirtualProps, target: Element, beDecorProps: BeDecoratedProps){
        const params = JSON.parse(proxy.getAttribute('is-' + beDecorProps.ifWantsToBe!)!);
        for(const propKey in params){
            const parm = params[propKey];
            const observeParams = ((typeof parm === 'string') ? {vft: parm} : parm) as IObserve;
            const elementToObserve = getElementToObserve(proxy, observeParams);
            if(elementToObserve === null){
                console.warn({msg:'404',observeParams});
                continue;
            }
            addListener(elementToObserve, observeParams, propKey, proxy);
            
        }        
    }
    finale(proxy: Element & BeObservantVirtualProps, target:Element){
        const eventHandlers = proxy.eventHandlers;
        for(const eh of eventHandlers){
            eh.elementToObserve.removeEventListener(eh.on, eh.fn);
        }
    }
}

export interface BeObservantController extends BeObservantProps{}

const tagName = 'be-observant';

const ifWantsToBe = 'observant';

const upgrade = '*';

define<BeObservantProps & BeDecoratedProps<BeObservantProps, BeObservantActions>, BeObservantActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade: '*',
            ifWantsToBe: 'observant',
            noParse: true,
            forceVisible: true,
            intro: 'intro',
            finale: 'finale',
            virtualProps: ['eventHandlers']
        }
    },
    complexPropDefaults:{
        controller: BeObservantController
    }
});

const beHive = document.querySelector('be-hive') as any;
if(beHive !== null){
    customElements.whenDefined(beHive.localName).then(() => {
        beHive.register({
            ifWantsToBe,
            upgrade,
            localName: tagName,
        })
    })
}else{
    document.head.appendChild(document.createElement(tagName));
}


export function getElementToObserve(self:Element, 
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

export function addListener(elementToObserve: Element, observeParams: IObserve, propKey: string, self: Element){
    const {on, vft, valFromTarget, valFromEvent, vfe, skipInit, onSet, fromProxy} = observeParams;
    const valFT = vft || valFromTarget;
    const onz = onSet !== undefined ? undefined :
         on || (valFT ? (fromProxy ? fromProxy + '::'  : '') + camelToLisp(valFT) + '-changed' : undefined); 
    const valFE = vfe || valFromEvent;
    if(valFT !== undefined && !skipInit){
        setProp(valFT, valFE, propKey, elementToObserve, observeParams, self);
    }
    if(onz !== undefined){
        const fn = (e: Event) => {
            e.stopPropagation();
            setProp(valFT, valFE, propKey, e.target! as Element, observeParams, self, e);
        }
        elementToObserve.addEventListener(onz, fn);
        if((<any>self).eventHandlers === undefined) (<any>self).eventHandlers = [];
        (<any>self).eventHandlers.push({onz, elementToObserve, fn});
        nudge(elementToObserve);
    }else if(onSet !== undefined){
        let proto = elementToObserve;
        let prop: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(proto, onSet);
        while(proto && !prop){
            proto = Object.getPrototypeOf(proto);
            prop = Object.getOwnPropertyDescriptor(proto, onSet);
        }
        if(prop === undefined){
            throw {elementToObserve, onSet, message: "Can't find property."};
        }
        const setter = prop.set!.bind(elementToObserve);
        const getter = prop.get!.bind(elementToObserve);
        Object.defineProperty(elementToObserve, onSet!, {
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
export function setProp(valFT: string | undefined, valFE: string | undefined, propKey: string, observedElement: Element, 
    {parseValAs, clone, as, trueVal, falseVal, fromProxy}: IObserve, self: Element, event?: Event){
    if(event === undefined && valFE !== undefined) return;
    const valPath = event !== undefined && valFE ? valFE : valFT;
    if(valPath === undefined) throw 'NI';//not implemented;
    const split = splitExt(valPath);
    let src: any = valFE !== undefined ? ( event ? event : observedElement) : observedElement;
    let val: any;
    if(fromProxy === undefined){
        val = getProp(src, split, observedElement);
    }else{
        const beProxy = 'be-' + fromProxy;
        const decorator = document.querySelector(`[if-wants-to-be="${beProxy}"],${beProxy}`);
        if(decorator === null) return;
        const map = (<any>decorator).targetToController as WeakMap<Element, any>;
        if(map === undefined) return;
        if(!map.has(observedElement)) return;
        const proxy = map.get(observedElement).proxy;
        val = getProp(src, split, proxy);
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