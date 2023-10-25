import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {ElTypes, SignalRefType} from 'be-linked/types';

export interface EndUserProps extends IBE{
    Of?: Array<OfStatement>,
    of?: Array<OfStatement>
} 

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    observeRules?: Array<ObserveRule>,
}

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

export interface ObserveRule{
    remoteProp: string,
    remoteType: ElTypes,
    remoteSignal?: WeakRef<SignalRefType>,
    localProp?: string,
    splitLocalProp?: Array<string>,
    localSignal?: SignalRefType,
    negate?: boolean,
    mathOp?: '+' | '-' | '*' | '/',
    mathEnd?: number,
    skipInit?: boolean,
    callback?:(rule: ObserveRule, val: any) => void;
}