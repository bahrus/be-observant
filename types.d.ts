import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IEnhancement} from 'trans-render/be/types';
import {ElTypes, SignalRefType} from 'be-linked/types';
import { Specifier } from "trans-render/dss/types";

export interface EndUserProps extends IEnhancement{
    
} 

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    observedFactors?: Array<Specifier>,
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
    // onCamelized(self: this): ProPAP;
    // hydrate(self: this): ProPAP;
}

export interface SignalAndElO extends Specifier{
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
    o: ObserverEventModel,
    enh: string,
}

export interface ObserverEventModel{
    factors: {[key: string] : any},
    vals: any[],
    setProps?: {[key: string]: any};
}