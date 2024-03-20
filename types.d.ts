import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {ElTypes, SignalRefType} from 'be-linked/types';
import {ElO} from 'trans-render/lib/prs/types';

export interface EndUserProps extends IBE{
    Of?: Array<OfStatement>,
    of?: Array<OfStatement>
} 

export interface IObserveRules {
    observeRules?: Array<ObserveRule>,
}

export interface AllProps extends EndUserProps, IObserveRules{
    isParsed?: boolean,
    observedFactors?: Array<ElO>,
    setRules?: Array<SetRule>
}

export type SetRule = any;

export type OfStatement = string;

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export type LifecycleEvent = 'init' | 'update';

export interface Actions{
    noAttrs(self: this): ProPAP;
    onCamelized(self: this): ProPAP;
    hydrate(self: this): ProPAP;
}

export interface SignalAndElO extends ElO{
    signal?: WeakRef<SignalRefType>
}

// export interface ObserveRule{
//     localEnhancement?: string,
//     remoteProp: string,
//     remoteType: ElTypes,
//     remoteSignal?: WeakRef<SignalRefType>,
//     localProp?: string,
//     splitLocalProp?: Array<string>,
//     localSignal?: SignalRefType,
//     negate?: boolean,
//     mathOp?: '+' | '-' | '*' | '/',
//     mathEnd?: number,
//     skipInit?: boolean,
//     callback?:(rule: ObserveRule, val: any) => void;
//     lastVal?: any;
// }

export interface ObserverOptions{
    abortControllers: Array<AbortController>,
    remoteEl?: Element,
}

export type LoadEventName = 'load';
export interface EventForObserver{

}