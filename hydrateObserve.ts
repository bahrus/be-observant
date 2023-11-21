import {IBE} from 'be-enhanced/types';
import {ObserveRule, IObserveRules, LifecycleEvent} from './types';
import {getLocalSignal} from 'be-linked/defaults.js';
import {getRemoteEl} from 'be-linked/getRemoteEl.js';
import {SignalContainer} from 'be-linked/types';
import {Actions as BPActions} from 'be-propagating/types';
import {getSignalVal} from 'be-linked/getSignalVal.js';

export async function hydrateObserve(self: IBE & IObserveRules, observe: ObserveRule, abortControllers: Array<AbortController>){
    const {enhancedElement} = self;
    const {remoteProp, remoteType, localProp} = observe;
    if(localProp === undefined){
        const signal = await getLocalSignal(enhancedElement);
        observe.localProp = signal.prop;
        observe.localSignal = signal.signal;
    }else{
        observe.localSignal = enhancedElement;
    }
    //similar code as be-pute/be-switched, be-bound -- share somehow?
    const el = await getRemoteEl(enhancedElement, remoteType!, remoteProp!);
    const stInput = () => {
        observe.remoteSignal = new WeakRef(el);
        const ab = new AbortController();
        abortControllers.push(ab);
        el.addEventListener('input', async e => {
            await evalObserveRules(self, 'update');
        }, {signal: ab.signal});
    }
    switch(remoteType){
        case '/':{
            const {doPG} = await import('be-linked/doPG.js');
            await doPG(self, el, observe as any as SignalContainer, 'remoteSignal', remoteProp!, abortControllers, evalObserveRules as any, 'remote');
            break;
        }
        case '#':
        case '@':{
            stInput();
            break;
        }
        case '-':{
            //TODO:  share code with similar code in be-bound
            const {lispToCamel} = await import('trans-render/lib/lispToCamel.js');
            const newRemoteProp = lispToCamel(remoteProp!);
            observe.remoteProp = newRemoteProp;
            import('be-propagating/be-propagating.js');
            const bePropagating = await (<any>el).beEnhanced.whenResolved('be-propagating') as BPActions;
            const signal = await bePropagating.getSignal(newRemoteProp!);
            observe.remoteSignal = new WeakRef(signal);
            const ab = new AbortController();
            abortControllers.push(ab);
            signal.addEventListener('value-changed', async () => {
                await evalObserveRules(self, 'update');
            }, {signal: ab.signal});
            break;
        }
        default:{
            throw 'NI';
        }
    }
}

export function evalObserveRules(self: IObserveRules, lifecycleEvent: LifecycleEvent){
    const {observeRules} = self;
    for(const observe of observeRules!){
        const {skipInit, remoteSignal} = observe;
        if(skipInit && lifecycleEvent === 'init') continue;
        const remoteObj = remoteSignal?.deref();
        if(remoteObj === undefined){
            console.warn(404);
            continue;
        }
        const {localProp, localSignal, splitLocalProp, negate, mathEnd, mathOp, callback} = observe;
        let val = getSignalVal(remoteObj); // (<any>remoteObj).value;
        if(negate){
            val = !val;
        } else if(typeof mathEnd === 'number'){
            switch(mathOp){
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
        if(callback !== undefined){
            callback(observe, val);
            return;
        }
        if(splitLocalProp !== undefined){
            setVal(localSignal, splitLocalProp, val);
        }else{
            (<any>localSignal!)[localProp!] = val;
        }
        
    }
}

//TODO:  move to be-linked
export function setVal(obj: any, split: Array<string>, val: any){
    let context = obj;
    const len = split.length;
    let cnt = 1;
    for(const token of split){
        if(cnt === len){
            context[token] = val;
            return;
        }
        if(context[token] === undefined){
            context[token] = {};
        }
        context = context[token];
        cnt++;
    }
}
