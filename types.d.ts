import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {ElTypes, SignalRefType} from 'be-linked/types';
import {ElO} from 'trans-render/lib/prs/types';

export interface EndUserProps extends IBE{
    Of?: Array<OfStatement>,
    of?: Array<OfStatement>,
    Set?: Array<SetStatement>
} 

// export interface IObserveRules {
//     observeRules?: Array<ObserveRule>,
// }

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    observedFactors?: Array<ElO>,
    setRules?: Array<ParsedSetStatement>
}


export type OfStatement = string;

export type SetStatement = string;

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

// export type LifecycleEvent = 'init' | 'update';

export interface Actions{
    noAttrs(self: this): ProPAP;
    onCamelized(self: this): ProPAP;
    hydrate(self: this): ProPAP;
}

export interface SignalAndElO extends ElO{
    signal?: WeakRef<SignalRefType>
}

export interface ParsedSetStatement{
    localPropToSet?: string,
    to: string
}



export interface ObserverOptions{
    abortControllers: Array<AbortController>,
    remoteEl?: Element,
}

export type LoadEventName = 'load';

export interface EventForObserver{
    o: ObserverEventModel
}

export interface ObserverEventModel{
    factors: {[key: string] : any},
    vals: any[],
    setProps?: {[key: string]: any};
}